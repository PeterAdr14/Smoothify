package controllers

import (
	"log"
	"reflect"

	"net/http"

	"getrecipe.local/get_recipe/config"
	"getrecipe.local/get_recipe/models"

	"github.com/gin-gonic/gin"
)

type ProductController struct {
}

// GET the recipes for the user
func (con *ProductController) Get(c *gin.Context) {
	var recipes []models.Recipe
	var user models.User

	userID := c.Param("user_id")
	log.Println("product_controller|| user_id: ?", userID, reflect.TypeOf(userID))

	//User Table Database Execution
	err_user := config.DB.Raw("select * from user where user = ?", userID).Find(&user).Error

	log.Println(user)
	if err_user != nil {
		log.Println("main/router/product_controller: query/user error|| error: ?", err_user)
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	} else if len(user.User) == 0 {
		log.Println("main/router/product_controller: user doesn't exist")
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	//Recipe Table Database Execution
	err_recipe := config.DB.Raw("select * from recipe where user_id = ?", user.Id).Find(&recipes).Error
	if err_recipe != nil {
		log.Println("main/router/product_controller: query/recipe error|| error: ?", err_recipe)
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}

	log.Println("recipe: ", recipes)

	if len(recipes) == 0 {
		log.Println("main/router/product_controller: empty response|| response: ?", recipes)
	}

	// Return the recipe
	log.Println("main/router/product_controller: executed")

    response := gin.H{
		"user":    user.Id,
		"recipes": recipes,
	}

	c.JSON(http.StatusOK, response)
}

func (con *ProductController) Health(c *gin.Context) {
	c.JSON(http.StatusOK, "Ok")
}

// CREATES a new recipe for a user
func (con *ProductController) Create_Recipe(c *gin.Context) {
	var recipe models.Recipe
	c.BindJSON(&recipe)
    var user models.User

	userID := c.Param("user_id")
	log.Println("product_controller|| user_id: ?", userID, reflect.TypeOf(userID))

	//User Table Database Execution
	err_user := config.DB.Raw("select * from user where user = ?", userID).Find(&user).Error

	log.Println(user)
	if err_user != nil {
		log.Println("main/router/product_controller: query/user error|| error: ?", err_user)
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	} else if len(user.User) == 0 {
		log.Println("main/router/product_controller: user doesn't exist")
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	err := config.DB.Exec("insert into recipe (user_id, title, output, preference, allergy) values (?, ?, ?, ?, ?)", recipe.User_Id, recipe.Title, recipe.Output, recipe.Preference, recipe.Allergy).Error
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusOK, recipe)
}

// CREATES a new user
func (con *ProductController) Create_User(c *gin.Context) {
	var dupe models.User
	var user models.User
	c.BindJSON(&user)

	exist := config.DB.Raw("select * from user where user = ?", user.User).Find(&dupe).Error
	if exist != nil || user.User == dupe.User {
		c.JSON(http.StatusFound, "User Exists")
		return
	}

	err := config.DB.Exec("insert into user (user, email) values (?, ?)", user.User, user.Email).Error
	if err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	c.JSON(http.StatusOK, user)
}

// DELETE a recipe
func (con *ProductController) Delete(c *gin.Context) {
    var user models.User

	recipeID := c.Param("recipe_id")
	log.Println("product_controller|| recipe_id: ?", recipeID, reflect.TypeOf(recipeID))

	userID := c.Param("user_id")
	log.Println("product_controller|| user_id: ?", userID, reflect.TypeOf(userID))

	//User Table Database Execution
	err_user := config.DB.Raw("select * from user where user = ?", userID).Find(&user).Error

	log.Println(user)
	if err_user != nil {
		log.Println("main/router/product_controller: query/user error|| error: ?", err_user)
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found"})
		return
	} else if len(user.User) == 0 {
		log.Println("main/router/product_controller: user doesn't exist")
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	//Recipe Table Database Execution
	err_recipe := config.DB.Exec("delete from recipe where id = ?", recipeID).Error
	if err_recipe != nil {
		log.Println("main/router/product_controller: query/recipe error|| error: ?", err_recipe)
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}
	// Return the recipe
	log.Println("main/router/product_controller: executed")
	c.JSON(http.StatusOK, "Successfully Deleted")
}
