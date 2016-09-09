//Flushes test database
//For use with testing POSTS which can affect initial index tests
var request = require('supertest');
var app = require('./app');

var redis = require('redis');
var client = redis.createClient();
client.select('test'.length);
client.flushdb();
console.log('database has been flushed');
