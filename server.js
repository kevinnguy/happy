'use strict';

const Hapi = require('hapi');
const Good = require('good');


// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ port: process.env.PORT || 8000 });

// Add the route
server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {

        return reply('hello world');
    }
});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});

// Start the server
// server.register({
//     register: Good,
//     options: {
//         reporters: {
//             console: [{
//                 module: 'good-squeeze',
//                 name: 'Squeeze',
//                 args: [{
//                     response: '*',
//                     log: '*'
//                 }]
//             }, {
//                 module: 'good-console'
//             }, 'stdout']
//         }
//     }
// }, (err) => {
//
//     if (err) {
//         throw err; // something bad happened loading the plugin
//     }
//
//     server.start((err) => {
//
//         if (err) {
//            throw err;
//         }
//         server.log('info', 'Server running at: ' + server.info.uri);
//     });
// });

server.register(require('hapi-heroku-helpers'), function (err) {

    // Assuming no err, start server
    server.start(function () {
      console.log('Server running at:', server.info.uri);
    });
});
