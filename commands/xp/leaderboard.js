const users = require('../../assets/users.json');
const { MessageEmbed } = require('discord.js');
const { sortFields } = require('../../util');
exports.run = async (client, message) => {
    const embed = new MessageEmbed();
    let passedMsg;
    const fieldHolder = [];
    const startIndex = 0;
    const sortedUsers = Object.keys(users).map(key => ({
        key: key, value: users[key]
    })).sort((first, second) => (second.value.xp - first.value.xp));

    embed.setTitle(`${message.guild.name} ranglistája`)
        .setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true }))
        .setColor('#DB6206')
        .setTimestamp();

    let position = 0;
    for(let i = 0; i < sortedUsers.length; i++) {
        if(message.guild.members.cache.find(x => x.id == sortedUsers[i].key) && sortedUsers[i].value.xp > 0) {
            let összeg = 35;
            position++;
            for(let j = 1; j <= sortedUsers[i].value.level; j++) összeg += (j - 1) * 40 + 20;
            fieldHolder.push({
                title: `__${position}.__ **${message.guild.members.cache.find(x => x.id == sortedUsers[i].key).user.tag}**`,
                desc: `Szint: \`${sortedUsers[i].value.level}\`\nXP: \`${sortedUsers[i].value.xp}/${összeg}\``
            });
        }
    }
    return message.channel.send('Kérlek, várj...')
    .then(msg => {
        passedMsg = msg;
        if(!fieldHolder.length) {
            embed.setFooter('Oldal: 1/1');
            return passedMsg.edit('', embed);
        }
        msg.react('⬅️');
        msg.react('➡️');
        sortFields(startIndex, embed, fieldHolder, passedMsg, message);
    });
};

exports.info = {

    name: 'leaderboard',
    category: 'xp',
    syntax: '',
    description: 'Kiírja a top xp-vel rendelkező tagokat.',
    requiredPerm: null,
    aliases: ['lb']

};