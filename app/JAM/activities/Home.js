import {Text, View, StyleSheet, Platform} from "react-native";
import TopBar from "./TopBar";
import MapView from "react-native-maps";
import {StatusBar} from "expo-status-bar";
import {useContext, useEffect, useRef, useState} from "react";
import MapViewDirections from "react-native-maps-directions";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import StreetModal from "../components/StreetModal";
import {StreetsInfosContext} from "../components/StreetsInfosProvider";
import {Colors} from "../res/Colors";
function Home({navigation}) {
    const [polyLines, setPolyLines] = useState(new Map());
    const GOOGLE_MAPS_APIKEY = 'AIzaSyCMVvS9_LtrL_sfNoXu27hfhWBaWtYrUss';
    const [showStreetModal, setShowStreetModal] = useState(false);
    const [selectedStreetInfo, setSelectedStreetInfo] = useState();
    const [selectedStreetName, setSelectedStreetName] = useState('');
    const { streetsInfos, setStreetsInfos, location, update, errorMsg } = useContext(StreetsInfosContext);

    useEffect(() => {
        const polyLinesToPlot = new Map();
        for(let streetName of streetsInfos.keys()) {
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
            polyLinesToPlot.set(streetName, <MapViewDirections
                key={streetName}
                origin={origin}
                destination={destination}
                apikey={GOOGLE_MAPS_APIKEY}
                strokeWidth={6}
                strokeColor={color}
                precision="high"
                tappable={true}
                onPress={() => {setShowStreetModal(true); setSelectedStreetName(streetName); setSelectedStreetInfo(streetsInfos.get(streetName))}}
            />);
        }
        setPolyLines(new Map([...polyLines, ...polyLinesToPlot]));
        console.log(polyLines);
    }, [update]);

    const styles = StyleSheet.create({
        container: {
            height: "100%",
            alignItems: "center"
        },
        map: {
            width: "100%",
            height: "100%",
            marginTop: -30,
            zIndex: 1
        },
        errorBar: {
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            backgroundColor: "red",
            height: 150,
            marginTop: -40,
            paddingTop: 0
        },
        errorText: {
            fontSize: 16,
            color: "white"
        }
    })
    return(
        <View style={styles.container}>
            <TopBar page="Home" navigation={navigation}/>
            {errorMsg ?
                <View style={styles.errorBar}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
                :
                null
            }
            {location ?
                <MapView style={styles.map} initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }} showsUserLocation={true} followsUserLocation={true} showsCompass={false}>{Array.from(polyLines.values())}</MapView>
                :
                <MapView style={styles.map} initialRegion={{
                    latitude: 44.499789104418404,
                    longitude: 11.350433839312743,
                    latitudeDelta: 0.004,
                    longitudeDelta: 0.004,
                }} showsUserLocation={true} followsUserLocation={true} showsCompass={false}>{Array.from(polyLines.values())}</MapView>
            }
            {showStreetModal ? <StreetModal isVisible={showStreetModal} streetName={selectedStreetName} streetInfos={selectedStreetInfo} onClose={() => {setShowStreetModal(false)}}/> : null}
            <StatusBar style="auto"/>
        </View>
    )
}

export default Home;
