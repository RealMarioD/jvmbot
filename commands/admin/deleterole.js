exports.run = (client, message, args) => {

    const sar = require('../../assets/sar.json');
    const fs = require('fs');

    if(args.length === 0) {
        message.channel.send('❌ **| Nem adtál meg rankot!**');
    }
    else {
        const roleName = args.join(' ').toLowerCase();
        const role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
        if(!role) {
            message.channel.send('❌ **| Nem létezik ilyen rank!**');
        }
        else {
            if(!sar[role.id]) {
                sar[role.id] = {
                    enabled: false
                };
            }
            if(sar[role.id].enabled === true) {
                sar[role.id].enabled = false;
            }
            fs.writeFileSync('./assets/sar.json', JSON.stringify(sar, null, 2));
            message.channel.send(`✅ **| Rank \`${role.name}\` törölve a listáról!**`);
        }
    }
};

exports.info = {

    name: 'deleterole',
    category: 'admin',
    syntax: '<role>',
    description: 'Ezzel a paranccsal role-okat lehet törölni a kérhető role-ok listájáról',
    requiredPerm: 'admin'

};