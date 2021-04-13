const { MessageEmbed } = require('discord.js');
exports.run = (client, message, args) => {
    const helpEmbed = new MessageEmbed()
        .setColor('0x56f442')
        .setTitle('🗒 **| Parancsok**');

    let dev = false;

    if(message.content.endsWith('--slave')) {
        args = [];
        dev = true;
    }

    if(!args.length) {
        const categories = {};
        helpEmbed.description = 'Ha több infót akarsz megtudni egy parancsról: `.parancsok <parancs>`\n';
        client.commands.forEach(command => {
            categories[command.info.category] = [];
        });
        client.commands.forEach(command => {
            categories[command.info.category].push(`\`${command.info.name}\``);
        });

        if(!message.member._roles.includes(client.config.roles.fejleszto) || !message.member._roles.includes(client.config.roles.moderator) || dev) {
            delete categories['admin'];
            delete categories['dev'];
        }

        Object.keys(categories).forEach(category => {
            helpEmbed.addField(`**${category.substring(0, 1).toUpperCase()}${category.slice(1)}**\n`, categories[category].join(', '));
        });

        return message.channel.send(helpEmbed);
    }
    try {
        const commandFile = client.commands.get(args[0].toLowerCase());
        let reqPerm;
        switch(commandFile.info.requiredPerm) {
            case 'developer':
                reqPerm = 'Fejlesztői';
                break;

            case 'moderator':
                reqPerm = 'Moderátori';
                break;

            case 'admin':
                reqPerm = 'Adminisztrátori';
                break;
        }
        const cmdEmbed = new MessageEmbed()
            .setTitle(`\`${client.config.prefix}${args[0].toLowerCase()}\` ${reqPerm ? `- __${reqPerm}__ parancs` : ''}`);

        if(typeof commandFile.info.syntax == 'string') {
            if(commandFile.info.syntax) cmdEmbed.addField('Változók:', `\`.${commandFile.info.name} ${commandFile.info.syntax}\``);
        }
        else cmdEmbed.addField('Változók:', commandFile.info.syntax.map(s => `\`.${commandFile.info.name} ${s.syn}\` - ${s.desc}`).join('\n'));
        if(commandFile.info.description) cmdEmbed.addField('Információ:', commandFile.info.description); !reqPerm ? '' : `__Ezt a parancsot csak ${reqPerm} rangúak tudják használni!__`;
        if(commandFile.info.aliases) cmdEmbed.addField('Aliasok:', commandFile.info.aliases.map(c => '`' + c + '`').join(', '));

        message.channel.send(cmdEmbed);
    }
    catch(err) {
        message.channel.send('> ❌ **| Ez a parancs nem létezik!**');
    }
};

exports.info = {

    name: 'parancsok',
    category: 'egyéb',
    syntax: [
        { syn: '[parancs]', desc: 'A parancs amiről infót szeretnél lekérdezni.' }
    ],
    description: 'Visszaadja az összes parancsot.',
    requiredPerm: null,
    aliases: ['parancs', 'commands', 'command', 'help', 'hlep']

};
