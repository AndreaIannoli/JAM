"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyModel = void 0;
var PrivacyModel;
(function (PrivacyModel) {
    PrivacyModel[PrivacyModel["NONE"] = 0] = "NONE";
    PrivacyModel[PrivacyModel["PERTURBATION"] = 1] = "PERTURBATION";
    PrivacyModel[PrivacyModel["DUMMY_UPDATES"] = 2] = "DUMMY_UPDATES";
    PrivacyModel[PrivacyModel["DUMMY_UPDATES_WITH_PERCOLATION"] = 3] = "DUMMY_UPDATES_WITH_PERCOLATION";
})(PrivacyModel || (exports.PrivacyModel = PrivacyModel = {}));
