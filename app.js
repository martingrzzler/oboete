//jshint esversion:6

//npm modules
const express = require("express");
const bodyParser = require("body-parser");

//use npm modules
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//start server
app.get("/", function(req, res) {
  res.render("home", {});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
