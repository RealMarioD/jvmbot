const { getDate, sleep } = require('../util.js');
module.exports = (client, message) => {

    if(message.content.toLowerCase().includes('mosolypannoniae')) {
        message.delete()
            .catch(() => {
                message.channel.send('<@438757327152218114>, nincs jogom ebben a channelben üzenetet törölni<:vidmanUnott:587645361154424832>');
            });
    }

    if (message.channel.id === '584445312312147996' &&
    !message.member._roles.includes(client.config.adminID)) {
        sleep(1000).then(() => {
            message.delete();
        });
    }

    if (!message.content.startsWith(client.config.prefix)) return;
    if (message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();
    const commandObject = client.commands.get(commandName);

    if (!commandObject) return;

    switch (commandObject.info.requiredPerm) {
        case 'developer':
            if(client.config.ownerID == message.author.id || message.member._roles.includes(client.config.fejlesztoID)) {
                runCommand();
            }
            else {noPerms('Fejlesztő');}
            break;

        case 'admin':
            if(client.config.ownerID == message.author.id || message.member._roles.includes(client.config.adminID)) {
                runCommand();
            }
            else {noPerms('Admin');}
            break;

        default:
            runCommand();
            break;
    }

    function runCommand() {
        try {
            commandObject.run(client, message, args);
            console.log(`${commandName} parancs futtatva @ ${getDate()}`);
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

};