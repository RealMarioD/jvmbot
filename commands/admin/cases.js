const cases = require('../../assets/cases.json');
const fs = require('fs');
const Discord = require('discord.js');
exports.run = (client, message, args) => {

    if(!args.length) {
        const toDoCases = [];
        for(const caseID in cases) if(cases[caseID].managed == false) toDoCases.push(caseID.toString());
        return message.channel.send(new Discord.MessageEmbed().addField('Fűggőben lévő ötletek/hibák:', toDoCases.length == 0 ? '*Üres*' : toDoCases));
    }
    else if(args.length == 1) {
        const caseID = args[0];
        if(Object.prototype.hasOwnProperty.call(cases, caseID)) {
            return message.channel.send(new Discord.MessageEmbed()
                .setColor(cases[caseID].type == 'error' ? '#FF0000' : '#00CC00')
                .setTitle(cases[caseID].type == 'error' ? 'Hiba' : 'Ötlet')
                .setAuthor(cases[caseID].author)
                .addField('Leírás:', cases[caseID].description)
                .addField('Státusz:', cases[caseID].outcome.toString())
                .addField('Elbírált?', cases[caseID].managed.toString())
                .setFooter(`ID: ${caseID}`)
            );
        }
        else return message.channel.send('Nincs ilyen case.');
    }
    const caseID = args[0];
    const caseObj = cases[caseID];
    const outcomeInput = args[1];
    let msgReference;
    if(!caseObj) return message.reply(`nem létezik \`${caseID}\` ID-vel ügy!`);
    if(caseObj.msgID) msgReference = caseObj.msgID;
    else msgReference = caseID;

    if(outcomeInput == 'delete') {
        delete cases[caseID];
        fs.writeFileSync('./assets/cases.json', JSON.stringify(cases, null, 2));
        return message.channel.send(`\`${caseID}\` törölve!`);
    }

    const adminComment = args.slice(2).join(' ');
    message.guild.channels.cache.get(client.config.channels.otletekhibak).messages.fetch(msgReference)
    .then(msg => {
        const toEditEmbed = msg.embeds[0];
        switch(outcomeInput.toLowerCase()) {
            case 'elfogadva': case 'megvalósítva':
                toEditEmbed.setColor('#00CC00');
                break;
            case 'elutasítva':
                toEditEmbed.setColor('#CC0000');
                break;
            default:
                toEditEmbed.setColor('#FFFF00');
                break;
        }
        toEditEmbed.setFooter(`Státusz: ${outcomeInput}`);
        if(adminComment) toEditEmbed.addField('Admin comment:', adminComment);
        msg.edit(toEditEmbed);
    });

    cases[caseID].outcome = outcomeInput;
    cases[caseID].managed = true;
    fs.writeFileSync('./assets/cases.json', JSON.stringify(cases, null, 2));
    message.channel.send('Feldolgozva.');
};

exports.info = {

    name: 'cases',
    category: 'admin',
    syntax: '<caseID> [delete|elfogadva|megvalósítva|elutasítva|...] [megjegyzés]',
    description: 'Ezzel a paranccsal lehet kezelni az ötleteket és hibákat.',
    requiredPerm: 'admin'

};