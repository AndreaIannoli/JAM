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
exports.GeoProcessor = void 0;
var geolib = require('geolib');
var GeoProcessor = /** @class */ (function () {
    function GeoProcessor(persister, callback) {
        this.persister = persister;
        this.callback = callback;
    }
    GeoProcessor.prototype.processUpdate = function (clientId, latitude, longitude) {
        return __awaiter(this, void 0, void 0, function () {
            var subList, i, geofenceList, j, inGeofence, msgJSON;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.persister.getAllSubscriptions(clientId)];
                    case 1:
                        subList = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < subList.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.persister.getGeofenceInfo(subList[i].topic)];
                    case 3:
                        geofenceList = _a.sent();
                        for (j = 0; j < geofenceList.length; j++) {
                            console.log("GEOFENCE LIST LENGTH", geofenceList.length);
                            console.log("CHECKING GEOFENCE", geofenceList[j].id, "MESSAGE", geofenceList[j].message);
                            inGeofence = this.checkWithinGeofence(geofenceList[j], latitude, longitude);
                            if (inGeofence == true) {
                                msgJSON = this.buildMessageJSON(geofenceList[j]);
                                this.callback.advertiseClient(geofenceList[j].id, geofenceList[j].topic, clientId, msgJSON);
                            }
                        }
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    GeoProcessor.prototype.buildMessageJSON = function (geofence) {
        var msg = '{ "message": "' + geofence.message + '", "latitude": ' + geofence.latitude + ', "longitude": ' + geofence.longitude + '}';
        return msg;
    };
    GeoProcessor.prototype.checkWithinGeofence = function (geofence, latitude, longitude) {
        var distance = GeoProcessor.computeDistanceGPS(geofence.latitude, geofence.longitude, latitude, longitude);
        // console.log("DISTANCE to gf:"+geofence.id+" D: "+distance);
        if (distance < geofence.radius)
            return true;
        else
            return false;
    };
    GeoProcessor.computeDistanceGPS = function (lat1, long1, lat2, long2) {
        var distance = geolib.getDistance({ latitude: lat1, longitude: long1 }, { latitude: lat2, longitude: long2 });
        return distance;
    };
    return GeoProcessor;
}());
exports.GeoProcessor = GeoProcessor;
