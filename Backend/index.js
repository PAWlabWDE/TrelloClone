'use strict';
var Hapi = require('hapi');

const server = new Hapi.Server({  
    host: 'localhost',
    port: 3000
  })


server.route({
    method: 'GET',
    path: '/',
    handler: function(request,reply){
        return('It is wokring');
    }
});

server.start(function(){
    console.log('Server is running');
})