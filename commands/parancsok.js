const {error} = require("../util");
exports.run = (client, message, args) => {
    let helpEmbed = {
        color: 0x56f442,
        title: '🗒 **| Parancsok**',
        fields: []
    };
    if (args.length === 0) {
        const fs = require('fs');
        helpEmbed.description = `Ha több infót akarsz megtudni egy parancsról: \`.parancsok <parancs>\`\n`;
        fs.readdirSync(`./commands/`).forEach(cmdfile => {
            cmdfile = cmdfile.replace('.js', '');
            let cmd = require(`../commands/${cmdfile}`);
            helpEmbed.description += `| \`${client.config.prefix}${cmdfile} ${cmd.info.syntax}\` | ${cmd.info.adminOnly === true ? '__Admin Only!__' : ''}\n`
        });
        helpEmbed.description = helpEmbed.description.replace('undefined', '');
        message.channel.send({embed: helpEmbed});
    } else {
        try {
            let commandFile = require(`./${args[0].toLowerCase()}.js`);
            message.channel.send({
                embed: {
                    color: 0x56f442,
                    title: `\`\`${client.config.prefix}${args[0].toLowerCase()}\`\``,
                    description: (commandFile.info.syntax === '' ? `` : `**Értékek:** ${commandFile.info.syntax}\n`) +
                        `**Információ:** ${commandFile.info.description}\n${commandFile.info.adminOnly === true ? '__Ezt a parancsot csak fejlesztők/adminok tudják használni!__' : ''}`
                }
            });
        } catch (e) {
            error(message.channel)
        }
    }
};

exports.info = {

    syntax: '<parancs>',
    description: 'Visszaadja az összes parancsot.'

};
