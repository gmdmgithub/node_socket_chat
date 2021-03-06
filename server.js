//server file to create server
const app = require('./app').app;
const socket = require('socket.io');
const http = require('http');

const MongoClient = require('mongodb').MongoClient;
//assert, path - its native module - do not exists npm i assert
const assert = require('assert');

const db_test = require('./test/db_test')

//take the port from env properties
app.set('port', process.env.PORT || 4000);


//create server with express
const server = http.createServer(app);
const io = socket(server);

// io.on('connection', (socket) => {
//     socket.emit('request', /* … */); // emit an event to the socket
//     io.emit('broadcast', /* … */); // emit an event to all connected sockets
//     socket.on('reply', () => { /* … */ }); // listen to the event
//   });



MongoClient.connect(process.env.DB_URL, (err, client) => {

    assert.strictEqual(null, err);

    const db = client.db(process.env.DB_NAME);

    //just for tessting
    //db_test.insertDocuments(db, () => {});
    db_test.findDocuments(db, (result) => {
        console.log('RESUTLS FROM find:', result);

    });

    //connect from the client and perform the acktion
    io.on('connection', (socket) => {

        const chat = db.collection('chats');
        console.log(socket.id);

        // Create function to send status
        sendStatus = status => {
            socket.emit('status', status);
        }

        // Get chats from mongo collection
        chat.find().limit(100).sort({
            _id: 1
        }).toArray((err, res) => {
            if (err) {
                throw err;
            }

            // Emit the messages
            socket.emit('output', res);
        });

        // Handle input events
        socket.on('input', data => {
            let name = data.name;
            let message = data.message;
            console.log(socket.id);


            // Check for name and message - if message and name is blank
            if (name == '' || message == '') {
                // Send error status
                sendStatus('Please enter a name and message');
            } else {
                // Insert message
                chat.insertOne({
                    name: name,
                    message: message,
                    chatId: socket.id
                }, () => {

                    //console.log('output', data);
                    socket.emit('output', [data]);
                    socket.broadcast.emit('output', [data]);

                    // Send status object
                    sendStatus({
                        message: 'Message sent and update',
                        clear: true
                    });
                });
            }
        });

        // Handle clear
        socket.on('clear', (data) => {
            // Remove all chats from collection
            chat.remove({}, function () {
                // Emit cleared
                socket.emit('cleared');
            });
        });


    });

});

//now we listen on the port and start it!
server.listen(app.get('port'), () => {
    console.log(`App listening on port ${server.address().port}`);
});