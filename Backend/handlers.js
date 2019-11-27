'use strict';
const peopleDataFile = "ourDatabase/people.json";
const mainDataBaseFile = "ourDatabase/boardsList.json";
const dataBaseFolder = "ourDatabase/";
function clearArray(array) {
    while (array.length) {
        array.pop();
    }
}

const handlers = {
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
            fs2.writeFile(dataBaseFolder + request.payload.boardName + ".json", doPliku, function (err) {
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
            var dataBoard = fs2.readFileSync(dataBaseFolder + request.payload.boardName + ".json");
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
                return ("Inna tablica ma taką samę nazwę. \nZmiana nazwy nie została dokonana");
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
                var data = fs2.readFileSync(dataBaseFolder + request.payload.oldBoardName + ".json");
                var as2 = JSON.parse(data);
                as2.nazwaTablicy = request.payload.newBoardName;
                const jsonString2 = JSON.stringify(as2)
                var fs3 = require('fs');
                fs3.writeFile(dataBaseFolder + request.payload.newBoardName + ".json", jsonString2, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                //usuń stary plik
                try {
                    fs2.unlinkSync(dataBaseFolder + request.payload.oldBoardName + ".json")
                    //file removed
                } catch (err) {
                    console.error(err)
                }

                return ("Zmieniono nazwe tablicy");
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
            var dataBoard = fs2.readFileSync(dataBaseFolder + request.payload.boardName + ".json");
            var as2 = JSON.parse(dataBoard);
            as2['kolumny'].push({ "nazwaKolumny": request.payload.columnName, "listZadan": [] })
            const jsonString = JSON.stringify(as2)
            fs.writeFileSync(dataBaseFolder + request.payload.boardName + ".json", jsonString);
            return (as2);
        }
        else {

            return ("Podana tablica nie istnieje");
        }
    },
    restricted: function (request, reply) {
        const response = reply.response({ message: 'You used a Valid JWT Token to access /restricted endpoint!' });
        response.header("Authorization", request.headers.authorization);
        return response;
    },
    login: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync(peopleDataFile);
        var as = JSON.parse(content);
        var set = new Set();
        as['people'].forEach(element => {
            set.add(element.email);
        });
        if (set.has(request.payload.email)) {
            as['people'].forEach(element => {
                if(element.email===request.payload.email)
                {
                    
                }
            });
        }
        else {
            
            return ("Dodano gościa");
        }

    },
    register: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync(peopleDataFile);
        var as = JSON.parse(content);
        var set = new Set();
        as['people'].forEach(element => {
            set.add(element.email);
        });
        if (set.has(request.payload.email)) {
            return ("Gość istnieje");
        }
        else {
            as['people'].push({
                "email": request.payload.email,
                "password": request.payload.password,
                "boardList": [],
                "boardListAccess": []
            })
            const jsonString = JSON.stringify(as)
            fs.writeFileSync(peopleDataFile, jsonString);
            // //dodanie oddzielnego katolgu na plik użytkownika  
            fs.mkdir(__dirname + '/ourDatabase/' + request.payload.email, err => {              
            })
            var doPliku = "[]"
            var fs2 = require('fs');
            fs2.writeFile(dataBaseFolder + request.payload.email + "/boardsLisst.json", doPliku, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            return ("Dodano gościa");
        }
    }
}

module.exports = handlers;