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

var goodPlugin = {
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
};

var plugins = [
    require('hapi-heroku-helpers'),
    goodPlugin
];

// Start server
server.register(plugins, function (err) {
  if (err) {
     throw err;
  }

  server.start(function (err) {
    if (err) {
       throw err;
    }

    console.log('Server running at:', server.info.uri);
  });
});
