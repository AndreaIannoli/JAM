import {SpatialMQTTClient} from "./la-mqtt/client/smqttclient";
import {v4 as uuidv4} from 'uuid';



export const clientId = 'LDS-CLIENT-' + uuidv4();
export const lamqttClient = new SpatialMQTTClient('', '', 'ws://127.0.0.1:9001/', 9001, clientId);

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
