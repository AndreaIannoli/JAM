"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = void 0;
var geolib = require('geolib');
var position_1 = require("./position");
var Direction = /** @class */ (function () {
    function Direction(source, destination, speed) {
        this.source = source;
        this.dest = destination;
        this.cPosition = new position_1.Position(source.latitude, source.longitude);
        this.destReached = false;
        this.computeCoefficients();
    }
    Direction.prototype.computeCoefficients = function () {
        this.mCoef = (this.source.longitude - this.dest.longitude) / (this.source.latitude - this.dest.latitude);
        this.nCoef = this.source.longitude - this.mCoef * this.source.latitude;
    };
    Direction.prototype.isDestinationReached = function () {
        return this.destReached;
    };
    Direction.prototype.computeDistanceToNextGoal = function () {
        return Direction.computeDistanceGPS(this.cPosition.latitude, this.cPosition.longitude, this.dest.latitude, this.dest.longitude);
    };
    Direction.prototype.computeAdvance = function (speed, timeAdvance) {
        var distanceToGoal = Direction.computeDistanceGPS(this.source.latitude, this.source.longitude, this.dest.latitude, this.dest.longitude);
        var distanceNow = Direction.computeDistanceGPS(this.cPosition.latitude, this.cPosition.longitude, this.dest.latitude, this.dest.longitude);
        var distanceE = Direction.computeEDistance(this.source.latitude, this.source.longitude, this.dest.latitude, this.dest.longitude);
        var realAdvance = speed * timeAdvance;
        var advance = realAdvance * distanceE / distanceToGoal;
        if ((distanceNow <= realAdvance)) {
            var p = new position_1.Position(this.dest.latitude, this.dest.longitude);
            this.cPosition.latitude = this.dest.latitude;
            this.cPosition.longitude = this.dest.longitude;
            this.destReached = true;
            return p;
        }
        else {
            var newX = this.cPosition.latitude;
            var val = advance * Math.sqrt(1 / (1 + this.mCoef * this.mCoef));
            if (newX > this.dest.latitude)
                newX = newX - val;
            else
                newX = newX + val;
            var newY = newX * this.mCoef + this.nCoef;
            this.cPosition.latitude = newX;
            this.cPosition.longitude = newY;
            var p = new position_1.Position(newX, newY);
            return p;
        }
    };
    Direction.computeEDistance = function (lat1, long1, lat2, long2) {
        var latE = Math.pow(Math.abs(lat1 - lat2), 2);
        var longE = Math.pow(Math.abs(long1 - long2), 2);
        var distance = Math.sqrt(latE + longE);
        return distance;
    };
    Direction.computeDistanceGPS = function (lat1, long1, lat2, long2) {
        var distance = geolib.getDistance({ latitude: lat1, longitude: long1 }, { latitude: lat2, longitude: long2 });
        return distance;
    };
    return Direction;
}());
exports.Direction = Direction;
