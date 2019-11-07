'use strict';
var Hapi = require('hapi');

const server = new Hapi.Server({  
    host: 'localhost',
    port: 3001  
  })

server.route({
    method: 'GET',
    path: '/',
    handler: function(request,reply){
        return('It is wokring');
    }
});
server.route({
    method:"GET",
    path:"/getAllBoards",
    handler: function(request,reply){
        var fs = require("fs");    
        var content = fs.readFileSync("boardsList.json");  
        return(content);
    }
});
server.route({
    method:"POST",
    path:"/addBoard",
    handler: function(request,reply){
        var fs = require("fs");
        var content = fs.readFileSync("boardsList.json");
        var as = JSON.parse(content);
        as.push("piaty");//dodajemy nowy element do jsona
        const jsonString = JSON.stringify(as)
        fs.writeFileSync("boardsList.json",jsonString);
        console.log(as);
        console.log("Output Content : \n"+ content);
        console.log("\n *EXIT* \n");  
        return(as);
    }
})



server.start(function(){
    console.log('Server is running');
})