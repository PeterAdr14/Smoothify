package main

import (
	"log"

	"getrecipe.local/get_recipe/config"
	"getrecipe.local/get_recipe/router"
)

func main() {
	log.Println("main: entered")
	config.SetupDatabase()
	log.Println("main/config: executed")
	router.SetupRouter()
	log.Println("main/router: executed")
}
