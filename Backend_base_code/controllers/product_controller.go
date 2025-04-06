package controllers

import (
	"app/config"
	"app/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ProductController struct {
}

// func (con *ProductController) Index(c *gin.Context) {
// 	var recipes []models.Recipe
// 	config.DB.Find(&recipes)
// 	c.JSON(http.StatusOK, recipes)
// }

func (con *ProductController) Get(c *gin.Context) {
	var recipe models.Recipe
	userID := c.Param("user_id")

	// Query the database
	if err := config.DB.Where("user_id = ?", userID).Order("id").First(&recipe).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}

	// Return the recipe
	c.JSON(http.StatusOK, recipe)

	// config.DB.First(&recipe, c.Params.ByName("user_id"))
	// c.JSON(http.StatusOK, recipe)
}

// func (con *ProductController) Create(c *gin.Context) {
// 	var recipe models.Recipe
// 	c.BindJSON(&recipe)
// 	if err := config.DB.Create(&recipe).Error; err != nil {
// 		c.AbortWithError(http.StatusBadRequest, err)
// 		return
// 	}
// 	c.JSON(http.StatusOK, recipe)
// }

// func (con *ProductController) Update(c *gin.Context) {
// 	var recipe models.Recipe
// 	c.BindJSON(&recipe)
// 	recipe.Id, _ = strconv.Atoi(c.Params.ByName("id"))
// 	if err := config.DB.Updates(&recipe).Error; err != nil {
// 		c.AbortWithError(http.StatusBadRequest, err)
// 		return
// 	}
// 	c.JSON(http.StatusOK, recipe)
// }

// func (con *ProductController) Delete(c *gin.Context) {
// 	var recipe models.Recipe
// 	if err := config.DB.Delete(&recipe, c.Params.ByName("id")).Error; err != nil {
// 		c.AbortWithError(http.StatusBadRequest, err)
// 		return
// 	}
// 	c.Status(http.StatusOK)
//}
