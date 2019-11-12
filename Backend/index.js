'use strict';
var Hapi = require('hapi');
/**************************UWAGA*********************
 * do poprawnego działania musimy mieć plik boardsList.json w folerze ourDatabase
 * z zawartością startową:             "[]"              */
const server = new Hapi.Server({
    host: 'localhost',
    port: 3001,
    routes: {
        cors: true
    }
})
const mainDataBaseFile ="ourDatabase/boardsList.json";
const dataBaseFolder ="ourDatabase/";
function clearArray(array) {
    while (array.length) {
        array.pop();
    }
}

var handlers = {
    post: function (request, reply) {
        return ('It is wokring');
    },

    getAllBoards: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync(mainDataBaseFile);
        return (content);
    },
    addBoard: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync(mainDataBaseFile);
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
            fs.writeFileSync(mainDataBaseFile, jsonString);
            //dodanie oddzielnego pliku na dane dla tablicy             
            var doPliku = "{\"nazwaTablicy\": \"" + request.payload.boardName + "\",\"kolumny\": []}"
            var fs2 = require('fs');
            fs2.writeFile(dataBaseFolder+request.payload.boardName + ".json", doPliku, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            return ("Dodano tablice: " + request.payload.boardName);
        }
    },
    chooseBoard: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync(mainDataBaseFile);
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
            var dataBoard = fs2.readFileSync(dataBaseFolder+request.payload.boardName + ".json");
            var boardsData = JSON.parse(dataBoard);
            return (boardsData);
        }
        else {

            return ("Podana tablica nie istnieje: " + request.payload.boardName);
        }
    },
    editBoardName: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync(mainDataBaseFile);
        var as = JSON.parse(content);
        var set = new Set();
        as.forEach(element => {
            set.add(element);
        });
        if (set.has(request.payload.oldBoardName)) {
            if (set.has(request.payload.newBoardName)) {
                return("Inna tablica ma taką samę nazwę. \nZmiana nazwy nie została dokonana");
            }
            else {
                clearArray(as);//wyczyszczenie naszje tablicy danych
                set.delete(request.payload.oldBoardName);
                set.add(request.payload.newBoardName)
                set.forEach(e => as.push(e));//dodanie do tablic do zapisu
                const jsonString = JSON.stringify(as)
                fs.writeFileSync(mainDataBaseFile, jsonString);
                //tutaj edycja konkretnego pliku danej tablicy
                var fs2 = require("fs");
                var data = fs2.readFileSync(dataBaseFolder+request.payload.oldBoardName + ".json");
                var as2 = JSON.parse(data);
                as2.nazwaTablicy = request.payload.newBoardName;
                const jsonString2 = JSON.stringify(as2)
                var fs3 = require('fs');
                fs3.writeFile(dataBaseFolder+request.payload.newBoardName + ".json", jsonString2, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                //usuń stary plik
                try {
                    fs2.unlinkSync(dataBaseFolder+request.payload.oldBoardName + ".json")
                    //file removed
                } catch (err) {
                    console.error(err)
                }

                return ("Zmieniono nazwe tablicy: " + request.payload.oldBoardName + " na: " + request.payload.newBoardName);
            }

        }
        else {

            return ("Tablica nie istnieje: " + request.payload.oldBoardName + "\nCzyli nie zmienisz nazwy");
        }
    },
    addColumn: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync(mainDataBaseFile);
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
            var dataBoard = fs2.readFileSync(dataBaseFolder+request.payload.boardName + ".json");
            var as2 = JSON.parse(dataBoard);
            as2['kolumny'].push({ "nazwaKolumny": request.payload.columnName, "listZadan": [] })
            const jsonString = JSON.stringify(as2)
            fs.writeFileSync(dataBaseFolder+request.payload.boardName + ".json", jsonString);
            return (as2);
        }
        else {

            return ("Podana tablica nie istnieje: " + request.payload.boardName);
        }
    }
}



server.route([
    { path: '/', method: 'GET', handler: handlers.post },
    { path: '/getAllBoards', method: 'GET', handler: handlers.getAllBoards },
    { path: '/addBoard', method: 'POST', handler: handlers.addBoard },
    { path: '/chooseBoard', method: 'POST', handler: handlers.chooseBoard },
    { path: '/editBoardName', method: 'POST', handler: handlers.editBoardName },
    { path: '/addColumn', method: 'POST', handler: handlers.addColumn }
]);



//chyba potrzebne
server.start(function () {
    console.log('Server is running');
})