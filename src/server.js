'use strict';

const Hapi = require('hapi');
const Good = require('good');
const PG = require('pg');

// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ port: process.env.PORT });

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

server.route({
    method: 'GET',
    path: '/task/{name}',
    handler: function (request, reply) {
      PG.connect(process.env.DATABASE_URL, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
        }

        // SQL Query > Insert Data
        client.query("INSERT INTO items(text, complete) values($1, $2)", [request.params.name, true]);

        const query = client.query("SELECT * FROM items ORDER BY id ASC");
        query.on('end', function() {
            done();
            reply('You\'ve created a task called: ' + encodeURIComponent(request.params.name));
        });
      });
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
