exports.run = (client, message, args) => {
    message.delete();
    let mem = message.guild.members.get(message.author.id)
    if(mem.roles.has(client.config.tagID) === true) {} else {
        mem.removeRole(client.config.ideiglenestagID);
        mem.addRole(client.config.tagID);
        message.author.send(`**Gratulálok, <@${message.author.id}>!** Mostmár láthatod a többi csatornát a szerveren és megkaptad a **Tag** rangot!🙂\n**Olvasd el a *<#584734791761526793>* csatornát is!**\n\nJelenleg ${message.guild.members.size} tag van a szerverben!\n\n<:vidman_logo:588027207772012544> __${message.guild.name}__`)
    }
};

exports.info = {

    syntax: '',
    description: 'Ellenőrző parancs a belépéskor.'

};
