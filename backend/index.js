"use strict";

/*var express = require('express');

const UIServer = http.createServer((req, res) => {});
UIServer.listen(8000, () => {});
/*app = express(); 
app.use('/', express.static(__dirname + '/'));
app.listen(8080);*/

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'UI';

const express = require('express')
const app = express();
app.use(express.urlencoded());
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/progressBarProgress', (req, res) => {
  debugger;
  res.sendStatus(200);
});

var atomicTokenAddtions = {};
app.post('/addAtomicToken', (req, res) => {
  var identity = req.body.identity;
  atomicTokenAddtions[identity] = "0.1"; // TODO: Change with some real value at some point!

  res.send(200);
});

app.get("/atomicTokenAddition", (req, res) => {
  var identity = req.body.identity;
  var valueToReturn = atomicTokenAddtions[identity];
  delete atomicTokenAddtions[identity]; // To avoid resending it!

  if (valueToReturn != undefined){
    res.send(valueToReturn);
  } else {
    res.send(0);
  }
});

app.listen(port, () => console.log(`REST server listening on port ${port}!`))

// Port where we'll run the websocket server
var unityWebSocketServerPort = 1337;
var uiWebSocketServerPort = 1336;

// websocket and http servers
var webSocketServer = require('websocket').server;

/**
 * HTTP server
 */
var http = require('http');

var unityServer = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
unityServer.listen(unityWebSocketServerPort, function() {
  console.log((new Date()) + " Unity server is listening on port "
      + unityWebSocketServerPort);
});

var uiServer = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
uiServer.listen(uiWebSocketServerPort, function() {
  console.log((new Date()) + " UI server is listening on port "
      + uiWebSocketServerPort);
});

/**
 * WebSocket server
 */
var unityWebSocketServer = new webSocketServer({
  // WebSocket server is tied to a HTTP server. WebSocket
  // request is just an enhanced HTTP request. For more info 
  // http://tools.ietf.org/html/rfc6455#page-6
  httpServer: unityServer
});

var uiWebSocketSerer = new webSocketServer({
  httpServer:uiServer
});

var connectionToUnity;
var connectionToUI;

uiWebSocketSerer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');

  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  connectionToUI = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event

  console.log((new Date()) + ' Connection accepted.');

  // user disconnected
  connectionToUI.on('close', function (connection) {
    console.log((new Date()) + " Peer "
      + connection.remoteAddress + " disconnected.");
  });
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
unityWebSocketServer.on('request', function(request) {
  console.log((new Date()) + ' Connection from origin '
      + request.origin + '.');

  // accept connection - you should check 'request.origin' to
  // make sure that client is connecting from your website
  // (http://en.wikipedia.org/wiki/Same_origin_policy)
  connectionToUnity = request.accept(null, request.origin); 
  // we need to know client index to remove them on 'close' event

  console.log((new Date()) + ' Connection accepted.');

  // user sent some message
  connectionToUnity.on('message', function (message) {
    if (message.type === 'binary') {
      var messageData = message.binaryData;
      var stringMessageData = JSON.parse(messageData.toString());

      if (stringMessageData.type == "IdentityUpdate"){
        console.log("Received the following identity update: " + stringMessageData.identity);
      }

      connectionToUnity.sendUTF("Your message type was: " + message.type);
      if (connectionToUI != undefined){
        connectionToUI.sendUTF(JSON.stringify(stringMessageData));
      }
    }

    // We assume UTF8 data is debug data!
    if (message.type == "utf8"){
      connectionToUI.sendUTF(message.utf8Data);
    }
  });

  // user disconnected
  connectionToUnity.on('close', function (connection) {
    console.log((new Date()) + " Peer "
      + connection.remoteAddress + " disconnected.");
  });
});