const express = require('express');
const app = express();

app.get('/ping', (req, res) => {
    res.send('pong');
    });

 //Defines a route for HTTP GET requests to the path /ping.
//When a client sends a GET request to /ping, the server responds with the text "pong".

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    });
//Starts the server and listens for incoming connections on port 3000.
//Logs a message to the console indicating that the server is running.