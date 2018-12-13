"use strict";

/*var express = require('express');

const UIServer = http.createServer((req, res) => {});
UIServer.listen(8000, () => {});
/*app = express(); 
app.use('/', express.static(__dirname + '/'));
app.listen(8080);*/

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'UI';

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
    //connectionToUnity.sendUTF("Heej fra server!");
    if (message.type === 'binary') {
      var messageData = message.binaryData;
      var stringMessageData = JSON.parse(messageData.toString());

      console.log(stringMessageData);
      connectionToUnity.sendUTF("Your message type was: " + message.type);
      if (connectionToUI != undefined){
        connectionToUI.sendUTF(JSON.stringify(stringMessageData));
      }
    }
  });

  // user disconnected
  connectionToUnity.on('close', function (connection) {
    console.log((new Date()) + " Peer "
      + connection.remoteAddress + " disconnected.");
  });
});