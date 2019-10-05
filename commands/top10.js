const users = require('../assets/users.json');

exports.run = (client, message, args) => {

    let results = [];
    let i = 1;
    Object.keys(users).map(key => ({
        key: key, value: users[key]
    })).sort(
        (first, second) => (second.value.money - first.value.money)
    ).forEach((sortedData) => {
            results.push(`${i}. __${message.guild.members.get(sortedData.key).user.tag}__ - *${sortedData.value.money}*`);
            i += 1;
        }
    );
    message.channel.send(results.slice(0, 10))
};

exports.info = {
    syntax: "",
    description: "Kiírja a 10 legtöbb vidmánival rendelkező embert!"
};