const dotenv = require('dotenv')
const express = require('express');


//files outside the app.js
const errorHendler = require('./middlewares/errors');

//assert, path - its native module - do not exists npm i assert
const assert = require('assert');
const path = require('path');

//set the .env file configuration
dotenv.config({
    path: '.env'
});



//create app with exprress the most important!!
const app = express();

//static files - use for app its called middlewares
app.use(express.static(path.join(__dirname, 'public')));


//add 404 page at the and (Middleware - outside)
app.use(errorHendler.notFound);
//catch any error in the system
app.use(errorHendler.catchErrors);




//exprot the app for other files
module.exports = {
    app
}