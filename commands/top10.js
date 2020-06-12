const users = require('../assets/users.json');
const { getEmoji } = require('../util');
exports.run = (client, message) => {

    const results = [];
    let i = 1;
    Object.keys(users).map(key => ({
        key: key, value: users[key]
    })).sort(
        (first, second) => (second.value.money - first.value.money)
    ).forEach((sortedData) => {
        if(message.guild.members.cache.has(sortedData.key) == true) {
            results.push(`${i}. __${message.guild.members.cache.get(sortedData.key).user.tag}__ - *${sortedData.value.money}*${getEmoji('vidmani')}`);
            i += 1;
        }
    });
    message.channel.send('>>> ' + results.slice(0, 10).join('\n'));
};

exports.info = {

    name: 'top10',
    category: 'szórakozás',
    syntax: '',
    description: 'Kiírja a 10 legtöbb <:vidmani:701782953679782019>-val rendelkező embert!',
    requiredPerm: null,
    aliases: ['top']

};