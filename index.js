const { Client, Events, GatewayIntentBits, ActivityType } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
const mongoose = require('mongoose');

const config = require('./config.json');

process.on('uncaughtException', (err) => {
  if (err.message && err.message.includes('No compatible encryption modes')) {
    console.error('Ses kanalı şu an desteklenmiyor (şifreleme uyumsuzluğu). config.json içinde "voice"u boş bırakabilirsin.');
    return;
  }
  throw err;
});

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.commands = new Map();
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  }
}

if (config.mongokey && config.mongokey.length > 0) {
  const opts = { dbName: 'b1long-v14' };
  mongoose.connect(config.mongokey, opts)
    .then(() => console.log('MongoDB bağlantısı başarılı.'))
    .catch(async (err) => {
      console.error('MongoDB bağlantı hatası:', err.message);
      if (err.message && err.message.includes('querySrv')) {
        const direct = config.mongokey
          .replace('mongodb+srv://', 'mongodb://')
          .replace('.mongodb.net/', '.mongodb.net:27017/');
        const hasParams = direct.includes('?');
        const directUrl = direct + (hasParams ? '&' : '?') + 'directConnection=true&tls=true';
        console.log('Direct connection deneniyor...');
        mongoose.connect(directUrl, opts).then(() => console.log('MongoDB (direct) başarılı.')).catch((e) => console.error('MongoDB direct de başarısız:', e.message));
      }
    });
}

client.once(Events.ClientReady, async (c) => {
  console.log(`Bot hazır: ${c.user.tag}`);

  client.user.setActivity(config.status || 'Discord', { type: ActivityType.Playing });
  if (config.voice && config.voice.length > 0) {
    try {
      const channel = await client.channels.fetch(config.voice);
      if (channel && channel.isVoiceBased()) {
        const { joinVoiceChannel } = require('@discordjs/voice');
        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        connection.on('error', (err) => {
          console.error('Ses bağlantı hatası (bot çalışmaya devam ediyor):', err.message);
        });
        console.log('Ses kanalına girildi: ' + channel.name);
      }
    } catch (err) {
      console.error('Ses kanalına girilemedi:', err.message);
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    const reply = { content: 'Bu komut çalıştırılırken bir hata oluştu.', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply).catch(() => {});
    } else {
      await interaction.reply(reply).catch(() => {});
    }
  }
});

client.login(config.token);
