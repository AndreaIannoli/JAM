"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.God = void 0;
var God = /** @class */ (function () {
    function God() {
        this.snapshotAdv = new Map();
        this.debugMode = false;
        this.OPTIMIZED_MODE = false;
    }
    God.prototype.newAdvertisement = function (messageNo, geofenceId) {
        var _this = this;
        var messageS = String(messageNo);
        var gData = new GeofenceData(geofenceId);
        this.snapshotAdv.set(messageS, gData);
        //console.log(this.snapshotAdv.keys());
        this.snapshotAdv.forEach(function (gEntry, key) {
            if ((gEntry.id == geofenceId) && (key != messageS)) {
                gEntry.active = false;
                if (_this.OPTIMIZED_MODE)
                    _this.snapshotAdv.delete(key);
            }
        });
        if (this.debugMode)
            this.printSnapshot();
    };
    God.prototype.setActiveUser = function (messageNo, userId, ctime) {
        var messageS = String(messageNo);
        var gData = this.snapshotAdv.get(messageS);
        if ((gData != undefined) && (gData.active == true)) {
            var found = false;
            for (var i = 0; i < gData.userList.length; i++) {
                if (gData.userList[i].id == userId)
                    found = true;
            }
            if (found == false) {
                gData.userList.push(new ActiveUser(userId, ctime));
            }
        }
        if (this.debugMode)
            this.printSnapshot();
    };
    God.prototype.setNotifiedUser = function (messageNo, userId, ctime) {
        var messageS = String(messageNo);
        var gData = this.snapshotAdv.get(messageS);
        if ((gData != undefined) && (gData.active == true)) {
            for (var i = 0; i < gData.userList.length; i++) {
                if (gData.userList[i].id == userId) {
                    gData.userList[i].notified = true;
                    gData.userList[i].timeNotified = ctime;
                }
            }
        }
        if (this.debugMode)
            this.printSnapshot();
    };
    God.prototype.printSnapshot = function () {
        console.log("------GOD------");
        this.snapshotAdv.forEach(function (gEntry, key) {
            console.log("Key: " + key + "GFence: " + gEntry.id + " active: " + gEntry.active + " numUsers: " + gEntry.userList.length);
            for (var i = 0; i < gEntry.userList.length; i++) {
                console.log("User " + gEntry.userList[i].id + " Notified: " + gEntry.userList[i].notified + " Time enter: " + gEntry.userList[i].timeEnter + " Time notified: " + gEntry.userList[i].timeNotified);
            }
        });
    };
    God.prototype.computePrecision = function () {
        var totUserEntered = 0;
        var totUserNotified = 0;
        this.snapshotAdv.forEach(function (gEntry, key) {
            totUserEntered += gEntry.userList.length;
            for (var i = 0; i < gEntry.userList.length; i++) {
                if (gEntry.userList[i].notified == true)
                    totUserNotified += 1;
            }
        });
        var precision = totUserNotified / totUserEntered;
        return precision;
    };
    God.prototype.computeDelay = function () {
        var meanDelay = 0;
        var totUserNotified = 0;
        this.snapshotAdv.forEach(function (gEntry, key) {
            for (var i = 0; i < gEntry.userList.length; i++) {
                if (gEntry.userList[i].notified == true) {
                    totUserNotified += 1;
                    console.log(gEntry.userList[i].timeNotified);
                    if (gEntry.userList[i].timeNotified >= gEntry.userList[i].timeEnter)
                        meanDelay += (gEntry.userList[i].timeNotified - gEntry.userList[i].timeEnter);
                }
            }
        });
        var delay = meanDelay / totUserNotified;
        return delay;
    };
    return God;
}());
exports.God = God;
var GeofenceData = /** @class */ (function () {
    function GeofenceData(id) {
        this.userList = new Array();
        this.active = true;
        this.id = id;
    }
    return GeofenceData;
}());
var ActiveUser = /** @class */ (function () {
    function ActiveUser(id, time) {
        this.id = id;
        this.timeEnter = time;
        this.timeNotified = undefined;
        this.notified = false;
    }
    return ActiveUser;
}());
