var express = require('express');
var app = express();

var bodyParser = require('body-parser');
var urlEncode = bodyParser.urlencoded({ extended: false });

app.use(express.static('public'));

// app.get('/', function(request, response){
//   response.send('OK');
// });

var cities = {
  'Lotopia': 'some description',
  'Caspiana': 'caspiana description',
  'Indigo': 'indigo description'
};

app.get('/cities', function(request, response){
  response.json(Object.keys(cities));
});

app.post('/cities', urlEncode, function(request, response){
  var newCity = request.body;
  cities[newCity.name] = newCity.description;
  response.status(201).json(newCity.name);
});

module.exports = app;
