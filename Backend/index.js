'use strict';
var Hapi = require('hapi');

const server = new Hapi.Server({ 
    host: 'localhost',
    port: 3001,
    routes:{
        cors: true
    }
  
    
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
       
        console.log("COS PRZYSZŁO: "+request.payload.boardName);
        var set = new Set();
        as.forEach(element => {
            set.add(element);
        });
        if(set.has(request.payload.boardName))
        {
            return("Tablica istnieje");
        }
        else{
            as.push(request.payload.boardName);//dodajemy nowy element do jsona
            const jsonString = JSON.stringify(as)
            fs.writeFileSync("boardsList.json",jsonString);
            return ("Dodano tablice: "+request.payload.boardName);
        }
      
      
        
    }
})
server.route({
    method:"POST",
    path:"/chooseBoard",
    handler: function(request,reply){
        var fs = require("fs");
        var content = fs.readFileSync("boardsList.json");
        //znajdź odpowidnią tablice 
      
        return("ZWRACANA TABLICA I JEJ KLMNY I WGL ");//do implemtanacji
    }
})




server.start(function(){
    console.log('Server is running');
})