import {createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile} from "firebase/auth";
import {getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {FIREBASE_AUTH, FIREBASE_DB} from "../config/FirebaseConfig";
import uuid from "react-native-uuid";
import {createDefaultUserFields} from "./UserService";
import i18n from "../services/i18n";

export async function signUp(auth, credentials, setCredentials, image, navigation) {
    console.log(credentials);
    if(credentials.password !== credentials.confirmPass) {
        setCredentials({
            ...credentials,
            error: i18n.t("passwordDoNotMatch")
        })
        return;
    }
    if(credentials.email === '' || credentials.password === '' || credentials.confirmPass === '' || credentials.displayName === '') {
        setCredentials({
            ...credentials,
            error: i18n.t("allFields")
        })
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
        await updateProfile(FIREBASE_AUTH.currentUser, {
            displayName: credentials.displayName,
            photoURL: await uploadImageAsync(image)
        });
        await createDefaultUserFields(FIREBASE_AUTH.currentUser.uid);
    } catch (error) {
        console.log(error.code);
        switch (error.code) {
            case 'auth/email-already-in-use':
                setCredentials({
                    ...credentials,
                    error: i18n.t("alreadyInUseEmail"),
                });
                break;
            case 'auth/invalid-email':
                setCredentials({
                    ...credentials,
                    error: i18n.t("invalidEmailAddress"),
                });
                break;
            case 'auth/weak-password':
                setCredentials({
                    ...credentials,
                    error: i18n.t("weakPassword"),
                });
                break;

            default:
                setCredentials({
                    ...credentials,
                    error: i18n.t("genericError"),
                });
                break;
        }
    }
}

export async function signIn(auth, credentials, setCredentials, navigation) {
    if (credentials.email === "" || credentials.password === "") {
        setCredentials({
            ...credentials,
            error: i18n.t("allFields"),
        });
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    } catch (error) {
        console.log(error.code);
        switch (error.code) {
            case "auth/invalid-email":
                setCredentials({
                    ...credentials,
                    error: i18n.t("invalidEmailAddress"),
                });
                break;
            case "auth/user-disabled":
                setCredentials({
                    ...credentials,
                    error: i18n.t("userAccountDisabled"),
                });
                break;
            case "auth/user-not-found":
                setCredentials({
                    ...credentials,
                    error: i18n.t("userNotFound"),
                });
                break;
            case "auth/wrong-password":
                setCredentials({
                    ...credentials,
                    error: i18n.t("incorrectPassword"),
                });
                break;
            case "auth/invalid-login-credentials":
                setCredentials({
                    ...credentials,
                    error: i18n.t("invalidCredentials"),
                });
                break;

            default:
                setCredentials({
                    ...credentials,
                    error: i18n.t("genericError"),
                });
                break;
        }
    }
}

async function uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send(null);
    });

    const fileRef = ref(FIREBASE_DB, 'propics/' + uuid.v4());

    const result = await uploadBytes(fileRef, blob);

    // We're done with the blob, close and release it
    blob.close();

    return await getDownloadURL(fileRef);
}
