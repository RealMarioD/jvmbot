const users = require('../assets/users.json');
const fs = require('fs');
const { getEmoji } = require('../util');
exports.run = (client, message, args) => {

    const responses = [
        'Nem sikerült..',
        'BANG! Halott vagy.',
        'Elég nagy rendetlenséget hagytál magad után az asztalon..',
        'Nem vagy szerencsés, meghaltál.',
        'Jó ember voltál, de a pénzedből más fog megélni',
        'Élet vagy halál? Az életet választod!',
        'A fegyver kattant, de semmi sem történt!',
        'Most szerencsés voltál...',
        'Mostmár kinyithatod a szemedet.',
        'Valaki nem töltötte újra a revolvert... üres tárral tényleg könnyű.'
    ];
    if(args.length === 0) {
        return message.channel.send(`> __${message.author.tag}__, adj meg egy összeget, amit be akarsz dobni!`);
    }
    const amount = parseInt(args[0]);
    if(isNaN(amount)) return message.channel.send('> ❌ **| i g e n**');

    if(!users[message.author.id]) {
        users[message.author.id] = {
            money: 0
        };
    }
    if(users[message.author.id].money < amount) {
        return message.channel.send(`>>> __${message.author.tag}, nincs elég ${getEmoji('vidmani')}-d, hogy feltegyél ennyit!`);
    }
    if(amount >= 50 && amount <= 10000) {
        const response = Math.floor(Math.random() * 10);
        if(response > 4) {
            users[message.author.id].money += amount;
            message.channel.send(`>>> **${responses[response]}**\n__${message.author.tag}__ nyert ${amount} ${getEmoji('vidmani')}-t!`);
        }
        else {
            users[message.author.id].money -= amount;
            message.channel.send(`>>> **${responses[response]}**\n__${message.author.tag}__ elvesztette a felrakott ${amount} ${getEmoji('vidmani')}-t.`);
        }
        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
    }
    else {
        message.channel.send(`>>> __${message.author.tag}__, túl keveset vagy túl sokat akarsz felrakni! \`(50-10000)\``);
    }
};

exports.info = {

    name: 'oroszrulett',
    category: 'szórakozás',
    syntax: '<tét>',
    description: 'Egy kis szerencse játék.',
    requiredPerm: null,
    aliases: ['rr', 'orosz', 'or', 'oroszr', 'oroszrulet']
};
