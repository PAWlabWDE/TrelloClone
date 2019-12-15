"use strict";
const Hapi = require("hapi");
const port = process.env.PORT || 3001;
const secret = require("./config");
const JWT = require("jsonwebtoken");
const hapiAuthJWT = require("./lib/");
const peopleDataFile = "ourDatabase/people.json";
const dataBaseFolder = "ourDatabase/";
var people = {
  1: {
    id: 1,
    name: "Anthony Valid User"
  },
  2: {
    id: 2,
    name: "asd"
  }
};
var idFake = 3;

const validate = async function (decoded, request, h) {
  console.log(" - - - - - - - decoded token:");
  console.log(decoded);
  console.log(" - - - - - - - request info:");
  console.log(request.info);
  console.log(" - - - - - - - user agent:");
  console.log(request.headers["user-agent"]);
  if (!people[decoded.id]) {
    return { isValid: false };
  } else {
    return { isValid: true };
  }
};

function clearArray(array) {
  while (array.length) {
    array.pop();
  }
}
const verifyToken = jwtToken => {
  try {
    var a = JWT.verify(jwtToken, secret);
    return a;
  } catch (e) {
    console.log("e:", e);
    return null;
  }
};

const handlers = {
  post: function (request, reply) {
    return "It is wokring";
  },
  getAllBoards: function (request, reply) {
    console.log(request.query);
    console.log(verifyToken(request.query.token));
    var a = verifyToken(request.query.token);
    var fs = require("fs");
    var content = fs.readFileSync(dataBaseFolder + a.name + "/boardsList.json");
    return content;
  },
  addBoard: function (request, reply) {
    var a = verifyToken(request.query.token);
    var fs = require("fs");
    var content = fs.readFileSync(dataBaseFolder + a.name + "/boardsList.json");
    var as = JSON.parse(content);
    var set = new Set();
    as.forEach(element => {
      set.add(element);
    });
    if (set.has(request.payload.boardName)) {
      return "Tablica istnieje";
    } else {
      as.push(request.payload.boardName); //dodajemy nowy element do jsona
      const jsonString = JSON.stringify(as);
      fs.writeFileSync(
        dataBaseFolder + a.name + "/boardsList.json",
        jsonString
      );
      //dodanie oddzielnego pliku na dane dla tablicy
      var doPliku =
        '{"nazwaTablicy": "' + request.payload.boardName + '","kolumny": []}';
      var fs2 = require("fs");
      fs2.writeFile(
        dataBaseFolder + a.name + "/" + request.payload.boardName + ".json",
        doPliku,
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      return "Dodano tablice: " + request.payload.boardName;
    }
  },
  chooseBoard: function (request, reply) {
    var a = verifyToken(request.query.token);
    var fs = require("fs");
    var content = fs.readFileSync(dataBaseFolder + a.name + "/boardsList.json");
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
      var dataBoard = fs2.readFileSync(
        dataBaseFolder + a.name + "/" + request.payload.boardName + ".json"
      );
      var boardsData = JSON.parse(dataBoard);
      return boardsData;
    } else {
      return "Podana tablica nie istnieje: " + request.payload.boardName;
    }
  },
  editBoardName: function (request, reply) {
    var a = verifyToken(request.query.token);
    var fs = require("fs");
    var content = fs.readFileSync(dataBaseFolder + a.name + "/boardsList.json");
    var as = JSON.parse(content);
    var set = new Set();
    as.forEach(element => {
      set.add(element);
    });
    if (set.has(request.payload.oldBoardName)) {
      if (set.has(request.payload.newBoardName)) {
        return "Inna tablica ma taką samę nazwę. \nZmiana nazwy nie została dokonana";
      } else {
        clearArray(as); //wyczyszczenie naszje tablicy danych
        set.delete(request.payload.oldBoardName);
        set.add(request.payload.newBoardName);
        set.forEach(e => as.push(e)); //dodanie do tablic do zapisu
        const jsonString = JSON.stringify(as);
        fs.writeFileSync(
          dataBaseFolder + a.name + "/boardsList.json",
          jsonString
        );
        //tutaj edycja konkretnego pliku danej tablicy
        var fs2 = require("fs");
        var data = fs2.readFileSync(
          dataBaseFolder + a.name + "/" + request.payload.oldBoardName + ".json"
        );
        var as2 = JSON.parse(data);
        as2.nazwaTablicy = request.payload.newBoardName;
        const jsonString2 = JSON.stringify(as2);
        var fs3 = require("fs");
        fs3.writeFile(
          dataBaseFolder +
          a.name +
          "/" +
          request.payload.newBoardName +
          ".json",
          jsonString2,
          function (err) {
            if (err) {
              console.log(err);
            }
          }
        );
        //usuń stary plik
        try {
          fs2.unlinkSync(
            dataBaseFolder +
            a.name +
            "/" +
            request.payload.oldBoardName +
            ".json"
          );
          //file removed
        } catch (err) {
          console.error(err);
        }

        return "Zmieniono nazwe tablicy";
      }
    } else {
      return (
        "Tablica nie istnieje: " +
        request.payload.oldBoardName +
        "\nCzyli nie zmienisz nazwy"
      );
    }
  },
  addColumn: function (request, reply) {
    var a = verifyToken(request.query.token);
    var fs = require("fs");
    var content = fs.readFileSync(dataBaseFolder + a.name + "/boardsList.json");
    //znajdź odpowidnią tablice
    var as = JSON.parse(content);
    var set = new Set();
    as.forEach(element => {
      set.add(element);
    });
    console.log(
      a.name +
      " " +
      request.payload.boardName +
      " " +
      request.payload.columnName
    );
    if (set.has(request.payload.boardName)) {
      //tablica istnieje czyli zwracamy jej kolumny
      //odczyt z pliku danych o tablicy
      var fs2 = require("fs");
      var dataBoard = fs2.readFileSync(
        dataBaseFolder + a.name + "/" + request.payload.boardName + ".json"
      );
      var as2 = JSON.parse(dataBoard);
      var index = as2["kolumny"].length + 1;
      as2["kolumny"].push({
        nazwaKolumny: request.payload.columnName,
        listZadan: [],
        nrKolumny: index
      });
      const jsonString = JSON.stringify(as2);
      fs.writeFileSync(
        dataBaseFolder + a.name + "/" + request.payload.boardName + ".json",
        jsonString
      );
      return as2;
    } else {
      return "Podana tablica nie istnieje";
    }
  },
  addComment: function (request, reply) {
    var a = verifyToken(request.query.token);
    var fs2 = require("fs");
    var dataBoard = fs2.readFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json"
    );
    var as2 = JSON.parse(dataBoard);

    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.columnName) {
        element["listZadan"].forEach(zadanie => {
          if (zadanie.nazwaZadania === request.payload.taskName) {
            var index = zadanie["komentarze"].length + 1;
            zadanie["komentarze"].push({
              kto: a.name,
              co: request.payload.comment,
              nrKomentarza: index
            });
          }
        });
      }
    });

    const jsonString = JSON.stringify(as2);
    fs2.writeFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json",
      jsonString
    );
    return as2;
  },
  addAttachment: function (request, reply) {

    var a = verifyToken(request.query.token);
    var fs2 = require("fs");
    var dataBoard = fs2.readFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json"
    );
    var as2 = JSON.parse(dataBoard);

    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.columnName) {
        element["listZadan"].forEach(zadanie => {
          if (zadanie.nazwaZadania === request.payload.taskName) {

            var tempRemoved = zadanie["zalaczniki"].pop();
            if(tempRemoved===undefined){
              zadanie["zalaczniki"].push({
                kto: a.name,
                co: request.payload.urlOrPath,
                nrZalocznika:1
              });
            }
            else{
              zadanie["zalaczniki"].push(tempRemoved);
              var index = tempRemoved.nrZalocznika + 1;
              zadanie["zalaczniki"].push({
                kto: a.name,
                co: request.payload.urlOrPath,
                nrZalocznika: parseInt(index)
              });
            }

          }
        });
      }
    });

    const jsonString = JSON.stringify(as2);
    fs2.writeFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json",
      jsonString
    );
    return as2;
  },
  addCard: function (request, reply) {
    var a = verifyToken(request.query.token);
    var fs2 = require("fs");
    var dataBoard = fs2.readFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json"
    );
    var as2 = JSON.parse(dataBoard);
      var returnObject;
    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.columnName) {
        console.log(element["listZadan"]);
        console.log(element["listZadan"].length);
        var index = element["listZadan"].length + 1;
        var history = a.name + " added this card to " + request.payload.columnName

        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        returnObject={
          nazwaZadania: request.payload.newTask,
          komentarze: [],
          nrZadania: index,
          zalaczniki: [],
          label: [],
          history: [{ what: history, data: dateTime }]
        };
        element["listZadan"].push({
          nazwaZadania: request.payload.newTask,
          komentarze: [],
          nrZadania: index,
          zalaczniki: [],
          label: [],
          history: [{ what: history, data: dateTime }]
        });
      }
    });

    const jsonString = JSON.stringify(as2);
    fs2.writeFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json",
      jsonString
    );
    return returnObject;
  },
  restricted: function (request, reply) {
    const response = reply.response({
      message: "You used a Valid JWT Token to access /restricted endpoint!"
    });
    response.header("Authorization", request.headers.authorization);
    return response;
  },
  login: function (request, reply) {
    var fs = require("fs");
    var content = fs.readFileSync(peopleDataFile);
    var as = JSON.parse(content);
    var set = new Set();
    as["people"].forEach(element => {
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
            a = JWT.sign(
              {
                id: idFake,
                name: request.payload.email
              },
              secret
            );
            people[idFake] = { id: idFake, name: request.payload.email };

            // console.log("Tokenik: " + a);
          } else {
            a = "Access denied";
          }
        }
      });
    } else {
      return "Access denied";
    }
    return a;
  },
  register: function (request, reply) {
    var fs = require("fs");
    var content = fs.readFileSync(peopleDataFile);
    var as = JSON.parse(content);
    var set = new Set();
    as["people"].forEach(element => {
      set.add(element.email);
    });
    //  console.log(as);
    if (set.has(request.payload.email)) {
      return "Gość istnieje";
    } else {
      as["people"].push({
        email: request.payload.email,
        password: request.payload.password,
        boardList: [],
        boardListAccess: []
      });
      const jsonString = JSON.stringify(as);
      fs.writeFileSync(peopleDataFile, jsonString);
      // //dodanie oddzielnego katolgu na plik użytkownika
      fs.mkdir(__dirname + "/ourDatabase/" + request.payload.email, err => { });
      var doPliku = "[]";
      var fs2 = require("fs");
      fs2.writeFile(
        dataBaseFolder + request.payload.email + "/boardsList.json",
        doPliku,
        function (err) {
          if (err) {
            console.log(err);
          }
        }
      );
      return "Adding User";
    }
  },
  deleteAttachment: function (request, reply) {
    console.log("DELETE: \n"+request.payload.boardName +"\n"+request.payload.attachmentNumber)
    var a = verifyToken(request.query.token);
    var fs2 = require("fs");
    var dataBoard = fs2.readFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json"
    );
    var as2 = JSON.parse(dataBoard);

    //add all label to set
    var mySetLabel = [];
    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.columnName) {
        element["listZadan"].forEach(zadanie => {
          if (zadanie.nazwaZadania === request.payload.taskName) {
            zadanie["zalaczniki"].forEach(e => {
              if (parseInt(e.nrZalocznika) != parseInt(request.payload.attachmentNumber)) {
                mySetLabel.push(e);
              }
            })
          }
        });
      }
    });

    //replace zalacznik's list in file
    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.columnName) {
        element["listZadan"].forEach(zadanie => {
          if (zadanie.nazwaZadania === request.payload.taskName) {
            clearArray(zadanie["zalaczniki"]);
            mySetLabel.forEach(e => zadanie["zalaczniki"].push(e));
          }
        });
      }
    });



    const jsonString = JSON.stringify(as2);
    fs2.writeFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json",
      jsonString
    );
    return as2;
  },
  addLabel: function (request, reply) {
    var a = verifyToken(request.query.token);
    var fs2 = require("fs");
    var dataBoard = fs2.readFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json"
    );
    var as2 = JSON.parse(dataBoard);

    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.columnName) {
        element["listZadan"].forEach(zadanie => {
          if (parseInt(zadanie.nrZadania) === parseInt(request.payload.taskID)) {
            var tempLabel= zadanie["label"].pop();
            if(tempLabel===undefined){
              zadanie["label"].push({labelName:request.payload.labelName, labelColor:request.payload.labelColor,nrLabel:1});
            }
            else{
              zadanie["label"].push(tempLabel);
              var index=tempLabel.nrLabel+1;
              zadanie["label"].push({labelName:request.payload.labelName, labelColor:request.payload.labelColor,nrLabel:parseInt(index)});
            }
           
          }
        });
      }
    });

    const jsonString = JSON.stringify(as2);
    fs2.writeFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json",
      jsonString
    );
    return as2;
  },
  deleteLabel: function (request, reply) {
    var a = verifyToken(request.query.token);
    var fs2 = require("fs");
    var dataBoard = fs2.readFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json"
    );
    var as2 = JSON.parse(dataBoard);

       //add all label to set
       var mySetLabel = [];
       as2["kolumny"].forEach(element => {
         if (element.nazwaKolumny === request.payload.columnName) {
           element["listZadan"].forEach(zadanie => {
             if (parseInt(zadanie.nrZadania) === parseInt(request.payload.taskID)) {
               zadanie["label"].forEach(e => {
                 if (parseInt(e.nrLabel) != parseInt(request.payload.labelID)) {
                   mySetLabel.push(e);
                 }
               })
             }
           });
         }
       });
   
       //replace zalacznik's list in file
       as2["kolumny"].forEach(element => {
         if (element.nazwaKolumny === request.payload.columnName) {
           element["listZadan"].forEach(zadanie => {
             if (parseInt(zadanie.nrZadania) === parseInt(request.payload.taskID)) {
               clearArray(zadanie["label"]);
               mySetLabel.forEach(e => zadanie["label"].push(e));
             }
           });
         }
       });
    const jsonString = JSON.stringify(as2);
    fs2.writeFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json",
      jsonString
    );
    return as2;
  },
  moveAndHistoryCard: function (request, reply) {
    var a = verifyToken(request.query.token);
    var fs2 = require("fs");
    var dataBoard = fs2.readFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json"
    );
    var as2 = JSON.parse(dataBoard);
    //save to db if is from column to column
    if (request.payload.prevColumnName !== request.payload.currColumnName) {
      as2["kolumny"].forEach(element => {
        if (element.nazwaKolumny === request.payload.prevColumnName) {
          var history = a.name + " moveded this card from " + request.payload.prevColumnName + " to " + request.payload.currColumnName
          var today = new Date();
          var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
          var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          var dateTime = date + ' ' + time;
          element["listZadan"].forEach(zadanie => {
            if (parseInt(zadanie.nrZadania) === parseInt(request.payload.nrZadania)) {
              zadanie["history"].push({ what: history, data: dateTime });
            }
          });

        }
      });
    }

    //zmień pliki, aby zobrazować prznieseienie karty(z kolumny do kolumny, w jednej kolumnie, eccetera)
    var movingElement;
    var flag = false;
    var newPrevList = [];
    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.prevColumnName) {
        element["listZadan"].forEach(zadanie => {
          if (parseInt(zadanie.nrZadania) == parseInt(request.payload.nrZadania)) {
            movingElement = zadanie;
            flag = true;
          }
          else {
            if (flag) {
              var index = zadanie.nrZadania - 1;
              newPrevList.push({
                nazwaZadania: zadanie.nazwaZadania,
                komentarze: zadanie.komentarze,
                nrZadania: parseInt(index),
                zalaczniki: zadanie.zalaczniki,
                label: zadanie.label,
                history: zadanie.history
              });
            }
            else {
              newPrevList.push(zadanie);
            }

          }
        });
      //  console.log("FIRST LIST:\n"+element['listZadan'])
        //console.log("FIRST LIST(newPrevList):\n"+newPrevList)
      }
    });
    console.log("movingElement: " + movingElement.nazwaZadania);
    //zadanie zapisane w movingElement i stara tablica poprawiona
    //update starej tablicy w pliku:
    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.prevColumnName) {

        clearArray(element["listZadan"]);
        newPrevList.forEach(e => element["listZadan"].push(e));

      }
    });
    //
    var currFlag = false;
    var newCurrList = [];
    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.currColumnName) {
        element["listZadan"].forEach(zadanie => {
          if (parseInt(zadanie.nrZadania) == parseInt(request.payload.indexInNewColumn)) {
            newCurrList.push({
              nazwaZadania: movingElement.nazwaZadania,
              komentarze: movingElement.komentarze,
              nrZadania: parseInt(request.payload.indexInNewColumn),
              zalaczniki: movingElement.zalaczniki,
              label: movingElement.label,
              history: movingElement.history
            })
            var index = zadanie.nrZadania + 1;
            newCurrList.push({
                nazwaZadania: zadanie.nazwaZadania,
                komentarze: zadanie.komentarze,
                nrZadania: parseInt(index),
                zalaczniki: zadanie.zalaczniki,
                label: zadanie.label,
                history: zadanie.history
              });
            currFlag = true;
          }
          else {
            if (currFlag) {
              var index = zadanie.nrZadania + 1;
              newCurrList.push({
                nazwaZadania: zadanie.nazwaZadania,
                komentarze: zadanie.komentarze,
                nrZadania: parseInt(index),
                zalaczniki: zadanie.zalaczniki,
                label: zadanie.label,
                history: zadanie.history
              });

            }
            else {
              newCurrList.push(zadanie);
            }
          }

        })
      }
    });
    console.log(" no chyb anie: "+newCurrList);
    if (!currFlag) {
      newCurrList.push({
        nazwaZadania: movingElement.nazwaZadania,
        komentarze: movingElement.komentarze,
        nrZadania: parseInt(request.payload.indexInNewColumn),
        zalaczniki: movingElement.zalaczniki,
        label: movingElement.label,
        history: movingElement.history
      })
    }
    //update nowej tablicy w pliku:
    as2["kolumny"].forEach(element => {
      if (element.nazwaKolumny === request.payload.currColumnName) {
        clearArray(element["listZadan"]);
        newCurrList.forEach(e => element["listZadan"].push(e));
      }
    });


    const jsonString = JSON.stringify(as2);
    fs2.writeFileSync(
      dataBaseFolder + a.name + "/" + request.payload.boardName + ".json",
      jsonString
    );
    return as2;
  }
};

