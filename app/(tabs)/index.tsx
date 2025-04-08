import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "react-native-wheel-pick";
import { Colors } from "../../constants/Colors";
import Toggles from "../Components/Toggles";
import Ingredient from "../Components/Ingredient";

const totalAllergies = ["PEANUTS", "TREE NUTS", "MILK", "SOY", "SESAME"];
let setAllergies = [true, true, true, true, true];
let finalAllergy: string[] = [];

const totalPreferences = ["QUANTITY"];
let setPreferences = [true];
let finalPreferences: string[] = [];

let finalIngredients: string[] = [];

let flavoring = "Sweet";

const flavorList = [
  "Fruity",
  "Sour",
  "Nutty",
  "Veggie",
  "High-Protein",
  "Low-Calorie",
  "Milkshake",
];

//Export the recipe allergies
export const confirmAllergies = () => {
  finalAllergy = [];
  let inc = 0;
  for (let i = 0; i < setAllergies.length; i++) {
    if (setAllergies[i] == false) {
      finalAllergy[inc] = totalAllergies[i];
      inc++;
    }
  }
  return finalAllergy;
};

//Export the recipe ingredient list
export const confirmIngredients = () => {
  return finalIngredients;
};

//Export the recipe preferences
export const confirmPreferences = () => {
  finalPreferences = [];
  if (setPreferences[0] == true) {
    finalPreferences[0] = "Individual";
  } else if (setPreferences[0] == false) {
    finalPreferences[0] = "Batch";
  }
  finalPreferences[1] = flavoring;
  return finalPreferences;
};

// Index Function
export default function Index() {
  //Allergy list state
  const [allergies, updateAllergy] = useState([true, true, true, true, true]);
  //Preference list state
  const [preference, updatePreference] = useState([true]);
  //Individual ingredient
  const [ingredient, setIngredient] = useState("");
  //Ingredients list
  const [ingItems, setIngItems] = useState(["Fruit"]);

  //Changes toggle/button based on value
  const changeToggle = (input: number, type: String) => {
    if (type == "A") {
      updateAllergy((prev) =>
        prev.map((value, i) => (i === input ? !value : value))
      );
      setAllergies = allergies;
    } else {
      updatePreference((prev) =>
        prev.map((value, i) => (i === input ? !value : value))
      );
      setPreferences = preference;
    }
  };

  //Adding new ingredient to list
  const handleAddIng = () => {
    Keyboard.dismiss();
    if (ingredient.length != 0) {
      setIngItems([...ingItems, ingredient]);
      finalIngredients = [...ingItems, ingredient];
      setIngredient("");
    }
  };

  //Removing ingredient from list
  const handleRemoveIng = (index: number) => {
    let itemsCopy = [...ingItems];
    itemsCopy.splice(index, 1);
    setIngItems(itemsCopy);
    finalIngredients = itemsCopy;
  };

  //Confirming flavor selection
  const handleDrinkSelect = (value: string) => {
    flavoring = value;
  };

  //Index Main View
  return (
    <ScrollView
      style={styles.container}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets={true}
      alwaysBounceVertical={true}
    >
      <View style={styles.toggleWrapper}>
        <Text style={styles.title}>Ingredients</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.writeIngWrap}
        >
          <TextInput
            style={styles.input}
            placeholder={"Enter an Ingredient"}
            placeholderTextColor={"#777"}
            value={ingredient}
            onChangeText={(text) => setIngredient(text)}
          />
          <Pressable onPress={handleAddIng}>
            <View style={styles.addWrap}>
              <Text style={styles.addText}>Add</Text>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
        <View>
          {ingItems.map((item, index) => {
            return (
              <Pressable key={index} onPress={() => handleRemoveIng(index)}>
                <Ingredient key={index} text={item} />
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.title}>Preferences</Text>
        <View style={styles.picker}>
          <Picker
            style={{
              backgroundColor: Colors.theme.input,
              borderRadius: 20,
              width: 275,
              height: 200,
            }}
            selectedValue="Fruity"
            pickerData={flavorList}
            onValueChange={(value: string) => handleDrinkSelect(value)}
          />
        </View>
        <Pressable onPress={() => changeToggle(0, "F")}>
          <View>
            <Toggles
              text={totalPreferences[0]}
              state={preference[0]}
              type={"F"}
            />
          </View>
        </Pressable>
        <Text style={styles.title}>Allergies</Text>
        <Pressable onPress={() => changeToggle(0, "A")}>
          <View>
            <Toggles text={totalAllergies[0]} state={allergies[0]} type={"A"} />
          </View>
        </Pressable>
        <Pressable onPress={() => changeToggle(1, "A")}>
          <View>
            <Toggles text={totalAllergies[1]} state={allergies[1]} type={"A"} />
          </View>
        </Pressable>
        <Pressable onPress={() => changeToggle(2, "A")}>
          <View>
            <Toggles text={totalAllergies[2]} state={allergies[2]} type={"A"} />
          </View>
        </Pressable>
        <Pressable onPress={() => changeToggle(3, "A")}>
          <View>
            <Toggles text={totalAllergies[3]} state={allergies[3]} type={"A"} />
          </View>
        </Pressable>
        <Pressable onPress={() => changeToggle(4, "A")}>
          <View>
            <Toggles text={totalAllergies[4]} state={allergies[4]} type={"A"} />
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.theme.background,
  },

  toggleWrapper: {
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    flex: 1,
    fontSize: 40,
    color: Colors.theme.title,
    fontWeight: "bold",
    paddingTop: 50,
    marginBottom: 10,
  },

  bton_txt: {
    color: Colors.theme.bton_txt,
    fontSize: 20,
    fontWeight: "bold",
  },

  writeIngWrap: {
    marginBottom: 20,
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
  },

  input: {
    maxWidth: "70%",
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: Colors.theme.input,
    borderRadius: 10,
  },

  addWrap: {
    backgroundColor: Colors.theme.toggleA,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
  },

  addText: {
    fontSize: 20,
    color: Colors.theme.bton_txt,
    fontWeight: "bold",
  },

  picker: {
    paddingBottom: 15,
  },
});
