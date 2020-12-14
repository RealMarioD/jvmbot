const users = require('../../assets/users.json');
const Canvas = require('canvas');
const Discord = require('discord.js');
function applyText(canvas, text) {
    const ctx = canvas.getContext('2d');
    let fontSize = 50;
    do ctx.font = `bold ${fontSize -= 10}px sans-serif`;
    while(ctx.measureText(text).width > canvas.width - 510);
    return ctx.font;
}

exports.run = async (client, message, args) => {
    message.guild.members.fetch();
    let member = message.member;
    if(args.length > 0) {
        if(message.mentions.members.size > 0) member = message.mentions.members.first();
        else if(message.guild.members.cache.find(x => x.user.id == args[0])) member = message.guild.members.cache.find(x => x.user.id == args[0]);
        else if(message.guild.members.cache.find(x => x.user.username.toLowerCase().includes(args.join(' ').toLowerCase()))) member = message.guild.members.cache.find(x => x.user.username.toLowerCase().includes(args.join(' ').toLowerCase()));
    }
    if(!users[member.id]) {
        users[member.id] = {
            xp: 0,
            level: 0
        };
    }
    else if(users[member.id].level == undefined) {
        users[member.id].xp = 0;
        users[member.id].level = 0;
    }
    let final = 35;
    for(let i = 1; i <= users[member.id].level; i++) final += (i - 1) * 40 + 20;
    let toRemove = 35;
    for(let j = 1; j < users[member.id].level; j++) toRemove += (j - 1) * 40 + 20;
    if(users[member.id].level === 0) toRemove = 0;
    const canvas = Canvas.createCanvas(900, 220);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#7f7f7f';
    ctx.fillRect(208 + (users[member.id].xp - toRemove) / (final - toRemove) * 659, 151, 659 - (users[member.id].xp - toRemove) / (final - toRemove) * 659, 24);
    ctx.fillStyle = `#${users[member.id].colour || 'ffffff'}`;
    ctx.fillRect(208, 151, (users[member.id].xp - toRemove) / (final - toRemove) * 659, 24);
    const background = await Canvas.loadImage('./assets/imgs/card.png');
    const textname = member.user.tag;
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.font = applyText(canvas, textname);
    ctx.fillText(textname, 213, 121);
    ctx.font = 'bold 28px sans-serif';
    let i = 1;
    let j = 1;
    Object.keys(users).map(key => ({
        key: key, value: users[key]
    })).sort((first, second) => (second.value.xp - first.value.xp)).forEach(sorteddata => {
        if(sorteddata.key == member.id) j = i;
        i++;
    });
    let canvasWidth = ctx.measureText(`#${j}`).width;
    ctx.fillText(`#${j}`, 280, 65);
    ctx.font = 'bold 28px sans-serif';
    canvasWidth = ctx.measureText(users[member.id].level).width;
    ctx.fillText(users[member.id].level, 460, 65);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    canvasWidth = ctx.measureText(`${users[member.id].xp}/${final}`).width;
    ctx.fillText(`${users[member.id].xp}/${final}`, 812 - canvasWidth, 145);
    ctx.beginPath();
    ctx.arc(109, 110, 91, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = `#${users[member.id].colour || 'ffffff'}`;
    ctx.fillRect(18, 19, 182, 182);
    ctx.beginPath();
    ctx.arc(109, 110, 83, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(avatar, 26, 27, 166, 166);
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), './assets/imgs/level.png');
    message.channel.send('', attachment);

};

exports.info = {

    name: 'rank',
    category: 'xp',
    syntax: '',
    description: 'Kiírja, mennyi XP-d van.',
    requiredPerm: null,
    aliases: ['xp', 'szint']
};