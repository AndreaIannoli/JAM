// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import {getStorage} from "firebase/storage";
import {getFirestore} from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCMVvS9_LtrL_sfNoXu27hfhWBaWtYrUss",
    authDomain: "justanalyzemobility-400723.firebaseapp.com",
    projectId: "justanalyzemobility-400723",
    storageBucket: "justanalyzemobility-400723.appspot.com",
    messagingSenderId: "900290759066",
    appId: "1:900290759066:web:0702dc62bde4588aca1223",
    measurementId: "G-VPYESH40K0"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
export const FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

export const FIREBASE_DB = getStorage(FIREBASE_APP);

export const FIREBASE_FIRESTORE = getFirestore(FIREBASE_APP);
