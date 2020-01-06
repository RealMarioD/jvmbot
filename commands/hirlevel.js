const {getEmoji} = require("../util");
exports.run = (client, message, args) => {
    message.delete();
    let member = message.guild.members.get(message.author.id);
    if (member.roles.has(client.config.hirlevelID) === false) {
        member.addRole(client.config.hirlevelID).then(() =>
            message.author.send(`>>> ✅ **Feliratkoztál** a szerver hírlevelére! 📨\n\n${getEmoji(client, "vidmanLogo")} __${message.guild.name}__`));
    } else {
        member.removeRole(client.config.hirlevelID).then(() =>
            message.author.send(`>>> ✅ **Leiratkoztál** a szerver hírleveléről! 📨\n\n${getEmoji(client, "vidmanLogo")} __${message.guild.name}__`));
    }
};

exports.info = {

    syntax: '',
    description: 'Fel/le tudsz iratkozni a szerver hírlevélre/ről ezzel a paranccsal.'

};
