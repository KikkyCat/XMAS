var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");

// ************** Server only methods
app.set('views', __dirname + '/views');
app.use('/resources', express.static(__dirname + '/resources'));
app.use('/views', express.static(__dirname + '/views'));
// FYI, Jade está deprecado y ahora recomiendan Pug, aunque usan la misma sintaxis
app.set('view engine', 'pug');

/*
 * Cuando el usuario abre el root de la app, le regres el HTML para que seleccione su nombre 
 * (para saber de quién "tomará el papelito"). Aquí, el template engine deberá llenar la lista
 * de personas que aún no han tomado su papelito. 
 *
 * Los nombres de las personas se almacenan en la variable "persons" en el método render, y si
 * te fijas en el archivo views/index.pug, en el elemento "select" ahí puse un for que recorre
 * esta lista de personas y muestra el nombre en un combo box. En tu caso, vas a poner esta
 * lista en el control UI que quieras siguiendo el formato del template con el for.
 *
 * NOTA: Puedes traducir tu HTML a JADE con esta página http://html2jade.org/ y lo traducido 
 * lo pones en un archivo con extensión .jade.
 */
app.get("/", (req, res) => {
    var json = readJSON();
    
    res.render("index",{
        persons: json.availableToAssignSecretFriend
    });
});

/*
 * Como ejemplo puedes usar la URL http://localhost:8000/assign/Lety. 
 * Te regresa un JSON con esta estructura.
 *
 * {
 *  "originator": 
 *      {
 *          "name": "Lety"
 *      }, 
 *      "secretFriend": 
 *      {
 *          "name": "Victor"
 *      }
 * }
 *
 * Tú tomarías el nombre y lo mostrarías. Si quieres las fotos, entonces tengo que modificar el backend :P
 */
app.post("/assign/:name", (req, res) => {
    var json = readJSON();
    var found = findPerson(json.availableToAssignSecretFriend, req.params.name);
    
    if (!found) {
        found = findPerson(json.all, req.params.name);
        if (!found) {
            res.status("400").send("La persona '" + req.params.name + "' no se pudo encontrar en la lista registrada");
            return;
        } else {
            res.status("400").send("Hey! " + req.params.name + ", sin trampas! Ya tienes a tu amigo secreto");
            return;
        }
    }
    
    res.send(assignSecretFriend(json, found));
});

var port = process.env.VCAP_APP_PORT || 8000;
app.listen(port, () => {
    console.log("Listening to http://localhost:%s/", port);
});
/*
 * Ignora todo lo de abajo si quieres, es la lógica para seleccionar de forma random al amigo secreto 
 * y guardar los datos
 */
// ************** Logic to randomize secret friend
var jsonFilePath = path.join(__dirname, "resources/data/data.json");

function readJSON() {
    var content = fs.readFileSync(jsonFilePath);
    var json = JSON.parse(content);
    return json;
}

/*
 * Estos dos métodos find pudieran ser refactorizados para no duplicar código
 */
function findPerson(persons, name) {
    for(var i=0; i<persons.length; i++) {
        var person = persons[i];
        
        if (person.name == name) {
            return person;
        }
    }
}

function findAndRemove(array, name) {
    array.forEach(function(result, index) {
        if(result["name"] === name) {
            array.splice(index, 1);
            return;
        }
    });
}

function storeAssignation(json, originator, secretFriend) {
    findAndRemove(json.availableAsSecretFriend, secretFriend.name);
    findAndRemove(json.availableToAssignSecretFriend, originator.name);
    json.assigned.push({originator: originator, secretFriend: secretFriend});
    
    fs.writeFile(jsonFilePath, JSON.stringify(json), (err) => {
        if (err) {
            console.log(err);
            throw err;
        }
    });
}

function assignSecretFriend(json, originator) {
    var copy = JSON.parse(JSON.stringify(json.availableAsSecretFriend));
    findAndRemove(copy, originator.name);
    var randomIndex = Math.floor(Math.random() * copy.length);
    var secretFriend = copy[randomIndex];
    
    storeAssignation(json, originator, secretFriend);
    return {originator: originator, secretFriend: secretFriend};
}


function secretFriend(){
	var name = req.body.name;
	console.log(name);
}