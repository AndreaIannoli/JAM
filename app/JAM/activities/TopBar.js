import {Image, Text, TouchableOpacity, View} from "react-native";
import Constants from "expo-constants";
import {StyleSheet} from "react-native";
import {Colors} from "../res/Colors";
import UserPill from "../components/UserPill";
import {FIREBASE_AUTH} from "../config/FirebaseConfig";
import {MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {signOut} from "firebase/auth";
import {useContext, useEffect, useState} from "react";
import {
    addToFavourite,
    changeUserNotificationsPref,
    checkIfFavourite,
    getUserNotificationsPref,
    removeFromFavourite
} from "../services/UserService";
import {StreetsInfosContext} from "../components/StreetsInfosProvider";
import {useTranslation} from "react-i18next";

function TopBar({page, navigation}){
    const { t } = useTranslation();
    const styles = StyleSheet.create({
        topBarContainer: {
            paddingTop: Constants.statusBarHeight,
            paddingBottom: 20,
            backgroundColor: Colors.surface500,
            width: "100%",
            alignItems: "center",
            borderBottomRightRadius: 30,
            borderBottomLeftRadius: 30,
            gap: 10,
            zIndex: 10
        },
        logo: {
            width: 80,
            height: 40
        },
        userPillContainer: {
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 20,
            justifyContent: "center",
            alignItems: "center",
        },
        headingContainer: {
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 20,
            alignItems: "center",
            justifyContent: "space-between"
        },
        headingText: {
            color: "white",
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center"
        },
        iconSecondary: {
            color: Colors.surface200,
            fontSize: 30
        },
        iconPrimary: {
            color: Colors.primary,
            fontSize: 30
        },
        headingContainerWOBtns: {
            flexDirection: "row",
            width: "100%",
            paddingHorizontal: 20,
            alignItems: "center",
            justifyContent: "center"
        },
        rightBtn: {
            position: "absolute",
            right: 20
        },
        leftBtn: {
            position: "absolute",
            left: 20
        }
    })
    if(page === "Home") {
        return (
            <View style={styles.topBarContainer}>
                <Image source={require("../res/img/logohorizontal_2.webp")} resizeMode="contain" style={styles.logo}/>
                <View style={styles.userPillContainer}>
                    <TouchableOpacity onPress={() => {navigation.navigate('Settings')}}>
                        <MaterialIcons name="settings" style={styles.iconSecondary}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {navigation.navigate('Profile')}} style={{marginStart: "auto"}}>
                        <UserPill username={FIREBASE_AUTH.currentUser.displayName} propic={FIREBASE_AUTH.currentUser.photoURL}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    } else if(page === "Feed") {
        const [notificationsPref, setNotificationsPref] = useState(true);

        async function retrieveNotificationsPref() {
            setNotificationsPref(await getUserNotificationsPref());
        }

        useEffect(() => {
            retrieveNotificationsPref();
        }, []);
        return(
            <View style={styles.topBarContainer}>
                <Image source={require("../res/img/logohorizontal_2.webp")} resizeMode="contain" style={styles.logo}/>
                <View style={styles.headingContainerWOBtns}>
                    <Text style={styles.headingText}>{t('feedHeading')}</Text>
                    {notificationsPref ?
                        <TouchableOpacity style={styles.rightBtn} onPress={() => {changeUserNotificationsPref(false); setNotificationsPref(false);}}>
                            <MaterialCommunityIcons name="bell" style={styles.iconSecondary} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity style={styles.rightBtn} onPress={() => {changeUserNotificationsPref(true); setNotificationsPref(true);}}>
                            <MaterialCommunityIcons name="bell-off" style={styles.iconSecondary} />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    } else if(page === "Favourites") {
        return(
            <View style={styles.topBarContainer}>
                <Image source={require("../res/img/logohorizontal_2.webp")} resizeMode="contain" style={styles.logo}/>
                <View style={styles.headingContainerWOBtns}>
                    <Text style={styles.headingText}>{t('favouritesHeading')}</Text>
                </View>
            </View>
        )
    } else if(page === "Profile") {
        return(
            <View style={styles.topBarContainer}>
                <Image source={require("../res/img/logohorizontal_2.webp")} resizeMode="contain" style={styles.logo}/>
                <View style={styles.headingContainer}>
                    <TouchableOpacity onPress={() => {navigation.navigate('Home')}}>
                        <MaterialIcons name="arrow-back" style={styles.iconSecondary}/>
                    </TouchableOpacity>
                    <Text style={styles.headingText}>{t('profileHeading')}</Text>
                    <TouchableOpacity onPress={() => {signOut(FIREBASE_AUTH)}}>
                        <MaterialIcons name="logout" style={styles.iconPrimary}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    } else if(page === "Settings") {
        return(
            <View style={styles.topBarContainer}>
                <Image source={require("../res/img/logohorizontal_2.webp")} resizeMode="contain" style={styles.logo}/>
                <View style={styles.headingContainerWOBtns}>
                    <TouchableOpacity onPress={() => {navigation.navigate('Home')}} style={styles.leftBtn}>
                        <MaterialIcons name="arrow-back" style={styles.iconSecondary}/>
                    </TouchableOpacity>
                    <Text style={styles.headingText}>{t('settingsHeading')}</Text>
                </View>
            </View>
        )
    } else if(page.split('/')[0] === "Street") {
        const [isFav, setIsFav] = useState(false);
        const {setUpdateFavs} = useContext(StreetsInfosContext);

        async function retrieveIsFav() {
            setIsFav(await checkIfFavourite(page.split('/')[1]));
        }

        useEffect(() => {
            retrieveIsFav();
        }, []);

        return(
            <View style={styles.topBarContainer}>
                <Image source={require("../res/img/logohorizontal_2.webp")} resizeMode="contain" style={styles.logo}/>
                <View style={styles.headingContainer}>
                    <TouchableOpacity onPress={() => {navigation.navigate('Favourites')}}>
                        <MaterialIcons name="arrow-back" style={styles.iconSecondary}/>
                    </TouchableOpacity>
                    <Text style={styles.headingText}>{page.split('/')[1]}</Text>
                    {isFav ?
                        <TouchableOpacity onPress={async () => {
                            setIsFav(false);
                            await removeFromFavourite(page.split('/')[1]);
                            setUpdateFavs(currentUpdate => currentUpdate + 1);
                        }}>
                            <MaterialCommunityIcons name="heart" style={styles.iconPrimary} />
                        </TouchableOpacity>
                        :
                        <TouchableOpacity onPress={async () => {
                            setIsFav(true);
                            await addToFavourite(page.split('/')[1]);
                            setUpdateFavs(currentUpdate => currentUpdate + 1);
                        }}>
                            <MaterialCommunityIcons name="heart-broken" style={styles.iconPrimary} />
                        </TouchableOpacity>
                    }

                </View>
            </View>
        )
    }
}

export default TopBar;
