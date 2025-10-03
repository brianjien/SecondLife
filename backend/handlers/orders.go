package handlers

import (
	"context"
	"errors"
	"net/http"
	"secondlife/backend/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readconcern"
	"go.mongodb.org/mongo-driver/mongo/writeconcern"
)

// CheckoutRequest defines the structure for the checkout request body
type CheckoutRequest struct {
	BuyerID         primitive.ObjectID   `json:"buyerId"`
	Total           float64              `json:"total"`
	Items           []models.Product     `json:"items"`
	ShippingAddress string               `json:"shippingAddress"`
	PaymentMethod   models.PaymentMethod `json:"paymentMethod"`
	// AppliedDiscount could be added here in a future iteration
}

func Checkout(c *gin.Context) {
	var req CheckoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	client := c.MustGet("mongoClient").(*mongo.Client)
	session, err := client.StartSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start database session"})
		return
	}
	defer session.EndSession(context.Background())

	var createdOrder models.Order

	// Start a transaction
	txnOpts := options.Transaction().
		SetReadConcern(readconcern.Majority()).
		SetWriteConcern(writeconcern.New(writeconcern.WMajority()))
	err = session.StartTransaction(txnOpts)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
		productsCollection := client.Database("secondlife").Collection("products")
		usersCollection := client.Database("secondlife").Collection("users")

		// 1. Get Buyer's data
		var buyer models.User
		err := usersCollection.FindOne(sc, bson.M{"_id": req.BuyerID}).Decode(&buyer)
		if err != nil {
			return errors.New("buyer not found")
		}

		// 2. Handle Payment
		if req.PaymentMethod.Type == "wallet" {
			if buyer.Balance < req.Total {
				return errors.New("insufficient wallet balance")
			}
			newBalance := buyer.Balance - req.Total
			_, err := usersCollection.UpdateOne(sc, bson.M{"_id": buyer.ID}, bson.M{"$set": bson.M{"balance": newBalance}})
			if err != nil {
				return errors.New("failed to update buyer balance")
			}
		}
		// Coupon logic would be handled here in a future iteration

		// 3. Group items by seller and update product stock
		itemsBySeller := make(map[primitive.ObjectID][]models.Product)
		for _, itemInCart := range req.Items {
			var productOnDB models.Product
			err := productsCollection.FindOne(sc, bson.M{"_id": itemInCart.ID}).Decode(&productOnDB)
			if err != nil {
				return errors.New("could not find product with ID: " + itemInCart.ID.Hex())
			}

			if productOnDB.Stock < itemInCart.Stock { // itemInCart.Stock is the quantity
				return errors.New("not enough stock for product: " + productOnDB.Name)
			}

			// Decrease stock
			newStock := productOnDB.Stock - itemInCart.Stock
			newStatus := "available"
			if newStock <= 0 {
				newStatus = "sold"
			}
			_, err = productsCollection.UpdateOne(sc, bson.M{"_id": productOnDB.ID}, bson.M{"$set": bson.M{"stock": newStock, "status": newStatus}})
			if err != nil {
				return errors.New("failed to update product stock")
			}
			itemsBySeller[productOnDB.SellerID] = append(itemsBySeller[productOnDB.SellerID], itemInCart)
		}

		// 4. Create the main order record for the buyer
		orderID := "SL-" + primitive.NewObjectID().Hex()
		createdOrder = models.Order{
			OrderID:         orderID,
			BuyerID:         buyer.ID,
			Date:            primitive.NewDateTimeFromTime(time.Now()),
			Total:           req.Total,
			Items:           req.Items,
			ShippingAddress: req.ShippingAddress,
			Status:          "Processing",
			PaymentMethod:   req.PaymentMethod,
		}
		_, err = usersCollection.UpdateOne(sc, bson.M{"_id": buyer.ID}, bson.M{"$push": bson.M{"purchaseHistory": createdOrder}})
		if err != nil {
			return errors.New("failed to add order to buyer's history")
		}

		// 5. Create sale records for each seller
		for sellerID, items := range itemsBySeller {
			sellerTotal := 0.0
			for _, item := range items {
				// We need the accurate price from the DB, not the one from the cart
				var p models.Product
				productsCollection.FindOne(sc, bson.M{"_id": item.ID}).Decode(&p)
				sellerTotal += p.Price * float64(item.Stock) // item.Stock is quantity
			}

			sellerBonus := sellerTotal * 0.05
			sellerPayout := sellerTotal + sellerBonus

			sale := models.Sale{
				OrderID:       orderID,
				SellerID:      sellerID,
				BuyerID:       buyer.ID,
				BuyerName:     buyer.Name,
				BuyerAddress:  req.ShippingAddress,
				Date:          createdOrder.Date,
				Items:         items,
				Total:         sellerTotal,
				Status:        "Processing",
				PaymentMethod: req.PaymentMethod,
			}

			update := bson.M{"$push": bson.M{"sales": sale}}
			if req.PaymentMethod.Type != "face-to-face" {
				update["$inc"] = bson.M{"balance": sellerPayout}
			}

			_, err = usersCollection.UpdateOne(sc, bson.M{"_id": sellerID}, update)
			if err != nil {
				return errors.New("failed to create sale record for seller " + sellerID.Hex())
			}
		}

		return session.CommitTransaction(sc)
	})

	if err != nil {
		session.AbortTransaction(context.Background())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, createdOrder)
}