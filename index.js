const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
app.use(express.json({ limit: '1mb' }));
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));

const url = "mongodb://localhost:27017/";

/*
MongoClient.connect(url, function(err, db) {  // To insert a document into the collection
  if (err) throw err;
  const dbo = db.db("mydb");
  dbo.collection("Sensor").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
    db.close();
  });
});
*/ 
MongoClient.connect(url, function(err, db) {  // To insert a document into the collection
  	if (err) throw err;
  	const dbo = db.db("mydb");

 	app.get('/api', (request, response) => {
		console.log(dbo);
		dbo.collection("Sensor").find({}).toArray((err, data) => {
    	if (err) {
    		console.log('error in get')
      		response.end();
      		return;
    	}
    	response.json(data);
  		});
	});

	app.post('/api', (request, response) => {
  		const data = request.body;
  		const timestamp = Date.now();
  		data.timestamp = timestamp;
  		dbo.collection('Sensor').insertOne(data, (err, res) => {
  		if (err) 
  			throw err;
  		else 
  			console.log('Added element to collection');
  		});
  	response.json(data);
	});
});


/*const Datastore = require('nedb');
const app = express();
app.use(express.json({ limit: '1mb' }));
app.listen(3000, () => console.log('listening at 3000'));
app.use(express.static('public'));

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
  });
});

app.post('/api', (request, response) => {
  const data = request.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  database.insert(data);
  response.json(data);
});
*/
