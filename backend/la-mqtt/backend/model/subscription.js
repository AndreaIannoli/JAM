"use strict";
exports.__esModule = true;
exports.Subscription = void 0;
var mongoose_1 = require("mongoose");
var SubscriptionSchema = new mongoose_1.Schema({
    clientId: { type: String, required: true },
    topic: { type: String, required: true }
});
exports.Subscription = mongoose_1.model('Subscription', SubscriptionSchema);
