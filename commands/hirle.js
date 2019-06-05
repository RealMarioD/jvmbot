exports.run = (client, message, args) => {
    message.delete()
    message.guild.members.get(message.author.id).removeRole('584676489405136897')
    message.author.send(`✔️ **LEiratkoztál** a szerver hírleveléről! 📨\n\n<:vidman_logo:584352979818250257> __${message.guild.name}__`)
}