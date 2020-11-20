const users = require('../../assets/users.json');
const Canvas = require('canvas');
const Discord = require('discord.js');
const fs = require('fs');
const applyText = (canvas, text) => {
    const ctx = canvas.getContext('2d');
    let fontSize = 50;
    do {
        ctx.font = `${fontSize -= 10}px sans-serif`;
    } while(ctx.measureText(text).width > canvas.width - 510);
    return ctx.font;
};

exports.run = async (client, message, args) => {
    const embed = new Discord.MessageEmbed();
    let passedMsg;
    const fieldHolder = [];
    let startIndex = 0;
    message.guild.members.fetch();
    if(args[0] === 'lb') {
        for(const key in users) {
            if(users[key].xp === undefined) users[key].xp = 0;
            if(users[key].level === undefined) users[key].level = 0;
            fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
        }
        const sortedUsers = Object.keys(users).map(key => ({
            key: key, value: users[key]
        })).sort((first, second) => (second.value.xp - first.value.xp));

        embed.setTitle(`${message.guild.name} ranglistája`)
            .setThumbnail(message.guild.iconURL({ format: 'png', dynamic: true }))
            .setColor('#DB6206')
            .setTimestamp();

        let k = 0;
        for(let i = 0; i < sortedUsers.length; i++) {
            if(message.guild.members.cache.find(x => x.id === sortedUsers[i].key) && sortedUsers[i].value.xp > 0) {
                let összeg = 35;
                ++k;
                for(let j = 1; j <= sortedUsers[i].value.level; j++) összeg += (j - 1) * 40 + 20;
                fieldHolder.push({
                    title: `__${k}.__ **${message.guild.members.cache.find(x => x.id === sortedUsers[i].key).user.username}**`,
                    desc: `Szint: \`${sortedUsers[i].value.level}\`\nXP: \`${sortedUsers[i].value.xp}/${összeg}\``
                });
            }
        }
        return message.channel.send('Kérlek, várj...')
        .then(msg => {
            passedMsg = msg;
            if(!fieldHolder.length) {
                embed.setFooter('Oldal: 1/1');
                return passedMsg.edit('', embed);
            }
            msg.react('⬅️');
            msg.react('➡️');
            sortFields(startIndex);
        });
    }
    let member = message.member;
    if(args.length > 0) member = message.guild.members.cache.find(x => x.id == args[0]/* .slice(2, args[0].length - 1).replace('!', '')*/);
    if(!users[member.id] || users[member.id].level === undefined) {
        users[member.id] = {
            xp: 0,
            level: 0
        };
    }
    let final = 35;
    for(let i = 1; i <= users[member.id].level; i++) final += (i - 1) * 40 + 20;
    let toRemove = 35;
    for(let j = 1; j < users[member.id].level; j++) toRemove += (j - 1) * 40 + 20;
    const canvas = Canvas.createCanvas(900, 220);
    const ctx = canvas.getContext('2d');
    const background = await Canvas.loadImage('./card.png');
    const canvasLevel = await Canvas.loadImage('./szint.png');
    const restOfLevel = await Canvas.loadImage('./maradek.png');
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
        if(sorteddata.key === member.id) j = i;
        ++i;
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
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'szint.png');
    message.channel.send('', attachment);

    function sortFields(start) {
        embed.spliceFields(0, 5);
        let k = start;
        if(k >= fieldHolder.length) k = fieldHolder.length - 5;
        let stopIndex = start + 5;
        if(stopIndex > fieldHolder.length) {
            stopIndex = fieldHolder.length;
        }
        const pages = Math.ceil(fieldHolder.length / 5);
        const pageOf = Math.ceil(k / 5) + 1;
        for(k; k < stopIndex; k++) {
            embed.addField(fieldHolder[k].title, fieldHolder[k].desc);
        }
        embed.setFooter(`Oldal: ${pageOf}/${pages}`);
        passedMsg.edit('', embed);
        startAwait();
    }

    function startAwait() {
        const filter = (reaction, user) => reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️' && user.id == message.author.id;
        passedMsg.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(collection => handleReactions(collection));
    }

    function handleReactions(collection) {
        switch(collection.first()._emoji.name) {
            case '⬅️':
                if(startIndex == 0) {
                    startAwait();
                }
                else {
                    startIndex = startIndex - 5;
                    sortFields(startIndex);
                }
                break;

            case '➡️':
                if(startIndex + 5 >= fieldHolder.length) {
                    startAwait();
                }
                else {
                    startIndex = startIndex + 5;
                    sortFields(startIndex);
                }
                break;
            default:
                startAwait();
                break;
        }
    }
};

exports.info = {

    name: 'rank',
    category: 'xp',
    syntax: '',
    description: 'Kiírja, mennyi XP-d van.',
    requiredPerm: null,
    aliases: ['xp', 'szint']
};