var express = require('express');
var app = express();
var path = require('path');

app.use('/resources', express.static(__dirname + '/resources'));



app.get('/',function(req,res){
	res.sendFile('index.html',{ root: '/xmasApp'});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

