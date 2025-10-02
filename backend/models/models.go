package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Email           string             `bson:"email" json:"email"`
	Password        string             `bson:"password" json:"-"`
	Name            string             `bson:"name" json:"name"`
	IsAdmin         bool               `bson:"isAdmin" json:"isAdmin"`
	Balance         float64            `bson:"balance" json:"balance"`
	Cards           []Card             `bson:"cards" json:"cards"`
	Address         string             `bson:"address" json:"address"`
	Phone           string             `bson:"phone" json:"phone"`
	PurchaseHistory []Order            `bson:"purchaseHistory" json:"purchaseHistory"`
	Sales           []Sale             `bson:"sales" json:"sales"`
	Coupons         []Coupon           `bson:"coupons" json:"coupons"`
	ProfilePicture  string             `bson:"profilePicture" json:"profilePicture"`
	Reviews         []Review           `bson:"reviews" json:"reviews"`
}

type Card struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	CardNumber string             `bson:"cardNumber" json:"cardNumber"`
	CardName   string             `bson:"cardName" json:"cardName"`
	ExpiryDate string             `bson:"expiryDate" json:"expiryDate"`
	CVV        string             `bson:"cvv" json:"-"`
	LastFour   string             `bson:"lastFour" json:"lastFour"`
}

type Coupon struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name        string             `bson:"name" json:"name"`
	Type        string             `bson:"type" json:"type"`
	Value       float64            `bson:"value" json:"value"`
	Used        bool               `bson:"used" json:"used"`
	MinPurchase float64            `bson:"minPurchase" json:"minPurchase"`
	Category    string             `bson:"category" json:"category"`
}

type Review struct {
	By      string `bson:"by" json:"by"`
	Rating  int    `bson:"rating" json:"rating"`
	Comment string `bson:"comment" json:"comment"`
	Photo   string `bson:"photo" json:"photo"`
}

type Product struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name      string             `bson:"name" json:"name"`
	Price     float64            `bson:"price" json:"price"`
	Stock     int                `bson:"stock" json:"stock"`
	Discount  int                `bson:"discount" json:"discount"`
	ImageUrls []string           `bson:"imageUrls" json:"imageUrls"`
	Desc      string             `bson:"desc" json:"desc"`
	SellerID  primitive.ObjectID `bson:"sellerId" json:"sellerId"`
	Cat       string             `bson:"cat" json:"cat"`
	Cond      string             `bson:"cond" json:"cond"`
	Status    string             `bson:"status" json:"status"`
	Questions []Question         `bson:"questions" json:"questions"`
}

type Question struct {
	ID       primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID   primitive.ObjectID `bson:"userId" json:"userId"`
	UserName string             `bson:"userName" json:"userName"`
	Text     string             `bson:"text" json:"text"`
	Answer   string             `bson:"answer,omitempty" json:"answer,omitempty"`
	Date     primitive.DateTime `bson:"date" json:"date"`
}

type Order struct {
	OrderID         string        `bson:"orderId" json:"orderId"`
	BuyerID         primitive.ObjectID `bson:"buyerId" json:"buyerId"`
	Date            primitive.DateTime `bson:"date" json:"date"`
	Total           float64       `bson:"total" json:"total"`
	Items           []Product     `bson:"items" json:"items"`
	ShippingAddress string        `bson:"shippingAddress" json:"shippingAddress"`
	Status          string        `bson:"status" json:"status"`
	ShippingInfo    *ShippingInfo `bson:"shippingInfo,omitempty" json:"shippingInfo,omitempty"`
	PaymentMethod   PaymentMethod `bson:"paymentMethod" json:"paymentMethod"`
	ReturnInfo      *ReturnInfo   `bson:"returnInfo,omitempty" json:"returnInfo,omitempty"`
	Rated           bool          `bson:"rated" json:"rated"`
}

type Sale struct {
	OrderID       string        `bson:"orderId" json:"orderId"`
	SellerID      primitive.ObjectID `bson:"sellerId" json:"sellerId"`
	BuyerID       primitive.ObjectID `bson:"buyerId" json:"buyerId"`
	BuyerName     string        `bson:"buyerName" json:"buyerName"`
	BuyerAddress  string        `bson:"buyerAddress" json:"buyerAddress"`
	Date          primitive.DateTime `bson:"date" json:"date"`
	Items         []Product     `bson:"items" json:"items"`
	Total         float64       `bson:"total" json:"total"`
	Status        string        `bson:"status" json:"status"`
	ShippingInfo  *ShippingInfo `bson:"shippingInfo,omitempty" json:"shippingInfo,omitempty"`
	PaymentMethod PaymentMethod `bson:"paymentMethod" json:"paymentMethod"`
	ReturnInfo    *ReturnInfo   `bson:"returnInfo,omitempty" json:"returnInfo,omitempty"`
}

type ShippingInfo struct {
	Service     string `bson:"service" json:"service"`
	Appointment string `bson:"appointment" json:"appointment"`
}

type PaymentMethod struct {
	Type    string `bson:"type" json:"type"`
	Details string `bson:"details" json:"details"`
}

type ReturnInfo struct {
	Status string `bson:"status" json:"status"`
	Reason string `bson:"reason" json:"reason"`
}