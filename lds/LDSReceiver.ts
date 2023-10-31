import {MQTTMessage, MQTTReceiver} from "./la-mqtt/common/ireceiver";
export class LDSReceiver implements MQTTReceiver {
    public messageRecv(message: MQTTMessage) {
        console.log(message.getContent());
    }
}
