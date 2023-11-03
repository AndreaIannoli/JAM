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
exports.Persister = void 0;
var user_1 = require("./model/user");
var geofence_1 = require("./model/geofence");
var mongoose = require("mongoose");
var subscription_1 = require("./model/subscription");
var self;
var Persister = /** @class */ (function () {
    function Persister(dbName) {
        this.dbName = dbName;
        this.connected = false;
    }
    Persister.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                self = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var url = "mongodb://localhost:27017/" + _this.dbName;
                        mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });
                        var db = mongoose.connection;
                        db.on("error", function () {
                            console.log("MongoDB Connection error");
                            resolve(false);
                        });
                        db.on("open", function () {
                            console.log("MongoDB Connection OK");
                            self.connected = true;
                            resolve(true);
                        });
                    })];
            });
        });
    };
    Persister.prototype.disconnect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, geofence_1.Geofence.deleteMany({})];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, user_1.User.deleteMany({})];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, subscription_1.Subscription.deleteMany({})];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, mongoose.disconnect()];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Persister.prototype.addUserPosition = function (userId, lat, long) {
        return __awaiter(this, void 0, void 0, function () {
            var user, query, filter, update, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connected) return [3 /*break*/, 8];
                        user = new user_1.User({ id: userId, latitude: lat, longitude: long });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, user_1.User.findOne({ id: userId })];
                    case 2:
                        query = _a.sent();
                        if (!(query == null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, user.save()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        filter = { id: userId };
                        update = { latitude: lat, longitude: long };
                        return [4 /*yield*/, user_1.User.updateOne(filter, update)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_1 = _a.sent();
                        console.log("DB Insert Position error: " + err_1);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Persister.prototype.addGeofence = function (name, idG, lat, long, rad, msg) {
        return __awaiter(this, void 0, void 0, function () {
            var gfence, query, filter, update, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connected) return [3 /*break*/, 8];
                        gfence = new geofence_1.Geofence({ topic: name, id: idG, latitude: lat, longitude: long, radius: rad, message: msg });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 7, , 8]);
                        return [4 /*yield*/, geofence_1.Geofence.findOne({ id: idG })];
                    case 2:
                        query = _a.sent();
                        if (!(query == null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, gfence.save()];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 4:
                        filter = { id: idG };
                        update = { latitude: lat, longitude: long, radius: rad, message: msg, topic: name };
                        return [4 /*yield*/, geofence_1.Geofence.updateOne(filter, update)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        err_2 = _a.sent();
                        console.log("DB Insert Geofence error: " + err_2);
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    Persister.prototype.addSubscription = function (id, top) {
        return __awaiter(this, void 0, void 0, function () {
            var subs, query, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connected) return [3 /*break*/, 6];
                        subs = new subscription_1.Subscription({ clientId: id, topic: top });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        return [4 /*yield*/, subscription_1.Subscription.findOne({ clientId: id, topic: top })];
                    case 2:
                        query = _a.sent();
                        if (!(query == null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, subs.save()];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        err_3 = _a.sent();
                        console.log("DB Insert Subscription error: " + err_3);
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    Persister.prototype.getAllSubscriptions = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connected) return [3 /*break*/, 2];
                        return [4 /*yield*/, subscription_1.Subscription.find({ clientId: id })];
                    case 1:
                        query = _a.sent();
                        return [2 /*return*/, query];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Persister.prototype.getGeofenceInfo = function (top) {
        return __awaiter(this, void 0, void 0, function () {
            var query;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.connected) return [3 /*break*/, 2];
                        return [4 /*yield*/, geofence_1.Geofence.find({ topic: top })];
                    case 1:
                        query = _a.sent();
                        return [2 /*return*/, query];
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    return Persister;
}());
exports.Persister = Persister;
