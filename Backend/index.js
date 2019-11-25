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

const Mongoose = require("mongoose");
const handlers = require('./handlers');

const init = async () => {
    Mongoose.connect('mongodb+srv://test:test@cluster0-8ecx4.azure.mongodb.net/test?retryWrites=true&w=majority', {

        useNewUrlParser: true
    }).
        catch(error => handleError(error));
    Mongoose.connection.on('error', err => {
        console.log("Cos jebalo");
        logError(err);
    });
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
/**************************UWAGA*********************
//  * do poprawnego działania musimy mieć plik boardsList.json w folerze ourDatabase
//  * z zawartością startową:             "[]"              */
