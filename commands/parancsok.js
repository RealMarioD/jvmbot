const fs = require('fs');
const { MessageEmbed } = require('discord.js');
exports.run = (client, message, args) => {
    const helpEmbed = new MessageEmbed()
        .setColor('0x56f442')
        .setTitle('🗒 **| Parancsok**');

    if(!args.length) {
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

        return message.channel.send(helpEmbed);
    }
    try {
        const commandFile = require(`./${args[0].toLowerCase()}.js`);
        message.channel.send(new MessageEmbed()
            .setColor('#56f442')
            .setTitle(`\`${client.config.prefix}${args[0].toLowerCase()}\``)
            .setDescription(!commandFile.info.syntax ? '' : `**Értékek:** ${commandFile.info.syntax}\n**Információ:** ${commandFile.info.description}\n${commandFile.info.requiredPerm ? `__Ezt a parancsot csak ${commandFile.info.requiredPerm} rangúak tudják használni!__` : ''}`)
        );
    }
    catch(err) {
        message.channel.send('> ❌ **| Ez a parancs nem létezik!**');
    }
};

exports.info = {

    name: 'parancsok',
    category: 'egyéb',
    syntax: '<parancs>',
    description: 'Visszaadja az összes parancsot.',
    requiredPerm: null,
    aliases: ['parancs', 'commands', 'com', 'comm', 'command', 'help']

};
