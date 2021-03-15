const { Client, Collection } = require('discord.js');
const client = new Client();
const config = require('./config');
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

client.commands = new Collection();
client.aliases = new Collection();

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

const tokens = require('./tokens');
client.login(tokens.main);
// client.login(tokens.dev);

module.exports = {
  client: client
};