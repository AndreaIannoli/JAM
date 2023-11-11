"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MosquittoConnector = void 0;
var ireceiver_1 = require("./ireceiver");
var mqtt = require('mqtt');
var MosquittoConnector = /** @class */ (function () {
    function MosquittoConnector() {
        this.connected = false;
        this.eventInitialized = false;
        this.sclient = undefined;
    }
    MosquittoConnector.prototype.connect = function (conf) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        _this.client = mqtt.connect(conf.url, { clientId: conf.id, protocolId: 'MQTT', protocolVersion: 4, connectTimeout: 5000, debug: true, username: conf.username, password: conf.password });
                        //this.client  = mqtt.connect(conf.url,{clientId: conf.id, protocolId: 'MQIsdp', protocolVersion: 3, connectTimeout:5000, debug:true, username: conf.username, password: conf.password});
                        _this.client.on('connect', function () {
                            console.log("Connected to MQTT Broker. Client id: " + conf.id);
                            this.connected = true;
                            resolve(true);
                        }.bind(_this));
                        _this.client.on('error', function (e) {
                            console.log("Connection Error" + e);
                            this.client.end();
                            resolve(false);
                        }.bind(_this));
                    })];
            });
        });
    };
    MosquittoConnector.prototype.publish = function (topic, message) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (_this.connected) {
                            _this.client.publish(topic, message);
                            resolve(true);
                        }
                        else
                            resolve(false);
                    })];
            });
        });
    };
    MosquittoConnector.prototype.subscribe = function (topic, mclient) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.sclient = mclient;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (_this.connected) {
                            _this.client.subscribe(topic);
                            if (_this.eventInitialized == false)
                                _this.recvMessage();
                            _this.eventInitialized = true;
                            resolve(true);
                        }
                        else
                            resolve(false);
                    })];
            });
        });
    };
    MosquittoConnector.prototype.recvMessage = function () {
        this.client.on('message', function (topic, message) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.sclient != undefined)) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.sclient.msgRecv(new ireceiver_1.MQTTMessage(topic, message))];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        }.bind(this));
    };
    MosquittoConnector.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        if (_this.connected == true)
                            _this.client.end();
                        resolve(true);
                    })];
            });
        });
    };
    MosquittoConnector.prototype.isConnected = function () {
        return this.connected;
    };
    return MosquittoConnector;
}());
exports.MosquittoConnector = MosquittoConnector;
