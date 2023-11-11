import {Image, ImageBackground, StyleSheet, Text, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import Constants from "expo-constants";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import {Colors} from "../res/Colors";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import {useState} from "react";
import {useTranslation} from "react-i18next";

function Onboarding({ navigation }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const {t, i18n} = useTranslation();

    const styles = StyleSheet.create({
        onboardingBG: {
            height: "100%"
        },
        container: {
            width: "100%",
            height: "90%",
            alignItems: "center",
            justifyContent: "flex-start"
        },
        infoContainer: {
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start"
        },
        logo: {
            width: 50,
            height: 50,
            marginTop: Constants.statusBarHeight
        },
        onboarding1: {
            width: 250,
            height: 250,
            marginTop: 40
        },
        textContainer: {
            width: "90%",
            gap: 20
        },
        heading: {
            fontSize: 30,
            fontWeight: "bold",
            color: "white",
            textAlign: "center"
        },
        paragraph: {
            fontSize: 20,
            color: "white",
            textAlign: "center"
        },
        buttonsContainer: {
            width: "100%",
            marginTop: "auto",
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },
        buttonContainer: {
            width: "25%"
        }
    })
    return(
        <ImageBackground source={require("../res/img/onboarding_bg.webp")} resizeMode="cover" style={styles.onboardingBG}>
            <View style={styles.container}>
                {selectedIndex !== 0 ?
                    <Image source={require("../res/img/logo.webp")} resizeMode="contain" style={styles.logo}/>
                    :
                    null
                }
                {selectedIndex === 0 ?
                    <View style={styles.infoContainer}>
                        <Image source={require("../res/img/logohorizontal_1.webp")} resizeMode="contain" style={styles.onboarding1}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.heading}>{t('onboardingHeading1')}</Text>
                            <Text style={styles.paragraph}>{t('onboardingSubHeading1')}</Text>
                        </View>
                    </View>
                    :
                    null
                }
                {selectedIndex === 1 ?
                    <View style={styles.infoContainer}>
                        <Image source={require("../res/img/onboarding1.webp")} resizeMode="contain" style={styles.onboarding1}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.heading}>{t('onboardingHeading2')}</Text>
                            <Text style={styles.paragraph}>{t('onboardingSubHeading2')}</Text>
                        </View>
                    </View>
                    :
                    null
                }
                {selectedIndex === 2 ?
                    <View style={styles.infoContainer}>
                        <Image source={require("../res/img/onboarding2.webp")} resizeMode="contain" style={styles.onboarding1}/>
                        <View style={styles.textContainer}>
                            <Text style={styles.heading}>{t('onboardingHeading3')}</Text>
                            <Text style={styles.paragraph}>{t('onboardingSubHeading3')}</Text>
                        </View>
                    </View>
                    :
                    null
                }

                <View style={styles.buttonsContainer}>
                    <View style={styles.buttonContainer}>
                        {selectedIndex > 0 ?
                            <SecondaryButton title={t('backBtnOnboarding')} onPress={() => {setSelectedIndex(selectedIndex-1)}}/>
                            :
                            null
                        }
                    </View>
                    <SegmentedControl
                        values={['•', '•', '•']}
                        selectedIndex={selectedIndex}
                        onChange={(event) => {
                            setSelectedIndex(event.nativeEvent.selectedSegmentIndex)
                        }}
                        backgroundColor={Colors.surface200}
                        tintColor={Colors.surface500}
                        fontStyle={{color: Colors.grey}}
                        activeFontStyle={{color: Colors.primary}}
                        style={{height: 20, borderRadius: 50, width: "20%"}}
                    />
                    <View style={styles.buttonContainer}>
                        <PrimaryButton title={t('nextBtnOnboarding')} onPress={() => {
                            if(selectedIndex < 2) {
                                setSelectedIndex(selectedIndex + 1)
                            } else {
                                navigation.navigate('Authentication');
                            }
                        }}/>
                    </View>
                </View>
            </View>
            <StatusBar style="auto"/>
        </ImageBackground>
    )
}

export default Onboarding;
