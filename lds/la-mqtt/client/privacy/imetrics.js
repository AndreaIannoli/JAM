"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacySet = void 0;
var PrivacySet = /** @class */ (function () {
    function PrivacySet() {
        this.dummySet = new Array();
    }
    PrivacySet.prototype.add = function (pos) {
        this.dummySet.push(pos);
    };
    PrivacySet.NO_METRIC_VALUE = -1;
    return PrivacySet;
}());
exports.PrivacySet = PrivacySet;
