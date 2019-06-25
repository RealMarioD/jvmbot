const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text
};

exports.run = (client, message, args) => {
    const config = require("../config.json");
    if(message.author.id === config.ownerID) {

        try {
            const code = args.join(" ");
            let evaled = eval(code);
            if(typeof evaled !== "string") evaled = require("util").inspect(evaled);
            message.channel.send(`\`OUT:\`\n\`\`\`xl\n${clean(evaled)}\`\`\``).catch(err => message.channel.send(`\`ERROR\` \`\`\`\nToo many characters to send! (2000+)\n\`\`\``))
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``).catch(err => message.channel.send(`\`ERROR\` \`\`\`\nToo many characters to send! (2000+)\n\`\`\``))
        }

    } else {

        message.channel.send({
            embed: {
                color: 0xff0000,
                title: `Ennek a parancsnak a végrehajtásához adminnak kell lenned!`
            }
        });

    }
};

exports.info = {

    syntax: '<js kód>',
    description: 'Teszt parancs a fejlesztőknek'

};
