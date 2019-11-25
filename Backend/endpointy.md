## Jesli problem z bcrypt to powershell admina i komedna: npm install --global --production windows-build-tools

# Nasze Endpointy
localhost:3001

## Testowy
```JSON
GET
"/"
Retrun:"It is working"
```

## Pobierz wysztkie tablice
```JSON
GET
"/getAllBoards"
Retrun: json z nazwami tablic
np: ["jesczszRaz","toJebnie","toChybaDziała","test1234"]
```
## Dodaj nową tablicę
```JSON
POST
"/addBoard"
Paramatery: "boardName" : nazwaNowejTAblicy
Retrun: "Tablica istnieje" lub "Dodano tablice: "+ jejNazwa;

```

## Wybierz tablicę
```JSON
POST
"/chooseBoard"
Paramatery: "boardName" : nazwaNowejTAblicy
Retrun: "Podana tablica nie istnieje: " + jejNazwa;
lub JSON z danymi tablicy:
np:
{
    "nazwaTablicy": "toChybaDziała",
    "kolumny": [
        {
            "nazwaKolumny": "Pierwsza",
            "listZadan": []
        },
        {
            "nazwaKolumny": "nowaKolumna",
            "listZadan": []
        }
    ]
}

```

## Zmień nazwę tablicy
```JSON
POST
"/editBoardName"
Paramatery: "newBoardName" : nowaNazwa
            "oldBoardName" : staraNazawa
Retrun: "Tablica nie istnieje: " + jejNazwa;
lub 
"Inna tablica ma taką samę nazwę. \nZmiana nazwy nie została dokonana"
lub 
"Zmieniono nazwe tablicy"

```
## Dodaj nową kolumne do tablicy
```JSON
POST
"/addColumn"
Paramatery: "boardName" : nazawaTAblicy
            "columnName" : dodawanaKolumna //(nazwy mogą się duplikować)
Retrun:("Podana tablica nie istnieje");
lub JSON z danymi tablicy:
np:
{
    "nazwaTablicy": "toChybaDziała",
    "kolumny": [
        {
            "nazwaKolumny": "Pierwsza",
            "listZadan": []
        },
        {
            "nazwaKolumny": "nowaKolumna",
            "listZadan": []
        }
    ]
}
```