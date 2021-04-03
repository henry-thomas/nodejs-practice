const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const express = require('express');
const app = express();

// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);
//adding middleware to handle requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet()); //add headers

//Configuration
console.log('App name: '+ config.get('name'));
console.log('Mail host: '+ config.get('mail.host'));
console.log('Mail password: '+ config.get('mail.password')); //remove

if (app.get('env') === 'development') {
    app.use(morgan('tiny')); //logging requests in console (or log file).
    startupDebugger('morgan enabled...')
}
app.use(logger);

//Dbwork...
dbDebugger('connected to the database');

app.use(function (req, res, next) {
    console.log('Authenticating...');
    next();
})
//
const devices = [
    {
        serialNumber: 1,
        deviceName: 'SMA Energy Meter'
    },
    {
        serialNumber: 2,
        deviceName: 'Water Meter'
    },
    {
        serialNumber: 3,
        deviceName: 'Relay'
    }
];

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.get('/api/devices', (req, res) => {
    res.send(devices);
});

app.get('/api/devices/:serialNumber', (req, res) => {
    const device = devices.find(c => c.serialNumber === parseInt(req.params.serialNumber));
    if (!device) {
        res.status(404).send('Device not found');
        return;
    } else {
        res.send(device);
    }
})

app.post('/api/devices', (req, res) => {
    const result = validateDevice(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return
    }

    const device = {
        serialNumber: devices.length + 1,
        deviceName: req.body.deviceName
    };

    devices.push(device);
    res.send(device);
});

app.put('/api/devices/:serialNumber', (req, res) => {
    const device = devices.find(c => c.serialNumber === parseInt(req.params.serialNumber));
    if (!device) {
        res.status(404).send('Device not found');
        return;
    } else {
        res.send(device);
    }
    const result = validateDevice(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return
    }

    device.deviceName = req.body.deviceName;
    res.send(device);
});

app.delete('/api/devices/:serialNumber', (req, res) => {
    const device = devices.find(c => c.serialNumber === parseInt(req.params.serialNumber));
    if (!device) {
        res.status(404).send('Device not found');
        return;
    } else {
        res.send(device);
    }

    const idx = devices.indexOf(device);
    devices.splice(idx, 1);

    res.send(device);
});

function validateDevice(device) {
    const schema = {
        deviceName: Joi.string().min(3).required(),
    }

    return schema.deviceName.validate(device.deviceName, schema);
}

// PORT
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});