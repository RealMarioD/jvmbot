const users = require('../../assets/users.json');
const fs = require('fs');
const Canvas = require('canvas');
const Discord = require('discord.js');
exports.run = (client, message, args) => {
    if(!args[0]) return;
    args[0] = args[0].toLowerCase();
    let mehet = true;
    for(let i = 0; i < args[0].length; i++) {
        const c = args[0].charAt(i);
        if(c.length > 6) mehet = false;
        if(c != '0' && c != '1' && c != '2' && c != '3' && c != '4' && c != '5' && c != '6' && c != '7' && c != '8' && c != '9' && c != 'a' && c != 'b' && c != 'c' && c != 'd' && c != 'e' && c != 'f') mehet = false;
        if(c.length < 6) args[0] = args[0].padStart(6, '0');
    }
    if(mehet) {
        users[message.author.id].colour = args[0];
        message.reply('sikeresen megváltoztattad a profilod színét!');
        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
    }
    else {
        message.channel.send('Nem megfelelő formátumú színt adtál meg!');
        const canvas = Canvas.createCanvas(900, 220);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = `#${users[message.author.id].colour}`;
        ctx.fillRect(0, 0, 900, 220);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'asd.png');
        message.channel.send('', attachment);
    }
};

exports.info = {

    name: 'profil',
    category: 'xp',
    syntax: '<hex szín>',
    description: 'Megváltoztatja a profilod színét',
    requiredPerm: null,
    aliases: ['profile']

};