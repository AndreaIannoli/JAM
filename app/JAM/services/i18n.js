import en from "../res/lang/en.json";
import it from "../res/lang/it.json";
import * as Localization from "expo-localization";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

export const languageResources = {
    en: {translation: en},
    it: {translation: it}
}

i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: Localization.locale,
    fallbackLng: 'en',
    resources: languageResources
})

export default i18n;
