package main

import (
	"context"
	"log"
	"secondlife/backend/handlers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

import (
	"context"
	"log"
	"os"
	"secondlife/backend/handlers"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		log.Fatal("MONGO_URI environment variable not set")
	}

	// Set up MongoDB connection
	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	// Ping the database to verify connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Could not connect to MongoDB:", err)
	}
	log.Println("Connected to MongoDB!")

	r := gin.Default()

	// CORS middleware
	r.Use(cors.Default())

	// Store the database client in the Gin context
	r.Use(func(c *gin.Context) {
		c.Set("mongoClient", client)
		c.Next()
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	// User routes
	userRoutes := r.Group("/users")
	{
		userRoutes.POST("/register", handlers.RegisterUser)
		userRoutes.POST("/login", handlers.LoginUser)
		userRoutes.GET("/:id", handlers.GetUserByID)
	}

	// Product routes
	productRoutes := r.Group("/products")
	{
		productRoutes.GET("", handlers.GetAllProducts)
		productRoutes.GET("/:id", handlers.GetProductByID)
		productRoutes.POST("/:id/questions", handlers.AskQuestion)
		productRoutes.POST("/:id/questions/:questionId/answer", handlers.AnswerQuestion)
	}

	// Order routes
	orderRoutes := r.Group("/orders")
	{
		orderRoutes.POST("/checkout", handlers.Checkout)
	}

	// Sales routes
	salesRoutes := r.Group("/sales")
	{
		salesRoutes.PUT("/:saleId", handlers.UpdateSale)
		salesRoutes.POST("/:saleId/return", handlers.ProcessReturn)
	}

	r.Run() // listen and serve on 0.0.0.0:8080
}