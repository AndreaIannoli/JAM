"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RNG = void 0;
var RNG = /** @class */ (function () {
    function RNG(seed) {
        this.seed = seed;
    }
    RNG.prototype.getSeed = function () {
        return this.seed;
    };
    RNG.prototype.next = function (min, max) {
        max = max || 0;
        min = min || 0;
        this.seed = (this.seed * 9301 + 49297) % 233280;
        var rnd = this.seed / 233281;
        return min + rnd * (max - min);
    };
    RNG.prototype.nextInt = function (min, max) {
        return Math.floor(this.next(min, max));
    };
    RNG.prototype.nextDouble = function () {
        return this.next(0, 1);
    };
    RNG.prototype.pick = function (collection) {
        return collection[this.nextInt(0, collection.length - 1)];
    };
    return RNG;
}());
exports.RNG = RNG;
