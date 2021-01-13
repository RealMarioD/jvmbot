const { MessageEmbed } = require('discord.js');
const { getDate } = require('../../util');

exports.run = async (client, message, args) => {
    let member = message.member;
    if(args.length > 0) {
        if(message.mentions.members.size > 0) member = message.mentions.members.first();
        else if(message.guild.members.cache.find(x => x.user.id == args[0])) member = message.guild.members.cache.find(x => x.user.id == args[0]);
        else if(message.guild.members.cache.find(x => x.user.username.toLowerCase().includes(args.join(' ').toLowerCase()))) member = message.guild.members.cache.find(x => x.user.username.toLowerCase().includes(args.join(' ').toLowerCase()));
    }
    const users = {};
    const sortedUsers = [];
    let counter;
    message.guild.members.cache.forEach(m => {
        users[m.user.tag] = new Date(m.joinedTimestamp);
    });
    let i = 1;
    Object.keys(users).map(key => ({ key: key, value: users[key] })).sort((a, b)=>a.value - b.value).forEach(c=> {
        sortedUsers.push(`${i}. ${c.key}: ${new Date(c.value).toISOString().slice(0, 10).replace(/-/gi, '.') + ' ' + new Date(c.value).toISOString().slice(11, 19)}`);
        ++i;
    });
    for(let j = 0;j < sortedUsers.length;j++) if(sortedUsers[j].includes(member.user.tag)) counter = j + 1;
    const userRoles = [];
    member.roles.cache.sort((r, r2) => r2.position - r.position).forEach(r => {
        if(r.name !== '@everyone') userRoles.push(r);
    });
    const highest = userRoles.find(r => r.hexColor !== '#000000').hexColor;
    const embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(member)
        .setColor(highest)
        .addField('Csatlakozási hely', counter, true)
        .addField('Csatlakozás ideje', getDate(new Date(member.joinedTimestamp)), true)
        .addField('Regisztrálás ideje', getDate(new Date(member.user.createdTimestamp)), true)
        .addField(`Rangok [${userRoles.length}]`, userRoles.join(' '), true)
        .setTimestamp()
        .setFooter(`ID: ${member.user.id}`);
    message.channel.send(embed);
};

exports.info = {

    name: 'userinfo',
    category: 'egyéb',
    syntax: '',
    description: 'Információt nyújt rólad',
    requiredPerm: null,
    aliases: ['uinfo']

};