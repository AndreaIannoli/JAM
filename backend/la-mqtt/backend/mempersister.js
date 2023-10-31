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
exports.MemPersister = void 0;
var user_1 = require("./model/user");
var geofence_1 = require("./model/geofence");
var subscription_1 = require("./model/subscription");
var self;
var MemPersister = /** @class */ (function () {
    function MemPersister() {
        this.memUser = new Map();
        this.memGeofence = new Map();
        this.memSubscription = new Map();
    }
    MemPersister.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, true];
            });
        });
    };
    MemPersister.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        });
    };
    MemPersister.prototype.addUserPosition = function (userId, lat, long) {
        return __awaiter(this, void 0, void 0, function () {
            var user, user_2;
            return __generator(this, function (_a) {
                user = this.memUser.get(userId);
                if (user == undefined) {
                    user_2 = new user_1.User({ id: userId, latitude: lat, longitude: long });
                    this.memUser.set(userId, user_2);
                }
                else {
                    user.latitude = lat;
                    user.longitude = long;
                }
                return [2 /*return*/];
            });
        });
    };
    MemPersister.prototype.addGeofence = function (name, idG, lat, long, rad, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var gfence, gfence_1;
            return __generator(this, function (_a) {
                gfence = this.memGeofence.get(idG);
                if (gfence == undefined) {
                    gfence_1 = new geofence_1.Geofence({ topic: name, id: idG, latitude: lat, longitude: long, radius: rad, message: msg });
                    this.memGeofence.set(idG, gfence_1);
                }
                return [2 /*return*/];
            });
        });
    };
    MemPersister.prototype.addSubscription = function (id, top) {
        return __awaiter(this, void 0, void 0, function () {
            var key, subs, subs_1;
            return __generator(this, function (_a) {
                key = id + "!" + top;
                subs = this.memSubscription.get(key);
                if (subs == undefined) {
                    subs_1 = new subscription_1.Subscription({ clientId: id, topic: top });
                    this.memSubscription.set(key, subs_1);
                }
                return [2 /*return*/];
            });
        });
    };
    MemPersister.prototype.getAllSubscriptions = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                res = new Array();
                this.memSubscription.forEach(function (gEntry, key) {
                    var idEntry = key.split("!")[0];
                    if (idEntry == id)
                        res.push(gEntry);
                });
                return [2 /*return*/, res];
            });
        });
    };
    MemPersister.prototype.getGeofenceInfo = function (top) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                res = new Array();
                this.memGeofence.forEach(function (gEntry, key) {
                    if (gEntry.topic == top)
                        res.push(gEntry);
                });
                return [2 /*return*/, res];
            });
        });
    };
    return MemPersister;
}());
exports.MemPersister = MemPersister;
