package main

import (
	"context"
	"errors"
	"log"
	"os"
	"secondlife/backend/handlers"
	"strings"
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

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Could not connect to MongoDB:", err)
	}
	log.Println("Connected to MongoDB!")

	db := client.Database("secondlife")
	collections := []string{"users", "products", "orders", "sales"}
	for _, coll := range collections {
		err = db.CreateCollection(ctx, coll)
		if err != nil {
			var cmdErr mongo.CommandError
			if errors.As(err, &cmdErr) && cmdErr.Code == 48 { // 48 is NamespaceExists
				log.Printf("Collection '%s' already exists, skipping creation.\n", coll)
			} else {
				log.Fatalf("Failed to create collection '%s': %v", coll, err)
			}
		} else {
			log.Printf("Collection '%s' created successfully.\n", coll)
		}
	}

	r := gin.Default()

	r.Use(cors.Default())

	r.Use(func(c *gin.Context) {
		c.Set("mongoClient", client)
		c.Next()
	})

	// API routes are grouped under /api
	api := r.Group("/api")
	{
		api.GET("/ping", func(c *gin.Context) {
			c.JSON(200, gin.H{"message": "pong"})
		})
		userRoutes := api.Group("/users")
		{
			userRoutes.POST("/register", handlers.RegisterUser)
			userRoutes.POST("/login", handlers.LoginUser)
			userRoutes.GET("/:id", handlers.GetUserByID)
		}
		productRoutes := api.Group("/products")
		{
			productRoutes.GET("", handlers.GetAllProducts)
			productRoutes.GET("/:id", handlers.GetProductByID)
			productRoutes.POST("/:id/questions", handlers.AskQuestion)
			productRoutes.POST("/:id/questions/:questionId/answer", handlers.AnswerQuestion)
		}
		orderRoutes := api.Group("/orders")
		{
			orderRoutes.POST("/checkout", handlers.Checkout)
		}
		salesRoutes := api.Group("/sales")
		{
			salesRoutes.PUT("/:saleId", handlers.UpdateSale)
			salesRoutes.POST("/:saleId/return", handlers.ProcessReturn)
		}
	}

	// Serve frontend static files
	r.Static("/assets", "./frontend/dist/assets")

	// Serve the index.html for the root route
	r.GET("/", func(c *gin.Context) {
		c.File("./frontend/dist/index.html")
	})

	// Catch-all for other routes, to support client-side routing
	r.NoRoute(func(c *gin.Context) {
		// If the request is not for an API endpoint, serve the index.html
		if !strings.HasPrefix(c.Request.URL.Path, "/api/") {
			c.File("./frontend/dist/index.html")
		}
	})

	r.Run() // listen and serve on 0.0.0.0:8080
}