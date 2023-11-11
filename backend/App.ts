import {SpatialMQTTBackEnd} from "./la-mqtt/backend/backend";
import fs = require('fs');

if (process.argv.length !== 4) {
    console.error('Usage: npm start <broker-address> <backend-conf-path>');
    process.exit(1);
} else if(!process.argv[2].split(':')[1]) {
    console.error('You must specify the port in the address');
    process.exit(1);
}

const brokerAddress = process.argv[2];

const filePath = process.argv[3];

function readFileAsJSON(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }

            try {
                const jsonContent = JSON.parse(data);
                resolve(jsonContent);
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function start() {
    const configuration = await (async () => {
        try {
            const jsonContent = await readFileAsJSON(filePath);
            console.log(jsonContent);
            return jsonContent;
        } catch (error) {
            console.error('Error:', error);
        }
    })();
    const lamqttBackEnd = new SpatialMQTTBackEnd('', '', brokerAddress.split(':')[0], parseInt(brokerAddress.split(':')[1]), configuration);
    await clientConnection(lamqttBackEnd);
}
start();



export async function clientConnection(lamqttBackEnd) {
    await lamqttBackEnd.start();
}


