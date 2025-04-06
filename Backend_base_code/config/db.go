package config

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"gorm.io/gorm/schema"
)

var DB *gorm.DB

func SetupDatabase() {
	godotenv.Load()
	log.Printf("user: %s, instance: %s, port: %s, database: %s",  os.Getenv("DB_USER"), os.Getenv("DB_INSTANCE"), os.Getenv("DB_PORT"), os.Getenv("DB_DATABASE"))
	connection := fmt.Sprintf("%s:%s@unix(/cloudsql/%s)/%s?parseTime=true",
    os.Getenv("DB_USER"), os.Getenv("DB_PASSWORD"), os.Getenv("DB_INSTANCE"), os.Getenv("DB_DATABASE"))
    
    db, err := gorm.Open(mysql.Open(connection), &gorm.Config{
		NamingStrategy: schema.NamingStrategy{SingularTable: true},
	})
    
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		return
	}
	DB = db
	log.Println("db: connected")
}
