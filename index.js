const startupDebugger = require('debug')('app:startup');
const dbDebugger = require('debug')('app:db');
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const Joi = require('joi');
const logger = require('./logger');
const devices = require('./routes/devices')
const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/nodepractice').then(console.log('connected to mongodb')).catch(err=>console.log('could not connect to mongodb...!'));
// console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
// console.log(`app: ${app.get('env')}`);
//adding middleware to handle requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet()); //add headers
app.use('/api/devices', devices);

//Configuration
console.log('App name: '+ config.get('name'));
console.log('Mail host: '+ config.get('mail.host'));
// console.log('Mail password: '+ config.get('mail.password')); //remove

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


app.get('/', (req, res) => {
    res.send("Hello world");
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