const dotenv = require('dotenv')
const express = require('express');
const socket_io = require('socket.io').listen(4000).sockets;
const MongoClient = require('mongodb').MongoClient;

//files outside the app.js
const errorHendler = require('./middlewares/errors');
const db_test = require('./test/db_test')

//assert, path - its native module - do not exists npm i assert
const assert = require('assert');
const path = require('path');

//set the .env file configuration
dotenv.config({
    path: '.env'
});



// Use connect method to connect to the server
const db = MongoClient.connect(process.env.DB_URL, (err, client) => {
    assert.equal(null, err);
    console.log("Connected successfully to db server");
    const db = client.db(process.env.DB_NAME);

    //just for tessting
    //db_test.insertDocuments(db, () => {});
    db_test.findDocuments(db, (result) => {
        console.log('RESUTLS FROM find:', result);

    });

    return db
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
    app,
    db
}