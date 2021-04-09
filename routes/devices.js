const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send(devices);
});

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

router.get('/:serialNumber', (req, res) => {
    const device = devices.find(c => c.serialNumber === parseInt(req.params.serialNumber));
    if (!device) {
        res.status(404).send('Device not found');
        return;
    } else {
        res.send(device);
    }
})

router.post('/', (req, res) => {
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

router.put('/:serialNumber', (req, res) => {
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

router.delete('/:serialNumber', (req, res) => {
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

module.exports = router;