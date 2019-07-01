const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const fetch = require('node-fetch');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));
const url = "mongodb://localhost:27017/";

const darksky_key = '1f18c87e6e4fbe4f5856eb9aae157d94';

app.get('/Chart.bundle.min.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/chart.js/dist/Chart.bundle.min.js');
});
app.get('/bootstrap.min.css', function(req, res) {
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/css/bootstrap.min.css');
});
app.get('/jquery.slim.min.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/jquery/dist/jquery.slim.min.js');
});
app.get('/bootstrap.bundle.min.js', function(req, res) {
  res.sendFile(__dirname + '/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js');
});
let dbo 
MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {  // To insert a document into the collection
  if (err) throw err;
  dbo = db.db("mydb");
});

app.get('/api/:sensorNode', (request, response) => {
  const sensorNode = request.params.sensorNode;
  if(sensorNode == "all"){
    dbo.collection("Sensor").find({}).toArray((err, data) => {
      if (err) {
        console.log('error in get')
        response.end();
        return;
      }
      response.json(data);
    });
  }
  else {
    dbo.collection("Sensor").find({"sensorID": sensorNode}).toArray((err, data) => {
      if (err) {
        console.log('error in get')
        response.end(); 
        return;
      }
      response.json(data);
    });
  }
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  dbo.collection('Sensor').insertOne(data, (err, res) => {
  if (err) {
    throw err;
  }
  else 
    console.log('Added element to collection');
  });
  response.json(data);
});

app.get('/weather/:latlon', async (request, response) => {
  //DarkSky allows for upto 1000 free api calls per day. If more than this is required consider payment or another free api
  //console.log(request.params);
  const latlon = request.params.latlon.split(',');
  const lat = latlon[0];
  const lon = latlon[1];
  const api_url = `https://api.darksky.net/forecast/` + darksky_key + `/${lat},${lon}?units=si`;
  const fetch_response = await fetch(api_url);
  const weatherJson = await fetch_response.json();
  response.json(weatherJson);
});