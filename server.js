// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// init sqlite db
var fs = require('fs');
var dbFile = './.data/sqlite.db';
var exists = fs.existsSync(dbFile);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
db.serialize(function(){
  if (!exists) {
    db.run('CREATE TABLE ThoughtExperimentData (datapoint TEXT)');
    console.log('New table ThoughtExperimentData created!');
    
    // insert default datapoint
    db.serialize(function() {
      db.run('INSERT INTO ThoughtExperimentData (datapoint) VALUES ("Left"), ("Right"), ("Right")');
    });
  }
  else {
    console.log('Database "ThoughtExperimentData" ready to go!');
    db.each('SELECT * from ThoughtExperimentData', function(err, row) {
      if ( row ) {
        console.log('record:', row);
      }
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/configurator.html');
});

app.get('/experience', function(request, response) {
  response.sendFile(__dirname + '/views/experience.html');
});


// endpoint to add datapoint in the database
app.get('/addDatapoint', function(request, response) {
  console.log( "secret?", (process.env.SECRET == request.query.secret ) );
  // could be used to not add content if the secret doesn't match
  // see .env to setup the secret code server side
  var stmt = db.prepare("INSERT INTO ThoughExperimentData VALUES (?)");
  stmt.run( request.query.datapoint );
  stmt.finalize();
  response.send("added");
});

// endpoint to get all the datapoints in the database
app.get('/getDatapoints', function(request, response) {
  db.all('SELECT * from ThoughExperimentData', function(err, rows) {
    response.send(JSON.stringify(rows));
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
