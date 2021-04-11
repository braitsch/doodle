
/**
 * Node.js Doodle Server
 * Author :: Stephen Braitsch
 */

const express = require('@braitsch/express');

const app = express();

express.log('./logs');

const server = express.http(app);

global.io = require('socket.io')(server);

express.init(__dirname, app);

express.start(app);