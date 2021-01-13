const Canvas = require('canvas');
const fs = require('fs');
const { MessageAttachment } = require('discord.js');
const users = require('../../assets/users.json');

exports.run = async (client, message, args) => {
    if(!message.attachments || !(message.content.startsWith('/bg http') && (message.content.endsWith('.png') || message.content.endsWith('.jpg') || message.content.endsWith('.jpeg')))) return message.channel.send('Nem adtál meg egy képet!');
    const canvas = Canvas.createCanvas(880, 155);
    const ctx = canvas.getContext('2d');
    try {
    const background = await Canvas.loadImage(args[0] || message.attachments.first().attachment);
    const widthszorzó = background.width / canvas.width;
    const heightszorzó = background.height / canvas.height;
    if(widthszorzó > heightszorzó)
        ctx.drawImage(background, (background.width - canvas.width * heightszorzó) / 2, 0, canvas.width * heightszorzó, background.height, 0, 0, canvas.width, canvas.height);
    else if(heightszorzó > widthszorzó)
        ctx.drawImage(background, 0, (background.height - canvas.height * widthszorzó) / 2, background.width, canvas.height * widthszorzó, 0, 0, canvas.width, canvas.height);
    ctx.clearRect(198, 118, 659, 24);
    const attachment = new MessageAttachment(canvas.toBuffer(), 'szint.png');
    message.channel.send('Profil háttered sikeresen megváltoztatva, itt az előnézete:', attachment).then(m => {
        users[message.author.id].bg = m.attachments.first().attachment;
        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
    });
    }
    catch(error) {
        message.channel.send('Nem képet adtál meg!');
    }
};

exports.info = {

    name: 'background',
    category: 'xp',
    syntax: '',
    description: 'Megváltoztatja a profilod háttérképét',
    requiredPerm: null,
    aliases: ['bg']

};