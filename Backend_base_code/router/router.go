package router

import (
	"log"

	"getrecipe.local/get_recipe/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() {
	productController := controllers.ProductController{}
	corsConfig := cors.DefaultConfig()
	corsConfig.AllowAllOrigins = true
	router := gin.Default()
	router.Use(cors.New(corsConfig))
	router.Group("/get").
		GET("/recipes/:user_id", productController.Get)
	createGroup := router.Group("/create")
	{
		createGroup.POST("/recipe/:user_id", productController.Create_Recipe)
		createGroup.POST("/user", productController.Create_User)
	}
	router.Group("/delete").
		DELETE("/recipe/:user_id/:recipe_id", productController.Delete)

	router.Group("/health").
		GET("", productController.Health)
	router.Run()
	log.Println("main/router: executed")
}
