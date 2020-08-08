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
        message.channel.send(`Még várnod kell \`${remainingTime.minutes()} percet és ${remainingTime.seconds()} másodpercet\`, hogy be tudj küldeni egy új hibát/ötletet!`);
    }
    else if(args.length == 0) {message.channel.send('> ❌ Nem adtál meg ötletet!');}
    else {
        const caseID = Math.random().toString(36).substring(7);
        const ideaChannel = message.guild.channels.cache.get(client.config.ideaChannelID);
        const finalMsg = new Discord.MessageEmbed()
            .setColor('#00CC00')
            .setTitle('Új Ötlet')
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
                type: 'idea',
                author: `${message.author.tag} (${message.author.id})`,
                description: args.join(' '),
                msgID: m.id
            };
        })
        .then(() => {
            timeouts['erroridea'].lastSavedTime = currentDate;
            fs.writeFileSync('./assets/cases.json', JSON.stringify(cases, null, 2));
            fs.writeFileSync('./assets/timeouts.json', JSON.stringify(timeouts, null, 2));
            message.channel.send(`>>> Ötletedet fogadtuk!\nID: \`${caseID}\``);
        });
    }
};
exports.info = {

    name: 'otlet',
    category: 'egyéb',
    syntax: '<ötlet>',
    description: 'Ezzel a paranccsal ötletet tudsz beküldeni.',
    requiredPerm: null
};