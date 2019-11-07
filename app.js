//jshint esversion:6

//npm modules
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const jishoApi = require('unofficial-jisho-api');
const jisho = new jishoApi();

//use npm modules
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.set("view engine", "ejs");

//start server
app.get("/", function(req, res) {
  res.render("home", {});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//search word
app.post('/', function(req, res) {
  let query = req.body.query;
  let word, reading, translation, examples;

  jisho.searchForPhrase(query).then(result => {
    word = result.data[0].japanese[0].word;
    reading = result.data[0].japanese[0].reading;
    translation = [];
    for (let i = 0; i < result.data[0].senses.length; i++) {
      translation.push(result.data[0].senses[i].english_definitions);
    }

    jisho.searchForExamples(word).then(result => {

      examples = [];

      for (let i = 0; i < 3; ++i) {
        let example = result.results[i];
        examples.push(example.kanji);
        examples.push(example.kana);
        examples.push(example.english);

      }


      res.render("search", {
        word: word,
        reading: reading,
        translation: translation,
        examples: examples
      });

    });

  });


});
