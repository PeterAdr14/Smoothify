import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

function Saved (props){
    return(
            <View style={styles.shape}>
                <Text style={styles.itemText}>{props.text}</Text>
            </View>
    )
}

const styles = StyleSheet.create({
   
    itemText: {
        maxWidth: '80%',
        fontSize: 20,
        color: Colors.theme.bton_txt,
        fontWeight: "bold",
    },

    shape: {
        backgroundColor: Colors.theme.toggleA, 
            width: 290, 
            borderRadius: 20,
            alignItems: "center",
            paddingVertical: 20,
            marginTop: 30,    
        },
});

export default Saved