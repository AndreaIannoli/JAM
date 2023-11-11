import {MQTTMessage, MQTTReceiver} from "./ireceiver";
import {
    addNotification, checkIfFavourite,
    getUserNotificationsPref,
    removeFromFavourite,
    sendPushNotification
} from "../../services/UserService";


export class MQTTBaseReceiver implements MQTTReceiver {
    private polyLines: Map<any, any>;
    private setPolyLines: (value: (((prevState: Map<any, any>) => Map<any, any>) | Map<any, any>)) => void;
    private setUpdate: (value: (((prevState: number) => number) | number)) => void;
    private expoPushToken: string;
    private setUpdateNotifications: (value: (((prevState: number) => number) | number)) => void;

    constructor(polyLines: Map<any, any>, setPolyLines: (value: (((prevState: Map<any, any>) => Map<any, any>) | Map<any, any>)) => void, setUpdate: (value: (((prevState: number) => number) | number)) => void, expoPushToken: string, setUpdateNotifications: (value: (((prevState: number) => number) | number)) => void) {
        this.polyLines = polyLines;
        this.setPolyLines = setPolyLines;
        this.setUpdate = setUpdate;
        this.expoPushToken = expoPushToken;
        this.setUpdateNotifications = setUpdateNotifications;
    }
    public async messageRecv(message: MQTTMessage) {
        const messageCtn = message.getContent();
        const messageCtnA = messageCtn.split("-");
        const streetName = messageCtnA[0];
        const latStart = parseFloat(messageCtnA[1]);
        const lngStart = parseFloat(messageCtnA[2]);
        const latEnd = parseFloat(messageCtnA[3]);
        const lngEnd = parseFloat(messageCtnA[4]);
        const status = messageCtnA[5];

        const streetInfos = {latStart: latStart,
                                            lngStart: lngStart,
                                            latEnd: latEnd,
                                            lngEnd: lngEnd,
                                            status: status}

        if(this.polyLines.has(streetName)) {
            if(this.polyLines.get(streetName).status !== status) {
                this.setPolyLines(this.polyLines.set(streetName, streetInfos));
                this.setUpdate(currentUpdate => currentUpdate + 1);
                const isFav = await checkIfFavourite(streetName);
                if(await getUserNotificationsPref() && isFav) {
                    await sendPushNotification(this.expoPushToken, streetName, streetName + ' è ' +
                        (status === 'free' ? 'libera' : (status === 'almost full' ? 'quasi piena' : 'piena')));
                    await addNotification(streetName, streetName + ' è ' +
                        (status === 'free' ? 'libera' : (status === 'almost full' ? 'quasi piena' : 'piena')), NotificationType[status.replace(/ /g,'').toUpperCase()], new Date());
                    this.setUpdateNotifications(currentUpdate => currentUpdate+1);
                } else if(isFav) {
                    await addNotification(streetName, streetName + ' è ' +
                        (status === 'free' ? 'libera' : (status === 'almost full' ? 'quasi piena' : 'piena')), NotificationType[status.replace(/ /g,'').toUpperCase()], new Date());
                    this.setUpdateNotifications(currentUpdate => currentUpdate+1);
                }
            }
        } else {
            this.setPolyLines(this.polyLines.set(streetName, streetInfos));
            this.setUpdate(currentUpdate => currentUpdate + 1);
        }

        console.log(message.getContent());
    }
}

const NotificationType = {
    FREE: 'notifyFree',
    ALMOSTFULL: 'notifyAlmostFull',
    FULL: 'notifyFull'
}
