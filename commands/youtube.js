const { getEmoji } = require('../util');
exports.run = (client, message) => {
    message.delete();
    const mem = message.guild.members.get(message.author.id);
    if (mem.roles.has(client.config.ytID) === false) {
        mem.addRole(client.config.ytID).then(() => message.author.send(`>>> ✅ **Feliratkoztál** a szerver YouTube hírlevelére! 📨\n\n${getEmoji(client, 'vidmanLogo')} __${message.guild.name}__`));
    }
    else {
        mem.removeRole(client.config.ytID).then(() => message.author.send(`>>> ✅ **Leiratkoztál** a szerver YouTube hírleveléről! 📨\n\n${getEmoji(client, 'vidmanLogo')} __${message.guild.name}__`));
    }
};

exports.info = {
    syntax: '',
    description: 'Fel/le tudsz iratkozni a YouTube hírlevélre/ről ezzel a paranccsal.',
};
