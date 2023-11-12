"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MQTTClientMeasurer = void 0;
var direction_1 = require("../common/direction");
var imetrics_1 = require("./privacy/imetrics");
var MQTTClientMeasurer = /** @class */ (function () {
    function MQTTClientMeasurer() {
        this.numPublishSent = 0;
        this.numNotificationRecv = 0;
        this.numNotificationRelevant = 0;
        this.spatialAccuracy = 0;
        this.cPosition = undefined;
        this.numNotificationRecvPerSlot = 0;
        this.numNotificationRelevantPerSlot = 0;
        this.spatialAccuracyPerSlot = 0;
        this.privacyPerSlot = 0;
        this.numPrivacySamples = 0;
        this.pManager = undefined;
    }
    MQTTClientMeasurer.prototype.setPrivacyModel = function (pm) {
        this.pManager = pm;
    };
    MQTTClientMeasurer.prototype.messageRecv = function (message) {
        this.numNotificationRecv += 1;
        this.numNotificationRecvPerSlot += 1;
        var posGf = message.getPositionFromMessage();
        if (this.cPosition != undefined) {
            var distance = direction_1.Direction.computeDistanceGPS(posGf.latitude, posGf.longitude, this.cPosition.latitude, this.cPosition.longitude);
            if (distance < MQTTClientMeasurer.RELEVANCE_DISTANCE) {
                this.numNotificationRelevant += 1;
                this.numNotificationRelevantPerSlot += 1;
                this.spatialAccuracy = (this.numNotificationRelevant * 1.0) / this.numNotificationRecv;
                this.spatialAccuracyPerSlot = (this.numNotificationRelevantPerSlot * 1.0) / this.numNotificationRecvPerSlot;
            }
        }
    };
    MQTTClientMeasurer.prototype.trackGPSPublish = function (cPos) {
        this.numPublishSent += 1;
        this.cPosition = cPos;
        if (this.pManager != null)
            this.updatePrivacyPerSlot();
    };
    MQTTClientMeasurer.prototype.trackGeofencePublish = function () {
        this.numPublishSent += 1;
    };
    MQTTClientMeasurer.prototype.getNumberPublishSent = function () {
        return this.numPublishSent;
    };
    MQTTClientMeasurer.prototype.getNumberNotificationRecv = function () {
        return this.numNotificationRecv;
    };
    MQTTClientMeasurer.prototype.getSpatialAccuracy = function () {
        return this.spatialAccuracy;
    };
    MQTTClientMeasurer.prototype.getNumberNotificationRecvPerSlot = function () {
        return this.numNotificationRecvPerSlot;
    };
    MQTTClientMeasurer.prototype.getSpatialAccuracyPerSlot = function () {
        if (this.numNotificationRecvPerSlot > 0)
            return this.spatialAccuracyPerSlot;
        else
            return MQTTClientMeasurer.DEFAULT_SPATIAL_ACCURACY;
    };
    MQTTClientMeasurer.prototype.getPrivacyPerSlot = function () {
        if (this.numPrivacySamples > 0)
            return this.privacyPerSlot / this.numPrivacySamples;
        else
            return imetrics_1.PrivacySet.NO_METRIC_VALUE;
    };
    MQTTClientMeasurer.prototype.updatePrivacyPerSlot = function () {
        var value = this.pManager.getPrivacyMetricValue();
        if (value != imetrics_1.PrivacySet.NO_METRIC_VALUE) {
            this.privacyPerSlot += value;
            this.numPrivacySamples += 1;
        }
    };
    MQTTClientMeasurer.prototype.getIstantaneousPrivacyMetric = function () {
        if (this.pManager != undefined)
            return this.pManager.getPrivacyMetricValue();
        else
            return imetrics_1.PrivacySet.NO_METRIC_VALUE;
    };
    MQTTClientMeasurer.prototype.resetLatest = function () {
        this.numNotificationRecvPerSlot = 0;
        this.spatialAccuracyPerSlot = 0;
        this.numNotificationRelevantPerSlot = 0;
        this.privacyPerSlot = 0;
        this.numPrivacySamples = 0;
    };
    MQTTClientMeasurer.RELEVANCE_DISTANCE = 300.0;
    MQTTClientMeasurer.DEFAULT_SPATIAL_ACCURACY = 0.30;
    return MQTTClientMeasurer;
}());
exports.MQTTClientMeasurer = MQTTClientMeasurer;
