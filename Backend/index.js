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
            //dodanie oddzielnego pliku na dane dla tablicy             //TODO trzeba jeszcze do jsona zapisać odpowiendie dane, bo na razie SSIE xd
            var doPliku="{\"nazwaTablicy\": \""+request.payload.boardName+"\",\"kolumny\": []}"
            var fs2 = require('fs');
            fs2.writeFile(request.payload.boardName+".json", doPliku, function (err) {
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
function clearArray(array) {
    while (array.length) {
      array.pop();
    }
  }
//edytuj nazwe tablicy  //2 paramtery newBoardName, oldBoardName
server.route({
    method: "POST",
    path: "/editBoardName",
    handler: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync("boardsList.json");
        var as = JSON.parse(content);
        var set = new Set();
        as.forEach(element => {
            set.add(element);
        });
        if (set.has(request.payload.oldBoardName)) {
            clearArray(as);//wyczyszczenie naszje tablicy danych
            set.delete(request.payload.oldBoardName);
            set.add(request.payload.newBoardName)
            set.forEach(e=>as.push(e));//dodanie do tablic do zapisu
            const jsonString = JSON.stringify(as)
            fs.writeFileSync("boardsList.json", jsonString);
            //tutaj edycja konkretnego pliku danej tablicy
            var fs2 = require("fs");
            var data = fs2.readFileSync(request.payload.oldBoardName+".json");
            var as2 = JSON.parse(data);
            as2.nazwaTablicy = request.payload.newBoardName;
            const jsonString2 = JSON.stringify(as2)
            var fs3 = require('fs');
            fs3.writeFile(request.payload.newBoardName+".json", jsonString2, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            //usuń stary plik
            try {
                fs2.unlinkSync(request.payload.oldBoardName+".json")
                //file removed
              } catch(err) {
                console.error(err)
              }

            return ("Zmieniono nazwe tablicy: "+request.payload.oldBoardName+" na: "+request.payload.newBoardName);
        }
        else {
         
            return ("Tablica nie istnieje: " + request.payload.boardName+"\nCzyli nie zmienisz nazwy");
        }



    }
})
//dodanie nowej kolumny //2 parametry boardName, columnName
server.route({
    method: "POST",
    path: "/addColumn",
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
            var as2 = JSON.parse(dataBoard);
            console.log(as2);
            as2['kolumny'].push({ "nazwaKolumny": request.payload.columnName,"listZadan": []})
            const jsonString = JSON.stringify(as2)
            fs.writeFileSync(request.payload.boardName+".json", jsonString);
            return (as2);
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