import {Modal, Pressable, View, StyleSheet, Text} from "react-native";
import {FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {Colors} from "../res/Colors";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import {useContext, useEffect, useState} from "react";
import {addToFavourite, checkIfFavourite, removeFromFavourite} from "../services/UserService";
import {getStatusComponent} from "../services/StreetService";
import {StreetsInfosContext} from "./StreetsInfosProvider";
import {useTranslation} from "react-i18next";

function StreetModal({isVisible, streetName, streetInfos, onClose}) {
    const [isFavourite, setIsFavourite] = useState(false);
    const {setUpdateFavs} = useContext(StreetsInfosContext);
    const {t, i18n} = useTranslation();
    async function retrieveIsFavourite() {
        setIsFavourite(await checkIfFavourite(streetName));
    }

    useEffect(() => {
        retrieveIsFavourite();
    }, []);

    const styles = StyleSheet.create({
        modalContent: {
            height: '50%',
            width: '100%',
            backgroundColor: Colors.surface500,
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
            position: 'absolute',
            bottom: 0,
            display: 'flex',
            alignItems: 'center'
        },
        titleContainer: {
            height: '16%',
            width: '100%',
            backgroundColor: 'transparent',
            paddingHorizontal: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
        },
        title: {
            color: 'white',
            fontSize: 30,
            fontWeight: 'bold',
            marginTop: 10
        },
        bodyLabel: {
          color: Colors.grey,
            fontWeight: "bold",
            fontSize: 22
        },
        bodySubLabel: {
            color: Colors.grey,
            fontWeight: "bold",
            fontSize: 18
        },
        bodyText: {
            color: 'white',
            fontStyle: 'italic',
            fontSize: 18
        },
        body: {
            width: '100%',
            paddingHorizontal: 25,
            paddingTop: 10
        },
        statusContainer: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 5
        },
        buttonContainer: {
            display: "flex",
            alignItems: "center",
            width: "100%",
            marginTop: 30
        },
        row: {
          display: "flex",
            flexDirection: "row",
            gap: 10
        }

    })
    return(
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View style={styles.modalContent}>
                <View style={styles.titleContainer}>
                    <Pressable onPress={onClose}>
                        <MaterialIcons name="close" color="#fff" size={22} />
                    </Pressable>
                </View>
                <FontAwesome5 name="map-marked-alt" size={62} color={Colors.primary} />
                <Text style={styles.title}>{streetName}</Text>
                <View style={styles.body}>
                    <View style={styles.row}>
                        <Text style={styles.bodyLabel}>{i18n.t('statusLabel')}</Text>
                        {getStatusComponent(streetInfos.status)}
                    </View>
                    <Text style={[styles.bodyLabel, {marginTop: 10}]}>{i18n.t('coordsLabel')}</Text>
                    <View style={styles.row}>
                        <Text style={styles.bodySubLabel}>{i18n.t('startLabel')}</Text>
                        <Text style={styles.bodyText}>{streetInfos.latStart + "° " + streetInfos.lngStart + "°"}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.bodySubLabel}>{i18n.t('endLabel')}</Text>
                        <Text style={styles.bodyText}>{streetInfos.latEnd + "° " + streetInfos.lngEnd + "°"}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        {
                            isFavourite ?
                            <SecondaryButton widthPerc={"70%"} title={[<MaterialCommunityIcons name="heart-minus" size={24} color={Colors.grey} />, 'Rimuovi dai preferiti']} onPress={() => {removeFromFavourite(streetName).then(() => {retrieveIsFavourite(); setUpdateFavs(currentUpdate => currentUpdate+1);})}}/>
                            :
                            <PrimaryButton widthPerc={"70%"} title={[<MaterialCommunityIcons name="heart-plus" size={24} color={"white"} />, 'Aggiungi ai preferiti']} onPress={() => {addToFavourite(streetName).then(() => {retrieveIsFavourite(); setUpdateFavs(currentUpdate => currentUpdate+1);})}}/>
                        }
                    </View>

                </View>
            </View>
        </Modal>
    )
}

export default StreetModal;
