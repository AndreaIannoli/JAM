import {Text, View, StyleSheet} from "react-native";
import {Colors} from "../res/Colors";
import TopBar from "./TopBar";
import MapView from "react-native-maps";
import {useContext} from "react";
import {StreetsInfosContext} from "../components/StreetsInfosProvider";
import MapViewDirections from "react-native-maps-directions";
import {getStatusComponent} from "../services/StreetService";

function Street({route, navigation}) {
    const {streetName} = route.params;
    const {streetsInfos} = useContext(StreetsInfosContext);
    const GOOGLE_MAPS_APIKEY = 'AIzaSyCMVvS9_LtrL_sfNoXu27hfhWBaWtYrUss';

    const origin = {latitude: streetsInfos.get(streetName).latStart, longitude: streetsInfos.get(streetName).lngStart};
    const destination = {latitude: streetsInfos.get(streetName).latEnd, longitude: streetsInfos.get(streetName).lngEnd};
    let color;
    if(streetsInfos.get(streetName).status === "free") {
        color = Colors.green;
    } else if(streetsInfos.get(streetName).status === "almost full") {
        color = Colors.orange;
    } else {
        color = Colors.red;
    }

    const styles = StyleSheet.create({
        container: {
            height: "100%",
            alignItems: "center",
            backgroundColor: Colors.surface200,
        },
        streetInfosContainer: {
            width: '100%',
            marginTop: 10,
            paddingHorizontal: 20
        },
        map: {
            width: "100%",
            height: 200,
            borderRadius: 15
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
        row: {
            display: "flex",
            flexDirection: "row",
            gap: 10
        }
    })
    return(
        <View style={styles.container}>
            <TopBar page={"Street/" + streetName} navigation={navigation} />
            <View style={styles.streetInfosContainer}>
                <MapView style={styles.map} initialRegion={{
                    latitude: streetsInfos.get(streetName).latStart,
                    longitude: streetsInfos.get(streetName).lngStart,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008
                }}>
                    <MapViewDirections
                        key={streetName}
                        origin={origin}
                        destination={destination}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={6}
                        strokeColor={color}
                        precision="high"
                    />
                </MapView>
                <View style={[styles.row, {marginTop: 20}]}>
                    <Text style={styles.bodyLabel}>Status:</Text>
                    {getStatusComponent(streetsInfos.get(streetName).status)}
                </View>
                <Text style={[styles.bodyLabel, {marginTop: 10}]}>Coordinate</Text>
                <View style={styles.row}>
                    <Text style={styles.bodySubLabel}>Inizio:</Text>
                    <Text style={styles.bodyText}>{streetsInfos.get(streetName).latStart + "° " + streetsInfos.get(streetName).lngStart + "°"}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.bodySubLabel}>Fine:</Text>
                    <Text style={styles.bodyText}>{streetsInfos.get(streetName).latEnd + "° " + streetsInfos.get(streetName).lngEnd + "°"}</Text>
                </View>
            </View>
        </View>
    )
}

export default Street;
