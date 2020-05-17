const buff = require('./assets/buffos.json');
const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');

function devOnly(channel) {
    channel.send({
        embed: {
            color: 0xff0000,
            title: 'Ennek a parancsnak a végrehajtásához fejlesztőnek kell lenned!'
        }
    });
}

function getMention(channel) {
    return `<#${channel}>`;
}

// Visszaadja az időt egy szép formátumban. (Pl: 2019.06.09 04:20:42)
function getDate() {
    let final = new Date().toISOString().slice(0, 10).replace(/-/gi, '.');
    final += ' ' + new Date().toTimeString().slice(0, 8);
    return final;
}

// 8ball randomziáló cucc.
function magicBall() {
    const rand = ['Igen.', 'Kérdezd újra később..', 'Nem tudom.', 'Nem.', 'Lehet.', 'Valószínűleg nem.', 'Valószínűleg igen.', 'Talán.'];
    return rand[Math.floor(Math.random() * rand.length)];
}

// Beirsz egy nevet, es kikop egy emojit. Hasznos.
function getEmoji(client, name) {
    const emoji = client.emojis.cache.find(e => e.name == name);
    return emoji;
}

function getBuff() {
    const randIndex = Math.floor(Math.random() * buff.length);
    return buff[randIndex];
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
};

const items = {
    'alma': {
        'name': 'Alma',
        'price': 100,
        'winboost': 5
    },
    'csigaszeru': {
        'name': 'Csigaszerű Játékizé',
        'price': 300,
        'healboost': 5
    },
    'tengeri': {
        'name': 'Tengeri Szerzetes',
        'price': 500,
        'winboost': 10
    },
    'onosz': {
        'name': 'Onosz',
        'price': 1000,
        'healboost': 10
    },
    'leggitar': {
        'name': 'Léggitár',
        'price': 2500,
        'healboost': 15
    },
    'ludolacra': {
        'name': 'Ludolacra',
        'price': 5000,
        'healboost': 15
    }
};

function listItems() {
    let list = '>>> __Megvásárolható/Eladható Itemek__:\n\n';
    for (const item in items) {
        list += `**${items[item].name} \`(${item})\`** - Vétel ár: __${items[item].price}vm__ | Eladási ár: __${items[item].price / 2}vm__\n`;
    }
    return list;
}

function giveRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function totalUpCardpack(cardpack, total, index) {
    switch(cardpack[index]) {
        case 'Ace':
            if(total + 11 <= 21) total += 11;
            else total += 1;
            break;
        case 'King': case 'Queen': case 'Jack':
            total += 10;
            break;
        default:
            total += Number(cardpack[index]);
    }
    return total;
}

function bjMsg(cardpack, total, name) {
    return `${name} cards:\n${String(cardpack.map((c, index) => `${index + 1}. card: ${c}\n`)).replace(',', '')}Total: ${total}\n`;
}

function play(connection, client, message, ogMsg) {
    client.message = message;
    client.dispatcher = connection.play(ytdl(client.queue[0].url, { quality: 'highestaudio' }));
    if(!ogMsg) {
        message.channel.send(new MessageEmbed()
            .setDescription('Most indult.')
            .setTitle(client.queue[0].title)
            .setURL(client.queue[0].url)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setFooter(client.queue[0].channelName, client.queue[0].channelIcon)
            .setThumbnail(client.queue[0].videoThumbnail)
        );
    }
    else {
        ogMsg.edit('', new MessageEmbed()
            .setDescription('Most indult.')
            .setTitle(client.queue[0].title)
            .setURL(client.queue[0].url)
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setFooter(client.queue[0].channelName, client.queue[0].channelIcon)
            .setThumbnail(client.queue[0].videoThumbnail)
        );
    }
    const event = require('./dispatcher/finish.js');
    const eventName = 'finish';
    client.dispatcher.on(eventName, event.bind(null, client));
}

module.exports = {
    getEmoji: getEmoji,
    getMention: getMention,
    devOnly: devOnly,
    getDate: getDate,
    magicBall: magicBall,
    getBuff: getBuff,
    sleep: sleep,
    items: items,
    listItems: listItems,
    giveRandom : giveRandom,
    totalUpCardpack: totalUpCardpack,
    bjMsg: bjMsg,
    play: play
};