import { MQTTSpatialMessages } from '../common/messages';
import { MQTTClient } from '../common/client';
import { MQTTMessage, MQTTReceiver } from '../common/ireceiver';
import { Persister } from './persister'
import { IPersister } from './ipersister';
import { MemPersister } from './mempersister';
import { MosquittoWatcher } from './logwatcher'
import { ILogCallback } from './dto/iwatcher';
import { GeoProcessor } from './geoprocesser';
import { PersisterType } from './ipersister';
export class SpatialMQTTBackEnd extends MQTTClient implements MQTTReceiver, ILogCallback {

    private static DEFAULT_NAME:string="MQTT_BACKEND";
    private static STORAGE_NAME:string="smqtt";


    //HHH
    private static GEOFENCE_PERSISTANCE:boolean=true;
    private static NOTIFY_ONLY_ONCE: boolean=true;

    private verboseMode: boolean;
    private persisterType: PersisterType;
    private persister: IPersister;
    //private logWatcher: MosquittoWatcher;
    private geoProcessor: GeoProcessor;
    // @ts-ignore
    private historyGeofence: Map<string,number>;
    // @ts-ignore
    private historyNotificationSent: Map<string,number>;

    constructor (username: string, password: string, host: string, port: number) {
        super(username,password,host,port,SpatialMQTTBackEnd.DEFAULT_NAME);
        this.persisterType=PersisterType.MONGODB;
        // @ts-ignore
        if (this.persisterType==PersisterType.MEMORY)
            this.persister=new MemPersister();
        else
            this.persister=new Persister(SpatialMQTTBackEnd.STORAGE_NAME);

        //this.logWatcher=new MosquittoWatcher('/Users/marcodifelice/Documents/Lavoro/ProgettiSW/SpatialMQTT/src/backend','log.txt');
        this.geoProcessor=new GeoProcessor(this.persister, this);
        // @ts-ignore
        this.historyGeofence=new Map<string,number>();
        // @ts-ignore
        this.historyNotificationSent=new Map<string,number>();
        this.verboseMode=true;
    }


    public async start() {
        let res: boolean=await this.connect();
        console.log("CONNECTION RESULT: ", res);
        if (res==true) {
            this.setCallback(this);
            await this.subscribe(MQTTSpatialMessages.TOPIC_PUBLISH_POSITION);
            await this.subscribe(MQTTSpatialMessages.TOPIC_PUBLISH_GEOFENCE);
            await this.subscribe(MQTTSpatialMessages.TOPIC_PUBLISH_SUBSCRIPTION);
            await this.persister.connect();
            //await this.logWatcher.start(this);
        }
    }

    public async stop() {
        await this.disconnect();
        await this.persister.disconnect();
        //this.logWatcher.stop();
        console.log("Connection to DB closed");
    }

    public async messageRecv(msg: MQTTMessage) {
        if (msg.topic==MQTTSpatialMessages.TOPIC_PUBLISH_POSITION)
            await this.handlePositionUpdate(msg.message);
        else if (msg.topic==MQTTSpatialMessages.TOPIC_PUBLISH_GEOFENCE)
            await this.handleGeofenceUpdate(msg.message);
        else if (msg.topic==MQTTSpatialMessages.TOPIC_PUBLISH_SUBSCRIPTION)
            await this.handleSubscriptionUpdate(msg.message);
    }

    // @ts-ignore
    private async handlePositionUpdate(payload: string) {
        if (this.verboseMode==true) {
            console.log("[BACKEND] Received UPDATE POSITION: "+payload);
        }
        let objJSON=JSON.parse(payload);
        await this.persister.addUserPosition(objJSON["id"],objJSON["latitude"],objJSON["longitude"]);
        if (SpatialMQTTBackEnd.GEOFENCE_PERSISTANCE==true)
            await this.geoProcessor.processUpdate(objJSON["id"],objJSON["latitude"],objJSON["longitude"]);
    }

    // @ts-ignore
    private async handleGeofenceUpdate(payload: string) {
        if (this.verboseMode==true) {
            console.log("[BACKEND] Received UPDATE GEOFENCE: "+payload);
        }
        let objJSON=JSON.parse(payload);
        let seqNo=this.historyGeofence.get(objJSON["id"]);
        if (seqNo==undefined)
            seqNo=1;
        else
            seqNo+=1;
        this.historyGeofence.set(objJSON["id"],seqNo);
        console.log("SEQUENTIAL:", this.historyGeofence.get(objJSON["id"]));
        await this.persister.addGeofence(objJSON["topicGeofence"],objJSON["id"],objJSON["latitude"],objJSON["longitude"],objJSON["radius"],objJSON["message"]);
    }

    // @ts-ignore
    private async handleSubscriptionUpdate(payload: string) {
        if (this.verboseMode==true) {
            console.log("[BACKEND] Received SUBSCRIPTION: "+payload);
        }
        let objJSON=JSON.parse(payload);
        await this.newSubscribeEvent(objJSON["id"],objJSON["topic"]);
    }

    // @ts-ignore
    public async newSubscribeEvent(clientId: string, topic: string) {
        //if (this.verboseMode==true) {
            console.log("[BACKEND] New subscription "+clientId+" "+topic);
        //}
        await this.persister.addSubscription(clientId, topic);
    }

    public async advertiseClient(geofenceId: string, topic: string, clientId: string, message: string) {

        let correctTopic: string=topic+"_"+clientId;
        if (SpatialMQTTBackEnd.NOTIFY_ONLY_ONCE==true) {
            let signature:string=geofenceId+"_"+clientId;
            let currentSeqNo=this.historyNotificationSent.get(signature);
            console.log("CURRENT SEQUEL NO:", currentSeqNo);
            let lastSeqNo=this.historyGeofence.get(geofenceId);
            console.log("LAST SEQUEL NO:", lastSeqNo);
            if ((currentSeqNo==undefined) || (currentSeqNo<lastSeqNo)) {
                this.historyNotificationSent.set(signature,lastSeqNo);
                if (this.verboseMode==true)
                    console.log("[BACKEND] Publish GEO_ADVERTISEMENT to: "+clientId+" topic: "+correctTopic);
                //await this.publish(topic, message);
                //HHH
                await this.publish(correctTopic, message);
            }
        } else {
            if (this.verboseMode==true)
                console.log("[BACKEND] Publish GEO_ADVERTISEMENT to: "+clientId+" topic: "+correctTopic);
            //HHH
            await this.publish(correctTopic, message);
            //await this.publish(topic, message);
        }

    }

}
