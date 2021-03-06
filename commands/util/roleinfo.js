const { MessageEmbed, MessageAttachment } = require('discord.js');
const { getDate, cmdUsage } = require('../../util');
const Canvas = require('canvas');

exports.run = async (client, message, args) => {
    if(!args.length) return cmdUsage(this, message);
    args = args.join(' ');
    const roleCount = message.guild.roles.cache.size - 1;
    let role = message.guild.roles.cache.find(r => r.name.toLowerCase() == args.toLowerCase());
    if(!role) role = message.guild.roles.cache.find(r => r.name.toLowerCase().includes(args.toLowerCase()) || r.id == args);
    if(!role) return message.channel.send('> ❌ **Nincs ilyen role.**');
    const canvas = Canvas.createCanvas(128, 128);
    const ctx = canvas.getContext('2d');
    const image = await Canvas.loadImage(message.guild.members.cache.find(x => x.user.username === 'Botszerű Játékizé').user.displayAvatarURL({ format: 'png' }));
    ctx.drawImage(image, 0, 0, 128, 128);
    const imageData = ctx.getImageData(0, 0, 128, 128);
    const data = imageData.data;
    if(role.hexColor != '#000000') {
        for(let i = 0; i < data.length; i += 4) {
            if(data[i] > 0 || data[i + 1] > 0 || data[i + 2] > 0) { // rgb modifications, 4th index is alpha so we don't change it
                data[i] -= 255 - parseInt(role.hexColor[1] + role.hexColor[2], 16);
                data[i + 1] -= 255 - parseInt(role.hexColor[3] + role.hexColor[4], 16);
                data[i + 2] -= 255 - parseInt(role.hexColor[5] + role.hexColor[6], 16);
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    const attachment = new MessageAttachment(canvas.toBuffer(), 'rolecolor.png');
    message.channel.send(new MessageEmbed()
        .setTitle(role.name)
        .addField('ID', role.id, true)
        .addField('Szín', role.hexColor, true)
        .addField('Külön megjelenített?', role.hoist ? 'Igen' : 'Nem', true)
        .addField('Pozíció', roleCount - role.position, true)
        .addField('Megemlíthető?', role.mentionable ? 'Igen' : 'Nem', true)
        .attachFiles(attachment)
        .setThumbnail('attachment://rolecolor.png')
        .setColor(role.hexColor)
        .setFooter(`Rang létrehozva: ${getDate(role.createdAtTimestamp)}`)
    );
};

exports.info = {

    name: 'roleinfo',
    category: 'egyéb',
    syntax: '<role>',
    description: 'Információt nyújt egy adott rangról',
    requiredPerm: null,
    aliases: ['rinfo']

};