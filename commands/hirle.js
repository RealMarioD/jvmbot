exports.run = (client, message, args) => {
    message.delete();
    message.guild.members.get(message.author.id).removeRole(config.hirlevelID);
    message.author.send(`✔️ **LEiratkoztál** a szerver hírleveléről! 📨\n\n<:vidman_logo:584352979818250257> __${message.guild.name}__`)
};

exports.info = {

    syntax: '',
    description: 'LEiratkozás a szerver hírleveléről'

};
