import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { Colors } from "../../constants/Colors";
import Saved from "../Components/Saved";
import React, { useState } from "react";
import * as AppleAuthentication from "expo-apple-authentication";
import axios from "axios";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

let refresh = false;
let status = false;
let ID = "";
let UID = 0;

//Check to make sure the user is logged in
export const signInCheck = () => {
  console.log(status);
  return status;
};

//Returns the ID string provided by Apple
export const IdCheck = () => {
  console.log(ID);
  return ID;
};

//Returns the UID number provided by the database
export const UidCheck = () => {
  console.log(UID);
  return UID;
};

//Exports refresh recipe list call (actual refresh later)
export const refreshing = () => {
  refresh = !refresh;
  console.log("refresh: " + refresh);
};

//Profile function
export default function Profile() {
  const [inCredits, setPage] = useState(false);
  const [inRecipe, setView] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [spot, setIndex] = useState(Number);
  const [isSignedIn, setStatus] = useState(false);

  //Alert to confirm sign out
  const signOutAlert = () =>
    Alert.alert("Sign Out", "Sign out of your Smoothify account?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "Confirm", onPress: () => statusChange() },
    ]);

  //Allert to confirm deleting a recipe
  const deleteRecipeAlert = (recipe_id: string) =>
    Alert.alert("Delete Recipe", "Delete this Recipe?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: async () => await deleteRecipe(ID, recipe_id),
      },
    ]);

  //Removing recipe from app recipe list
  const handleRemoveRecipe = (index: number) => {
    let itemsCopy = recipes;
    itemsCopy.splice(index, 0);
    setRecipes(itemsCopy);
    setView(!inRecipe);
    refreshList(ID);
  };

  //Change sign-in status
  const statusChange = () => {
    console.log("status Changed");
    status = !isSignedIn;
    setStatus(!isSignedIn);
  };

  // Login Database Process
  async function login(user: string) {
    console.log("enter login");
    const url =
      "YOUR DATABASE ENDPOINT/get/recipes/" +
      user;
    console.log(url);
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // Ensures no request timeout issues
        validateStatus: () => true, // Bypasses Axios rejection for HTTP errors
      });
      console.log(response.data);
      if (response.data["recipes"].length != 0) {
        console.log(response);
        const raw = JSON.stringify(response.data["recipes"]);
        const data = JSON.parse(raw);
        setRecipes(data);
      }
      ID = user;
      UID = response.data["user"];
      console.log(UID);
    } catch (e) {
      console.log("Failed database retrieval: ", e);
      return false;
    }
    return true;
  }

  //Refresh the recipe list
  async function refreshList(user: string) {
    const url =
      "YOUR DATABASE ENDPOINT/get/recipes/" +
      user;
    console.log(url);
    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // Ensures no request timeout issues
        validateStatus: () => true, // Bypasses Axios rejection for HTTP errors
      });
      //console.log(response);
      const raw = JSON.stringify(response.data["recipes"]);
      const data = JSON.parse(raw);
      setRecipes(data);
      console.log(recipes.length);
    } catch (e) {
      console.log("Failed refresh: ", e);
    }

    return;
  }

  //  Delete Recipe Database Process
  async function deleteRecipe(user: string, recipe_id: string) {
    console.log("Enter Delete");
    const url =
      "YOUR DATABASE ENDPOINT/delete/recipe/" +
      user +
      "/" +
      recipe_id;
    console.log(url);
    try {
      const response = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // Ensures no request timeout issues
        validateStatus: () => true, // Bypasses Axios rejection for HTTP errors
      });
      console.log(response);
      handleRemoveRecipe(spot);
      setIndex(-1);
      console.log("Successfully Deleted");
    } catch (e) {
      console.log("Failed Recipe Delete: ", e);
    }
    return;
  }

  // Create User Database Operation
  async function newUser(id: string, account: string | null) {
    console.log("new user entered");
    const url =
      "YOUR DATABASE ENDPOINT/create/user";

    const body = {
      user: id,
      email: account,
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
      ID = id;
      UID = response.data["user"];
    } catch (e) {
      console.log("Failed User Creation: ", e);
      return false;
    }
    return true;
  }

  //CREDITS PAGE *******
  if (inCredits) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.credContainer}>
          <Text style={styles.title}>Credits</Text>
          <Pressable onPress={() => setPage(!inCredits)}>
            <Text style={styles.link}>Back</Text>
          </Pressable>
          <Text style={styles.credText}>
            Generating the recipes is powered by OpenAI's GPT-4o-mini. As such
            please thoroughly read the recipes to ensure that they comply with
            your dietary needs. In order to generate the best possible recipes,
            ChatGPT is passed a template recipe dependent on the flavor profile
            that you have selected.
          </Text>
          <Image
            source={require("./../../assets/gifs/blender.gif")}
            style={styles.image}
          />
          <Text style={styles.credText}>
            The creator of this app is Peter Adranly. Peter is a recent graduate
            from Santa Clara University's Computer Science program with a
            Bachelor's in Science. He is currently pursuing a career in Data
            Science, Full Stack Engineering, and Machine Learning, and decided
            to build Smooth to expand his knowledgebase about incorporating
            ChatGPT with React Native in a mobile application.
          </Text>
        </View>
      </ScrollView>
    );
  }

  //Retrieves the index of the local recipe list
  const retrieve = (index: number) => {
    console.log(index);
    setIndex(index);
    setView(!inRecipe);
  };

  //RECIPE PAGE *******
  if (inRecipe) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.credContainer}>
          <Text style={styles.title}>Saved Recipe</Text>
          <Pressable style={styles.credits} onPress={() => setView(!inRecipe)}>
            <Text style={styles.link}>Back</Text>
          </Pressable>
          <Text style={styles.miniTitle}>{recipes[spot]["title"]}</Text>
          <Text style={styles.recipe_text}>
            {JSON.parse(recipes[spot]["output"])}
          </Text>
          <Pressable
            style={styles.credits}
            onPress={() => deleteRecipeAlert(recipes[spot]["Id"])}
          >
            <Text style={styles.delete_link}>Delete</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  //SIGNED IN PAGE *******
  if (isSignedIn) {
    let subTitle = "";
    if (recipes.length == 0) {
      subTitle = "No Saved Recipes";
    } else {
      subTitle = "Saved Recipes";
    }
    if (refresh) {
      refreshList(ID);
      refreshing();
    }
    return (
      <ScrollView style={styles.container}>
        <View style={styles.credContainer}>
          <Text style={styles.title}>Profile</Text>
          <Pressable
            style={styles.credits}
            onPress={async () => await refreshList(ID)}
          >
            <MaterialCommunityIcons style={styles.refresh} name={"refresh"} />
          </Pressable>
          <Text style={styles.miniTitle}>{subTitle}</Text>
          <View>
            {recipes.map((recipe, index) => {
              return (
                <Pressable key={index} onPress={() => retrieve(index)}>
                  <Saved text={recipe["title"]} />
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.credits} onPress={() => setPage(!inCredits)}>
            <Text style={styles.link}>Credits</Text>
          </Pressable>
          <Pressable style={styles.credits} onPress={signOutAlert}>
            <Text style={styles.link}>Sign Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  //BASE PAGE ********
  return (
    <ScrollView style={styles.container}>
      <View style={styles.credContainer}>
        <Text style={styles.title}>Profile</Text>
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE}
          cornerRadius={5}
          style={styles.button}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              //Successfully log in
              console.log(credential.user);
              let val = await login(credential.user);
              console.log(val);

              //Create a new user
              if (!val) {
                console.log("new user");
                val = await newUser(credential.user, credential.email);
              }
              statusChange();
            } catch (e: any) {
              console.log("Login Error: ", e);
            }
          }}
        />
        <Pressable style={styles.credits} onPress={() => setPage(!inCredits)}>
          <Text style={styles.link}>Credits</Text>
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

  credContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.theme.background,
  },

  title: {
    flex: 1,
    fontSize: 40,
    color: Colors.theme.title,
    fontWeight: "bold",
    paddingTop: 80,
    marginBottom: 20,
  },

  text: {
    flex: 1,
    maxWidth: "90%",
    fontSize: 18,
    color: Colors.theme.title,
    marginBottom: 20,
  },

  recipe_text: {
    maxWidth: "90%",
    fontSize: 15,
    color: Colors.theme.title,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30,
  },

  credText: {
    maxWidth: "90%",
    fontSize: 18,
    color: Colors.theme.title,
  },

  miniTitle: {
    maxWidth: "90%",
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.theme.title,
  },

  link: {
    maxWidth: "90%",
    fontSize: 25,
    color: Colors.theme.subtitle,
  },

  refresh: {
    //maxWidth: "90%",
    fontSize: 60,
    color: Colors.theme.toggleA,
  },

  delete_link: {
    maxWidth: "90%",
    fontSize: 25,
    color: Colors.theme.toggleB,
  },

  image: {
    width: 300,
    height: 300,
    borderRadius: 500,
  },

  credits: {
    paddingVertical: 30,
  },

  button: {
    backgroundColor: Colors.theme.toggleB,
    height: 64,
    width: 260,
    padding: 15,
    borderRadius: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
});
