"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterTuner = void 0;
var imetrics_1 = require("./imetrics");
var ParameterTuner = /** @class */ (function () {
    function ParameterTuner(dummyUpdateValues, perturbationValues, alpha, pm, measurer, rng, frequency, exploration) {
        this.EXP_FOR_STATES = 2.0;
        this.cConf = new Configuration(dummyUpdateValues, perturbationValues);
        this.pManager = pm;
        this.alpha = alpha;
        this.mqttMeasurer = measurer;
        this.qTable = new QTable(this.cConf, dummyUpdateValues, perturbationValues, rng);
        this.temperature = ParameterTuner.MAX_TEMPERATURE;
        this.cAction = this.cConf.getConfigNumber();
        this.frequency = frequency;
        this.implementAction();
        this.slotTime = 0;
        this.slotNumber = 0;
        this.EXP_FOR_STATES = exploration;
        this.deltaTemperature = (ParameterTuner.MAX_TEMPERATURE - ParameterTuner.MIN_TEMPERATURE) / (this.qTable.getNumEntries(this.cConf) * this.EXP_FOR_STATES);
        console.log("EXPLORATION " + this.EXP_FOR_STATES + " Delta " + this.deltaTemperature);
    }
    ParameterTuner.prototype.getReward = function () {
        this.cReward = this.mqttMeasurer.getPrivacyPerSlot() * this.alpha + (1 - this.alpha) * this.mqttMeasurer.getSpatialAccuracyPerSlot();
        console.log("[REW] TIME: " + this.slotNumber + " REWARD: " + this.cReward + " " + " P: " + this.mqttMeasurer.getPrivacyPerSlot() + " SA: " + this.mqttMeasurer.getSpatialAccuracyPerSlot() + " DU: " + this.cConf.cDummyValue + "  PE: " + this.cConf.cPerturbationValue + " NN: " + this.mqttMeasurer.getNumberNotificationRecvPerSlot());
        return this.cReward;
    };
    ParameterTuner.prototype.update = function (cPosition) {
        this.slotTime += this.frequency;
        if ((this.mqttMeasurer.getPrivacyPerSlot() != imetrics_1.PrivacySet.NO_METRIC_VALUE) && (this.slotTime >= ParameterTuner.SLOT_DURATION)) {
            this.qTable.update(this.cConf, this.cAction, cPosition, this.getReward());
            this.cAction = this.qTable.getBestAction(cPosition, this.cConf, this.temperature);
            this.implementAction();
            this.adjustTemperature();
            this.mqttMeasurer.resetLatest();
            this.slotTime = 0;
        }
        this.slotNumber += 1;
    };
    ParameterTuner.prototype.adjustTemperature = function () {
        if (this.temperature > ParameterTuner.MIN_TEMPERATURE)
            this.temperature -= this.deltaTemperature;
    };
    ParameterTuner.prototype.implementAction = function () {
        this.cConf.setConfiguration(this.cAction);
        var privacyParameters = "{\"digit\":" + this.cConf.cPerturbationValue + ", \"numdummy\":" + this.cConf.cDummyValue + ", \"interval\":" + this.frequency + " }";
        console.log(privacyParameters);
        this.pManager.setParameters(JSON.parse(privacyParameters));
    };
    ParameterTuner.MAX_TEMPERATURE = 10.0;
    ParameterTuner.MIN_TEMPERATURE = 0.10;
    ParameterTuner.SLOT_DURATION = 540.0;
    return ParameterTuner;
}());
exports.ParameterTuner = ParameterTuner;
var QTable = /** @class */ (function () {
    function QTable(conf, dummyUpdateValues, perturbationValues, rng) {
        this.qTable = new Map();
        this.gr = new GridRegion();
        this.rng = rng;
        for (var i = 0; i < conf.getNumConfigurations(); i++)
            for (var k = 0; k < this.gr.getNumRegions(); k++) {
                var stateVal = this.encode(k, i);
                this.qTable.set(stateVal, QTable.DEFAULT_VALUE);
            }
    }
    QTable.prototype.getNumEntries = function (conf) {
        return this.gr.getNumRegions() * conf.getNumConfigurations();
    };
    QTable.prototype.encode = function (gridCell, configNumber) {
        var str = String(gridCell) + "_" + String(configNumber);
        return str;
    };
    QTable.prototype.update = function (conf, action, cPosition, reward) {
        var gridCell = this.gr.getCurrentRegion(cPosition);
        var state = this.encode(gridCell, conf.getConfigNumber());
        var val = 0;
        if (this.qTable.get(state) == QTable.DEFAULT_VALUE)
            val = reward;
        else
            val = QTable.GAMMA * reward + (1 - QTable.GAMMA) * this.qTable.get(state);
        console.log("State: " + state + " Qtable: " + val + " " + "Reward: " + reward);
        this.qTable.set(state, val);
    };
    QTable.prototype.getBestAction = function (cPosition, conf, temperature) {
        var gridCell = this.gr.getCurrentRegion(cPosition);
        var probAction = new Array();
        var bestAction = undefined;
        var probTot = 0;
        for (var action = 0; action < conf.getNumConfigurations(); action++) {
            var state = this.encode(gridCell, action);
            var value = this.qTable.get(state);
            probAction[action] = Math.exp(value / temperature);
            probTot += probAction[action];
        }
        for (var action = 0; action < conf.getNumConfigurations(); action++) {
            probAction[action] = probAction[action] / probTot;
        }
        var ranValue = this.rng.nextDouble();
        var end = false;
        var base = 0;
        for (var action = 0; ((action < conf.getNumConfigurations()) && (end == false)); action++) {
            base = base + probAction[action];
            if (ranValue <= base) {
                end = true;
                bestAction = action;
            }
        }
        console.log("BestAction: " + bestAction + " DU: " + conf.getDummiesFromConfigNumber(bestAction) + " PE: " + conf.getPerturbationFromConfigNumber(bestAction));
        return bestAction;
    };
    QTable.DEFAULT_VALUE = -1;
    QTable.GAMMA = 0.5;
    return QTable;
}());
var GridRegion = /** @class */ (function () {
    function GridRegion() {
        this.regionSizeLat = (GridRegion.RIGHT_CORNER_LAT - GridRegion.LEFT_CORNER_LAT) / GridRegion.NUM_REGIONS_PER_SIZE;
        this.regionSizeLong = (GridRegion.RIGHT_CORNER_LONG - GridRegion.LEFT_CORNER_LONG) / GridRegion.NUM_REGIONS_PER_SIZE;
    }
    GridRegion.prototype.getNumRegions = function () {
        return GridRegion.NUM_REGIONS_PER_SIZE * GridRegion.NUM_REGIONS_PER_SIZE;
    };
    GridRegion.prototype.getCurrentRegion = function (cPosition) {
        var gridX = Math.floor((cPosition.latitude - GridRegion.LEFT_CORNER_LAT) / this.regionSizeLat);
        var gridY = Math.floor((cPosition.longitude - GridRegion.LEFT_CORNER_LONG) / this.regionSizeLong);
        return gridX * GridRegion.NUM_REGIONS_PER_SIZE + gridY;
    };
    GridRegion.LEFT_CORNER_LAT = 44.482789890501586;
    GridRegion.LEFT_CORNER_LONG = 11.325016021728516;
    GridRegion.RIGHT_CORNER_LAT = 44.50715706370573;
    GridRegion.RIGHT_CORNER_LONG = 11.362781524658203;
    GridRegion.NUM_REGIONS_PER_SIZE = 2;
    return GridRegion;
}());
var Configuration = /** @class */ (function () {
    function Configuration(dummyUpdateValues, perturbationValues) {
        this.dummyUpdateValues = dummyUpdateValues;
        this.perturbationValues = perturbationValues;
        this.cDummyIndex = 0;
        this.cPerturbationIndex = 0;
        this.cDummyValue = this.dummyUpdateValues[this.cDummyIndex];
        this.cPerturbationValue = this.perturbationValues[this.cPerturbationIndex];
    }
    Configuration.prototype.getNumConfigurations = function () {
        return this.dummyUpdateValues.length * this.perturbationValues.length;
    };
    Configuration.prototype.setConfiguration = function (action) {
        this.cDummyIndex = action % this.dummyUpdateValues.length;
        this.cPerturbationIndex = Math.floor(action / this.dummyUpdateValues.length);
        this.cDummyValue = this.dummyUpdateValues[this.cDummyIndex];
        this.cPerturbationValue = this.perturbationValues[this.cPerturbationIndex];
    };
    Configuration.prototype.getConfigNumber = function () {
        return ((this.cPerturbationIndex * this.dummyUpdateValues.length) + this.cDummyIndex);
    };
    Configuration.prototype.getDummiesFromConfigNumber = function (val) {
        var index = val % this.dummyUpdateValues.length;
        return this.dummyUpdateValues[index];
    };
    Configuration.prototype.getPerturbationFromConfigNumber = function (val) {
        var index = Math.floor(val / this.dummyUpdateValues.length);
        return this.perturbationValues[index];
    };
    return Configuration;
}());
