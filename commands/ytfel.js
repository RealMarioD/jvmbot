exports.run = (client, message, args) => {
    message.delete();
    message.guild.members.get(message.author.id).addRole('584736334099382288');
    message.author.send(`✔️ **FELiratkoztál** a szerver YouTube hírlevelére! <:youtube_logo:584701064637448202>\n\n<:vidman_logo:584352979818250257> __${message.guild.name}__`)
};

exports.info = {

    syntax: '',
    description: 'FELiratkozás a szerver YouTube hírlevelére'

};
