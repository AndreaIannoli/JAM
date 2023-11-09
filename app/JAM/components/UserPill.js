import {Image, View, StyleSheet, Text, Pressable, Modal, TouchableOpacity} from "react-native";
import {Colors} from "../res/Colors";
import {useState} from "react";
import {signOut} from "firebase/auth";
import {FIREBASE_AUTH} from "../config/FirebaseConfig";
import {Feather} from "@expo/vector-icons";
import {LinearGradient} from "expo-linear-gradient";
import ModalDropdown from 'react-native-modal-dropdown';

function UserPill({username, propic}){
    const [modalVisible, setModalVisible] = useState(false);
    const styles = StyleSheet.create({
        container: {
            flexDirection: "row",
            backgroundColor: Colors.surface200,
            borderRadius: 20,
            alignItems: "center",
            gap: 10,
            paddingStart: 10
        },
        text: {
            fontWeight: "bold",
            color: "white"
        },
        propic: {
            backgroundColor: "white",
            borderRadius: 50,
            width: 40,
            height: 40,
        },
    })
    return(
        <View style={styles.container}>
            <Text style={styles.text}>{username}</Text>
            <Image source={{uri: propic}} style={styles.propic}/>
        </View>
    )
}

export default UserPill;
