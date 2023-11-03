const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hi')
    .setDescription('Replies with a greeting'),
  async execute(interaction) {
    await interaction.reply('Hello There!');
  },
};
