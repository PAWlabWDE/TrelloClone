'use strict';
const Hapi = require('hapi');
const port = process.env.PORT || 3001;
const secret = require('./config');
const JWT = require('jsonwebtoken');
const hapiAuthJWT = require('./lib/');
const people = {
    1: {
        id: 1,
        name: 'Anthony Valid User'
    },
    2: {
        id: 2,
        name: 'Mateusz Baranski'
    }
};
// use the token as the 'authorization' header in requests
const token = JWT.sign(people[1], secret); // synchronous
console.log(token);
const token2 = JWT.sign(people[2], secret); // synchronous
console.log(token2);
const validate = async function (decoded, request, h) {
    console.log(" - - - - - - - decoded token:");
    console.log(decoded);
    console.log(" - - - - - - - request info:");
    console.log(request.info);
    console.log(" - - - - - - - user agent:");
    console.log(request.headers['user-agent']);

    // do your checks to see if the person is valid
    if (!people[decoded.id]) {
        return { isValid: false };
    }
    else {
        return { isValid: true };
    }
};


const handlers = require('./handlers');

const init = async () => {
    const server = new Hapi.Server({
        port: port,
        routes: {
            cors: true
        }
    });
    await server.register(hapiAuthJWT);
    // see: http://hapijs.com/api#serverauthschemename-scheme
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
        { path: '/getAllBoards', method: 'GET', config: { auth: false }, handler: handlers.getAllBoards },
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
// const Mongoose = require("mongoose");
// /**************************UWAGA*********************
//  * do poprawnego działania musimy mieć plik boardsList.json w folerze ourDatabase
//  * z zawartością startową:             "[]"              */
// const server = new Hapi.Server({
//     host: 'localhost',
//     port: 3001,
//     routes: {
//         cors: true
//     }
// })///test?retryWrites=true&w=majority
// //Mongoose.connect("mongodb+srv://test:test@cluster0-8ecx4.azure.mongodb.net");
// Mongoose.connect('mongodb+srv://test:test@cluster0-8ecx4.azure.mongodb.net', { useNewUrlParser: true }).
//   catch(error => handleError(error));
// Mongoose.connection.on('error', err => {
//     console.log("Cos jebalo");
//     logError(err);
//   });
// // var MongoClient = require('mongodb').MongoClient;
// // var url = "mongodb+srv://test:test@cluster0-8ecx4.azure.mongodb.net/test?retryWrites=true&w=majority";

// // MongoClient.connect(url, function(err, db) {
// //   if (err) throw err;
// //   else console.log("success");
// //   db.db("test").collection("insert").insertOne({ name: "Company Inc"},function(err,res){
// //     if (err) {
// //       console.log("fucking errror");
// //       throw err;}
// //        console.log("1 document inserted");
// //        db.close();
// //   });
// server.register(require('hapi-auth-jwt'), (err) => {

//     // We're giving the strategy both a name
//     // and scheme of 'jwt'
//     server.auth.strategy('jwt', 'jwt', {
//       key: secret,
//       verifyOptions: { algorithms: ['HS256'] }
//     });
// });


// const mainDataBaseFile ="ourDatabase/boardsList.json";
// const dataBaseFolder ="ourDatabase/";
// function clearArray(array) {
//     while (array.length) {
//         array.pop();
//     }
// }

// var handlers = {
//     post: function (request, reply) {
//         return ('It is wokring');
//     },

//     getAllBoards: function (request, reply) {
//         var fs = require("fs");
//         var content = fs.readFileSync(mainDataBaseFile);
//         return (content);
//     },
//     addBoard: function (request, reply) {
//         var fs = require("fs");
//         var content = fs.readFileSync(mainDataBaseFile);
//         var as = JSON.parse(content);
//         var set = new Set();
//         as.forEach(element => {
//             set.add(element);
//         });
//         if (set.has(request.payload.boardName)) {
//             return ("Tablica istnieje");
//         }
//         else {
//             as.push(request.payload.boardName);//dodajemy nowy element do jsona
//             const jsonString = JSON.stringify(as)
//             fs.writeFileSync(mainDataBaseFile, jsonString);
//             //dodanie oddzielnego pliku na dane dla tablicy             
//             var doPliku = "{\"nazwaTablicy\": \"" + request.payload.boardName + "\",\"kolumny\": []}"
//             var fs2 = require('fs');
//             fs2.writeFile(dataBaseFolder+request.payload.boardName + ".json", doPliku, function (err) {
//                 if (err) {
//                     console.log(err);
//                 }
//             });
//             return ("Dodano tablice: " + request.payload.boardName);
//         }
//     },
//     chooseBoard: function (request, reply) {
//         var fs = require("fs");
//         var content = fs.readFileSync(mainDataBaseFile);
//         //znajdź odpowidnią tablice 
//         var as = JSON.parse(content);
//         var set = new Set();
//         as.forEach(element => {
//             set.add(element);
//         });
//         if (set.has(request.payload.boardName)) {
//             //tablica istnieje czyli zwracamy jej kolumny
//             //odczyt z pliku danych o tablicy
//             var fs2 = require("fs");
//             var dataBoard = fs2.readFileSync(dataBaseFolder+request.payload.boardName + ".json");
//             var boardsData = JSON.parse(dataBoard);
//             return (boardsData);
//         }
//         else {

//             return ("Podana tablica nie istnieje: " + request.payload.boardName);
//         }
//     },
//     editBoardName: function (request, reply) {
//         var fs = require("fs");
//         var content = fs.readFileSync(mainDataBaseFile);
//         var as = JSON.parse(content);
//         var set = new Set();
//         as.forEach(element => {
//             set.add(element);
//         });
//         if (set.has(request.payload.oldBoardName)) {
//             if (set.has(request.payload.newBoardName)) {
//                 return("Inna tablica ma taką samę nazwę. \nZmiana nazwy nie została dokonana");
//             }
//             else {
//                 clearArray(as);//wyczyszczenie naszje tablicy danych
//                 set.delete(request.payload.oldBoardName);
//                 set.add(request.payload.newBoardName)
//                 set.forEach(e => as.push(e));//dodanie do tablic do zapisu
//                 const jsonString = JSON.stringify(as)
//                 fs.writeFileSync(mainDataBaseFile, jsonString);
//                 //tutaj edycja konkretnego pliku danej tablicy
//                 var fs2 = require("fs");
//                 var data = fs2.readFileSync(dataBaseFolder+request.payload.oldBoardName + ".json");
//                 var as2 = JSON.parse(data);
//                 as2.nazwaTablicy = request.payload.newBoardName;
//                 const jsonString2 = JSON.stringify(as2)
//                 var fs3 = require('fs');
//                 fs3.writeFile(dataBaseFolder+request.payload.newBoardName + ".json", jsonString2, function (err) {
//                     if (err) {
//                         console.log(err);
//                     }
//                 });
//                 //usuń stary plik
//                 try {
//                     fs2.unlinkSync(dataBaseFolder+request.payload.oldBoardName + ".json")
//                     //file removed
//                 } catch (err) {
//                     console.error(err)
//                 }

//                 return ("Zmieniono nazwe tablicy");
//             }

//         }
//         else {

//             return ("Tablica nie istnieje: " + request.payload.oldBoardName + "\nCzyli nie zmienisz nazwy");
//         }
//     },
//     addColumn: function (request, reply) {
//         var fs = require("fs");
//         var content = fs.readFileSync(mainDataBaseFile);
//         //znajdź odpowidnią tablice 
//         var as = JSON.parse(content);
//         var set = new Set();
//         as.forEach(element => {
//             set.add(element);
//         });
//         if (set.has(request.payload.boardName)) {
//             //tablica istnieje czyli zwracamy jej kolumny
//             //odczyt z pliku danych o tablicy
//             var fs2 = require("fs");
//             var dataBoard = fs2.readFileSync(dataBaseFolder+request.payload.boardName + ".json");
//             var as2 = JSON.parse(dataBoard);
//             as2['kolumny'].push({ "nazwaKolumny": request.payload.columnName, "listZadan": [] })
//             const jsonString = JSON.stringify(as2)
//             fs.writeFileSync(dataBaseFolder+request.payload.boardName + ".json", jsonString);
//             return (as2);
//         }
//         else {

//             return ("Podana tablica nie istnieje");
//         }
//     }
// }



// server.route([
//     { path: '/', method: 'GET', handler: handlers.post },
//     { path: '/getAllBoards', method: 'GET', handler: handlers.getAllBoards },
//     { path: '/addBoard', method: 'POST', handler: handlers.addBoard },
//     { path: '/chooseBoard', method: 'POST', handler: handlers.chooseBoard },
//     { path: '/editBoardName', method: 'POST', handler: handlers.editBoardName },
//     { path: '/addColumn', method: 'POST', handler: handlers.addColumn }
// ]);



// //chyba potrzebne
// server.start(function () {
//     console.log('Server is running');
// })
//************************************************************************************************************************ */
// var Hapi = require('hapi');
// var jwt = require('jsonwebtoken');

// // IMPORTANT: you must bring your own validation function
// var validate = function (token, request, callback) {

//     var publicKey = 'someKey';
//     jwt.verify(token, publicKey, function (err, decoded) {

//       if (err) {
//         return callback(err)
//       }
//       var credentials = request.auth.credentials;
//       // .. do some additional credentials checking
//       return callback(null, true, decoded);
//     });
// };


// const server = new Hapi.Server({
//         host: 'localhost',
//         port: 3001,
//         routes: {
//             cors: true
//         }
//     })
//         // include our module here ↓↓
// server.register(require('hapi-auth-jwt-simple'), function (err) {

//     if(err){
//       console.log(err);
//     }

//     server.auth.strategy('jwt', 'jwt', {
//       validateFunc: validate
//     });

//     server.auth.default('jwt');

//     server.route([
//       {
//         method: "GET", path: "/", config: { auth: false },
//         handler: function(request, reply) {
//           //reply({text: 'Token not required'} );
//           return "HEllo";

//         }
//       },
//       {
//         method: 'GET', path: '/restricted', config: { auth: 'jwt' },
//         handler: function(request, reply) {
//           reply({text: 'You used a Token!'})
//           .header("Authorization", request.headers.authorization);
//         }
//       }
//     ]);
// });

// server.start(function () {
//   console.log('Server running at:', server.info.uri);
// });