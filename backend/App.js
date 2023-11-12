"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.clientConnection = void 0;
var backend_1 = require("./la-mqtt/backend/backend");
var fs = require("fs");
if (process.argv.length !== 4) {
    console.error('Usage: npm start <broker-address> <backend-conf-path>');
    process.exit(1);
}
else if (!process.argv[2].split(':')[1]) {
    console.error('You must specify the port in the address');
    process.exit(1);
}
var brokerAddress = process.argv[2];
var filePath = process.argv[3];
function readFileAsJSON(filePath) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filePath, 'utf8', function (err, data) {
            if (err) {
                reject(err);
                return;
            }
            try {
                var jsonContent = JSON.parse(data);
                resolve(jsonContent);
            }
            catch (error) {
                reject(error);
            }
        });
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var configuration, lamqttBackEnd;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (function () { return __awaiter(_this, void 0, void 0, function () {
                        var jsonContent, error_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, readFileAsJSON(filePath)];
                                case 1:
                                    jsonContent = _a.sent();
                                    console.log(jsonContent);
                                    return [2 /*return*/, jsonContent];
                                case 2:
                                    error_1 = _a.sent();
                                    console.error('Error:', error_1);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })()];
                case 1:
                    configuration = _a.sent();
                    lamqttBackEnd = new backend_1.SpatialMQTTBackEnd('', '', brokerAddress.split(':')[0], parseInt(brokerAddress.split(':')[1]), configuration);
                    return [4 /*yield*/, clientConnection(lamqttBackEnd)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
start();
function clientConnection(lamqttBackEnd) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, lamqttBackEnd.start()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.clientConnection = clientConnection;
