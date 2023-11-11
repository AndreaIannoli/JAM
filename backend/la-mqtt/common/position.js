"use strict";
exports.__esModule = true;
exports.Position = void 0;
var Position = /** @class */ (function () {
    function Position(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
    Position.prototype.toString = function () {
        var result = "\"latitude\": " + this.latitude + ", \"longitude\": " + this.longitude;
        return result;
    };
    return Position;
}());
exports.Position = Position;
