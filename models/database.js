const PG = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);
client.connect();

const query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', function() { client.end(); });
