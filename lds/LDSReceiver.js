"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LDSReceiver = void 0;
var LDSReceiver = /** @class */ (function () {
    function LDSReceiver() {
    }
    LDSReceiver.prototype.messageRecv = function (message) {
        console.log(message.getContent());
    };
    return LDSReceiver;
}());
exports.LDSReceiver = LDSReceiver;
