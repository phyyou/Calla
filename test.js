const { parse } = require("node-html-parser");
const request = require("request");

request.get(
  {
    uri: "https://imslp.org/wiki/File:PMLP527626-003-1_piano_sonata_no_1_mvt_1.mp3",
  },
  function (error, response, body) {
    const document = parse(response.body);
    const fileLink = document.querySelector("a.internal").attrs.href;
    const songInfoLink = document
      .querySelector("li#mw-imagepage-linkstoimage-ns0")
      .querySelector("a").attrs.href;

    console.log(fileLink, songInfoLink)
  }
);
