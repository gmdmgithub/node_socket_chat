# Simple chat application with node.js express and mongodb

## Form mongodb using MongoDB driver - for improvement it's planed to use mongoose

https://github.com/mongodb/node-mongodb-native

## install most important pacages at start

```node
$ npm i mongodb express socket.io dotenv
```

## read variable from .env file

```node
const dotenv = require("dotenv");
dotenv.config({
  path: ".env"
});
```

## Working with socket - example

```node
socket.on("action", data => {
  let something = data.something;
  if (something == "strange") socket.emit("do_something");
  //emit to consumer
  else {
    const collection = db.collection("documents");
    // Find some documents
    collection.find({}).toArray(function(err, docs) {
      assert.equal(err, null);
      console.log("Found the following records");
      socket.emit("do_something_else", docs);
    });
  }
});
```
