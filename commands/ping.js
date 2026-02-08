const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Bot gecikmesini gösterir.'),
  async execute(interaction) {
    const sent = await interaction.reply({ content: 'Hesaplanıyor...', fetchReply: true });
    const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;
    await interaction.editReply(`Pong! Gecikme: ${roundtrip}ms.`);
  },
};
