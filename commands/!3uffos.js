const {getBuff} = require('../util')
exports.run = (client, message, args) => {
    let errored = false;
    let randNick = `!3UFFOS💪${getBuff().toUpperCase()}`;
    message.guild.members.get(message.author.id).setNickname(randNick).catch(err => {
        if(err.code == 50013) {
            errored = true;
            message.channel.send(`Az adminok immunisak a !3UFFOSságra :((`);
        }
    });
    setTimeout(() => {
        if(errored === false) {
            message.channel.send(`Üdvözöllek a !3UFFOSOK világában, ${message.author}!`);
        }
    }, 1000);
    
}

exports.info = {
    syntax: '',
    description: '!3UFFO$$4 C$IN4L'
}