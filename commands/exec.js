const exec = require("child_process").exec;
const {devOnly} = require("../util.js");
const config = require("../config.json");
exports.run = (client, message, args) => {
    if (message.author.id == config.ownerID) {
        if(args.length == 0) message.channel.send("> Nem adtál meg parancsot.");
        else {
            let code = args.join(" ");
            let msg = "";
            exec(code, (err, out) => {
                if(err) {
                    msg += `Error:\n\`\`\`${err}\`\`\`\n`;
                }
                if(out) {
                    msg += `Output:\n\`\`\`${out}\`\`\``
                }
                message.channel.send(msg)
            })
        }
    } else {
        devOnly(message.channel);
    }
}
exports.info = {
    syntax: "<code>",
    description: "A console-t lehet kezelni ezzel a paranccsal.",
    adminOnly: true
}