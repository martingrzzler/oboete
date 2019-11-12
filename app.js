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

// variables
let query;

//search word

app.post('/search', function(req, res) {
  query = req.body.query;
  let word, reading, translation, examples;

  jisho.searchForPhrase(query).then(result => {
    word = result.data[0].japanese[0].word;
    reading = result.data[0].japanese[0].reading;
    translation = [];
    for (let i = 0; i < result.data[0].senses.length; i++) {
      translation.push(result.data[0].senses[i].english_definitions);
    }

    jisho.searchForExamples(word).then(result => {

      examples = {
        kanji: [],
        kana: [],
        english: []
      };

      for (let i = 0; i < 3; ++i) {
        let example = result.results[i];
        examples.kanji.push(example.kanji);
        examples.kana.push(example.kana);
        examples.english.push(example.english);

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

// redirect to Kanji Route
app.get("/kanji", function(req, res) {

});
