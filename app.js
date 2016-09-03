var express = require('express');
var app = express();

app.get('/', function(request, response){
  response.send('OK');
});

app.get('/cities', function(request, response){
  response.json('OK');
});

module.exports = app;
