const { MessageEmbed } = require('discord.js');
const users = require('../../assets/users.json');
const { sortFields } = require('../../util');

exports.run = (client, message) => {
    const sortedUsers = [];
    const fieldHolder = [];
    const embed = new MessageEmbed()
        .setTitle('Event ranglista')
        .setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true }))
        .setColor('#DB6206')
        .setTimestamp();

    Object.keys(users).forEach(key => {
        if(users[key].eventStats) sortedUsers.push({ key: key, value: users[key] });
    });
    sortedUsers.sort((first, second) => (second.value.eventStats - first.value.eventStats));

    let position = 0;
    for(let i = 0; i < sortedUsers.length; i++) {
        if(message.guild.members.cache.find(x => x.id == sortedUsers[i].key) && sortedUsers[i].value.eventStats) {
            position++;
            fieldHolder.push({
                title: `__${position}.__ **${message.guild.members.cache.find(x => x.id == sortedUsers[i].key).user.tag}**`,
                desc: `Összes meghallgatások száma: \`${sortedUsers[i].value.eventStats}\``
            });
        }
    }

    return message.channel.send('Kérlek, várj...')
    .then(msg => {
        if(!fieldHolder.length) {
            embed.setFooter('Oldal: 1/1');
            return msg.edit('', embed);
        }
        msg.react('⬅️');
        msg.react('➡️');
        sortFields(0, embed, fieldHolder, msg, message);
    });

};

exports.info = {

    name: 'eventstats',
    category: 'szórakozás',
    syntax: '',
    description: 'Meglepi adatok.',
    requiredPerm: null,

};