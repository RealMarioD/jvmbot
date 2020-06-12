const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
const ascii = require('ascii-table');
const table = new ascii().setHeading('Command', 'Status');
client.config = config;

fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      const event = require(`./events/${file}`);
      const eventName = file.split('.')[0];
      client.on(eventName, event.bind(null, client));
    });
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.queue = [];
client.dispatcher = {};
client.volume = 1.0;
client.party = {};

fs.readdir('./commands/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    if (!file.endsWith('.js')) return;
    const props = require(`./commands/${file}`);
    const commandName = file.split('.')[0];
    if(file) {
      table.addRow(file, '✅');
    }
    else {
      table.addRow(file, '❌');
    }
    client.commands.set(commandName, props);
    if(props.info.aliases) client.aliases.set(props.info.aliases, props);
  });
  console.log(table.toString());
});

client.login(config.token);
// client.login(config.devToken);

module.exports = {
  client: client
};