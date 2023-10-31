import {SpatialMQTTBackEnd} from "./la-mqtt/backend/backend";
export const lamqttBackEnd = new SpatialMQTTBackEnd('', '', 'ws://127.0.0.1:9001/', 9001);

export async function clientConnection() {
    await lamqttBackEnd.start();
}

