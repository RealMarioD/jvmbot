const config = require("./config.json");
const buff = require("./assets/buffos.json")

function devOnly(channel) {
    channel.send({
        embed: {
            color: 0xff0000,
            title: `Ennek a parancsnak a végrehajtásához fejlesztőnek kell lenned!`
        }
    });
}

function getMention(channel) {
    return `<#${channel}>`
}

// Visszaadja az időt egy szép formátumban. (Pl: 2019.06.09 04:20:42)
function getCrDate() {
    var final = new Date().toISOString().slice(0, 10).replace(/-/gi, '.');
    final += ' ' + new Date().toTimeString().slice(0, 8);
    return final;
}

// 8ball randomziáló cucc.
function magicBall() {
    var rand = ['Igen.', 'Kérdezd újra később..', 'Nem tudom.', 'Nem.', 'Lehet.', 'Valószínűleg nem.', 'Valószínűleg igen.', 'Talán.'];
    return rand[Math.floor(Math.random() * rand.length)];
}

// Beirsz egy nevet, es kikop egy emojit. Hasznos.
function getEmoji(client, name) {
    const vidmanserver = client.guilds.get(config.serverID);
    var emoji = vidmanserver.emojis.find(emoji => emoji.name === name);
    return emoji.toString();
}

function getBuff() {
    const buff = require('./assets/buffos.json')
    const randIndex = Math.floor(Math.random() * buff.length);
    const randKey = buff[randIndex];
    return randKey;
}

module.exports = {
    getEmoji: getEmoji,
    getMention: getMention,
    devOnly: devOnly,
    getCrDate: getCrDate,
    magicBall: magicBall,
    getBuff: getBuff
};