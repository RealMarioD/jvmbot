const { getDate, sleep } = require('../util.js');
const users = require('../assets/users.json');
const fs = require('fs');
module.exports = (client, message) => {

    if(message.content == '<@!585811477601189889>' || message.content == '<@585811477601189889>') {
        message.channel.send('A prefixem `.`\nA `.parancsok`-al megismerheted az összes parancsom!');
    }

    if(message.channel.id === '584445312312147996' &&
    !message.member._roles.includes(client.config.adminID)) {
        sleep(1000).then(() => {
            message.delete();
        });
    }

    if(message.author.bot) return;
    if(client.user.id == client.config.devID && !message.content.startsWith(client.config.devPrefix)) return addXP();
    if(client.user.id == client.config.normalID && !message.content.startsWith(client.config.prefix)) return addXP();

    const args = message.content.slice(1).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    let commandObject = client.commands.get(commandName);

    if(!commandObject) {
		client.aliases.forEach((cmdObject, alias) => {
			if(alias.includes(commandName)) {
                commandObject = client.commands.get(cmdObject.info.name);
			}
		});
		if(!commandObject) return;
	}

    switch(commandObject.info.requiredPerm) {
        case 'developer':
            if((client.config.ownerID == message.author.id || message.member._roles.includes(client.config.fejlesztoID)) && message.channel.id === client.config.commandsIDs.test) runCommand();
            else noPerms('Fejlesztő');
            break;

        case 'admin':
            if((client.config.ownerID == message.author.id || message.member._roles.includes(client.config.adminID)) && message.channel.id === client.config.commandsIDs.test) runCommand();
            else noPerms('Admin');
            break;

        case 'moderator':
            if(client.config.ownerID == message.author.id || message.member._roles.includes(client.config.moderatorID)) runCommand();
            else noPerms('Moderátor');
            break;

        default:
            if((Object.values(client.config.commandsIDs).includes(message.channel.id)) || (commandObject.info.name === 'igazol' && message.channel.id === client.config.igazolID) || (commandObject.info.category === 'music' && message.channel.id === client.config.musicID)) runCommand();
            break;
    }

    function runCommand() {
        try {
            commandObject.run(client, message, args);
            console.log(`${commandName} parancs futtatva @ ${getDate()}`);
        }
        catch(err) {
            if(err.code === 'MODULE_NOT_FOUND') {return;}
            else {
                console.error(err);
            }
        }
    }

    function noPerms(perm) {
        message.reply(`\`${perm}\` jog szükséges ennek a parancsnak a használatához!`);
    }

    function addXP() {
        if(!users[message.author.id]) {
            users[message.author.id] = {
                money: 0,
                lastSavedTime: null,
                dailyDay: 1,
                xp: 1,
                level: 0,
                lastMessageTime: message.createdTimestamp
            };
        }
        if(!users[message.author.id].lastMessageTime) {
            users[message.author.id].lastMessageTime = message.createdTimestamp;
            users[message.author.id].xp = 1;
            users[message.author.id].level = 0;
        }
        else if(users[message.author.id].lastMessageTime + 4000 <= message.createdTimestamp) {
            users[message.author.id].lastMessageTime = message.createdTimestamp;
            ++users[message.author.id].xp;
            let összeg = 35;
            for(let i = 1; i <= users[message.author.id].level; i++) összeg += (i - 1) * 40 + 20;
            if(users[message.author.id].xp === összeg) ++users[message.author.id].level;
        }
        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
    }
};