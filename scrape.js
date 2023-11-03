const cheerio = require('cheerio');

const url = 'https://www.lyrics.com/lyric/35065270/Imagine+Dragons/Thunder';

fetch(url)
  .then((response) => response.text())
  .then((html) => {
    const $ = cheerio.load(html);

    const result = $('pre#lyric-body-text').text();
    console.log(result);
  })
  .catch((error) => {
    console.error(`Error fetching the page: ${error}`);
  });
