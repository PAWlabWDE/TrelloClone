'use strict';
var Hapi = require('hapi');

const server = new Hapi.Server({
    host: 'localhost',
    port: 3001,
    routes: {
        cors: true
    }
})

//zwykły test
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        return ('It is wokring');
    }
});
//pobierz wszytkie tablice
server.route({
    method: "GET",
    path: "/getAllBoards",
    handler: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync("boardsList.json");
        return (content);
    }
});
//dodaj nowa tablicę
server.route({
    method: "POST",
    path: "/addBoard",
    handler: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync("boardsList.json");
        var as = JSON.parse(content);

        console.log("COS PRZYSZŁO: " + request.payload.boardName);
        var set = new Set();
        as.forEach(element => {
            set.add(element);
        });
        if (set.has(request.payload.boardName)) {
            return ("Tablica istnieje");
        }
        else {
            as.push(request.payload.boardName);//dodajemy nowy element do jsona
            const jsonString = JSON.stringify(as)
            fs.writeFileSync("boardsList.json", jsonString);
            //dodanie oddzielnego pliku na dane dla tablicy
            var fs2 = require('fs');
            fs2.writeFile(request.payload.boardName+".json", "", function (err) {
                if (err) {
                    console.log(err);
                }
            });
            return ("Dodano tablice: " + request.payload.boardName);
        }



    }
})
//wybierz konkretną tablicę i uzysaj jej kolumny i zadania
server.route({
    method: "POST",
    path: "/chooseBoard",
    handler: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync("boardsList.json");
        //znajdź odpowidnią tablice 
        var as = JSON.parse(content);
        var set = new Set();
        as.forEach(element => {
            set.add(element);
        });
        if (set.has(request.payload.boardName)) {
            //tablica istnieje czyli zwracamy jej kolumny
            //odczyt z pliku danych o tablicy
            var fs2 = require("fs");
            var dataBoard = fs2.readFileSync(request.payload.boardName+".json");
            var boardsData=JSON.parse(dataBoard);
            return (boardsData);
        }
        else {

            return ("Podana tablica nie istnieje: " + request.payload.boardName);
        }


    }
})



//chyba potrzebne
server.start(function () {
    console.log('Server is running');
})