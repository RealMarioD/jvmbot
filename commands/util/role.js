const sar = require('../../assets/sar.json');
const { MessageEmbed } = require('discord.js');
exports.run = (client, message, args) => {

    if(!args.length) {
        const msgEmbed = new MessageEmbed()
            .setColor('#56f442')
            .setTitle('Kérhető roleok:')
            .setDescription('');

        for(const selfRole in sar) {
            if(sar[selfRole].enabled == true) {
                const _role = message.guild.roles.cache.get(selfRole);
                msgEmbed.description += `${_role.toString()} | .role \`${_role.name}\`\n`;
            }
        }
        return message.channel.send(msgEmbed);
    }

    const arg = args.join(' ').toLowerCase();

    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() == arg);

    if(!role) return message.channel.send('> ❌ **| Nem létezik ilyen rank!**');

    let canGetRole = true;
    let currentRole;
    for(const selfRole in sar) {
        if(sar[selfRole].enabled && message.member._roles.includes(selfRole)) {
            canGetRole = false;
            currentRole = selfRole;
        }
    }
    if(!sar[role.id] || !sar[role.id].enabled) message.channel.send('>>> ❌ **| Ez a rank nem választható!**');
    else if(message.member._roles.includes(role.id)) {
        message.guild.members.cache.get(message.author.id).roles.remove(role.id);
        message.channel.send(`>>> ✅ **| Elvetted a(z) \`${role.name}\` role-t!**`);
    }
    else if(canGetRole) {
        message.guild.members.cache.get(message.author.id).roles.add(role.id);
        message.channel.send(`>>> ✅ **| Megkaptad a(z) \`${role.name}\` role-t!**`);
    }
    else {
        message.guild.members.cache.get(message.author.id).roles.remove(currentRole);
        message.guild.members.cache.get(message.author.id).roles.add(role.id);
        message.channel.send(`>>> ✅ **| Rankod cserélve! \`(${message.guild.roles.cache.get(currentRole).name} --> ${role.name})\`**`);
    }
};

exports.info = {

    name: 'role',
    category: 'egyéb',
    syntax: '<role>',
    description: 'Ezzel a paranccsal tudsz role-okat szerezni.',
    requiredPerm: null

};
