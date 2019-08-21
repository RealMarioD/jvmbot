exports.run = (client, message, args) => {
    const config = require('../config.json')
    let hirr = message.guild.roles.get(config.hirlevelID)
    if(message.member.roles.has(config.fejlesztoID)) {
        if(hirr.mentionable === false) {
            hirr.setMentionable(true)
            message.channel.send(`A hírlevél role megpingelése: __**Engedélyezve**__`)
        } else {
            hirr.setMentionable(false)
            message.channel.send(`A hírlevél role megpingelése: __**Letiltva**__`)
        }
    }
}