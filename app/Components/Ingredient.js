import {
    StyleSheet,
    Text,
    View,
  } from "react-native";

import { Colors } from "../../constants/Colors";

const Ingredient = (props) => {

    return(
        <View style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={styles.square}>
                    <Text style={styles.X}>X</Text>
                </View>
                <Text style={styles.itemText}>{props.text}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

    item: {
        backgroundColor: Colors.theme.toggleA,
        padding: 15,
        borderRadius: 10,
        flexDirection: "row",
        marginBottom: 20,
        justifyContent: "space-between",
        alignItems: "center",
    },

    itemLeft: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },

    square: {
        backgroundColor: Colors.theme.square,
        opacity: 0.7,
        width: 24,
        height: 24,
        justifyContent: "space-between",
        borderRadius: 5,
        marginRight: 15,

    },

    X: {
        color: Colors.theme.bton_txt,
        fontWeight: "bold",
        fontSize: 20,
        paddingHorizontal: 5,
        alignItems: "center",
    },

    itemText: {
        color: Colors.theme.bton_txt,
        fontWeight: "bold",
        fontSize: 20,
        flexWrap: "wrap",
        paddingHorizontal: 30,
    }
});

export default Ingredient