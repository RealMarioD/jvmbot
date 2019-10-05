const {devOnly} = require("../util");
const clean = text => {
    if (typeof (text) === "string")
        return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text
};

exports.run = (client, message, args) => {
    const config = require("../config.json");
    if (message.member.roles.has(config.fejlesztoID)) {

        try {
            const code = args.join(" ");
            let evaled = eval(code);
            Promise.resolve(evaled).then((output) => {
                if (typeof output !== "string") {
                    output = require("util").inspect(output);
                }
                message.channel.send(`\`OUT:\`\n\`\`\`xl\n${output}\`\`\``).catch(() => message.channel.send(`\`ERROR\` \`\`\`\nToo many characters to send! (2000+)\n\`\`\``))
            })
        } catch (err) {
            message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``).catch(() => message.channel.send(`\`ERROR\` \`\`\`\nToo many characters to send! (2000+)\n\`\`\``))
        }

    } else {
        devOnly(message.channel)
    }
};

exports.info = {

    syntax: '<js kód>',
    description: 'Teszt parancs a fejlesztőknek.',
    adminOnly: true

};
