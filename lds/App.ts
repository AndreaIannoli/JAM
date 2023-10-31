import {clientConnection, clientId, lamqttClient} from "./LDSClientService";
import {LDSReceiver} from "./LDSReceiver";
import * as readline from "readline";

import fs = require('fs');
import path = require('path');

if (process.argv.length !== 3) {
    console.error('Usage: npm start <file-path>');
    process.exit(1);
}

const filePath = process.argv[2];

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


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
    await clientConnection()

    //await lamqttClient.publicGeofence(44.49987328047904, 11.350508941159259, 300, "parking", "Via Irnerio-free", clientId);
    // @ts-ignore
    lamqttClient.setCallback(LDSReceiver);
    askForParkingInput(configuration)
}
start();

function askForParkingInput(configuration) {
    rl.question('Take an action as LDS:\n1 - Notify free parking area\n2 - Notify almost full parking area\n3 - Notify full parking area\n', async (choice) => {
        switch(choice) {
            case "1":
                await lamqttClient.publicGeofence(configuration.latCenter, configuration.lngCenter, 300, "parking", configuration.streetName + "-" + configuration.latStart + "-" + configuration.lngStart + "-" + configuration.latEnd + "-" + configuration.lngEnd + "-free", clientId);
                break;
            case "2":
                await lamqttClient.publicGeofence(configuration.latCenter, configuration.lngCenter, 300, "parking", configuration.streetName + "-" + configuration.latStart + "-" + configuration.lngStart + "-" + configuration.latEnd + "-" + configuration.lngEnd + "-almost full", clientId);
                break;
            case "3":
                await lamqttClient.publicGeofence(configuration.latCenter, configuration.lngCenter, 300, "parking", configuration.streetName + "-" + configuration.latStart + "-" + configuration.lngStart + "-" + configuration.latEnd + "-" + configuration.lngEnd + "-full", clientId);
                break;
            default:
                console.error("Command not found");
        }
        askForParkingInput(configuration);
    })
}

rl.on('SIGINT', () => {
    console.log('\nExiting...');
    rl.close();
    process.exit();
});
