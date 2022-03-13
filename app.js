// include package by setting a handle
var express = require('express');
var mysql = require('mysql');
var bodyParser  = require("body-parser");
var app = express();


// Configure express application, set app configurations in the express framework
// After setting this, the res.render() will look for files under /views folder and ends with .esj
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));


// Connecting to the mySQL server
var connection = mysql.createConnection(
  {
      host: 'database-2.c0pbv8ca91j5.us-east-1.rds.amazonaws.com',
      user: 'admin',
      password : 'qweasdzxc',
      database: 'user'
  }
);


// Connet to mysql
connection.connect(function(err) {
  if (err) throw err;
});


// when "/" page is requested, the callback function is called, called routing, usually we send out a page (html) file
// Client gets something from the server
app.get("/", function(req, res){
  // Find count of user in DB
  var q = 'SELECT COUNT(*) AS count FROM account';
  connection.query(q, function(err, result) {
    if(err) throw err;
    var count = result[0].count;
    // Render the target page with given file, we don't know how long it take to do the query
    // To make sure the render executes after query finishes
    // We can pass in data to the ejs file here
    res.render("home",{data: count});
  });
});


// Post route (Client post something to the server)
app.post('/register', function(req,res){
  // Obtain the client side info with the help of body-parser package
  var person = {
    password: req.body.password
  };

  // Insert the data into database, the syntax comes from the mysql.js package
  var q = "INSERT INTO account SET ?"
  connection.query(q, person, function(err, result){
    if(err) throw err;
    res.redirect("/"); //Redirect back to the given page
  });
});


// When "/joke" page is requested, the callback function is called, a different page is sent
app.get("/joke", function(req, res){
  console.log('REQUEST THE JOKE ROUTE');
  var joke = "<strong>What do you call a dog that does magic tricks?</strong> <em>A labracadabrador</em>.";
  res.send(joke);
});


// When "/random_num" page is requested, the callback function is called, a different page is sent
app.get("/random_num", function(req, res){
  var num = Math.floor((Math.random() * 10) + 1);
  res.send("Your lucky number is " + num);
});


// ports for accessing, and set the call back function
app.listen(3001, function () {
  console.log('App listening on port 3000!');
});


