"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Percolation = void 0;
var position_1 = require("../../common/position");
var direction_1 = require("../../common/direction");
var imetrics_1 = require("./imetrics");
var perturbation_1 = require("./perturbation");
var dist_1 = require("./dist");
var Percolation = /** @class */ (function () {
    function Percolation(rng) {
        this.perturbation = new perturbation_1.GeoPerturbation(rng);
        this.rng = rng;
        this.trajectories = new Array();
        this.directions = new Array();
        this.speed = new Array();
        this.metric = new dist_1.DistanceMetrics();
        this.sequenceNo = 0;
        this.metricValue = imetrics_1.PrivacySet.NO_METRIC_VALUE;
        this.ps = new imetrics_1.PrivacySet();
        this.initialized = false;
    }
    Percolation.prototype.transform = function (cPosition) {
        var prev = this.trajectories[this.sequenceNo];
        this.updatePosition(cPosition);
        if (this.sequenceNo == 0) {
            this.sequenceNo += 1;
            this.ps.add(cPosition);
            this.ps.realPosition = cPosition;
            if (this.sequenceNo >= this.numUpdates) {
                this.sequenceNo = 0;
                this.metricValue = this.metric.compute(this.ps);
                this.metric.update(this.ps);
                this.ps = new imetrics_1.PrivacySet();
            }
            return cPosition;
        }
        else {
            var retPos = this.trajectories[this.sequenceNo];
            this.ps.add(retPos);
            this.sequenceNo += 1;
            if (this.sequenceNo >= this.numUpdates) {
                this.sequenceNo = 0;
                this.metricValue = this.metric.compute(this.ps);
                // console.log(this.metricValue);
                this.metric.update(this.ps);
                this.ps = new imetrics_1.PrivacySet();
            }
            return retPos;
        }
    };
    Percolation.prototype.setParameters = function (parameters) {
        this.perturbation.setParameters(JSON.parse("{\"digit\":" + parameters["digit"] + "}"));
        this.metric.setParameters(parameters);
        this.interval = parameters["interval"];
        if (parameters["numdummy"] < Percolation.MAX_TRAJECTORIES)
            this.numUpdates = parameters["numdummy"];
        else
            this.numUpdates = Percolation.MAX_TRAJECTORIES;
        if (this.initialized == false) {
            for (var i = 0; i < (Percolation.MAX_TRAJECTORIES); i++) {
                this.trajectories[i] = undefined;
                this.speed[i] = 0;
            }
        }
        else if (parameters["digit"] != this.cPerturbationIndex) {
            for (var i = 0; i < (Percolation.MAX_TRAJECTORIES); i++) {
                this.trajectories[i] = this.perturbation.transform(this.trajectories[i]);
                ;
                this.directions[i] = new direction_1.Direction(this.trajectories[i], this.perturbation.transform(this.dest), this.speed[i]);
            }
        }
        this.cPerturbationIndex = parameters["digit"];
    };
    Percolation.prototype.setTrajectory = function (cPosition, dPosition) {
        this.trajectories[0] = new position_1.Position(cPosition.latitude, cPosition.longitude);
        for (var i = 1; i < (Percolation.MAX_TRAJECTORIES); i++) {
            if (this.trajectories[i] == undefined)
                this.trajectories[i] = this.perturbation.transform(cPosition);
            this.speed[i] = this.rng.nextDouble() * (Percolation.MAX_SPEED - Percolation.MIN_SPEED) + Percolation.MIN_SPEED;
            this.directions[i] = new direction_1.Direction(this.trajectories[i], this.perturbation.transform(dPosition), this.speed[i]);
        }
        this.dest = dPosition;
        this.initialized = true;
    };
    Percolation.prototype.updatePosition = function (cPosition) {
        this.trajectories[0] = cPosition;
        for (var i = 1; i < Percolation.MAX_TRAJECTORIES; i++) {
            this.trajectories[i] = this.directions[i].computeAdvance(this.speed[i], this.interval);
            if (this.directions[i].isDestinationReached() == true) {
                this.speed[i] = this.rng.nextDouble() * Percolation.MAX_SPEED + Percolation.MIN_SPEED;
                this.directions[i] = new direction_1.Direction(this.trajectories[i], this.perturbation.transform(cPosition), this.speed[i]);
            }
        }
    };
    Percolation.prototype.getPrivacyMetricValue = function () {
        if (this.sequenceNo == 0) {
            return this.metricValue;
        }
        else
            return imetrics_1.PrivacySet.NO_METRIC_VALUE;
    };
    Percolation.MAX_SPEED = 5.0;
    Percolation.MIN_SPEED = 2.0;
    Percolation.MAX_TRAJECTORIES = 12;
    return Percolation;
}());
exports.Percolation = Percolation;
