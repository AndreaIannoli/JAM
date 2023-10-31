"use strict";
exports.__esModule = true;
exports.Geofence = void 0;
var mongoose_1 = require("mongoose");
var GeofenceSchema = new mongoose_1.Schema({
    topic: { type: String, required: true },
    id: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    radius: { type: Number, required: true },
    message: { type: String, required: true }
});
exports.Geofence = mongoose_1.model('Geofence', GeofenceSchema);
