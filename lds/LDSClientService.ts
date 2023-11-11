import {SpatialMQTTClient} from "./la-mqtt/client/smqttclient";
import {v4 as uuidv4} from 'uuid';

export async function clientConnection(lamqttClient) {
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
