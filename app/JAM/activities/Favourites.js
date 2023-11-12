import {FlatList, StyleSheet, Text, View, ListRenderItem, RefreshControl, TouchableOpacity} from "react-native";
import TopBar from "./TopBar";
import {Colors} from "../res/Colors";
import {useContext, useEffect, useState} from "react";
import {getUserFavourites} from "../services/UserService";
import {StreetsInfosContext} from "../components/StreetsInfosProvider";
import {getStatusComponent} from "../services/StreetService";
import {useTranslation} from "react-i18next";

function Favourites({navigation}){
    const [favs, setFavs] = useState([]);
    const { streetsInfos, updateFavs } = useContext(StreetsInfosContext);
    const { t } = useTranslation();
    function getDotColor(status) {
        if(status === 'free') {
            return Colors.green;
        } else if(status === 'almost full') {
            return Colors.orange;
        } else if(status === 'full') {
            return Colors.red;
        } else {
            return Colors.grey;
        }
    }

    const Item = ({title, status}) => (
        <TouchableOpacity onPress={() => {streetsInfos.get(title) ? navigation.navigate('Street', {streetName: title}) : null}}>
            <View style={styles.streetRow}>
                <View style={[styles.statusDot, {backgroundColor: getDotColor(status)}]}/>
                <Text style={styles.streetRowLabel}>{title}</Text>
                <Text style={styles.streetRowStatus}>{status ? getStatusComponent(status) : null}</Text>
            </View>
        </TouchableOpacity>
    );

    const StreetsItemSeparator = () => (
        <View style={styles.streetsItemSeparator} />
    );

    async function retrieveFavs() {
        setFavs(await getUserFavourites());
    }

    useEffect(() => {
        retrieveFavs();
    }, [updateFavs]);

    const styles = StyleSheet.create({
        container: {
            height: "100%",
            alignItems: "center",
            backgroundColor: Colors.surface200,
        },
        statusDot: {
            backgroundColor: Colors.grey,
            borderRadius: 50,
            width: 10,
            height: 10
        },
        streetsContainer: {
            alignItems: "center",
            paddingHorizontal: 20,
            marginTop: 20
        },
        streetRow: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: '100%',
            paddingVertical: 10,
            gap: 10
        },
        streetRowLabel: {
            color: 'white',
            fontWeight: "bold",
            fontSize: 18
        },
        streetsItemSeparator: {
            width: '100%',
            backgroundColor: 'white',
            height: 1
        },
        streetRowStatus: {
            marginLeft: "auto"
        },
        emptyText: {
            fontStyle: "italic",
            textAlign: "center",
            color: "white"
        }
    });
    return(
        <View style={styles.container}>
            <TopBar page="Favourites"/>
            <View style={styles.streetsContainer}>
                <FlatList
                    data={favs}
                    renderItem={({item}) => <Item title={item} status={streetsInfos.get(item) ? streetsInfos.get(item).status : null}/>}
                    ItemSeparatorComponent={StreetsItemSeparator}
                    KeyExtractor={({item}) => item.title}
                    ListEmptyComponent={() => {return(<Text style={styles.emptyText}>{t('emptyFavourites')}</Text>)}}
                />
            </View>
        </View>
    )
}

export default Favourites;
