exports.run = (client, message, args) => {
    const sar = require('../assets/sar.json');
    const fs = require('fs');

    var msgembed = {
        color: 0x56f442,
        title: 'Kérhető role-ok',
        fields: []
    };

    if (args.length === 0) {
        var r;
        for (var role in sar) {
            if (sar[role].enabled === true) {
                r = message.guild.roles.get(role);
                msgembed.description += `<@&${r.id}> | .role \`${r.name}\`\n`
            }
        }
        msgembed.description = msgembed.description.replace('undefined', '');
        message.channel.send({embed: msgembed})
    } else {

        let arg = args[0].toLowerCase();

        let r = message.guild.roles.find(r => r.name.toLowerCase() == arg);

        if (!r) {
            message.channel.send('❌ **| Nem létezik ilyen rank!**')
        } else {

            let cangetr = true;
            let crrole;
            for (var role in sar) {
                if (sar[role].enabled === true) {
                    if (message.member.roles.has(role)) {
                        cangetr = false;
                        crrole = role;
                    }
                }
            }
            if (!sar[r.id] || sar[r.id].enabled === false) {
                message.channel.send('❌ **| Ez a rank nem választható!**')
            } else {
                if (message.member.roles.has(r.id) === true) {
                    message.guild.members.get(message.author.id).removeRole(r.id);
                    message.channel.send(`✅ **| Elvetted a(z) \`${r.name}\` role-t!**`)
                } else {
                    if (cangetr === true) {
                        message.guild.members.get(message.author.id).addRole(r.id);
                        message.channel.send(`✅ **| Megkaptad a(z) \`${r.name}\` role-t!**`)
                    } else {
                        message.guild.members.get(message.author.id).removeRole(crrole);
                        message.guild.members.get(message.author.id).addRole(r.id);
                        message.channel.send(`✅ **| Rankod cserélve! \`(${message.guild.roles.get(crrole).name} --> ${r.name})\`**`)
                    }
                }
            }
        }
    }
};

exports.info = {

    syntax: '<role>',
    description: 'Ezzel a paranccsal tudsz role-okat szerezni.'

};
