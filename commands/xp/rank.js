const users = require('../../assets/users.json');
const Canvas = require('canvas');
const Discord = require('discord.js');
function applyText(canvas, text) {
    const ctx = canvas.getContext('2d');
    let fontSize = 50;
    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while(ctx.measureText(text).width > canvas.width - 510);
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
    const canvas = Canvas.createCanvas(900, 220);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./assets/imgs/card.png');
    const canvasLevel = await Canvas.loadImage('./assets/imgs/level.png');
    const restOfLevel = await Canvas.loadImage('./assets/imgs/rest.png');
    const textname = member.user.tag;
    ctx.drawImage(canvasLevel, 12, 203, (users[member.id].xp - toRemove) / (final - toRemove) * 615, 7);
    ctx.drawImage(restOfLevel, 12 + (users[member.id].xp - toRemove) / (final - toRemove) * 615, 203, 615 - (users[member.id].xp - toRemove) / (final - toRemove) * 615, 7);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.font = applyText(canvas, textname);
    ctx.fillStyle = '#fceaa8';
    ctx.fillText(textname, 234, 73);
    ctx.font = '30px sans-serif';
    let i = 1;
    let j = 1;
    Object.keys(users).map(key => ({
        key: key, value: users[key]
    })).sort((first, second) => (second.value.xp - first.value.xp)).forEach(sorteddata => {
        if(sorteddata.key == member.id) j = i;
        i++;
    });
    let canvasWidth = ctx.measureText(`#${j}`).width;
    ctx.fillText(`#${j}`, 264 - canvasWidth / 2, 175);
    ctx.font = 'bold 24px sans-serif';
    canvasWidth = ctx.measureText(users[member.id].level).width;
    ctx.fillText(users[member.id].level, 765 - canvasWidth / 2, 75);
    canvasWidth = ctx.measureText(users[member.id].xp).width;
    ctx.fillText(users[member.id].xp, 771 - canvasWidth, 181);
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#7f7f7f';
    canvasWidth = ctx.measureText(final).width;
    ctx.fillText(final, 788, 181);
    ctx.beginPath();
    ctx.arc(121, 110, 55, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(avatar, 65, 54, 111, 111);
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