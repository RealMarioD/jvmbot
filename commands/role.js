exports.run = (client, message, args) => {
    const sar = require('../assets/sar.json');

    const msgembed = {
        color: 0x56f442,
        title: 'Kérhető role-ok',
        fields: []
    };

    if (args.length === 0) {
        for (const role in sar) {
            if (sar[role].enabled === true) {
                const r = message.guild.roles.cache.get(role);
                msgembed.description += `<@&${r.id}> | .role \`${r.name}\`\n`;
            }
        }
        msgembed.description = msgembed.description.replace('undefined', '');
        message.channel.send({ embed: msgembed });
    }
    else {

        const arg = args.join(' ').toLowerCase();

        // eslint-disable-next-line no-shadow
        const r = message.guild.roles.cache.find(r => r.name.toLowerCase() == arg);

        if (!r) {
            message.channel.send('❌ **| Nem létezik ilyen rank!**');
        }
        else {

            let cangetr = true;
            let crrole;
            for (const role in sar) {
                if (sar[role].enabled === true) {
                    if (message.member._roles.includes(role)) {
                        cangetr = false;
                        crrole = role;
                    }
                }
            }
            if (!sar[r.id] || sar[r.id].enabled === false) {
                message.channel.send('>>> ❌ **| Ez a rank nem választható!**');
            }
            else if (message.member._roles.includes(r.id) === true) {
                    message.guild.members.cache.get(message.author.id).roles.remove(r.id);
                    message.channel.send(`>>> ✅ **| Elvetted a(z) \`${r.name}\` role-t!**`);
            }
            else if (cangetr === true) {
                message.guild.members.cache.get(message.author.id).roles.add(r.id);
                message.channel.send(`>>> ✅ **| Megkaptad a(z) \`${r.name}\` role-t!**`);
            }
            else {
                message.guild.members.cache.get(message.author.id).roles.remove(crrole);
                message.guild.members.cache.get(message.author.id).roles.add(r.id);
                message.channel.send(`>>> ✅ **| Rankod cserélve! \`(${message.guild.roles.cache.get(crrole).name} --> ${r.name})\`**`);
            }
        }
    }
};

exports.info = {

    name: 'role',
    category: 'egyéb',
    syntax: '<role>',
    description: 'Ezzel a paranccsal tudsz role-okat szerezni.',
    requiredPerm: null

};
