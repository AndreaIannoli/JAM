"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SpatialMQTTBackEnd = void 0;
var messages_1 = require("../common/messages");
var client_1 = require("../common/client");
var persister_1 = require("./persister");
var mempersister_1 = require("./mempersister");
var geoprocesser_1 = require("./geoprocesser");
var ipersister_1 = require("./ipersister");
var SpatialMQTTBackEnd = /** @class */ (function (_super) {
    __extends(SpatialMQTTBackEnd, _super);
    function SpatialMQTTBackEnd(username, password, host, port, brokerConf) {
        var _this = _super.call(this, username, password, 'ws://' + host + ':' + port + '/', port, SpatialMQTTBackEnd.DEFAULT_NAME + '-' + host.split('.').join('') + "-" + port) || this;
        _this.persisterType = ipersister_1.PersisterType.MONGODB;
        // @ts-ignore
        if (_this.persisterType == ipersister_1.PersisterType.MEMORY)
            _this.persister = new mempersister_1.MemPersister();
        else
            _this.persister = new persister_1.Persister(SpatialMQTTBackEnd.STORAGE_NAME + '-' + host.split('.').join('') + "-" + port);
        //this.logWatcher=new MosquittoWatcher('/Users/marcodifelice/Documents/Lavoro/ProgettiSW/SpatialMQTT/src/backend','log.txt');
        _this.geoProcessor = new geoprocesser_1.GeoProcessor(_this.persister, _this);
        // @ts-ignore
        _this.historyGeofence = new Map();
        // @ts-ignore
        _this.historyNotificationSent = new Map();
        _this.verboseMode = true;
        // @ts-ignore
        _this.adjacentBrokers = brokerConf.bridgedBrokers;
        _this.host = host + ':' + port;
        return _this;
    }
    SpatialMQTTBackEnd.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var res, _i, _a, aBroker;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.connect()];
                    case 1:
                        res = _b.sent();
                        console.log("CONNECTION RESULT: ", res);
                        if (!(res == true)) return [3 /*break*/, 10];
                        this.setCallback(this);
                        return [4 /*yield*/, this.subscribe(messages_1.MQTTSpatialMessages.TOPIC_PUBLISH_POSITION)];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, this.subscribe(messages_1.MQTTSpatialMessages.TOPIC_PUBLISH_GEOFENCE)];
                    case 3:
                        _b.sent();
                        return [4 /*yield*/, this.subscribe(messages_1.MQTTSpatialMessages.TOPIC_PUBLISH_SUBSCRIPTION)];
                    case 4:
                        _b.sent();
                        _i = 0, _a = this.adjacentBrokers;
                        _b.label = 5;
                    case 5:
                        if (!(_i < _a.length)) return [3 /*break*/, 8];
                        aBroker = _a[_i];
                        return [4 /*yield*/, this.subscribe('bridgeFrom' + aBroker + 'To' + this.host)];
                    case 6:
                        _b.sent();
                        _b.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 5];
                    case 8: return [4 /*yield*/, this.persister.connect()];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    SpatialMQTTBackEnd.prototype.stop = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.disconnect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.persister.disconnect()];
                    case 2:
                        _a.sent();
                        //this.logWatcher.stop();
                        console.log("Connection to DB closed");
                        return [2 /*return*/];
                }
            });
        });
    };
    SpatialMQTTBackEnd.prototype.messageRecv = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(msg.topic == messages_1.MQTTSpatialMessages.TOPIC_PUBLISH_POSITION)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.handlePositionUpdate(msg.message)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 2:
                        if (!(msg.topic == messages_1.MQTTSpatialMessages.TOPIC_PUBLISH_GEOFENCE)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.handleGeofenceUpdate(msg.message)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(msg.topic == messages_1.MQTTSpatialMessages.TOPIC_PUBLISH_SUBSCRIPTION)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.handleSubscriptionUpdate(msg.message)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(msg.topic.substring(0, 6) == messages_1.MQTTSpatialMessages.TOPIC_PUBLISH_BRIDGE)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.handleBridgeUpdate(msg.message)];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    // @ts-ignore
    SpatialMQTTBackEnd.prototype.handleBridgeUpdate = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.verboseMode == true) {
                            console.log("[BACKEND] Received UPDATE FROM BRIDGE: " + payload);
                        }
                        return [4 /*yield*/, this.handleGeofenceUpdate(payload)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // @ts-ignore
    SpatialMQTTBackEnd.prototype.handlePositionUpdate = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var objJSON;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.verboseMode == true) {
                            console.log("[BACKEND] Received UPDATE POSITION: " + payload);
                        }
                        objJSON = JSON.parse(payload);
                        return [4 /*yield*/, this.persister.addUserPosition(objJSON["id"], objJSON["latitude"], objJSON["longitude"])];
                    case 1:
                        _a.sent();
                        if (!(SpatialMQTTBackEnd.GEOFENCE_PERSISTANCE == true)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.geoProcessor.processUpdate(objJSON["id"], objJSON["latitude"], objJSON["longitude"])];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // @ts-ignore
    SpatialMQTTBackEnd.prototype.handleGeofenceUpdate = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var objJSON, seqNo, alreadyNotifiedBroker, _i, _a, aBroker;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.verboseMode == true) {
                            console.log("[BACKEND] Received UPDATE GEOFENCE: " + payload);
                        }
                        objJSON = JSON.parse(payload);
                        seqNo = this.historyGeofence.get(objJSON["id"]);
                        if (seqNo == undefined)
                            seqNo = 1;
                        else
                            seqNo += 1;
                        this.historyGeofence.set(objJSON["id"], seqNo);
                        console.log("SEQUENTIAL:", this.historyGeofence.get(objJSON["id"]));
                        return [4 /*yield*/, this.persister.addGeofence(objJSON["topicGeofence"], objJSON["id"], objJSON["latitude"], objJSON["longitude"], objJSON["radius"], objJSON["message"])];
                    case 1:
                        _b.sent();
                        alreadyNotifiedBroker = objJSON['notifiedBrokers'];
                        // This if should be run only by the first backend
                        if (!objJSON['notifiedBrokers'].includes(this.host)) {
                            objJSON['notifiedBrokers'].push(this.host);
                        }
                        objJSON['notifiedBrokers'] = objJSON['notifiedBrokers'].concat(this.adjacentBrokers).filter(function (value, index, self) {
                            return self.indexOf(value) === index;
                        });
                        _i = 0, _a = this.adjacentBrokers;
                        _b.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        aBroker = _a[_i];
                        if (!!alreadyNotifiedBroker.includes(aBroker)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.publish(messages_1.MQTTSpatialMessages.TOPIC_PUBLISH_BRIDGE + 'From' + this.host + 'To' + aBroker, JSON.stringify(objJSON))];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // @ts-ignore
    SpatialMQTTBackEnd.prototype.handleSubscriptionUpdate = function (payload) {
        return __awaiter(this, void 0, void 0, function () {
            var objJSON;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.verboseMode == true) {
                            console.log("[BACKEND] Received SUBSCRIPTION: " + payload);
                        }
                        objJSON = JSON.parse(payload);
                        return [4 /*yield*/, this.newSubscribeEvent(objJSON["id"], objJSON["topic"])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // @ts-ignore
    SpatialMQTTBackEnd.prototype.newSubscribeEvent = function (clientId, topic) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        //if (this.verboseMode==true) {
                        console.log("[BACKEND] New subscription " + clientId + " " + topic);
                        //}
                        return [4 /*yield*/, this.persister.addSubscription(clientId, topic)];
                    case 1:
                        //}
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    SpatialMQTTBackEnd.prototype.advertiseClient = function (geofenceId, topic, clientId, message) {
        return __awaiter(this, void 0, void 0, function () {
            var correctTopic, signature, currentSeqNo, lastSeqNo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        correctTopic = topic + "_" + clientId;
                        if (!(SpatialMQTTBackEnd.NOTIFY_ONLY_ONCE == true)) return [3 /*break*/, 3];
                        signature = geofenceId + "_" + clientId;
                        currentSeqNo = this.historyNotificationSent.get(signature);
                        console.log("CURRENT SEQUEL NO:", currentSeqNo);
                        lastSeqNo = this.historyGeofence.get(geofenceId);
                        console.log("LAST SEQUEL NO:", lastSeqNo);
                        if (!((currentSeqNo == undefined) || (currentSeqNo < lastSeqNo))) return [3 /*break*/, 2];
                        this.historyNotificationSent.set(signature, lastSeqNo);
                        if (this.verboseMode == true)
                            console.log("[BACKEND] Publish GEO_ADVERTISEMENT to: " + clientId + " topic: " + correctTopic);
                        //await this.publish(topic, message);
                        //HHH
                        return [4 /*yield*/, this.publish(correctTopic, message)];
                    case 1:
                        //await this.publish(topic, message);
                        //HHH
                        _a.sent();
                        _a.label = 2;
                    case 2: return [3 /*break*/, 5];
                    case 3:
                        if (this.verboseMode == true)
                            console.log("[BACKEND] Publish GEO_ADVERTISEMENT to: " + clientId + " topic: " + correctTopic);
                        //HHH
                        return [4 /*yield*/, this.publish(correctTopic, message)];
                    case 4:
                        //HHH
                        _a.sent();
                        _a.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    SpatialMQTTBackEnd.DEFAULT_NAME = "MQTT_BACKEND";
    SpatialMQTTBackEnd.STORAGE_NAME = "smqtt";
    //HHH
    SpatialMQTTBackEnd.GEOFENCE_PERSISTANCE = true;
    SpatialMQTTBackEnd.NOTIFY_ONLY_ONCE = true;
    return SpatialMQTTBackEnd;
}(client_1.MQTTClient));
exports.SpatialMQTTBackEnd = SpatialMQTTBackEnd;
