package handlers

import (
	"context"
	"errors"
	"net/http"
	"secondlife/backend/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UpdateSaleRequest struct {
	Status       string                `json:"status"`
	ShippingInfo *models.ShippingInfo `json:"shippingInfo"`
}

func UpdateSale(c *gin.Context) {
	saleID := c.Param("saleId")
	// Note: In a real app, you'd verify the user is the seller of this sale.

	var req UpdateSaleRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	client := c.MustGet("mongoClient").(*mongo.Client)
	usersCollection := client.Database("secondlife").Collection("users")

	ctx := context.Background()

	// Find the sale to get the buyer's ID
	var sellerWithSale models.User
	filter := bson.M{"sales.orderId": saleID}
	err := usersCollection.FindOne(ctx, filter).Decode(&sellerWithSale)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sale not found"})
		return
	}

	var buyerID primitive.ObjectID
	for _, sale := range sellerWithSale.Sales {
		if sale.OrderID == saleID {
			buyerID = sale.BuyerID
			break
		}
	}

	if buyerID.IsZero() {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not find buyer for the sale"})
		return
	}

	// Update seller's sale record
	_, err = usersCollection.UpdateOne(ctx,
		bson.M{"_id": sellerWithSale.ID, "sales.orderId": saleID},
		bson.M{"$set": bson.M{
			"sales.$.status": req.Status,
			"sales.$.shippingInfo": req.ShippingInfo,
		}},
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update seller's sale record"})
		return
	}

	// Update buyer's purchase history
	_, err = usersCollection.UpdateOne(ctx,
		bson.M{"_id": buyerID, "purchaseHistory.orderId": saleID},
		bson.M{"$set": bson.M{
			"purchaseHistory.$.status": req.Status,
			"purchaseHistory.$.shippingInfo": req.ShippingInfo,
		}},
	)
	if err != nil {
		// At this point, the seller's record is updated but the buyer's is not.
		// A transaction would be better here, but for now we proceed.
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update buyer's purchase history"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Sale updated successfully"})
}


type ProcessReturnRequest struct {
	Decision string `json:"decision"` // "approved" or "rejected"
}

func ProcessReturn(c *gin.Context) {
	saleID := c.Param("saleId")

	var req ProcessReturnRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	client := c.MustGet("mongoClient").(*mongo.Client)
	session, err := client.StartSession()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start session"})
		return
	}
	defer session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
		usersCollection := client.Database("secondlife").Collection("users")
		productsCollection := client.Database("secondlife").Collection("products")

		// Find the sale
		var sellerWithSale models.User
		err := usersCollection.FindOne(sc, bson.M{"sales.orderId": saleID}).Decode(&sellerWithSale)
		if err != nil {
			return errors.New("sale not found")
		}

		var sale models.Sale
		for _, s := range sellerWithSale.Sales {
			if s.OrderID == saleID {
				sale = s
				break
			}
		}

		newStatus := "Delivered"
		newReturnStatus := "rejected"
		if req.Decision == "approved" {
			newStatus = "Refunded"
			newReturnStatus = "approved"
		}

		// Update seller's sale record
		_, err = usersCollection.UpdateOne(sc,
			bson.M{"_id": sellerWithSale.ID, "sales.orderId": saleID},
			bson.M{"$set": bson.M{
				"sales.$.status": newStatus,
				"sales.$.returnInfo.status": newReturnStatus,
			}},
		)
		if err != nil { return err }

		// Update buyer's purchase history
		_, err = usersCollection.UpdateOne(sc,
			bson.M{"_id": sale.BuyerID, "purchaseHistory.orderId": saleID},
			bson.M{"$set": bson.M{
				"purchaseHistory.$.status": newStatus,
				"purchaseHistory.$.returnInfo.status": newReturnStatus,
			}},
		)
		if err != nil { return err }

		// If approved, process refund and restock
		if req.Decision == "approved" {
			// Refund buyer
			_, err = usersCollection.UpdateOne(sc, bson.M{"_id": sale.BuyerID}, bson.M{"$inc": bson.M{"balance": sale.Total}})
			if err != nil { return err }

			// Deduct from seller
			_, err = usersCollection.UpdateOne(sc, bson.M{"_id": sale.SellerID}, bson.M{"$inc": bson.M{"balance": -sale.Total}})
			if err != nil { return err }

			// Restock items
			for _, item := range sale.Items {
				_, err := productsCollection.UpdateOne(sc,
					bson.M{"_id": item.ID},
					bson.M{"$inc": bson.M{"stock": item.Stock}, "$set": bson.M{"status": "available"}}, // item.Stock is quantity
				)
				if err != nil { return err }
			}
		}

		return session.CommitTransaction(sc)
	})

	if err != nil {
		session.AbortTransaction(context.Background())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Transaction failed: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Return processed successfully"})
}