const config = require("../config.json");
const Discord = require('discord.js')
const fs = require("fs");
const cases = require("../assets/cases.json");
const {getEmoji} = require("../util");
exports.run = (client, message, args) => {
    if(args.length == 0) message.channel.send("> ❌ Nem adtál meg ötletet!")
    else {
        let caseid = Math.random().toString(36).substring(7);
        let ideachannel = message.guild.channels.get(config.ideaChannelID)
        let finalmsg = new Discord.RichEmbed()
            .setColor("#00CC00")
            .setTitle("Új Ötlet")
            .setAuthor(message.author.tag, message.author.avatarURL)
            .addField("Leírás:", `${args.join(" ")}`)
            .setFooter(`ID: ${caseid}`);
        ideachannel.send(finalmsg).then(m => {
            m.react(getEmoji(client, "tickGreen"))
            m.react(getEmoji(client, "tickRed"))
        })
        cases[caseid] = {
            outcome: false,
            managed: false,
            type: "idea",
            author: `${message.author.tag} (${message.author.id})`,
            description: args.join(" ")
        }
        fs.writeFileSync("./assets/cases.json", JSON.stringify(cases, null, 2))
        message.channel.send(`>>> Ötletedet fogadtuk!\nID: \`${caseid}\``)
    }
}
exports.info = {
    syntax: "<ötlet>",
    description: "Ezzel a paranccsal ötletet tudsz beküldeni."
}