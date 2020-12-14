const cases = require('../../assets/cases.json');
const fs = require('fs');
const Discord = require('discord.js');
exports.run = (client, message, args) => {

    if(args.length == 0) {
        const toDoCases = [];
        for(const _case in cases) if(cases[_case].managed == false) toDoCases.push(_case.toString());
        message.channel.send(new Discord.MessageEmbed().addField('Fűggőben lévő ötletek/hibák:', toDoCases.length == 0 ? '*Üres*' : toDoCases));
    }
    else if(args.length == 1) {
        const caseID = args[0];
        if(Object.prototype.hasOwnProperty.call(cases, caseID)) {
            message.channel.send(new Discord.MessageEmbed()
                .setColor(cases[caseID].type == 'error' ? '#FF0000' : '#00CC00')
                .setTitle(cases[caseID].type == 'error' ? 'Hiba' : 'Ötlet')
                .setAuthor(cases[caseID].author)
                .addField('Leírás:', cases[caseID].description)
                .addField('Jóváhagyott?', cases[caseID].outcome.toString())
                .addField('Elbírált?', cases[caseID].managed.toString())
                .setFooter(`ID: ${caseID}`)
            );
        }
        else message.channel.send('Nincs ilyen case.');
    }
    else {
        const caseID = args[0];
        let outcomeInput = args[1];
        if(outcomeInput == 'false') outcomeInput = false;
        else if(outcomeInput == 'true') outcomeInput = true;
        else if(outcomeInput == 'delete') {
            if(cases[caseID].msgID) {
                message.guild.channels.cache.get(client.config.ideaChannelID).messages.fetch(cases[caseID].msgID)
                .then(msg => {
                    if(msg) {
                        msg.delete()
                        .catch(() => message.channel.send(`A(z) <#${client.config.ideaChannelID}> szobából nem tudtam törölni az üzenetet. \`[${msg.id}]\``));
                    }
                });
            }
            else message.channel.send(`A(z) <#${client.config.ideaChannelID}> szobából nem tudtam törölni az üzenetet.`);
            delete cases[caseID];
            fs.writeFileSync('./assets/cases.json', JSON.stringify(cases, null, 2));
            return message.channel.send(`\`${caseID}\` törölve!`);
        }
        else return message.channel.send('Érvénytelen boolean/eljárás!');
        const adminComment = args.slice(2).join(' ');
        message.guild.channels.cache.get(client.config.resultsChannelID).send(new Discord.MessageEmbed()
            .setColor('#FFFF00')
            .setTitle(`${cases[caseID].type == 'error' ? 'Hiba' : 'Ötlet'} ID: [${caseID}]`)
            .setAuthor(cases[caseID].author)
            .addField('Leírás:', cases[caseID].description)
            .addField(cases[caseID].type == 'error' ? 'Javítva?' : 'Elfogadva?', outcomeInput == true ? 'Igen' : 'Nem')
            .addField('Egyéb hozzászólás:', adminComment == '' ? 'Nincs' : adminComment)
        );
        cases[caseID].outcome = outcomeInput;
        cases[caseID].managed = true;
        fs.writeFileSync('./assets/cases.json', JSON.stringify(cases, null, 2));
        message.channel.send('Feldolgozva.');
    }
};

exports.info = {

    name: 'cases',
    category: 'admin',
    syntax: '<case id> <bool> <notes>',
    description: 'Ezzel a paranccsal lehet kezelni az ötleteket és hibákat.',
    requiredPerm: 'admin'

};