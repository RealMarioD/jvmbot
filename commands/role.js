exports.run = (client, message, args) => {
    const sar = require('../assets/sar.json')
    const fs = require('fs')

    var msgembed = {
        color: 0x56f442,
        title: 'Kérhető role-ok',
        fields: []
    }

    if(args.length === 0) {
        var r
        for(var role in sar){
            r = message.guild.roles.get(role)
            msgembed.description += `<@&${r.id}> | .role \`${r.name}\`\n`
        };
        msgembed.description = msgembed.description.replace('undefined', '')
        message.channel.send({embed: msgembed})
    } else {
        let id = args[0].replace('<@&', '')
        id = id.replace('>', '')

        if(!message.guild.roles.get(id)) {
            message.channel.send('❌ **| Nem létezik ilyen rank!**')
        } else {
            if(!sar[id] || sar[id].enabled === false) {
                message.channel.send('❌ **| Ez a rank nem választható!**')
            } else {
                if(message.member.roles.has(id) === true) {
                    message.guild.members.get(message.author.id).removeRole(id)
                    message.channel.send(`✅ **| Elvetted a(z) \`${message.guild.roles.get(id).name}\` role-t!**`)
                } else {
                    message.guild.members.get(message.author.id).addRole(id)
                    message.channel.send(`✅ **| Megkaptad a(z) \`${message.guild.roles.get(id).name}\` role-t!**`)
                }
            }

        }

    }
}

exports.info = {

    syntax: '<role>',
    description: 'Ezzel a paranccsal tudsz role-okat szerezni'
  
  }