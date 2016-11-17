var express = require("express");
var app = express();
var fs = require("fs");
var path = require("path");

// ************** Server only methods
app.set('views', __dirname + '/views');
app.use('/resources', express.static(__dirname + '/resources'));
app.use('/views', express.static(__dirname + '/views'));
app.set('view engine', 'pug');

app.get("/", (req, res) => {
    var json = readJSON();
    
    res.render("index",{
        persons: json.availableToAssignSecretFriend
    });
});


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


// ************** Logic to randomize secret friend
var jsonFilePath = path.join(__dirname, "resources/data/data.json");

function readJSON() {
    var content = fs.readFileSync(jsonFilePath);
    var json = JSON.parse(content);
    return json;
}


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
