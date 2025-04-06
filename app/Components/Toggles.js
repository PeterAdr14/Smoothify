import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

function Toggles (props){
    const colorToggle = props.state ? Colors.theme.toggleA : Colors.theme.toggleB;
    if (props.type === "A"){
         textToggle = props.state ? "Not Allergic" : "Allergic";
    } else {
 
            textToggle = props.state ? "Individual" : "Batch";
    }

    return(
            <View style={{ backgroundColor: colorToggle, 
            height: 80, 
            width: 260, 
            padding: 15, 
            borderRadius: 20,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,}} >
                <Text style={styles.itemText}>{props.text}</Text>
                <Text style={styles.itemText}>{textToggle}</Text>
            </View>
    )
}

const styles = StyleSheet.create({
   
    itemText: {
        maxWidth: '80%',
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
    },
});

export default Toggles