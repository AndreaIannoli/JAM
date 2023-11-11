import {SpatialMQTTClient} from "../la-mqtt/client/smqttclient";
import {randomUUID} from "expo-crypto";

const clientId = 'APP-CLIENT-' + randomUUID();
export const lamqttClient = new SpatialMQTTClient('', '', 'ws://192.168.1.9:9001/', 9001, clientId);
//ws://192.168.1.9:9001/
export async function clientConnection() {
    if(!lamqttClient) {
        throw new Error("LAMQTT Client not initialized");
    }
    console.log("CHECK CONNECTION...");
    if(!lamqttClient.getMConnector().isConnected()) {
        console.log("CONNECTING...");
        return await lamqttClient.connect();
    } else {
        console.log("ALREADY CONNECTED");
    }
}
