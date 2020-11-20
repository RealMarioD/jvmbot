const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');
client.config = config;

fs.readdir('./events/', (err, files) => {
    if(err) return console.error(err);
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
client.volume = 1;
client.party = {};

fs.readdir('./commands/', (err, folders) => {
    if(err) return console.error(err);
    folders.forEach(folder => {
        fs.readdir(`./commands/${folder}`, (err, files) => {
            if(err) return console.error(err);
            files.forEach(file => {
                if(!file.endsWith('.js')) return;
                const props = require(`./commands/${folder}/${file}`);
                const commandName = file.split('.')[0];
                client.commands.set(commandName, props);
                if(props.info.aliases) client.aliases.set(props.info.aliases, props);
            });
        });
    });
});

client.login(config.token);
// client.login(config.devToken);

module.exports = {
  client: client
};