const init = async () => {
  const server = new Hapi.Server({
    port: port,
    routes: {
      cors: true
    }
  });
  await server.register(hapiAuthJWT);
  server.auth.strategy("jwt", "jwt", {
    key: secret,
    validate,
    verifyOptions: { ignoreExpiration: true }
  });

  server.auth.default("jwt");

  server.route([
    {
      path: "/login",
      method: "POST",
      config: { auth: false },
      handler: handlers.login
    },
    {
      path: "/register",
      method: "POST",
      config: { auth: false },
      handler: handlers.register
    },
    {
      path: "/",
      method: "GET",
      config: { auth: "jwt" },
      handler: handlers.post
    },
    {
      path: "/getAllBoards",
      method: "GET",
      config: { auth: "jwt" },
      handler: handlers.getAllBoards
    },
    {
      path: "/addBoard",
      method: "POST",
      config: { auth: "jwt" },
      handler: handlers.addBoard
    },
    {
      path: "/chooseBoard",
      method: "POST",
      config: { auth: "jwt" },
      handler: handlers.chooseBoard
    },
    {
      path: "/editBoardName",
      method: "POST",
      config: { auth: "jwt" },
      handler: handlers.editBoardName
    },
    {
      path: "/addColumn",
      method: "POST",
      config: { auth: "jwt" },
      handler: handlers.addColumn
    },
    {
      path: "/addCard",
      method: "POST",
      config: { auth: "jwt" },
      handler: handlers.addCard
    },
    {
      path: "/addComment",
      method: "POST",
      config: { auth: "jwt" },
      handler: handlers.addComment
    },
    {
      path: "/addAttachment",
      method: "POST",
      config: { auth: "jwt" },
      handler: handlers.addAttachment
    },
    {
      path: "/restricted",
      method: "GET",
      config: { auth: "jwt" },
      handler: handlers.restricted
    },
    {
      path: "/attachment",
      method: "DELETE",
      config: { auth: "jwt" },
      handler: handlers.deleteAttachment
    }
    ,
    {
      path: "/label",
      method: "POST",
      config: { auth: "jwt" },
      handler: handlers.addLabel
    }
    ,
    {
      path: "/label",
      method: "DELETE",
      config: { auth: "jwt" },
      handler: handlers.deleteLabel
    },
    {
      path: "/moveAndHistoryCard",
      method: "POST",
      config: { auth: "jwt" },
      handler: handlers.moveAndHistoryCard
    }
  ]);

  await server.start();
  return server;
};
init()
  .then(server => {
    console.log("Server running at:", server.info.uri);
  })
  .catch(err => {
    console.log(err);
  });
