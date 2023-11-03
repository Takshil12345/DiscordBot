const { SlashCommandBuilder, codeBlock } = require('discord.js');
const cheerio = require('cheerio');
require('dotenv').config();
// console.log(process.env.uid, process.env.tokenid);
module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics-fetcher')
    .setDescription('Fetches the lyrics of the song you are listening to'),
  async execute(interaction) {
    let result = interaction.guild.members.cache.get(interaction.user.id);
    // console.log(result.presence.activities);
    const songName = result.presence.activities[0].details;
    const songArtist = result.presence.activities[0].state;
    console.log(songName, songArtist);

    let lyrics = await getLyrics(songName, songArtist);
    // console.log(lyrics);

    lyrics = lyrics.substring(0, Math.min(lyrics.length, 1000));
    const highlighted = codeBlock('js', lyrics);
    interaction.editReply(`${highlighted}`);
  },
};

async function scrapeLyrics(urlToScrape) {
  const url = urlToScrape;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    const result = $('pre#lyric-body-text').text();
    // console.log(result);
    return result;
  } catch (error) {
    console.error(`Error fetching the page: ${error}`);
    throw error; // Rethrow the error to handle it outside the function if needed
  }
}

async function getLyrics(songName, songArtist) {
  const songNameFormatted = encodeURIComponent(songName);
  const songArtistFormatted = encodeURIComponent(songArtist);
  //   console.log(songNameFormatted, songArtistFormatted);
  const res = await fetch(
    `https://www.stands4.com/services/v2/lyrics.php?uid=${process.env.uid}&tokenid=${process.env.tokenid}&term=${songNameFormatted}&artist=${songArtistFormatted}&format=json`
  );
  const data = await res.json();
  //   console.log(data);
  const urlToScrape = data.result[0]['song-link'];
  const result = await scrapeLyrics(urlToScrape);
  //   console.log(result);
  return result;
}
