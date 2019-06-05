const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

module.exports = class ParancsokCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'parancsok',
            group: 'util',
            memberName: 'parancsok',
            aliases: ['cmds', 'commands'],
            description: 'Megmutatja a parancsokat.',
            examples: ['p/parancsok, p/commands prefix'],
            args: [
                {
                    key: 'command',
                    prompt: '',
                    type: 'string',
                    default: 'list'
                }
            ]
        });    
    }

    run(msg, { command }) {
        const gaycommands = msg.client.registry.groups.get('admin').commands.map(m => m.name)
        var theprefix
        if(!msg.guild) {theprefix = '.'} else {
            if(!msg.guild.settings.get('prefix')) {theprefix = '.'} else {theprefix = msg.guild.settings.get('prefix')}
        }
        if(command === 'list') {

            let commandEmbed = new RichEmbed();

            commandEmbed.setAuthor(`Parancsok:`, msg.client.user.avatarURL)
                .setDescription(`Így szerezhetsz több információt egy parancsról: \`${theprefix}parancsok <parancs>\``)
            
            if (config.owners.includes(msg.author.id)) {
                commandEmbed.addField('Admin', `${msg.client.registry.groups.get('admin').commands.map(m => `\`${theprefix}${m.name}\``)}`);
            }
            commandEmbed.addField('Fun', `${msg.client.registry.groups.get('fun').commands.map(m => `\`${theprefix}${m.name}\``)}`)
                .addField('Utilities', `${msg.client.registry.groups.get('util').commands.map(m => `\`${theprefix}${m.name}\``)}`)
                .setFooter(msg.author.tag, msg.author.avatarURL)
                .setTimestamp()
                .setColor('#7289da');
            
            msg.channel.send(commandEmbed)

        } else {
            command = command.toLowerCase()
            if(msg.client.registry.commands.get(command) === undefined) {
                msg.channel.send(`Ez a parancs nem létezik!`)
            } else {
                var reg = msg.client.registry.commands.get(command)
                if(gaycommands.includes(command)) {
                    if(config.owners.includes(msg.author.id)) {
                        return msg.embed(new RichEmbed()
                            .setDescription(`:satellite: | Információ a **${theprefix}${reg.name}** parancsról`)
                            .addField('Álnevek:', `${reg.aliases.length === 0 ? 'Nincsenek álnevek.' : reg.aliases}`)
                            .addField('Leírás:', `${reg.description === undefined ? 'Nincs leírás.' : reg.description}`)
                            .addField('Példák:', `${reg.examples === null ? 'Nincsenek példák.' : `\`${reg.examples}\``}`)
                            .setFooter(msg.author.tag, msg.author.avatarURL)
                            .setTimestamp()
                            .setColor('#7289da')
                        )
                    } else {
                        msg.reply(`Nincs jogod megnézni ezt a parancsot!`)
                    }
                } else {
                    return msg.embed(new RichEmbed()
                        .setDescription(`:satellite: | Információ a **${theprefix}${reg.name}** parancsról`)
                        .addField('Álnevek:', `${reg.aliases.length === 0 ? 'Nincsenek álnevek.' : reg.aliases}`)
                        .addField('Leírás:', `${reg.description === undefined ? 'Nincs leírás.' : reg.description}`)
                        .addField('Példák:', `${reg.examples === null ? 'Nincsenek példák.' : `\`${reg.examples}\``}`)
                        .setFooter(msg.author.tag, msg.author.avatarURL)
                        .setTimestamp()
                        .setColor('#7289da')
                    )
                }
            }
        }

    }

}