const { MessageEmbed, MessageAttachment } = require('discord.js');
const { getDate } = require('../../util');
const Canvas = require('canvas');

function hexToRGB(hexColor) {
    let number = 0;
    let add = 0;
    for(let i = 0; i < hexColor.length; i++) {
            if(hexColor[i] === 'a') add = 10;
            else if(hexColor[i] === 'b') add = 11;
            else if(hexColor[i] === 'c') add = 12;
            else if(hexColor[i] === 'd') add = 13;
            else if(hexColor[i] === 'e') add = 14;
            else if(hexColor[i] === 'f') add = 15;
            else add = parseInt(hexColor[i]);
            if(i === 0) number += add * 16;
            else number += add;
    }
    return number;
}

exports.run = async (client, message, args) => {
    args = args.join(' ');
    if(!args) return;
    let roleCount = 0;
    message.guild.roles.cache.forEach(r => {
        if(r.name !== '@everyone') ++roleCount;
    });
    let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === args.toLowerCase());
    if(!role) role = message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.toLowerCase()) || r.id === args);
    if(role) {
    const canvas = Canvas.createCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    const image = await Canvas.loadImage(message.guild.members.cache.find(x => x.user.username === 'Botszerű Játékizé').user.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(image, 0, 0, 128, 128);
    const imageData = ctx.getImageData(0, 0, 128, 128);
    const data = imageData.data;
    const pixels = [];
    if(role.hexColor === '#000000') {
        for(let i = 0; i < data.length; i += 4) {
            if(data[i] < 255 || data[i + 1] < 255 || data[i + 2] < 255) {
                data[i] += 255 - hexToRGB(role.hexColor[1] + role.hexColor[2]);
                data[i + 1] += 255 - hexToRGB(role.hexColor[3] + role.hexColor[4]);
                data[i + 2] += 255 - hexToRGB(role.hexColor[5] + role.hexColor[6]);
                pixels.push(i);
            }
        }
    }
    for(let i = 0; i < data.length; i += 4) {
        if((data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) && !pixels.includes(i)) {
            data[i] -= 255 - hexToRGB(role.hexColor[1] + role.hexColor[2]);
            data[i + 1] -= 255 - hexToRGB(role.hexColor[3] + role.hexColor[4]);
            data[i + 2] -= 255 - hexToRGB(role.hexColor[5] + role.hexColor[6]);
        }
    }
    ctx.putImageData(imageData, 0, 0);
    const attachment = new MessageAttachment(canvas.toBuffer(), 'rolecolor.png');
    const embed = new MessageEmbed()
        .setTitle(role.name)
        .addField('ID', role.id, true)
        .addField('Szín', role.hexColor, true)
        .addField('Külön megjelenített?', role.hoist ? 'Igen' : 'Nem', true)
        .addField('Pozíció', roleCount - role.position, true)
        .addField('Megemlíthető?', role.mentionable ? 'Igen' : 'Nem', true)
        .attachFiles(attachment)
        .setThumbnail('attachment://rolecolor.png')
        .setColor(role.hexColor)
        .setFooter(`Rang létrehozva: ${getDate(role.createdAtTimestamp)}`);
    message.channel.send(embed);
    }
};

exports.info = {

    name: 'roleinfo',
    category: 'egyéb',
    syntax: '<role>',
    description: 'Információt nyújt egy adott rangról',
    requiredPerm: null,
    aliases: ['rinfo']

};