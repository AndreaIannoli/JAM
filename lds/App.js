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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var LDSClientService_1 = require("./LDSClientService");
var LDSReceiver_1 = require("./LDSReceiver");
var readline = require("readline");
var fs = require("fs");
if (process.argv.length !== 3) {
    console.error('Usage: npm start <file-path>');
    process.exit(1);
}
var filePath = process.argv[2];
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
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var configuration;
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
                    return [4 /*yield*/, (0, LDSClientService_1.clientConnection)()
                        //await lamqttClient.publicGeofence(44.49987328047904, 11.350508941159259, 300, "parking", "Via Irnerio-free", clientId);
                        // @ts-ignore
                    ];
                case 2:
                    _a.sent();
                    //await lamqttClient.publicGeofence(44.49987328047904, 11.350508941159259, 300, "parking", "Via Irnerio-free", clientId);
                    // @ts-ignore
                    LDSClientService_1.lamqttClient.setCallback(LDSReceiver_1.LDSReceiver);
                    askForParkingInput(configuration);
                    return [2 /*return*/];
            }
        });
    });
}
start();
function askForParkingInput(configuration) {
    var _this = this;
    rl.question('Take an action as LDS:\n1 - Notify free parking area\n2 - Notify almost full parking area\n3 - Notify full parking area\n', function (choice) { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = choice;
                    switch (_a) {
                        case "1": return [3 /*break*/, 1];
                        case "2": return [3 /*break*/, 3];
                        case "3": return [3 /*break*/, 5];
                    }
                    return [3 /*break*/, 7];
                case 1: return [4 /*yield*/, LDSClientService_1.lamqttClient.publicGeofence(configuration.latCenter, configuration.lngCenter, 300, "parking", configuration.streetName + "-" + configuration.latStart + "-" + configuration.lngStart + "-" + configuration.latEnd + "-" + configuration.lngEnd + "-free", LDSClientService_1.clientId)];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 3: return [4 /*yield*/, LDSClientService_1.lamqttClient.publicGeofence(configuration.latCenter, configuration.lngCenter, 300, "parking", configuration.streetName + "-" + configuration.latStart + "-" + configuration.lngStart + "-" + configuration.latEnd + "-" + configuration.lngEnd + "-almost full", LDSClientService_1.clientId)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, LDSClientService_1.lamqttClient.publicGeofence(configuration.latCenter, configuration.lngCenter, 300, "parking", configuration.streetName + "-" + configuration.latStart + "-" + configuration.lngStart + "-" + configuration.latEnd + "-" + configuration.lngEnd + "-full", LDSClientService_1.clientId)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 8];
                case 7:
                    console.error("Command not found");
                    _b.label = 8;
                case 8:
                    askForParkingInput(configuration);
                    return [2 /*return*/];
            }
        });
    }); });
}
rl.on('SIGINT', function () {
    console.log('\nExiting...');
    rl.close();
    process.exit();
});
