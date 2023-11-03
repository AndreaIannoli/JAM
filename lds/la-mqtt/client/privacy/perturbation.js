"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoPerturbation = void 0;
var position_1 = require("../../common/position");
var imetrics_1 = require("./imetrics");
var GeoPerturbation = /** @class */ (function () {
    function GeoPerturbation(rng) {
        this.rng = rng;
    }
    GeoPerturbation.prototype.setParameters = function (parameters) {
        this.perturbationDigit = parameters["digit"];
        console.log("Changed: " + this.perturbationDigit);
    };
    GeoPerturbation.prototype.transform = function (cPosition) {
        var latString = String(cPosition.latitude);
        var finalLat = latString.split('.')[0] + ".";
        latString = latString.split('.')[1];
        var numDigit = latString.length;
        var longString = String(cPosition.longitude);
        var finalLong = longString.split('.')[0] + ".";
        longString = longString.split('.')[1];
        var prefixString = latString.slice(0, this.perturbationDigit);
        finalLat = finalLat + prefixString;
        prefixString = longString.slice(0, this.perturbationDigit);
        finalLong = finalLong + prefixString;
        for (var i = 0; i < (numDigit - prefixString.length); i++) {
            finalLat = finalLat + String(this.generateRandomDigit());
            finalLong = finalLong + String(this.generateRandomDigit());
        }
        return new position_1.Position(Number(finalLat), Number(finalLong));
    };
    GeoPerturbation.prototype.generateRandomDigit = function () {
        return this.rng.nextInt(0, 10);
    };
    GeoPerturbation.prototype.setTrajectory = function (cPosition, destPosition) {
    };
    GeoPerturbation.prototype.getPrivacyMetricValue = function () {
        return imetrics_1.PrivacySet.NO_METRIC_VALUE;
    };
    return GeoPerturbation;
}());
exports.GeoPerturbation = GeoPerturbation;
