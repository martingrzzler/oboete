//jshint esversion:6

$(".mnemonic").each(function() {
  let mnemonicArray = $(this).text().split(" ");
  $.each(mnemonicArray, function(i) {
    if (mnemonicArray[i].match("^#")) {
      mnemonicArray[i] = '<span class="radical-span">' + mnemonicArray[i].slice(1, mnemonicArray.length) + '</span>';
    } else if (mnemonicArray[i].match("^@")) {
      mnemonicArray[i] = '<span class="kanji-span">' + mnemonicArray[i].slice(1, mnemonicArray.length) + '</span>';
    }
    });
    let output = mnemonicArray.join(' ');
    $(this).html(output);

});
