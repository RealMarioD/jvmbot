const Discord = require('discord.js');
const fs = require('fs');
const cases = require('../../assets/cases.json');
const { getEmoji } = require('../../util');
const moment = require('moment');
const timeouts = require('../../assets/timeouts.json');
exports.run = (client, message, args) => {

    const currentDate = moment().valueOf();
    const resetTime = 600000;
    const lastSavedTime = timeouts['erroridea'].lastSavedTime;

    if(currentDate < lastSavedTime + resetTime) {
        const remainingTime = moment.duration(timeouts['erroridea'].lastSavedTime + resetTime - currentDate);
        return message.channel.send(`Még várnod kell \`${remainingTime.minutes()} percet és ${remainingTime.seconds()} másodpercet\`, hogy be tudj küldeni egy új hibát/ötletet!`);
    }
    else if(args.length == 0) return message.channel.send('> ❌ Nem adtál meg hibát!');

    const caseID = Math.random().toString(36).substring(7);
    const ideaChannel = message.guild.channels.cache.get(client.config.ideaChannelID);
    const finalMsg = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Új Hiba')
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .addField('Leírás:', `${args.join(' ')}`)
        .setFooter(`ID: ${caseID}`);

    ideaChannel.send(finalMsg)
    .then(m => {
        m.react(getEmoji('tickGreen'));
        m.react(getEmoji('tickRed'));
        cases[caseID] = {
            outcome: false,
            managed: false,
            type: 'error',
            author: `${message.author.tag} (${message.author.id})`,
            description: args.join(' '),
            msgID: m.id
        };
    })
    .then(() => {
        timeouts['erroridea'].lastSavedTime = currentDate;
        fs.writeFileSync('./assets/cases.json', JSON.stringify(cases, null, 2));
        fs.writeFileSync('./assets/timeouts.json', JSON.stringify(timeouts, null, 2));
        message.channel.send(`>>> A hibát fogadtuk!\nID: \`${caseID}\``);
    });
};
exports.info = {

    name: 'hiba',
    category: 'egyéb',
    syntax: '<hiba>',
    description: 'Ezzel a paranccsal hibát tudsz bejelenteni.',
    requiredPerm: null
};