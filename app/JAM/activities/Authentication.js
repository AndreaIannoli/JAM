import {
    ImageBackground,
    View,
    StyleSheet,
    Text,
    Image,
    TextInput,
    useWindowDimensions,
    Pressable
} from "react-native";
import loginBackground from "../res/img/bg_login.webp";
import {StatusBar} from "expo-status-bar";
import {Colors} from "../res/Colors";
import horizontalLogo1 from "../res/img/logohorizontal_1.webp"
import React, {useState} from "react";
import PrimaryButton from "../components/PrimaryButton";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {Ionicons} from "@expo/vector-icons";
import {signIn, signUp} from "../services/AuthService";
import {FIREBASE_AUTH, FIREBASE_DB} from "../config/FirebaseConfig";
import ImagePickerBox from "../components/ImagePickerBox";
import {useTranslation} from "react-i18next";

function Authentication({navigation}){
    const windowHeight = useWindowDimensions().height;
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [image, setImage] = useState(null);
    const [registrationCredentials, setRegistrationCredentials] = React.useState({
        email: '',
        displayName: '',
        password: '',
        confirmPass: '',
        error: ''
    });
    const [loginCredentials, setLoginCredentials] = React.useState({
        email: '',
        password: '',
        error: ''
    });
    const auth = FIREBASE_AUTH;
    const { t } = useTranslation();
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const styles = StyleSheet.create({
        loginBackground:{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "100%"
        },
        loginBackgroundTransparency:{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: 'rgba(53, 53, 53, 0.5)'
        },
        container:{
            width: "85%",
            justifyContent: "flex-end"
        },
        authContainer:{
            alignItems: "center",
            backgroundColor: Colors.surface500,
            borderRadius: 30,
            paddingStart: 30,
            paddingEnd: 30,
            paddingBottom: 30
        },
        logo:{
            width: "80%",
            height: 100,
            marginTop: 25
        },
        switchContainer: {
            marginTop: 100
        },
        textInput:{
            backgroundColor: Colors.surface200,
            borderRadius: 10,
            height: 40,
            width: "100%",
            color: "white",
            paddingHorizontal: 15
        },
        passContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.surface200,
            borderRadius: 10,
            height: 40,
            marginTop: 20,
            width: "100%",
            paddingHorizontal: 28,
            marginBottom: 60
        },
        forgotPassText: {
            color: "white",
            fontWeight: "bold"
        },
        form: {
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
        },
        error: {
            fontWeight: "bold",
            fontSize: 12,
            color: "red"
        }
    })
    return(
        <View style={[{ minHeight: Math.round(windowHeight) }, { height: "100%" }]}>
            <ImageBackground source={loginBackground} style={styles.loginBackground} resizeMode="cover">
                <View style={styles.loginBackgroundTransparency} resizeMode="cover">
                    <View style={styles.container}>
                        <View style={styles.authContainer}>
                            <Image source={horizontalLogo1} style={styles.logo} resizeMode="contain"/>
                        {selectedIndex === 0 ?
                            <View style={styles.form}>
                                <TextInput
                                    editable
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder={t('emailPlaceHolder')}
                                    cursorColor={Colors.primary}
                                    placeholderTextColor={Colors.grey}
                                    style={[styles.textInput, {marginTop: 20}]}
                                    onChangeText={(text) => setLoginCredentials({ ...loginCredentials, email: text })}
                                />
                                <View style={styles.passContainer}>
                                    <TextInput
                                        editable
                                        secureTextEntry={!showPassword}
                                        onChangeText={(text) => {setPassword(text); setLoginCredentials({ ...loginCredentials, password: text })}}
                                        value={password}
                                        inputMode="text"
                                        autoComplete="password"
                                        placeholder={t('passwordPlaceHolder')}
                                        cursorColor={Colors.primary}
                                        placeholderTextColor={Colors.grey}
                                        style={[styles.textInput, {paddingHorizontal: 0}]}

                                    />
                                    <Ionicons
                                        name={showPassword ? 'eye-off' : 'eye'}
                                        size={24}
                                        color={Colors.primary}
                                        style={styles.icon}
                                        onPress={toggleShowPassword}
                                    />
                                </View>
                                <PrimaryButton title="Login" onPress={() => {signIn(auth, loginCredentials, setLoginCredentials, navigation)}}/>
                                {loginCredentials.error ? <Text style={styles.error}>{loginCredentials.error}</Text> : null}
                                <Pressable hitSlop={3} style={{marginTop: 10}}>
                                    <Text style={styles.forgotPassText}>{t('passwordForgotLink')}</Text>
                                </Pressable>
                            </View>
                            :
                            <View style={styles.form}>
                                <ImagePickerBox image={image} setImage={setImage}/>
                                <TextInput
                                    editable
                                    inputMode="email"
                                    autoComplete="email"
                                    placeholder={t('emailPlaceHolder')}
                                    cursorColor={Colors.primary}
                                    placeholderTextColor={Colors.grey}
                                    style={[styles.textInput,  {marginTop: 20}]}
                                    onChangeText={(text) => setRegistrationCredentials({ ...registrationCredentials, email: text })}
                                />
                                <TextInput
                                    editable
                                    inputMode="text"
                                    autoComplete="username"
                                    placeholder={t('namePlaceHolder')}
                                    cursorColor={Colors.primary}
                                    placeholderTextColor={Colors.grey}
                                    style={[styles.textInput,  {marginTop: 20}]}
                                    onChangeText={(text) => setRegistrationCredentials({ ...registrationCredentials, displayName: text })}
                                />
                                <TextInput
                                    editable
                                    secureTextEntry={true}
                                    inputMode="text"
                                    autoComplete="password"
                                    placeholder={t('passwordPlaceHolder')}
                                    cursorColor={Colors.primary}
                                    placeholderTextColor={Colors.grey}
                                    style={[styles.textInput, {marginTop: 20}]}
                                    onChangeText={(text) => setRegistrationCredentials({ ...registrationCredentials, password: text })}
                                />
                                <TextInput
                                    editable
                                    secureTextEntry={true}
                                    inputMode="text"
                                    autoComplete="password"
                                    placeholder={t('confirmPasswordPlaceHolder')}
                                    cursorColor={Colors.primary}
                                    placeholderTextColor={Colors.grey}
                                    style={[styles.textInput, {marginTop: 20}, {marginBottom: 60}]}
                                    onChangeText={(text) => setRegistrationCredentials({ ...registrationCredentials, confirmPass: text })}
                                />
                                <PrimaryButton title={t('registerBtn')} onPress={() => {
                                    signUp(auth, registrationCredentials, setRegistrationCredentials, image, navigation);
                                }}/>
                                {registrationCredentials.error ? <Text style={styles.error}>{registrationCredentials.error}</Text> : null}
                            </View>
                        }
                        </View>
                        <View style={styles.switchContainer}>
                            <SegmentedControl
                                values={[t('segmentControlLogin'), t('segmentControlRegister')]}
                                selectedIndex={selectedIndex}
                                onChange={(event) => {
                                    setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
                                }}
                                backgroundColor={Colors.surface200}
                                tintColor={Colors.surface500}
                                fontStyle={{color: Colors.grey}}
                                activeFontStyle={{color: Colors.primary}}
                                style={{height: 40, borderRadius: 50}}
                            />
                        </View>
                    </View>
                    <StatusBar style={"auto"}/>
                </View>
            </ImageBackground>
        </View>
    )
}

export default Authentication;
