var express = require('express')
var app = express()
var path = require("path");

// Index Route
app.get('/', function(req, res) {
    res.send('Invalid Endpoint');
});

app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, 'public/index.html'));
})