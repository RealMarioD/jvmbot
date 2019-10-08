const config = require("./config.json");
const buff = require("./assets/buffos.json");

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
function getDate() {
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
    const randIndex = Math.floor(Math.random() * buff.length);
    return buff[randIndex];
}

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};

const items = {
    "alma": {
        "name": "Alma",
        "price": 100,
        "winboost": 5
    },
    "csigaszeru": {
        "name": "Csigaszerű Játékizé",
        "price": 300,
        "healboost": 5
    },
    "tengeri": {
        "name": "Tengeri Szerzetes",
        "price": 500,
        "winboost": 10
    },
    "onosz": {
        "name": "Onosz",
        "price": 1000,
        "healboost": 10
    },
    "leggitar": {
        "name": "Léggitár",
        "price": 2500,
        "healboost": 15
    },
    "ludolacra": {
        "name": "Ludolacra",
        "price": 5000,
        "healboost": 15
    }
};

function listItems() {
    let list = ">>> Megvásárolható/Eladható Itemek:\n";
    for (let item in items) {
        list += `**${items[item].name}** - Vétel ár: __${items[item].price}vm__ | Eladási ár: __${items[item].price / 2}vm__\n`
    }
    return list;
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
    listItems: listItems
};