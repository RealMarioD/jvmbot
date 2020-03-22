const cases = require('../assets/cases.json');
const fs = require('fs');
const Discord = require('discord.js');
exports.run = (client, message, args) => {

    if(args.length == 0) {
        const toDoCases = [];
        for (const acase in cases) {
            if (cases[acase].managed == false) {
                toDoCases.push(acase.toString());
            }
        }
        const finalMsg = new Discord.MessageEmbed()
            .addField('Fűggőben lévő ötletek/hibák:', toDoCases.length == 0 ? '*Üres*' : toDoCases);
        message.channel.send(finalMsg);
    }
    else if(args.length == 1) {
        const caseID = args[0];
        if(Object.prototype.hasOwnProperty.call(cases, caseID)) {
            const finalMsg = new Discord.MessageEmbed()
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
            message.guild.channels.cache.get(client.config.ideaChannelID).fetchMessage(cases[caseID].msgID)
                .then(msg => {
                    msg.delete().catch(err => console.error(err));
                });
            delete cases[caseID];
            fs.writeFileSync('./assets/cases.json', JSON.stringify(cases, null, 2));
            return message.channel.send(`\`${caseID}\` törölve!`);
        }
        else {
            message.channel.send('Érvénytelen boolean/eljárás!');
            return;
        }
        const adminComment = args.slice(2).join(' ');
        const finalMsg = new Discord.MessageEmbed()
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
        message.guild.channels.cache.get(client.config.resultsChannelID).send(finalMsg);
    }
};

exports.info = {

    name: 'cases',
    category: 'admin',
    syntax: '<case id> <bool> <notes>',
    description: 'Ezzel a paranccsal lehet kezelni az ötleteket és hibákat.',
    requiredPerm: 'developer'

};