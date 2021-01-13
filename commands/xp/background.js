const Canvas = require('canvas');
const fs = require('fs');
const { MessageAttachment } = require('discord.js');
const users = require('../../assets/users.json');
const { cmdUsage } = require('../../util');

exports.run = async (client, message, args) => {
    let toCheck = message.attachments.first();
    if(toCheck) toCheck = toCheck.attachment;
    if(!toCheck && args.length > 0) toCheck = args[0];
    if(!toCheck) return cmdUsage(this, message);
    if(!toCheck.startsWith('http') || toCheck.match(/.(jpeg|jpg|gif|png)$/) == null) return cmdUsage(this, message);
    const canvas = Canvas.createCanvas(880, 155);
    const ctx = canvas.getContext('2d');
    try {
        const background = await Canvas.loadImage(toCheck);
        const widthMulti = background.width / canvas.width;
        const heightMulti = background.height / canvas.height;
        if(widthMulti > heightMulti) ctx.drawImage(background, (background.width - canvas.width * heightMulti) / 2, 0, canvas.width * heightMulti, background.height, 0, 0, canvas.width, canvas.height);
        else if(heightMulti > widthMulti) ctx.drawImage(background, 0, (background.height - canvas.height * widthMulti) / 2, background.width, canvas.height * widthMulti, 0, 0, canvas.width, canvas.height);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'szint.png');
        message.channel.send('Profil háttered sikeresen megváltoztatva, itt az előnézete:', attachment)
        .then(msg => {
            users[message.author.id].bg = msg.attachments.first().attachment;
            fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
        });
    }
    catch(error) {
        cmdUsage(this, message);
    }
};

exports.info = {

    name: 'background',
    category: 'xp',
    syntax: '<kép>',
    description: 'Megváltoztatja a profilod háttérképét',
    requiredPerm: null,
    aliases: ['bg']

};