import {StyleSheet, Text, View} from "react-native";
import TopBar from "./TopBar";
import {Colors} from "../res/Colors";
import {Picker} from "@react-native-picker/picker";
import {useState} from "react";
import i18n from "../services/i18n"
import {useTranslation} from "react-i18next";
import {changeUserLanguagePref} from "../services/UserService";
import Constants from "expo-constants";

function Settings({navigation}){
    const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
    const { t } = useTranslation();

    const styles = StyleSheet.create({
        container: {
            height: "100%",
            alignItems: "center",
            backgroundColor: Colors.surface200
        },
        settingsContainer: {
            paddingHorizontal: 20,
            width: "100%"
        },
        settingRow: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            backgroundColor: Colors.surface500,
            padding: 15,
            marginVertical: 10,
            borderRadius: 10
        },
        settingLabel: {
            color: "white",
            fontWeight: "bold",
            fontSize: 16
        },
        picker: {
            width: 100
        },
        pickerItem: {
            height: 50
        },
        versionText: {
            color: Colors.surface500,
            fontStyle: "italic"
        }
    })
    return(
        <View style={styles.container}>
            <TopBar page="Settings" navigation={navigation}/>
            <View style={styles.settingsContainer}>
                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>{t('languageLabel')}</Text>
                    <Picker style={styles.picker} itemStyle={styles.pickerItem}
                        selectedValue={selectedLanguage}
                        onValueChange={(itemValue, itemIndex) =>
                        {setSelectedLanguage(itemValue); i18n.changeLanguage(itemValue); changeUserLanguagePref(itemValue);}
                        }>
                        <Picker.Item label="🇬🇧" value="en" />
                        <Picker.Item label="🇮🇹" value="it" />
                    </Picker>
                </View>
            </View>
            <Text style={styles.versionText}>{"JAM version: " + Constants.expoConfig.version}</Text>
        </View>
    )
}

export default Settings;
