"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerConf = void 0;
var BrokerConf = /** @class */ (function () {
    function BrokerConf(username, password, url, port, id) {
        this.username = username;
        this.password = password;
        this.url = url;
        this.port = port;
        this.id = id;
    }
    return BrokerConf;
}());
exports.BrokerConf = BrokerConf;
