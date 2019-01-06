//server file to create server
const app = require('./app');



//take the port from env properties
app.set('port', process.env.PORT || 8080);

//now we listen on the port and start it!
const server = app.listen(app.get('port'), () => {
    console.log(`App listening on port ${server.address().port}`);
});