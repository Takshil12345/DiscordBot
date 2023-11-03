require('dotenv').config();
const fs = require('fs');
const path = require('path');
const wait = require('node:timers/promises').setTimeout;

const {
  Client,
  IntentsBitField,
  ActivityType,
  Collection,
  Events,
} = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildPresences,
  ],
});

client.commands = new Collection();

const commandPaths = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandPaths)
  .filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandPaths, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

client.on('ready', (c) => {
  console.log(`Logged in as ${c.user.tag}!`);

  client.user.setActivity({
    name: 'Your Mama',
    type: ActivityType.Listening,
  });
});

// client.on('messageCreate', async (msg) => {
//   if (msg.author.bot) return;

//   let result = msg.guild.members.cache.get(msg.author.id);
//   // const songName = result.presence.activities[0].details;
//   // const songArtist = result.presence.activities[0].state;

//   // await getLyrics(songName, songArtist);
// });

async function getLyrics(songName, songArtist) {
  const songNameFormatted = encodeURIComponent(songName);
  const songArtistFormatted = encodeURIComponent(songArtist);
  console.log(songNameFormatted, songArtistFormatted);
  const res = await fetch(
    `https://www.stands4.com/services/v2/lyrics.php?uid=12159&tokenid=QLnBK9dmyACndLLO&term=${songNameFormatted}&artist=${songArtistFormatted}&format=json`
  );
  const data = await res.json();
  const urlToScrape = data.result[0]['song-link'];
  return;
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    if (interaction.commandName === 'lyrics-fetcher') {
      await interaction.deferReply();
      await wait(10000);
      await command.execute(interaction);
    }
  } catch (error) {
    console.error(`Error encountered : ${error}`);
    interaction.reply('Error Encounterde');
  }

  // console.log(interaction.user.id);
  // console.log(
  //   interaction.guild.members.cache.get(interaction.user.id).presence.activities
  // );
});

client.login(process.env.token);
