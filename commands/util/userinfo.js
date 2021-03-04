const { MessageEmbed } = require('discord.js');
const { getDate, findMember } = require('../../util');

exports.run = async (client, message, args) => {
    let member;
    if(args.length > 0) member = findMember(args[0], message);
    if(!member) member = message.member;
    const users = message.guild.members.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp).map(user => user.id);

    let position;
    for(let i = 0; i < users.length; i++) if(users[i] == member.user.id) position = i + 1;

    const userRoles = [];
    member.roles.cache.sort((r, r2) => r2.position - r.position).forEach(role => {
        if(role.name !== '@everyone') userRoles.push(role);
    });
    const embed = new MessageEmbed()
        .setAuthor(member.user.tag, member.user.displayAvatarURL())
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(member)
        .setColor(member.displayHexColor)
        .addField('Csatlakozási hely', position, true)
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
    aliases: ['whois']

};