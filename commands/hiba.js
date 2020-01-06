const config = require("../config.json");
const Discord = require('discord.js')
const fs = require("fs");
const cases = require("../assets/cases.json");
const {getEmoji} = require("../util");
const moment = require('moment');
const timeouts = require('../assets/timeouts.json')
exports.run = (client, message, args) => {

    let currentDate = moment().valueOf();
    let resetTime = 600000;
    let lastSavedTime = timeouts["erroridea"].lastSavedTime

    if(currentDate < lastSavedTime + resetTime) {
        let remainingTime = moment.duration(timeouts["erroridea"].lastSavedTime + resetTime - currentDate);
        message.channel.send(`Még várnod kell \`${remainingTime.minutes()} percet és ${remainingTime.seconds()} másodpercet\`, hogy be tudj küldeni egy új hibát/ötletet!`);
    } else {
        if(args.length == 0) message.channel.send("> ❌ Nem adtál meg hibát!");
        else {
            let caseid = Math.random().toString(36).substring(7);
            let ideachannel = message.guild.channels.get(config.ideaChannelID);
            let finalmsg = new Discord.RichEmbed()
                .setColor("#FF0000")
                .setTitle("Új Hiba")
                .setAuthor(message.author.tag, message.author.avatarURL)
                .addField("Leírás:", `${args.join(" ")}`)
                .setFooter(`ID: ${caseid}`);
            ideachannel.send(finalmsg).then(m => {
                m.react(getEmoji(client, "tickGreen"));
                m.react(getEmoji(client, "tickRed"));
            })
            cases[caseid] = {
                outcome: false,
                managed: false,
                type: "error",
                author: `${message.author.tag} (${message.author.id})`,
                description: args.join(" ")
            }
            timeouts["erroridea"].lastSavedTime = currentDate;
            fs.writeFileSync("./assets/cases.json", JSON.stringify(cases, null, 2));
            fs.writeFileSync("./assets/timeouts.json", JSON.stringify(timeouts, null, 2));
            message.channel.send(`>>> A hibát fogadtuk!\nID: \`${caseid}\``);
        }
    }
}
exports.info = {
    syntax: "<hiba>",
    description: "Ezzel a paranccsal hibát tudsz bejelenteni."
}