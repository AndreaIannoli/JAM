import {Text, View, StyleSheet} from "react-native";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {Colors} from "../res/Colors";
import i18n from "i18next";


const styles = StyleSheet.create({
    statusContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 5
    },
    bodyText: {
        color: 'white',
        fontStyle: 'italic',
        fontSize: 18
    },
})

export function getStatusComponent(status) {
    if(status === 'free') {
        return(
            <View style={styles.statusContainer}>
                <FontAwesome5 name="parking" size={20} color={Colors.green} />
                <Text style={[styles.bodyText, {color: Colors.green}]}>{i18n.t('freeStreet')}</Text>
            </View>
        )
    } else if(status === 'almost full') {
        return(
            <View style={styles.statusContainer}>
                <FontAwesome5 name="parking" size={20} color={Colors.orange} />
                <Text style={[styles.bodyText, {color: Colors.orange}]}>{i18n.t('almostFullStreet')}</Text>
            </View>
        )
    } else {
        return(
            <View style={styles.statusContainer}>
                <Ionicons name="flame" size={20} color={Colors.red} />
                <Text style={[styles.bodyText, {color: Colors.red}]}>{i18n.t('fullStreet')}</Text>
            </View>
        )
    }
}
