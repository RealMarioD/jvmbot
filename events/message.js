const { getDate, sleep, webHook } = require('../util.js');
const users = require('../assets/users.json');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
module.exports = (client, message) => {

    if(message.content == '<@!585811477601189889>' || message.content == '<@585811477601189889>') message.channel.send('A prefixem `.`\nA `.parancsok`-al megismerheted az összes parancsom!');

    // Deletes every message in igazol unless author is admin
    if(message.channel.id == client.config.channels.igazol && !message.member._roles.includes(client.config.roles.admin)) {
        sleep(1000)
        .then(() => {
            message.delete();
        });
    }

    if(message.author.bot) return;

    const splitContent = message.content.split(':');
    if(splitContent.some(x => client.emojis.cache.find(e => e.name == x) &&
        (!client.emojis.cache.find(e => e.name == x).available ||
        client.emojis.cache.find(e => e.name == x).animated ||
        client.emojis.cache.find(e => e.name == x).guild.name == 'j v m b o t'))) webHook(splitContent, message);

    if(client.user.id == client.config.devID && !message.content.startsWith(client.config.devPrefix)) return; // no xp to not fuck up roles and such
    if(client.user.id == client.config.normalID && !message.content.startsWith(client.config.prefix)) return addXP();

    const args = message.content.slice(1).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    let commandObject = client.commands.get(commandName);

    if(!commandObject) {
		client.aliases.forEach((cmdObject, alias) => {
			if(alias.includes(commandName)) commandObject = client.commands.get(cmdObject.info.name);
		});
		if(!commandObject) return;
	}

    switch(commandObject.info.requiredPerm) {
        case 'developer':
            if(client.config.ownerID == message.author.id || message.member._roles.includes(client.config.roles.fejleszto)) {
                if(message.channel.id == client.config.commandsIDs.test) runCommand();
                else {
                    message.reply('hint hint, rossz channel :eyes:')
                    .then(msg => {
                        sleep(10000)
                        .then(() => msg.delete());
                    });
                }
            }
            else noPerms('Fejlesztő');
            break;

        case 'admin':
            if(client.config.ownerID == message.author.id || message.member._roles.includes(client.config.roles.admin)) {
                if(message.channel.id == client.config.commandsIDs.test) runCommand();
                else {
                    message.reply('hint hint, rossz channel :eyes:')
                    .then(msg => {
                        sleep(10000)
                        .then(() => msg.delete());
                    });
                }
            }
            else noPerms('Admin');
            break;

        case 'moderator':
            if(client.config.ownerID == message.author.id || message.member._roles.includes(client.config.roles.moderator)) runCommand();
            else noPerms('Moderátor');
            break;

        default:
            if((Object.values(client.config.commandsIDs).includes(message.channel.id)) || (commandObject.info.name == 'igazol' && message.channel.id === client.config.channels.igazol) || (commandObject.info.category == 'music' && message.channel.id == client.config.commandsIDs.music)) runCommand();
            break;
    }

    function runCommand() {
        try {
            commandObject.run(client, message, args);
            console.log(`CMDRAN: ${commandObject.info.name} @ ${getDate()}`);
        }
        catch(err) {
            if(err.code == 'MODULE_NOT_FOUND') return;
            else console.error(err);
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
        const user = users[message.author.id];
        if(!user.lastMessageTime) {
            user.lastMessageTime = message.createdTimestamp;
            user.xp = 1;
            user.level = 0;
        }
        else if(user.lastMessageTime + 4000 <= message.createdTimestamp) {
            user.lastMessageTime = message.createdTimestamp;
            user.xp++;
            let final = 35;
            for(let i = 1; i <= user.level; i++) final += (i - 1) * 40 + 20;
            if(user.xp == final) {
                user.level++;
                console.log(`LVLUP: <${message.author.tag} (${message.author.id})> ${user.level - 1} => ${user.level}`);
                client.channels.cache.get(client.config.channels.levelup).send(message.author.toString(), new MessageEmbed()
                    .setTitle('Szintlépés!')
                    .setDescription(`Gratulálunk ${message.author.toString()}, szintet léptél!`)
                    .addField('Szinted:', user.level)
                    .setThumbnail(message.author.displayAvatarURL({ format: 'png', dynamic: true }))
                    .setColor('#00cc00')
                );
                const newRole = message.guild.roles.cache.find(x => x.name === `Lvl${user.level}`);
                if(newRole) {
                    message.member.roles.add(newRole)
                    .then(() => {
                        let roleHolder;
                        for(let i = 1; i < 6; i++) {
                            roleHolder = message.guild.roles.cache.find(role => role.name == `Lvl${user.level - i}`);
                            if(roleHolder && message.member._roles.includes(roleHolder.id)) {
                                message.member.roles.remove(roleHolder);
                                break;
                            }
                        }
                    });
                }
            }
        }
        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
    }

};