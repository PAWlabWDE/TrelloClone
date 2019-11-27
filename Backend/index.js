'use strict';
const Hapi = require('hapi');
const port = process.env.PORT || 3001;
const secret = require('./config');
const JWT = require('jsonwebtoken');
const hapiAuthJWT = require('./lib/');
const peopleDataFile = "ourDatabase/people.json";
const mainDataBaseFile = "ourDatabase/boardsList.json";
const dataBaseFolder = "ourDatabase/";
var people = {
    1: {
        id: 1,
        name: 'Anthony Valid User'
    },
    2: {
        id: 2,
        name: 'asd'
    }
};
var idFake = 3;
// use the token as the 'authorization' header in requests
const token = JWT.sign(people[1], secret); // synchronous
console.log(token);
//  people[3]={id:3,name:'nowy'};
//console.log(people);

const validate = async function (decoded, request, h) {
    console.log(" - - - - - - - decoded token:");
    console.log(decoded);
    console.log(" - - - - - - - request info:");
    console.log(request.info);
    console.log(" - - - - - - - user agent:");
    console.log(request.headers['user-agent']);
    if (!people[decoded.id]) {
        return { isValid: false };
    }
    else {
        return { isValid: true };
    }

};

function clearArray(array) {
    while (array.length) {
        array.pop();
    }
}
const verifyToken = (jwtToken) =>{
    try{
        var a=JWT.verify(jwtToken, secret);
        
       return a;
    }catch(e){
       console.log('e:',e);
       return null;
    }
 }

const handlers = {
    post: function (request, reply) {
        return ('It is wokring');
    },

    getAllBoards: function (request, reply) {
        console.log(request.query);
        console.log(verifyToken(request.query.token));
        var a=verifyToken(request.query.token);
        var fs = require("fs");
        var content = fs.readFileSync(dataBaseFolder+a.name+'/boardsList.json');
        return (content);
    },
    addBoard: function (request, reply) {
        var a=verifyToken(request.query.token);
        var fs = require("fs");
        var content = fs.readFileSync(dataBaseFolder+a.name+'/boardsList.json');
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
            fs.writeFileSync(dataBaseFolder+a.name+'/boardsList.json', jsonString);
            //dodanie oddzielnego pliku na dane dla tablicy             
            var doPliku = "{\"nazwaTablicy\": \"" + request.payload.boardName + "\",\"kolumny\": []}"
            var fs2 = require('fs');
            fs2.writeFile(dataBaseFolder+a.name +'/'+ request.payload.boardName + ".json", doPliku, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            return ("Dodano tablice: " + request.payload.boardName);
        }
    },
    chooseBoard: function (request, reply) {
        var a=verifyToken(request.query.token);
        var fs = require("fs");
        var content = fs.readFileSync(dataBaseFolder+a.name+'/boardsList.json');
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
            var dataBoard = fs2.readFileSync(dataBaseFolder+a.name +'/' + request.payload.boardName + ".json");
            var boardsData = JSON.parse(dataBoard);
            return (boardsData);
        }
        else {

            return ("Podana tablica nie istnieje: " + request.payload.boardName);
        }
    },
    editBoardName: function (request, reply) {
        var a=verifyToken(request.query.token);
        var fs = require("fs");
        var content = fs.readFileSync(dataBaseFolder+a.name+'/boardsList.json');
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
                fs.writeFileSync(dataBaseFolder+a.name+'/boardsList.json', jsonString);
                //tutaj edycja konkretnego pliku danej tablicy
                var fs2 = require("fs");
                var data = fs2.readFileSync(dataBaseFolder +a.name+'/'+ request.payload.oldBoardName + ".json");
                var as2 = JSON.parse(data);
                as2.nazwaTablicy = request.payload.newBoardName;
                const jsonString2 = JSON.stringify(as2)
                var fs3 = require('fs');
                fs3.writeFile(dataBaseFolder+a.name+'/' + request.payload.newBoardName + ".json", jsonString2, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });
                //usuń stary plik
                try {
                    fs2.unlinkSync(dataBaseFolder+a.name+'/' + request.payload.oldBoardName + ".json")
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
        var a=verifyToken(request.query.token);
        var fs = require("fs");
        var content = fs.readFileSync(dataBaseFolder+a.name+'/boardsList.json');
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
            var dataBoard = fs2.readFileSync(dataBaseFolder+a.name+'/' + request.payload.boardName + ".json");
            var as2 = JSON.parse(dataBoard);
            as2['kolumny'].push({ "nazwaKolumny": request.payload.columnName, "listZadan": [] })
            const jsonString = JSON.stringify(as2)
            fs.writeFileSync(dataBaseFolder+a.name+'/' + request.payload.boardName + ".json", jsonString);
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
        // console.log("*************************************LOGIN********************************\n")
        // console.log(as);
        // console.log(set);
        var a;
        if (set.has(request.payload.email)) {
            // console.log("emial: " + request.payload.email + " hasło: " + request.payload.password)
            as.people.forEach(element => {
                // console.log(element);
                // console.log("element.emial: " + element.email + " element.password: " + element.password);
                if (element.email === request.payload.email) {
                    //  console.log("wchodzisz tu? ");
                    if (element.password === request.payload.password) {
                        // console.log("a tutaj? ");
                        a = JWT.sign({
                            id: idFake,
                            name: request.payload.email
                        }
                            , secret);
                        people[idFake] = { id: idFake, name: request.payload.email };

                        // console.log("Tokenik: " + a);
                    }
                    else{
                        a="no chyba coś Cię..."
                    }

                }
            })
        }
        else {

            return ("nie istneijesz ");
        }
        return a;

    },
    register: function (request, reply) {
        var fs = require("fs");
        var content = fs.readFileSync(peopleDataFile);
        var as = JSON.parse(content);
        var set = new Set();
        as['people'].forEach(element => {
            set.add(element.email);
        });
        //  console.log(as);
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
            fs2.writeFile(dataBaseFolder + request.payload.email + "/boardsList.json", doPliku, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            return ("Dodano gościa");
        }
    }
}

const init = async () => {


    const server = new Hapi.Server({
        port: port,
        routes: {
            cors: true
        }
    });
    await server.register(hapiAuthJWT);
    server.auth.strategy('jwt', 'jwt',
        {
            key: secret,
            validate,
            verifyOptions: { ignoreExpiration: true }
        });

    server.auth.default('jwt');

    server.route([
        { path: '/login', method: 'POST', config: { auth: false }, handler: handlers.login },
        { path: '/register', method: 'POST', config: { auth: false }, handler: handlers.register },
        { path: '/', method: 'GET', config: { auth: 'jwt' }, handler: handlers.post },
        { path: '/getAllBoards', method: 'GET', config: { auth: 'jwt' }, handler: handlers.getAllBoards },
        { path: '/addBoard', method: 'POST', config: { auth: 'jwt' }, handler: handlers.addBoard },
        { path: '/chooseBoard', method: 'POST', config: { auth: 'jwt' }, handler: handlers.chooseBoard },
        { path: '/editBoardName', method: 'POST', config: { auth: 'jwt' }, handler: handlers.editBoardName },
        { path: '/addColumn', method: 'POST', config: { auth: 'jwt' }, handler: handlers.addColumn },
        { path: '/restricted', method: 'GET', config: { auth: 'jwt' }, handler: handlers.restricted }
    ]);

    await server.start();
    return server;


};
init().then(server => {
    console.log('Server running at:', server.info.uri);
}).catch(err => {
    console.log(err);
});