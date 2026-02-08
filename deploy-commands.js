const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

const config = require('./config.json');

const commands = [];
const commandsPath = join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
  }
}

const rest = new REST().setToken(config.token);

(async () => {
  try {
    console.log(`${commands.length} slash komutu kaydediliyor...`);
    const data = await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands },
    );
    console.log(`${data.length} slash komutu Discord'a kaydedildi.`);
  } catch (err) {
    console.error('Komut kayıt hatası:', err);
  }
})();
