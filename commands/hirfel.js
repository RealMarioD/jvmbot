exports.run = (client, message, args) => {
    message.delete()
    message.guild.members.get(message.author.id).addRole('584676489405136897')
    message.author.send(`✔️ **FELiratkoztál** a szerver hírlevelére! 📨\n\n<:vidman_logo:584352979818250257> __${message.guild.name}__`)
}

exports.info = {

  syntax: '',
  description: 'FELiratkozás a szerver hírlevelére'

}
