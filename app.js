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



// variables
let query;
let word, reading, translation, examples;

//search word

app.post('/search', function(req, res) {
  query = req.body.query;

  jisho.searchForPhrase(query).then(result => {

    if (result.data.length === 0) {
      res.render("queryError", {});
    } else {
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
        res.redirect("/search/" + word);
      });


    }

  });


});

app.get("/search/:word", function(req, res) {
  let kanjiArray = parseKanji(word);

  function isKanji(ch) {
    return (ch >= "\u4e00" && ch <= "\u9faf") ||
      (ch >= "\u3400" && ch <= "\u4dbf");
  }

  function basicParser(str, condition) {
    let result = [];

    for (let i = 0; i < str.length; ++i) {
      if (condition(str[i])) {
        result.push(str[i]);
      }
    }

    return result;
  }

  function parseKanji(str) {
    return basicParser(str, isKanji);
  }

  res.render("search", {
    word: word,
    reading: reading,
    translation: translation,
    examples: examples,
    kanjiArray: kanjiArray

  });
});


// redirect to Kanji Route
let kanjiQuery;

app.get("/kanji/:kanji", function(req, res) {
  kanjiQuery = req.params.kanji;




  jisho.searchForKanji(kanjiQuery).then(result => {
    let kanjiInfo = {
      meaning: result.meaning,
      onyomi: result.onyomi,
      kunyomi: result.kunyomi,
      jlptLevel: result.jlptLevel,
      parts: result.parts,
      radical: result.radical.symbol
    };
    kanjiInfo.parts.forEach(function(part) {
      if (part === kanjiInfo.radical) {
        kanjiInfo.radical = "";
      }
    });

    res.render("kanji", {
      kanji: kanjiQuery,
      kanjiInfo: kanjiInfo,
      meaningMnemonics: meaningMnemonics
    });
  });
});

// post mnemonics to kanji
let readingMnemonics = [];
let meaningMnemonics = [];

app.post("/kanji/:kanji", function(req, res) {

  let meaningPost = req.body.meaningPost;
  let readingPost = req.body.readingPost;
  meaningMnemonics.push(meaningPost);
  readingMnemonics.push(readingPost);
  res.redirect("/kanji/:kanji");

});

// get radical route
app.get("/radical/:radical", function(req, res) {
  let radicalQuery = req.params.radical;

  jisho.searchForKanji(radicalQuery).then(result => {
    let kanjiInfo = {
      meaning: result.meaning,
      onyomi: result.onyomi,
      kunyomi: result.kunyomi,
      jlptLevel: result.jlptLevel,
      parts: result.parts,
      radical: result.radical.symbol
    };
    kanjiInfo.parts.forEach(function(part) {
      if (part === kanjiInfo.radical) {
        kanjiInfo.radical = "";
      }
    });

    res.render("radical", {
      radical: radicalQuery,
      kanjiInfo: kanjiInfo
    });
  });

});
// set up port
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
