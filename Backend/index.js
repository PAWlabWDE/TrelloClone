'use strict';
var Hapi = require('hapi');
const MySQL = require('mysql');

const server = new Hapi.Server({  
    host: 'localhost',
    port: 3000
  })

  
const connection = MySQL.createConnection({
    connectionLimit : 100,
    host: 'sql.teatr-fenixa.nazwa.pl',
    user: 'teatr-fenix_PAW-DataBase',
    password: '69696969xD',
    database: 'teatr-fenix_PAW-DataBase',
    //user: 'teatr-fenix_PKI',
    //password: 'Qwerty12345',
    //database:'teatr-fenix_PKI',
    port: 3306
});


server.route({
    method: 'GET',
    path: '/',
    handler: function(request,reply){
        return('It is wokring');
    }
});
server.route({
    method: 'GET',
    path: '/conect',
    handler: function(request,reply){
    
        connection.connect(function(err) {
          if (err) {
            return console.error('error: ' + err.message+err.stack);
          }         
          console.log('Connected to the MySQL server.');
        });
        connection.query('CREATE TABLE [IF NOT EXISTS] Column(column_id INT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(255) NOT NULL);')
        connection.query('select table_schema as database_name, table_name from information_schema.tables');
        return "Polaczylem sie lub nie xddd";
    }
});

server.start(function(){
    console.log('Server is running');
})