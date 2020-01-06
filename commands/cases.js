const cases = require('../assets/cases.json');
const fs = require('fs');
const Discord = require('discord.js');
const config = require('../config.json');
const {devOnly} = require('../util');
exports.run = (client, message, args) => {
    if(message.author.id == config.ownerID) {
        if(args.length == 0) {
            let todocases = [];
            for (const acase in cases) {
                if (cases[acase].managed == false) {
                    todocases.push(acase.toString())                    
                }
            }
            let finalmsg = new Discord.RichEmbed()
                .addField("Fűggőben lévő ötletek/hibák:", todocases.length == 0 ? "*Üres*" : todocases);
            message.channel.send(finalmsg)
        }
        else if(args.length == 1) {
            let caseid = args[0];
            if(cases.hasOwnProperty(caseid)) {
                let finalmsg = new Discord.RichEmbed()
                    .setColor(cases[caseid].type == "error" ? "#FF0000" : "#00CC00")
                    .setTitle(cases[caseid].type == "error" ? "Hiba" : "Ötlet")
                    .setAuthor(cases[caseid].author)
                    .addField("Leírás:", cases[caseid].description)
                    .addField("Jóváhagyott?", cases[caseid].outcome.toString())
                    .addField("Elbírált?", cases[caseid].managed.toString())
                    .setFooter(`ID: ${caseid}`);
                message.channel.send(finalmsg);
            } else message.channel.send("Nincs ilyen case.")
        } else {
            let caseid = args[0];
            let outcomeInput = args[1];
            if(outcomeInput == "false") outcomeInput = false;
            else if(outcomeInput == "true") outcomeInput = true;
            else if(outcomeInput == "delete") {
                delete cases[caseid];
                fs.writeFileSync("./assets/cases.json", JSON.stringify(cases, null, 2))
                message.channel.send(`\`${caseid}\` törölve!`)
            }
            else {
                message.channel.send("Érvénytelen boolean/eljárás!")
                return
            }
            let admincomment = args.slice(2).join(" ")
            let finalmsg = new Discord.RichEmbed()
                .setColor("#FFFF00")
                .setTitle(`${cases[caseid].type == "error" ? "Hiba" : "Ötlet"} ID: [${caseid}]`)
                .setAuthor(cases[caseid].author)
                .addField("Leírás:", cases[caseid].description)
                .addField(cases[caseid].type == "error" ? "Javítva?" : "Elfogadva?", outcomeInput == true ? "Igen" : "Nem")
                .addField("Egyéb hozzászólás:", admincomment == "" ? "Nincs" : admincomment);

            cases[caseid].outcome = outcomeInput
            cases[caseid].managed = true
            fs.writeFileSync("./assets/cases.json", JSON.stringify(cases, null, 2))
            message.channel.send("Feldolgozva.");
            message.guild.channels.get(config.resultsChannelID).send(finalmsg);
        }
    } else {
        devOnly(message.channel)
    }
}
exports.info = {
    syntax: "<case id> <bool> <notes>",
    description: "Ezzel a paranccsal lehet kezelni az ötleteket és hibákat.",
    adminOnly: true
}