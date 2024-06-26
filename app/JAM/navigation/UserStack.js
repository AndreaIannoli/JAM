import React, {useContext, useEffect, useRef, useState} from "react";
import { NavigationContainer } from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Feed from "../activities/Feed";
import {Colors} from "../res/Colors";
import {Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {View, StyleSheet} from "react-native";
import HomeStack from "./HomeStack";
import * as Location from "expo-location";
import {clientConnection, lamqttClient} from "../services/ClientService";
import {MQTTBaseReceiver} from "../la-mqtt/common/baseReceiver";
import {StreetsInfosContext} from "../components/StreetsInfosProvider";
import FavsStack from "./FavsStack";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import {getUserLanguagePref, registerForPushNotificationsAsync} from "../services/UserService";
import i18n from "../services/i18n";
import * as Device from "expo-device";

const Tab = createBottomTabNavigator();

export default function UserStack() {
    const { streetsInfos, setStreetsInfos, location, setLocation, setErrorMsg, setUpdate, setUpdateNotifications } = useContext(StreetsInfosContext);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
    const projectId = Constants.expoConfig.extra.eas.projectId;
    async function getToken() {
        if (Device.isDevice) {
            const token = await Notifications.getExpoPushTokenAsync({
                projectId
            });

            return token.data;
        } else {
            return '';
        }
    }

    async function checkLangCorrespondence() {
        const languagePref = await getUserLanguagePref();
        if((languagePref !== undefined || languagePref !== null) && languagePref !== i18n.language) {
            await i18n.changeLanguage(languagePref);
        }
    }

    async function retrieveAndSendLocation() {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        lamqttClient.publicPosition(location.coords.latitude, location.coords.longitude);
    }

    useEffect(() => {
        checkLangCorrespondence();
    }, []);

    useEffect(() => {
        registerForPushNotificationsAsync({
            projectId
        }).then(token => {setExpoPushToken(token); console.log("EXPO PUSH TOKEN", token);});

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            console.log(location);

            console.log('CONNECTION STATUS:', await clientConnection());
            await lamqttClient.publish('presence', 'What a nice day for a mqtt client!');
            const expoPToken = await getToken();
            let subscriptionStatus = await lamqttClient.subscribeGeofence("parking", new MQTTBaseReceiver(streetsInfos, setStreetsInfos, setUpdate, expoPToken, setUpdateNotifications));
            console.log('SUBSCRIPTION STATUS:', subscriptionStatus);
            await lamqttClient.publicPosition(location.coords.latitude, location.coords.longitude);
            setInterval(() => {
                retrieveAndSendLocation();
            }, 20000);
        })();
    }, []);

    const styles = StyleSheet.create({
        iconContainer: {
            backgroundColor: Colors.surface200,
            borderRadius: 50,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center"
        },
        icon: {
            fontSize: 40
        }
    })
    return (
        <NavigationContainer independent={true}>
            <Tab.Navigator initialRouteName='Home' screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {

                    if (route.name === 'Home') {
                        return <View style={styles.iconContainer}><MaterialIcons name='explore' size={size} color={color} style={styles.icon}/></View>;
                    } else if (route.name === 'Feed') {
                        return <View style={styles.iconContainer}><MaterialIcons name='rss-feed' size={size} color={color} style={styles.icon}/></View>;
                    } else if (route.name === 'Favourites') {
                        return <View style={styles.iconContainer}><MaterialCommunityIcons name='cards-heart' size={size} color={color} style={styles.icon}/></View>;
                    }
                },
                tabBarActiveTintColor: Colors.primary,
                tabBarInactiveTintColor: "white",
                tabBarStyle: {
                    paddingTop: 20,
                    backgroundColor: Colors.surface500,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    height: 90,
                    position: 'absolute'
                },
                headerShown: false,
                tabBarShowLabel: false
            })}>
                <Tab.Screen name="Feed" component={Feed} />
                <Tab.Screen name="Home" component={HomeStack} />
                <Tab.Screen name="Favourites" component={FavsStack} />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
