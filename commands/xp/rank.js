const users = require('../../assets/users.json');
const Canvas = require('canvas');
const { MessageAttachment } = require('discord.js');
const { findMember } = require('../../util');
function applyText(canvas, text) {
    const ctx = canvas.getContext('2d');
    let fontSize = 50;
    do ctx.font = `bold ${fontSize -= 10}px sans-serif`;
    while(ctx.measureText(text).width > canvas.width - 510);
    return ctx.font;
}

function shadowColour(ogColour) {
    const numbers = '0123456789abcdef';
    let sum = 0;
    for(let i = 0; i < 6; i++) sum += 15 - numbers.indexOf(ogColour[i]);
    return Math.round(sum / 6) > 7 ? 'white' : 'black';
}

exports.run = async (client, message, args) => {
    let member;
    if(args.length > 0) member = findMember(args[0], message);
    if(!member) member = message.member;
    if(!users[member.id]) {
        users[member.id] = {
            xp: 0,
            level: 0
        };
    }
    else if(users[member.id].level === undefined) {
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
    let background;
    if(!users[member.id].bg) background = await Canvas.loadImage('./assets/imgs/card.png');
    else background = await Canvas.loadImage(users[member.id].bg);
    ctx.drawImage(background, 10, 33, background.width, background.height);
    ctx.fillStyle = '#7f7f7f';
    ctx.fillRect(208 + (users[member.id].xp - toRemove) / (final - toRemove) * 659, 151, 659 - (users[member.id].xp - toRemove) / (final - toRemove) * 659, 24);
    ctx.fillStyle = `#${users[member.id].colour || 'ffffff'}`;
    ctx.fillRect(208, 151, (users[member.id].xp - toRemove) / (final - toRemove) * 659, 24);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 23px sans-serif';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 7;
    ctx.lineWidth = 2;
    ctx.strokeText('RANK', 200, 65);
    ctx.strokeText('LEVEL', 362, 66);
    ctx.fillText('RANK', 200, 65);
    ctx.fillText('LEVEL', 362, 66);
    ctx.fillStyle = `#${users[member.id].colour || 'ffffff'}`;
    const textname = member.user.tag;
    ctx.font = applyText(canvas, textname);
    ctx.globalAlpha = 0.8;
    ctx.shadowColor = shadowColour(users[member.id].colour || 'ffffff');
    ctx.strokeText(textname, 213, 121);
    ctx.globalAlpha = 1;
    ctx.fillText(textname, 213, 121);
    ctx.font = 'bold 28px sans-serif';
    const sortedUsers = [];
    Object.keys(users).forEach(key => {
        if(users[key].xp > 2) sortedUsers.push({ key: key, value: users[key] });
    });
    sortedUsers.sort((first, second) => (second.value.xp - first.value.xp));
    const rankNumber = sortedUsers.findIndex(x => x.key == member.id) + 1;
    ctx.strokeText(`#${rankNumber}`, 280, 65);
    ctx.fillText(`#${rankNumber}`, 280, 65);
    ctx.font = 'bold 28px sans-serif';
    ctx.strokeText(users[member.id].level, 460, 65);
    ctx.fillText(users[member.id].level, 460, 65);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px sans-serif';
    ctx.shadowColor = '#000000';
    const canvasWidth = ctx.measureText(`${users[member.id].xp}/${final}`).width;
    ctx.strokeText(`${users[member.id].xp}/${final}`, 812 - canvasWidth, 145);
    ctx.fillText(`${users[member.id].xp}/${final}`, 812 - canvasWidth, 145);
    ctx.shadowBlur = 0;
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
    const attachment = new MessageAttachment(canvas.toBuffer(), './assets/imgs/level.png');
    message.channel.send('', attachment);
};

exports.info = {

    name: 'rank',
    category: 'xp',
    syntax: '[tag]',
    description: 'Kiírja, mennyi XP-d van.',
    requiredPerm: null,
    aliases: ['xp', 'szint']
};