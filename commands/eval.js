const clean = text => {
    if(typeof(text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203))
    else
        return text
}

exports.run = (client, message, args) => {
    const config = require("../config.json");
    if(message.member.roles.has("584740600033837069")) { //van fejlesztő rangja?

        try {
            const code = args.join(" ")
            let evaled = eval(code)
            if(typeof evaled !== "string") evaled = require("util").inspect(evaled)
            message.channel.send(`\`OUT:\`\n\`\`\`xl\n${clean(evaled)}\`\`\``)
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``)
        }

    }else {

        message.channel.send({embed: {color: 0xff0000, title: `Ennek a parancsnak a végrehajtásához fejlesztőnek kell lenned!`}});

    }
}

exports.info = {

  syntax: '<js kód>',
  description: 'Teszt parancs a fejlesztőknek'

}
