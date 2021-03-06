var request = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);


describe('Requests to the rooth path', function(){
  it('Returns a 200 status code', function(done){
    request(app)
      .get('/')
      .expect(200, done);
  });

  it('Returns a HTML format', function(done){
    request(app)
      .get('/')
      .expect('Content-Type', /html/, done);
  });

  it('Returns an index file with Cities', function(done){
    request(app)
      .get('/')
      .expect(/cities/i, done);
  });
});

describe('Listing cities on /cities', function(){
  it('Returns 200 status code', function(done){
     request(app)
      .get('/cities')
      .expect(200, done);
  });

  it('Returns JSON format', function(done){
    request(app)
      .get('/cities')
      .expect('Content-Type', /json/, done);
  });

  it('Returns initial cities', function(done){
    request(app)
      .get('/cities')
      .expect(JSON.stringify(['Lotopia', 'Caspiana', 'Indigo']), done);
  });

  it('Validates city name and description', function(done){
    request(app)
      .post('/cities')
      .send('name=&description=')
      .expect(400, done);
  });
});

describe('Creating new cities', function(){

  before(function(){
  });

  it('Returns a 201 status code', function(done){
    request(app)
      .post('/cities')
      .send('name=Springfield&description=where+the+simpsons+live')
      .expect(201)
      .end(function(error, response){
        if(error) return done(error);
        client.flushdb();
        done();
      });
  });


  it('Returns the city name', function(done){
    request(app)
      .post('/cities')
      .send('name=Springfield&description=where+the+simpsons+live')
      .expect(/springfield/i)
      .end(function(error, response){
        if(error) return done(error);
        client.flushdb();
        done();
      });
  });
});

describe('Deleting cities', function(){
  before(function(){
    client.hset('cities', 'Banana', 'a tasty fruit');
  });

  after(function(){
    client.flushdb();
  })


  it('Returns a 204 status code', function(done){
    request(app)
      .delete('/cities/Banana')
      .expect(204)
      .end(function(error, response){
        if(error) return done(error);
        done();
      });
  });
});

describe('Shows city info', function(){
  before(function(){
    client.hset('cities', 'Banana', 'a tasty city');
  });

  after(function(){
    client.flushdb();
  });

  it('Returns 200 status code', function(done){
    request(app)
      .get('/cities/Banana')
      .expect(200, done);
  });

  it('Returns HTML format', function(done){
    request(app)
     .get('/cities/Banana')
     .expect('Content-Type', /html/, done);
  });

  it('Returns information for given city', function(done){
    request(app)
     .get('/cities/Banana')
     .expect(/tasty/, done);
  });
});
