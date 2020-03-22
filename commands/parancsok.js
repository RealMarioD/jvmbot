const { error } = require('../util');
const fs = require('fs');
const Discord = require('discord.js');
exports.run = (client, message, args) => {
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('0x56f442')
        .setTitle('🗒 **| Parancsok**');
    if (args.length === 0) {
        const categories = {};
        helpEmbed.description = 'Ha több infót akarsz megtudni egy parancsról: `.parancsok <parancs>`\n';
        fs.readdirSync('./commands/').forEach(cmdfile => {
            cmdfile = cmdfile.replace('.js', '');
            const cmd = require(`../commands/${cmdfile}`);
            categories[cmd.info.category] = [];
        });
        fs.readdirSync('./commands/').forEach(cmdfile => {
            cmdfile = cmdfile.replace('.js', '');
            const cmd = require(`../commands/${cmdfile}`);
            categories[cmd.info.category].push(cmd.info.name);
        });

        if(!message.member._roles.includes(client.config.fejlesztoID)) {
            delete categories['admin'];
        }

        Object.keys(categories).forEach(category => {
            helpEmbed.addField(`**${category.substring(0, 1).toUpperCase()}${category.slice(1)}**\n`, categories[category].map(command => command), true);
        });

        // helpEmbed.description += `| \`${client.config.prefix}${cmdfile} ${cmd.info.syntax}\` | ${cmd.info.requiredPerm != null ? '__Admin Only!__' : ''}\n`;
        // helpEmbed.description = helpEmbed.description.replace('undefined', '');
        message.channel.send(helpEmbed);
    }
    else {
        try {
            const commandFile = require(`./${args[0].toLowerCase()}.js`);
            message.channel.send({
                embed: {
                    color: 0x56f442,
                    title: `\`\`${client.config.prefix}${args[0].toLowerCase()}\`\``,
                    description: (commandFile.info.syntax === '' ? '' : `**Értékek:** ${commandFile.info.syntax}\n`) +
                        `**Információ:** ${commandFile.info.description}\n${commandFile.info.requiredPerm != null ? '__Ezt a parancsot csak fejlesztők/adminok tudják használni!__' : ''}`
                }
            });
        }
        catch(e) {
            error(message.channel);
        }
    }
};

exports.info = {

    name: 'parancsok',
    category: 'egyéb',
    syntax: '<parancs>',
    description: 'Visszaadja az összes parancsot.',
    requiredPerm: null

};
