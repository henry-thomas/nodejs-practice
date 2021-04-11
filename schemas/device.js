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
const device = new Device({
    serialNumber: "SN894396511",
    deviceName: "SMA Energy Meter",
    deviceType: "Energy Meter",
    deviceModel: 30
})