const {devOnly} = require("../util");
exports.run = (client, message, args) => {
    if (message.member.roles.has(client.config.fejlesztoID)) {

        const sar = require('../assets/sar.json');
        const keys = Object.keys(sar);
        const randIndex = Math.floor(Math.random() * keys.length);
        const randKey = keys[randIndex];
        const fs = require('fs');

        if (args.length === 0) {
            message.channel.send(`❌ **| Nem adtál meg rankot!**`)
        } else {
            let arg = args[0].toLowerCase();

            let r = message.guild.roles.find(r => r.name.toLowerCase() === arg);

            if (!r) {
                message.channel.send('❌ **| Nem létezik ilyen rank!**')
            } else {
                if (!sar[r.id]) {
                    sar[r.id] = {
                        enabled: true
                    };
                }
                if (sar[r.id].enabled === false) {
                    sar[r.id].enabled = true
                }
                fs.writeFileSync('./assets/sar.json', JSON.stringify(sar, null, 2));
                message.channel.send(`✅ **| Rank \`${r.name}\` hozzáadva a listához!**`)
            }
        }
    } else {
        devOnly(message.channel)
    }
};

exports.info = {

    syntax: '<role>',
    description: 'Ezzel a paranccsal role-okat lehet hozzáadni a kérhető role-ok listájához.',
    adminOnly: true

};
