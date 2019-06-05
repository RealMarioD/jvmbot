exports.run = (client, message, args) => {
    message.delete()
    message.guild.members.get(message.author.id).removeRole('584408550365724672')
    message.guild.members.get(message.author.id).addRole('584408550101483523')
    message.author.send(`**Gratulálok, <@${message.author.id}>!** Mostmár láthatod a többi csatornát a szerveren és megkaptad a Tag rangot!🙂\n**Olvasd el a *<#584734791761526793>* csatornát is!**\n\nJelenleg ${message.guild.members.size} tag van a szerverben!\n\n<:vidman_logo:584352979818250257> __${message.guild.name}__`)
}