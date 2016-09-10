var express = require('express');

var bodyParser = require('body-parser');
var urlEncode = bodyParser.urlencoded({ extended: false });

// Redis Connection
var redis = require('redis');
// var redis = require("redis").createClient();
if (process.env.REDISTOGO_URL) {
  var rtg   = require("url").parse(process.env.REDISTOGO_URL);
  var client = redis.createClient(rtg.port, rtg.hostname);
  client.auth(rtg.auth.split(":")[1]);
} else {
  var client = redis.createClient();
  client.select((process.env.NODE_ENV || 'development').length);
}

// client.select((process.env.NODE_ENV || 'development').length);
// End Redis Connection
client.hset('cities', 'Lotopia', 'Description');
client.hset('cities', 'Caspiana', 'Description');
client.hset('cities', 'Indigo', 'Description');

var router = express.Router();

router.route('/')
  .get(function(request, response){
    client.hkeys('cities', function(error, names){
      if(error) throw error;
      response.json(names);
    });
  })
  .post(urlEncode, function(request, response){
    var newCity = request.body;
    if(!newCity.name || !newCity.description){
      response.sendStatus(400);
      return false;
    }
    client.hset('cities', newCity.name, newCity.description, function(error){
      if (error) throw error;
      response.status(201).json(newCity.name);
    });
  });

router.route('/:name')
  .delete(function(request, response){
    client.hdel('cities', request.params.name, function(error){
      if(error) throw error;
      response.sendStatus(204);
    });
  })
  .get(function(request, response){
    client.hget('cities', request.params.name, function(error, description){
      if(error) throw error;
      response.render('show.ejs', { city: { name: request.params.name,
                                            description: description}});
    });
  });

module.exports = router;
