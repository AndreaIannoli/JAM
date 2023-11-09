import {Text, TouchableOpacity, StyleSheet, View} from "react-native";
import {Colors} from "../res/Colors";

function SecondaryButton({onPress, title, widthPerc}) {
    const styles = StyleSheet.create({
        buttonContainer: {
            borderRadius: 40,
            borderStyle: "solid",
            borderColor: Colors.grey,
            borderWidth: 2,
            backgroundColor: "transparent",
            height: 45,
            width: widthPerc ? widthPerc : "100%",
            justifyContent: "center",
            alignItems: "center"
        },
        buttonText: {
            fontSize: 18,
            color: Colors.grey,
            fontWeight: "bold"
        },
        buttonWIconContainer: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            gap: 10
        }
    })
    return(
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
            {Array.isArray(title)?
                <View style={styles.buttonWIconContainer}>{title[0]}<Text style={styles.buttonText}>{title[1]}</Text></View>
                :
                <Text style={styles.buttonText}>{title}</Text>
            }
        </TouchableOpacity>
    )
}

export default SecondaryButton;
