const users = require('../assets/users.json');
const fs = require('fs');
const { MessageEmbed } = require('discord.js');
exports.run = (client, message, args) => {

    if (args.length < 2) {
        return message.channel.send('> ❌ **| Nem adtál meg elég adatot!**');
    }

    const userToPay = message.mentions.users.first();
    if(!userToPay) return message.channel.send('> ❌ **| Nincs ilyen tag!**');
    else if(userToPay.id == message.author.id) return message.channel.send('> ❌ **| Magadnak nem küldhetsz pénzt!**');
    const money = parseInt(args[1]);
    if(!users[message.author.id] || money > users[message.author.id].money) return message.channel.send('> ❌ **| Túl sok Vidmanit akarsz küldeni!**');

    let i = 0;
    const verified = [];

    message.channel.send(new MessageEmbed()
        .setTitle('<:vidmani:701782953679782019> | Átadás')
        .addField('**Küldő:**', message.author.tag, true)
        .addField('**Fogadó:**', userToPay.tag, true)
        .addField('**Összeg:**', money, true)
        .setDescription('__Elfogadáshoz mindakettő fél írjon egy `elfogad`-ot!__')
    );
    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1, time: 30000 })
    .then(collected => {
        handleTransfer(collected);
    });
    message.channel.awaitMessages(m => m.author.id == userToPay.id, { max: 1, time: 30000 })
    .then(collected => {
        handleTransfer(collected);
    });

    function handleTransfer(collection) {
        i++;
        if(!collection) return;
        verified.push(`${collection.first().author.id}${collection.first().content}`);
        if(i == 2) {
            if(verified[0] == `${message.author.id}elfogad` ||
            verified[1] == `${userToPay.id}elfogad` ||
            verified[1] == `${message.author.id}elfogad` ||
            verified[0] == `${userToPay.id}elfogad`) {
                users[userToPay.id].money += money;
                users[message.author.id].money -= money;
                fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                message.channel.send('> ✅ **| Az átadás megtörtént.**');
            }
            else {
                message.channel.send('> ❌ **| Elutasítva mert no elfogad.**');
            }
        }
    }

};

exports.info = {

    name: 'pay',
    category: 'szórakozás',
    syntax: '<tag> <vidmani>',
    description: 'Ezzel a paranccsal pénzt tudsz utalni másik tagnak.',
    requiredPerm: null

};
