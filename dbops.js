const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodepractice')
    .then(console.log('connected to mongodb'))
    .catch(err => console.log('could not connect to mongodb...!'));

const deviceSchema = mongoose.Schema({
    serialNumber: String,
    deviceName: String,
    deviceType: String,
    deviceModel: Number
})

const Device = mongoose.model('Device', deviceSchema);

// async function createDevice() {
//     const device = new Device({
//         serialNumber: "SN123456789",
//         deviceName: "Water Flow Meter",
//         deviceType: "Water Flow Meter",
//         deviceModel: 40
//     })
//     const result = await device.save();
//     console.log(result);
// }

async function getDevices() {
    const devices = await Device.find({ deviceName: "Water Flow Meter" });
    console.log(devices);
}

getDevices();
// createDevice();