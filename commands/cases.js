const cases = require('../assets/cases.json');
const fs = require('fs');
const Discord = require('discord.js');
const config = require('../config.json');
const { devOnly } = require('../util');
exports.run = (client, message, args) => {
    if(message.author.id == config.ownerID) {
        if(args.length == 0) {
            const toDoCases = [];
            for (const acase in cases) {
                if (cases[acase].managed == false) {
                    toDoCases.push(acase.toString());
                }
            }
            const finalMsg = new Discord.RichEmbed()
                .addField('Fűggőben lévő ötletek/hibák:', toDoCases.length == 0 ? '*Üres*' : toDoCases);
            message.channel.send(finalMsg);
        }
        else if(args.length == 1) {
            const caseID = args[0];
            if(Object.prototype.hasOwnProperty.call(cases, caseID)) {
                const finalMsg = new Discord.RichEmbed()
                    .setColor(cases[caseID].type == 'error' ? '#FF0000' : '#00CC00')
                    .setTitle(cases[caseID].type == 'error' ? 'Hiba' : 'Ötlet')
                    .setAuthor(cases[caseID].author)
                    .addField('Leírás:', cases[caseID].description)
                    .addField('Jóváhagyott?', cases[caseID].outcome.toString())
                    .addField('Elbírált?', cases[caseID].managed.toString())
                    .setFooter(`ID: ${caseID}`);
                message.channel.send(finalMsg);
            }
            else {message.channel.send('Nincs ilyen case.');}
        }
        else {
            const caseID = args[0];
            let outcomeInput = args[1];
            if(outcomeInput == 'false') {outcomeInput = false;}
            else if(outcomeInput == 'true') {outcomeInput = true;}
            else if(outcomeInput == 'delete') {
                delete cases[caseID];
                fs.writeFileSync('./assets/cases.json', JSON.stringify(cases, null, 2));
                message.channel.send(`\`${caseID}\` törölve!`);
            }
            else {
                message.channel.send('Érvénytelen boolean/eljárás!');
                return;
            }
            const adminComment = args.slice(2).join(' ');
            const finalMsg = new Discord.RichEmbed()
                .setColor('#FFFF00')
                .setTitle(`${cases[caseID].type == 'error' ? 'Hiba' : 'Ötlet'} ID: [${caseID}]`)
                .setAuthor(cases[caseID].author)
                .addField('Leírás:', cases[caseID].description)
                .addField(cases[caseID].type == 'error' ? 'Javítva?' : 'Elfogadva?', outcomeInput == true ? 'Igen' : 'Nem')
                .addField('Egyéb hozzászólás:', adminComment == '' ? 'Nincs' : adminComment);

            cases[caseID].outcome = outcomeInput;
            cases[caseID].managed = true;
            fs.writeFileSync('./assets/cases.json', JSON.stringify(cases, null, 2));
            message.channel.send('Feldolgozva.');
            message.guild.channels.get(config.resultsChannelID).send(finalMsg);
        }
    }
 else {
        devOnly(message.channel);
    }
};
exports.info = {
    syntax: '<case id> <bool> <notes>',
    description: 'Ezzel a paranccsal lehet kezelni az ötleteket és hibákat.',
    adminOnly: true,
};