import {FIREBASE_AUTH, FIREBASE_FIRESTORE} from "../config/FirebaseConfig";
import {getDoc, doc, updateDoc, deleteField, setDoc} from "firebase/firestore";
import * as Notifications from "expo-notifications";
import {Platform} from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import {randomUUID} from "expo-crypto";

export async function createDefaultUserFields(userUUID) {
    const usersRef = doc(FIREBASE_FIRESTORE, "users", userUUID);
    try {
        await setDoc(usersRef, {
            language: "",
            favourites: [],
            notifications: {},
            notificationsAlert: true
        });
        console.log('Default user document added successfully.');
    } catch (error) {
        console.error('Error adding default user document:', error);
    }
}

export async function changeUserLanguagePref(value) {
    const userRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
    await updateDoc(userRef, {language: value});
}

export async function getUserLanguagePref() {
    const currentUser= FIREBASE_AUTH.currentUser;
    if (currentUser) {
        try {
            const userRef = doc(FIREBASE_FIRESTORE, "users", currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData.language;
            } else {
                console.log("User document not found");
            }
        } catch (error) {
            console.error("Error getting user document:", error);
        }
    } else {
        console.log("No user is currently signed in.");
    }
}

export async function getUserNotificationsPref() {
    const currentUser= FIREBASE_AUTH.currentUser;
    if (currentUser) {
        try {
            const userRef = doc(FIREBASE_FIRESTORE, "users", currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData.notificationsAlert;
            } else {
                console.log("User document not found");
            }
        } catch (error) {
            console.error("Error getting user document:", error);
        }
    } else {
        console.log("No user is currently signed in.");
    }
}

export async function changeUserNotificationsPref(value) {
    let userNotificationsPref = await getUserNotificationsPref();
    userNotificationsPref = value;
    const userRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
    await updateDoc(userRef, {notificationsAlert: userNotificationsPref});
}

export async function getUserNotifications() {
    const currentUser= FIREBASE_AUTH.currentUser;
    if (currentUser) {
        try {
            const userRef = doc(FIREBASE_FIRESTORE, "users", currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log('USER NOTIFICATIONS', userData.notifications);
                return userData.notifications;
            } else {
                console.log("User document not found");
            }
        } catch (error) {
            console.error("Error getting user document:", error);
        }
    } else {
        console.log("No user is currently signed in.");
    }
}

export async function addNotification(title, description, notificationType, date) {
    const notificationId = randomUUID();
    const newNotificationData = {
        title: title,
        description: description,
        notificationType: notificationType,
        date: date
    };

    const userRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
    try {
        await updateDoc(userRef, {
            [`notifications.${notificationId}`]: newNotificationData,
        });
        console.log('Notification added successfully.');
    } catch (error) {
        console.error('Error adding notification:', error);
    }
}

export async function removeNotification(notificationId) {
    const userRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
    try {
        await updateDoc(userRef, {
            [`notifications.${notificationId}`]: deleteField(),
        });
        console.log('Notification deleted successfully.');
    } catch (error) {
        console.error('Error deleting notification:', error);
    }
}

export async function getUserFavourites(){
    const currentUser= FIREBASE_AUTH.currentUser;
    if (currentUser) {
        try {
            const userRef = doc(FIREBASE_FIRESTORE, "users", currentUser.uid);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                return userData.favourites;
            } else {
                console.log("User document not found");
            }
        } catch (error) {
            console.error("Error getting user document:", error);
        }
    } else {
        console.log("No user is currently signed in.");
    }
}

export async function checkIfFavourite(streetName) {
    const userFavourite = await getUserFavourites();
    if(userFavourite.includes(streetName)) {
        return true;
    } else {
        return false;
    }
}

export async function addToFavourite(streetName) {
    const userFavourite = await getUserFavourites();
    if(!userFavourite.includes(streetName)) {
        userFavourite.push(streetName);
        const userRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
        await updateDoc(userRef, {favourites: userFavourite});
    } else {
        console.log("Already favourite");
    }
}

export async function removeFromFavourite(streetName) {
    let userFavourite = await getUserFavourites();
    if(userFavourite.includes(streetName)) {
        userFavourite = userFavourite.filter(e => e !== streetName);
        const userRef = doc(FIREBASE_FIRESTORE, "users", FIREBASE_AUTH.currentUser.uid);
        await updateDoc(userRef, {favourites: userFavourite});
    } else {
        console.log("Not in favourite");
    }
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function sendPushNotification(expoPushToken, title, body) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = await Notifications.getExpoPushTokenAsync({
            projectId: Constants.expoConfig.extra.eas.projectId,
        });
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
        return '';
    }

    return token.data;
}
