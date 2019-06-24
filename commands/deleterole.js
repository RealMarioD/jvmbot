exports.run = (client, message, args) => {
    if (message.member.roles.has('584740600033837069')) {

        const sar = require('../assets/sar.json');
        const fs = require('fs');

        if (args.length === 0) {
            message.channel.send(`❌ **| Nem adtál meg rankot!**`)
        } else {
            let id = args[0].replace('<@&', '');
            id = id.replace('>', '');

            if (!message.guild.roles.get(id)) {
                message.channel.send('❌ **| Nem létezik ilyen rank!**')
            } else {
                if (!sar[id]) {
                    sar[id] = {
                        enabled: false
                    };
                }
                if (sar[id].enabled === true) {
                    sar[id].enabled = false
                }
                fs.writeFileSync('./assets/sar.json', JSON.stringify(sar, null, 2));
                message.channel.send(`✅ **| Rank \`${message.guild.roles.get(id).name}\` törölve a listáról!**`)
            }
        }
    } else {
        message.channel.send({
            embed: {
                color: 0xff0000,
                title: `Ennek a parancsnak a végrehajtásához fejlesztőnek kell lenned!`
            }
        });
    }
};

exports.info = {

    syntax: '<role>',
    description: 'Ezzel tudsz törölni role-okat a listáról'

};