const {sleep} = require("../util");
const {getBuff} = require('../util');
exports.run = (client, message, args) => {
    let randNick = `!3UFFOS💪${getBuff().toUpperCase()}`;
    message.guild.members.get(message.author.id).setNickname(randNick).catch(err => {
        if (err.code === 50013) {
            message.channel.send(`Az adminok immunisak a !3UFFOSságra :((`);
            throw new Error("asd"); // throwolunk hogy a kovetkezo uzenet ne irodjon ki
        }
    }).then(() => {
        sleep(1000).then(() => {
            message.channel.send(`Üdvözöllek a !3UFFOSOK világában, ${message.author}!`);
        });

    });

};

exports.info = {
    syntax: '',
    description: '!3UFFO$$4 C$IN4L'
};