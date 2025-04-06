package models

type Recipe struct {
	Id         int    `gorm:"primaryKey;autoIncrement"`
	User_Id    int    `json:"user_id"`
	Title      string `json:"title"`
	Output     string `json:"output"`
	Preference string `json:"preference"`
	Allergy    string `json:"allergy"`
}

type User struct {
	Id    int    `gorm:"primaryKey;autoIncrement"`
	User  string `json:"user"`
	Email string `json:"email"`
}
