const { MessageEmbed } = require('discord.js');
const { client } = require('./jvm');

function getMention(channel) {
    return client.channels.cache.get(channel).toString();
}

/**
 * Beautifies current date.
 * @param { Date } date If given, returns date beautified.
 */
function getDate(date) {
    if(!date) return new Date().toISOString().slice(0, 10).replace(/-/gi, '.') + ' ' + new Date().toTimeString().slice(0, 8);
    else return date.toISOString().slice(0, 10).replace(/-/gi, '.') + ' ' + date.toISOString().slice(11, 19);
}

/**
 * Tries to find given emote in client.emojis.cache
 * @param { String } name
 */
function getEmoji(name) {
    return client.emojis.cache.find(e => e.name == name);
}

/**
 * Simple promise based sleep function if you don't want to use setTimeout();
 * @param { Number } milliseconds
 */
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
    for(const item in items) list += `**${items[item].name} \`(${item})\`** - Vétel ár: __${items[item].price}vm__ | Eladási ár: __${items[item].price / 2}vm__\n`;
    return list;
}

/**
 * Random number generator. Starts from 0.
 * @param { Number } max
 * @param { Number } min
 */
function giveRandom(max, min) {
    if(!min) min = 0;
    return Math.floor(Math.random() * Math.floor(max - min)) + min;
}

/**
 * Use this if you would like to setup a page embed.
 * @param { Number } startIndex Leave this on 0 unless you want to start from a different position.
 * @param { MessageEmbed } list This is supposed to be the embed. It's named list because copypasta.
 * @param { Array } fieldHolder Put your fields into an array with 'title' and 'description'. E.g.: [{ title: 'Field Title', description: 'Ery nice.' }]
 * @param { Message } passedMsg Since you have to make the "please wait" message, this is that message's object holder.
 * @param { Message } message Author's message.
 * @param { Number } [pageSize] Defaults to 5. Optional.
 */
function sortFields(startIndex, list, fieldHolder, passedMsg, message, pageSize) {
    if(!pageSize) pageSize = 5;
    list.spliceFields(0, pageSize);
    let j = startIndex;
    if(j >= fieldHolder.length) j = fieldHolder.length - pageSize;
    let stopIndex = startIndex + pageSize;
    if(stopIndex > fieldHolder.length) stopIndex = fieldHolder.length;
    const pages = Math.ceil(fieldHolder.length / pageSize);
    const pageOf = Math.ceil(j / pageSize) + 1;
    for(j; j < stopIndex; j++) list.addField(fieldHolder[j].title, fieldHolder[j].desc);
    list.setFooter(`Oldal: ${pageOf}/${pages}`);
    passedMsg.edit('', list);
    startAwait(passedMsg, message, startIndex, fieldHolder, list, pageSize);
}

/**
 * Private function, don't use it.
 */
function startAwait(passedMsg, message, startIndex, fieldHolder, list, pageSize) {
    const filter = (reaction, user) => reaction.emoji.name == '⬅️' || reaction.emoji.name == '➡️' && user.id == message.author.id;
    passedMsg.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then(collection => handleReactions(collection, startIndex, fieldHolder, passedMsg, message, list, pageSize))
    .catch(() => {
        passedMsg.reactions.removeAll();
    });
}

/**
 * Private function, don't use it.
 */
function handleReactions(collection, startIndex, fieldHolder, passedMsg, message, list, pageSize) {
    switch(collection.first()._emoji.name) {
        case '⬅️':
            if(startIndex == 0) startAwait(passedMsg, message, startIndex, fieldHolder, list, pageSize);
            else {
                startIndex = startIndex - pageSize;
                sortFields(startIndex, list, fieldHolder, passedMsg, message, pageSize);
            }
            break;

        case '➡️':
            if(startIndex + pageSize >= fieldHolder.length) startAwait(passedMsg, message, startIndex, fieldHolder, list, pageSize);
            else {
                startIndex = startIndex + pageSize;
                sortFields(startIndex, list, fieldHolder, passedMsg, message, pageSize);
            }
            break;
        default:
            startAwait(passedMsg, message, startIndex, fieldHolder, list, pageSize);
            break;
    }
}

function doBackup() {
    client.channels.cache.get(client.config.channels.backup).send(`\`users.json\` **- Backup: ${getDate()}**`, { files: ['./assets/users.json'] });
}

/**
 * Use this after a no args check.
 * @param { Object } command Refers to the ran command.
 * @param { Message } message - Author's message.
 */
function cmdUsage(command, message) {
    const cmdInfo = command.info;
    message.channel.send(new MessageEmbed()
        .setTitle('❌ **| Helytelen használat.**')
        .setDescription(`\`.${cmdInfo.name} ${cmdInfo.syntax}\``)
        .setColor('#CC0000')
    );
}

/**
 * Finds a member. (Or user.)
 * @param { String } arg The argument which is supposed to be the user.
 * @param { Message } message Author's message.
 * @param { Boolean } returnUser Wheter to return a user. Default: Member
 * @param { User || GuildMember }
 */
function findMember(arg, message, returnUser) {
    let member;
    if(message.mentions.members.size > 0) member = message.mentions.members.first();
    else if(message.guild.members.cache.find(x => x.user.id == arg)) member = message.guild.members.cache.find(x => x.user.id == arg);
    else if(message.guild.members.cache.find(x => x.user.username.toLowerCase().includes(arg.toLowerCase()))) member = message.guild.members.cache.find(x => x.user.username.toLowerCase().includes(arg.toLowerCase()));
    if(returnUser && member) return member.user;
    return member;
}

module.exports = {
    getEmoji: getEmoji,
    getMention: getMention,
    getDate: getDate,
    sleep: sleep,
    items: items,
    listItems: listItems,
    giveRandom: giveRandom,
    sortFields: sortFields,
    doBackup: doBackup,
    cmdUsage: cmdUsage,
    findMember: findMember
};
