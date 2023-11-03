"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistanceMetrics = void 0;
var direction_1 = require("../../common/direction");
var DistanceMetrics = /** @class */ (function () {
    function DistanceMetrics() {
    }
    DistanceMetrics.prototype.compute = function (ps) {
        var distance = 0;
        for (var i = 0; i < ps.dummySet.length; i++)
            distance += direction_1.Direction.computeDistanceGPS(ps.dummySet[i].latitude, ps.dummySet[i].longitude, ps.realPosition.latitude, ps.realPosition.longitude);
        distance = distance / ps.dummySet.length;
        // console.log("DIST "+distance+" "+ps.dummySet.length);
        distance = this.normalize(distance);
        return distance;
    };
    DistanceMetrics.prototype.normalize = function (distance) {
        var val = Math.pow(distance / this.maxSpace, DistanceMetrics.SMOOTH_FACTOR);
        if (val > 1.0)
            val = 1.0;
        return val;
    };
    DistanceMetrics.prototype.update = function (ps) {
    };
    DistanceMetrics.prototype.setParameters = function (parameters) {
        this.maxSpace = parameters["interval"] * parameters["numdummy"] * DistanceMetrics.MAX_SPEED;
        this.maxSpace += DistanceMetrics.MAX_PERTURBATION;
    };
    DistanceMetrics.MAX_SPEED = 5.0;
    DistanceMetrics.MAX_PERTURBATION = 6000;
    DistanceMetrics.SMOOTH_FACTOR = 0.5;
    return DistanceMetrics;
}());
exports.DistanceMetrics = DistanceMetrics;
