import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { confirmAllergies, confirmIngredients, confirmPreferences } from ".";
import axios from "axios";
import { Colors } from "../../constants/Colors";
import { IdCheck, refreshing, signInCheck, UidCheck } from "./profile";

let allergy: string[] = [];
let preference: string[] = [];
let ingredients: string[] = [];

const apikey =
  "sk-Itn81kYl4y4DSrrKpofJWZ3oha0af3CyCeXCSExm16T3BlbkFJ5yuiOdYimT5sSFJlNF91uzYeUI4M_1ZCOITGju8NgA";

const recieveInfo = () => {
  allergy = confirmAllergies();
  preference = confirmPreferences();
  ingredients = confirmIngredients();
};

const getTemplate = (value: string) => {
  if (value == "Sour") {
    return "https://www.allrecipes.com/recipe/235998/sour-smoothie/";
  } else if (value == "Nutty") {
    return "https://www.prevention.com/food-nutrition/g20466367/nut-butter-smoothie-recipes/";
  } else if (value == "Fruity") {
    return "https://www.allrecipes.com/recipe/23553/basic-fruit-smoothie/";
  } else if (value == "Veggie") {
    return "https://www.allrecipes.com/recipe/236951/spinach-and-kale-smoothie/";
  } else if (value == "High-Protien") {
    return "https://www.menshealth.com/nutrition/a19545933/healthy-protein-smoothie-recipes/";
  } else if (value == "Low-Calorie") {
    return "https://www.eatthis.com/low-calorie-smoothies-weight-loss/";
  } else if (value == "Milkshake") {
    return "https://cookingformysoul.com/easy-vanilla-milkshakes/";
  }
};

export default function Generate() {
  const [text, setText] = useState("");
  const [savable, setSavable] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const find_status = () => {
    if (signInCheck() == true) {
      titleAlert();
    } else {
      noSignInAlert();
    }
  };

  const formatAllergy = (selected: string | string[]) => {
    const allAllergies = ["Soy", "Milk", "Sesame", "Peanuts", "Tree Nuts"];

    const allergiesObj = allAllergies.reduce<Record<string, number>>(
      (acc, allergy) => {
        acc[allergy] = selected.includes(allergy.toUpperCase()) ? 1 : 0;
        return acc;
      },
      {}
    );
    return JSON.stringify({ allergies: allergiesObj });
  };

  const formatPreference = (selected: String[]) => {
    const preferenceObj = {
      quantity: selected[0] || "Default",
      flavoring: selected[1] === "Sweet" ? "Fruity" : selected[1] || "Default",
    };

    return JSON.stringify({ preference: preferenceObj });
  };

  const titleAlert = () => {
    Alert.prompt("Title your smoothie!", "Please enter a title", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async (title) => await newRecipe(title),
      },
    ]);
  };

  const noSignInAlert = () => {
    Alert.alert("Not Signed In", "Please sign in on the Profile page", [
      {
        text: "Okay",
        onPress: () => console.log("Okay Pressed"),
        style: "cancel",
      },
    ]);
  };

  async function newRecipe(title: string | undefined) {
    const id = IdCheck();
    const uid = UidCheck();
    const url =
      "https://profile-recipe-755357171976.us-west1.run.app/create/recipe/" +
      id;

    const body = {
      User_id: uid,
      Title: title,
      Output: JSON.stringify(text),
      Allergy: formatAllergy(allergy),
      Preference: formatPreference(preference),
    };
    console.log(url);
    try {
      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // Ensures no request timeout issues
        validateStatus: () => true, // Bypasses Axios rejection for HTTP errors
      });
      console.log(response);
      refreshing();
      setSavable("");
    } catch (error) {
      console.log("Failed Database Post: ", error);
    }

    return;
  }

  const openAI = axios.create({
    baseURL: "https://api.openai.com/v1",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apikey}`,
    },
  });

  const handleSend = async () => {
    recieveInfo();
    let prompt = "";
    let template = getTemplate(preference[1]);
    setIsLoading(true);
    if (allergy.length == 0 && ingredients.length == 0) {
      prompt = `Write me a smoothie recipe using  ${template} as a base. I want a ${preference} smoothie. Please don't use Markdown formatting. The recipe should have ingredients and instructions sections`;
    } else if (ingredients.length == 0) {
      prompt = `Write me a smoothie recipe using ${template} as a base. I want a ${preference} smoothie, I am allergic to ${allergy}. Please don't use Markdown formatting. The recipe should have ingredients, and instructions sections`;
    } else if (allergy.length == 0) {
      prompt = `Write me a smoothie recipe using ${template} as a base and ${ingredients} as ingredinets. I want a ${preference} smoothie. Please don't use Markdown formatting. The recipe should have ingredients, and instructions sections`;
    } else {
      prompt = `Write me a smoothie recipe using ${template} as a base and ${ingredients} as ingredinets. I want a ${preference} smoothie, I am allergic to ${allergy}. Please don't use Markdown formatting. The recipe should have ingredients, and instructions sections`;
    }

    try {
      const response = await openAI.post("/chat/completions", {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      setIsLoading(false);
      setText(response.data.choices[0].message.content);
      setSavable("Save Recipe");
    } catch (error) {
      console.log(error);
      setText(
        "There were some difficulties generating your recipe. Please try again."
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadContainer}>
        <Image
          source={require("./../../assets/gifs/blender.gif")}
          style={styles.image}
        />
        <Text style={styles.loadTitle}>Generating Recipe</Text>
      </SafeAreaView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.genWrapper}>
        <Text style={styles.title}>Smoothie Recipe</Text>

        <Pressable style={styles.bton} onPress={handleSend}>
          <Text style={styles.bton_txt}>Generate</Text>
        </Pressable>
        <View style={styles.text}>
          <Text style={styles.text}>Generation is powered by ChatGPT</Text>
          <Text style={styles.text}>
            Please read through the recipe thoroughly to ensure it complies with
            your dietary needs.
          </Text>
          <Text>{text}</Text>
          <Pressable style={styles.credits} onPress={() => find_status()}>
            <Text style={styles.link}>{savable}</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.theme.background,
  },

  genWrapper: {
    paddingTop: 30,
    alignItems: "center",
    justifyContent: "center",
  },

  loadContainer: {
    flex: 1,
    backgroundColor: Colors.theme.background,
    paddingTop: StatusBar.currentHeight,
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    maxWidth: "90%",
    fontSize: 15,
    color: Colors.theme.subtitle,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    flex: 1,
    fontSize: 40,
    color: Colors.theme.title,
    fontWeight: "bold",
    paddingTop: 40,
    marginBottom: 10,
  },

  loadTitle: {
    flex: 1,
    fontSize: 40,
    color: Colors.theme.title,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "space-between",
  },

  bton: {
    backgroundColor: Colors.theme.toggleA,
    borderWidth: 0,
    width: 260,
    padding: 15,
    borderRadius: 25,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  bton_txt: {
    color: Colors.theme.bton_txt,
    fontSize: 20,
    fontWeight: "bold",
  },

  image: {
    marginTop: 100,
    width: 300,
    height: 300,
    borderRadius: 500,
  },

  credits: {
    paddingVertical: 30,
  },

  link: {
    maxWidth: "90%",
    fontSize: 25,
    color: Colors.theme.subtitle,
  },
});
