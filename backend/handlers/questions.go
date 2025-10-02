package handlers

import (
	"context"
	"net/http"
	"secondlife/backend/models"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func AskQuestion(c *gin.Context) {
	productID := c.Param("id")
	objProductID, err := primitive.ObjectIDFromHex(productID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	var question models.Question
	if err := c.ShouldBindJSON(&question); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	question.ID = primitive.NewObjectID()
	question.Date = primitive.NewDateTimeFromTime(time.Now())

	client := c.MustGet("mongoClient").(*mongo.Client)
	collection := client.Database("secondlife").Collection("products")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{"$push": bson.M{"questions": question}}
	_, err = collection.UpdateOne(ctx, bson.M{"_id": objProductID}, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add question"})
		return
	}

	c.JSON(http.StatusCreated, question)
}

func AnswerQuestion(c *gin.Context) {
	productID := c.Param("id")
	objProductID, err := primitive.ObjectIDFromHex(productID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid product ID"})
		return
	}

	questionID := c.Param("questionId")
	objQuestionID, err := primitive.ObjectIDFromHex(questionID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question ID"})
		return
	}

	var req struct {
		Answer string `json:"answer"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	client := c.MustGet("mongoClient").(*mongo.Client)
	collection := client.Database("secondlife").Collection("products")

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": objProductID, "questions._id": objQuestionID}
	update := bson.M{"$set": bson.M{"questions.$.answer": req.Answer}}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to answer question"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product or question not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Answer submitted successfully"})
}