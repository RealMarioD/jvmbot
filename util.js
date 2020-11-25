const ytdlDC = require('ytdl-core-discord');
const { MessageEmbed } = require('discord.js');
const { client } = require('./jvm');

function getMention(channel) {
    return client.channels.cache.get(channel).toString();
}

// Pl: 2019.06.09 04:20:42
function getDate(date) {
    if(!date) return new Date().toISOString().slice(0, 10).replace(/-/gi, '.') + ' ' + new Date().toTimeString().slice(0, 8);
    else return date.toISOString().slice(0, 10).replace(/-/gi, '.') + ' ' + date.toISOString().slice(11, 19);
}

function getEmoji(name) {
    return client.emojis.cache.find(e => e.name == name);
}

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

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
    },
    'penthouse': {
        'name': 'Penthouse',
        'price': 25000
    }
};

function listItems() {
    let list = '>>> __Megvásárolható/Eladható Itemek__:\n\n';
    for(const item in items) {
        list += `**${items[item].name} \`(${item})\`** - Vétel ár: __${items[item].price}vm__ | Eladási ár: __${items[item].price / 2}vm__\n`;
    }
    return list;
}

function giveRandom(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

async function play(connection, message, ogMsg) {
    client.message = message;
    const toPlay = client.queue[0];
    client.dispatcher = connection.play(await ytdlDC(toPlay.url), { type: 'opus' });
    const playEmbed = new MessageEmbed()
        .setDescription('Most indult.')
        .addField('**Hossz:**', toPlay.duration)
        .setTitle(toPlay.title)
        .setURL(toPlay.url)
        .setAuthor(toPlay.author.tag, toPlay.author.displayAvatarURL({ format: 'png', dynamic: true }))
        .setFooter(toPlay.channelName, toPlay.channelIcon)
        .setThumbnail(toPlay.videoThumbnail);

    if(!ogMsg) message.channel.send(playEmbed);
    else ogMsg.edit('', playEmbed);

    const finishEvent = require('./dispatcher/finish.js');
    const debugEvent = require('./dispatcher/debug.js');
    const errorEvent = require('./dispatcher/error.js');
    client.dispatcher.on('finish', finishEvent.bind(null, client));
    client.dispatcher.on('debug', debugEvent.bind(null, client));
    client.dispatcher.on('error', errorEvent.bind(null, client));
    client.dispatcher.setVolumeLogarithmic(client.volume);
}

function sortFields(startIndex, list, fieldHolder, passedMsg, message) {
    list.spliceFields(0, 5);
    let j = startIndex;
    if(j >= fieldHolder.length) j = fieldHolder.length - 5;
    let stopIndex = startIndex + 5;
    if(stopIndex > fieldHolder.length) {
        stopIndex = fieldHolder.length;
    }
    const pages = Math.ceil(fieldHolder.length / 5);
    const pageOf = Math.ceil(j / 5) + 1;
    for(j; j < stopIndex; j++) {
        list.addField(fieldHolder[j].title, fieldHolder[j].desc);
    }
    list.setFooter(`Oldal: ${pageOf}/${pages}`);
    passedMsg.edit('', list);
    startAwait(passedMsg, message, startIndex, fieldHolder, list);
}

function startAwait(passedMsg, message, startIndex, fieldHolder, list) {
    const filter = (reaction, user) => reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️' && user.id == message.author.id;
    passedMsg.awaitReactions(filter, { max: 1, time: 5000, errors: ['time'] })
    .then(collection => handleReactions(collection, startIndex, fieldHolder, passedMsg, message, list))
    .catch(() => null);
}

function handleReactions(collection, startIndex, fieldHolder, passedMsg, message, list) {
    switch(collection.first()._emoji.name) {
        case '⬅️':
            if(startIndex == 0) {
                startAwait(passedMsg, message, startIndex, fieldHolder, list);
            }
            else {
                startIndex = startIndex - 5;
                sortFields(startIndex, list, fieldHolder, passedMsg, message);
            }
            break;

        case '➡️':
            if(startIndex + 5 >= fieldHolder.length) {
                startAwait(passedMsg, message, startIndex, fieldHolder, list);
            }
            else {
                startIndex = startIndex + 5;
                sortFields(startIndex, list, fieldHolder, passedMsg, message);
            }
            break;
        default:
            startAwait(passedMsg, message, startIndex, fieldHolder, list);
            break;
    }
}

function doBackup() {
    client.channels.cache.get(client.config.consoleLogChannelID).send(`\`users.json\` **- Backup: ${getDate()}**`, { files: ['./assets/users.json'] });
}

module.exports = {
    getEmoji: getEmoji,
    getMention: getMention,
    getDate: getDate,
    sleep: sleep,
    items: items,
    listItems: listItems,
    giveRandom: giveRandom,
    play: play,
    sortFields: sortFields,
    doBackup: doBackup
};
