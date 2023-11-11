"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntropyMetrics = void 0;
var direction_1 = require("../../common/direction");
var EntropyMetrics = /** @class */ (function () {
    function EntropyMetrics() {
        this.historian = undefined;
        this.mean = 1.0;
    }
    EntropyMetrics.prototype.setParameters = function (parameters) {
        this.interval = parameters["interval"] * parameters["numdummy"];
        this.mean = ((EntropyMetrics.MAX_SPEED + EntropyMetrics.MIN_SPEED) / 2) * this.interval;
        this.variance = Math.pow(this.interval, 2) * (EntropyMetrics.MAX_SPEED - EntropyMetrics.MIN_SPEED) / 12.0;
    };
    EntropyMetrics.prototype.compute = function (ps) {
        var prob = new Array();
        var tot = 0.0;
        var entropy = 0.0;
        if (this.historian == undefined)
            return EntropyMetrics.DEFAULT_VALUE;
        for (var i = 0; i < ps.dummySet.length; i++) {
            //console.log("Sample "+i);
            //console.log("------------");
            prob[i] = this.computeMaxProbability(ps.dummySet[i], this.historian);
            tot += prob[i];
        }
        for (var i = 0; i < ps.dummySet.length; i++) {
            prob[i] = prob[i] / tot;
            if (prob[i] > 0)
                entropy += (Math.log2(prob[i]) * prob[i]);
        }
        entropy = entropy * -1;
        return entropy;
    };
    EntropyMetrics.prototype.update = function (ps) {
        this.historian = ps;
    };
    EntropyMetrics.prototype.computeAvgProbability = function (pos1, ps) {
        var avg = 0.0;
        for (var i = 0; i < ps.dummySet.length; i++)
            avg += this.computeLikelihood(pos1, ps.dummySet[i]);
        avg = avg / ps.dummySet.length;
        //console.log("AVG: "+avg+" "+ps.dummySet.length);
        return avg;
    };
    EntropyMetrics.prototype.computeMaxProbability = function (pos1, ps) {
        var max = undefined;
        for (var i = 0; i < ps.dummySet.length; i++) {
            var val = this.computeLikelihood(pos1, ps.dummySet[i]);
            if ((max == undefined) || (val > max))
                max = val;
        }
        //console.log("MAX: "+max+" "+ps.dummySet.length);
        return max;
    };
    EntropyMetrics.prototype.computeLikelihood = function (pos1, pos2) {
        var distance = direction_1.Direction.computeDistanceGPS(pos1.latitude, pos1.longitude, pos2.latitude, pos2.longitude);
        var gle = (1 / (Math.sqrt(2 * Math.PI * EntropyMetrics.DEFAULT_VARIANCE))) * Math.exp(Math.pow(distance - this.mean, 2) / (-2 * this.variance));
        var ok = false;
        if (distance > this.interval * EntropyMetrics.MAX_SPEED)
            ok = true;
        //console.log("DIST: "+distance+" "+gle+" ok: "+ok+" bound: "+this.interval* EntropyMetrics.MAX_SPEED);
        return gle;
    };
    EntropyMetrics.DEFAULT_VALUE = 0.0;
    EntropyMetrics.DEFAULT_VARIANCE = 500;
    EntropyMetrics.MAX_SPEED = 5.0;
    EntropyMetrics.MIN_SPEED = 1.0;
    return EntropyMetrics;
}());
exports.EntropyMetrics = EntropyMetrics;
