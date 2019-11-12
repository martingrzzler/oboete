let word = $(".word-heading").text()
let wordArray = parseKanji(word);
for (let i = 0; i < wordArray.length; i++) {
  $("<button/>", {
    text: wordArray[i],
    id: "kanji" + i,
    class: "btn btn-outline-dark kanji-button"

  }).appendTo(".used-kanji");
}


$(".kanji-button").click(function (event) {
  console.log(event.target);
});


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
