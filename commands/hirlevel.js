exports.run = (client, message, args) => {
    message.delete();
    let mem = message.guild.members.get(message.author.id)
    if(mem.roles.has(client.config.hirlevelID) === false) {
        mem.addRole(client.config.hirlevelID);
        message.author.send(`✔️ **Feliratkoztál** a szerver hírlevelére! 📨\n\n<:vidman_logo:588027207772012544> __${message.guild.name}__`)
    } else {
        mem.removeRole(client.config.hirlevelID);
        message.author.send(`✔️ **Leiratkoztál** a szerver hírleveléről! 📨\n\n<:vidman_logo:588027207772012544> __${message.guild.name}__`)
    }
};

exports.info = {

    syntax: '',
    description: 'Fel/le tudsz iratkozni a szerver hírlevélre/ről ezzel a paranccsal.'

};
