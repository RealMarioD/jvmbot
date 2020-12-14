const sar = require('../../assets/sar.json');
const fs = require('fs');
const { cmdUsage } = require('../../util');

exports.run = (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);
    const roleName = args.join(' ').toLowerCase();
    const role = message.guild.roles.cache.find(r => r.name.toLowerCase() == roleName);
    if(!role) return message.channel.send('> ❌ **| Nem létezik ilyen rank!**');
    if(!sar[role.id]) {
        sar[role.id] = {
            enabled: false
        };
    }
    else sar[role.id].enabled = false;
    fs.writeFileSync('./assets/sar.json', JSON.stringify(sar, null, 2));
    message.channel.send(`> ✅ **| Rank \`${role.name}\` törölve a listáról!**`);
};

exports.info = {

    name: 'deleterole',
    category: 'admin',
    syntax: '<role>',
    description: 'Ezzel a paranccsal role-okat lehet törölni a kérhető role-ok listájáról',
    requiredPerm: 'admin'

};
