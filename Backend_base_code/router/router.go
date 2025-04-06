package router

import (
	"app/controllers"

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
	router.Run()
}
