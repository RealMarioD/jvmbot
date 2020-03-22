const { getDate, sleep } = require('../util.js');
module.exports = (client, message) => {

    function runCommand() {
        try {
            cmd.run(client, message, args);
            console.log(`${command} parancs futtatva @ ${getDate()}`);
        }
        catch (err) {
            if(err.code === 'MODULE_NOT_FOUND') {return;}
            else {
                console.error(err);
            }
        }
    }

    function noPerms(perm) {
        message.reply(`\`${perm}\` jog szükséges ennek a parancsnak a használatához!`);
    }

    if (message.channel.id === '584445312312147996' && !message.guild.members.cache.get(message.author.id)._roles.includes(client.config.adminID)) {
        sleep(1000).then(() => {
            message.delete();
        });
    }

    if (!message.content.startsWith(client.config.prefix)) return;
    if (message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);

    if (!cmd) return;

    if(!cmd.info.requiredPerm) {
        runCommand();
    }
    else if(cmd.info.requiredPerm == 'developer') {
        if(client.config.ownerID == message.author.id || message.member._roles.includes(client.config.fejlesztoID)) {
            runCommand();
        }
        else {noPerms('Fejlesztő');}
    }
};