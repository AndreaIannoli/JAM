"use strict";
exports.__esModule = true;
exports.MQTTMessage = void 0;
var position_1 = require("./position");
var MQTTMessage = /** @class */ (function () {
    function MQTTMessage(topic, message) {
        this.topic = topic;
        this.message = message;
    }
    MQTTMessage.prototype.getPositionFromMessage = function () {
        var jsonOb = JSON.parse(String(this.message));
        var pos = new position_1.Position(jsonOb["latitude"], jsonOb["longitude"]);
        return pos;
    };
    MQTTMessage.prototype.getContent = function () {
        var jsonOb = JSON.parse(String(this.message));
        return jsonOb["message"];
    };
    return MQTTMessage;
}());
exports.MQTTMessage = MQTTMessage;
