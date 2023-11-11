import {Image, StyleSheet, Text, View} from "react-native";
import TopBar from "./TopBar";
import {FIREBASE_AUTH} from "../config/FirebaseConfig";
import {Colors} from "../res/Colors";
import {MaterialIcons} from "@expo/vector-icons";
import {useTranslation} from "react-i18next";

function Profile({navigation}){
    const { t } = useTranslation();
    const styles = StyleSheet.create({
        container: {
            height: "100%",
            alignItems: "center",
            backgroundColor: Colors.surface200
        },
        profilePropic: {
            width: 200,
            height: 200,
            borderRadius: 200,
            marginTop: 40,
            zIndex: 10
        },
        profileLabel: {
            color: Colors.grey,
            fontWeight: "bold"
        },
        profileText: {
            color: "white",
            marginBottom: 20
        },
        profileBox: {
            backgroundColor: Colors.surface500,
            padding: 40,
            paddingTop: 100,
            borderRadius: 30,
            width: "90%",
            marginTop: -100,
            zIndex: 1,
        }
    })
    return(
        <View style={styles.container}>
            <TopBar page="Profile" navigation={navigation}/>
            <Image source={{uri: FIREBASE_AUTH.currentUser.photoURL}} style={styles.profilePropic}></Image>
            <View style={styles.profileBox}>
                <Text style={styles.profileLabel}>
                    {t('nameLabel')}
                </Text>
                <Text style={styles.profileText}>
                    {FIREBASE_AUTH.currentUser.displayName}
                </Text>
                <Text style={styles.profileLabel}>
                    {t('emailLabel')}
                </Text>
                <Text style={styles.profileText}>
                    {FIREBASE_AUTH.currentUser.email}
                </Text>
                <Text style={[styles.profileLabel, {justifyContent: "center"}]}>{t('emailVerLabel')}{FIREBASE_AUTH.currentUser.emailVerified ? <MaterialIcons name="verified" style={{color: "green"}}/> : <MaterialIcons name="cancel" style={{color: Colors.primary}}/>}</Text>
            </View>
        </View>
    )
}

export default Profile;
