package models

type Recipe struct {
	Id         int `gorm:"primaryKey;autoIncrement"`
	User_Id    string
	Output     string
	Preference string
	Allergy    string
}
