const users = require('../assets/users.json');
const fs = require('fs');
const moment = require('moment');
exports.run = (client, message, args) => {

    let author = message.author;
    if (!users[author.id]) {
        users[author.id] = {
            money: 0,
            lastSavedTime: null,
            dailyDay: 1
        }
    }

    let currentDate = moment().valueOf();
    let cooldown = 86400000;
    let resetTime = 129600000;

    if (currentDate < users[author.id].lastSavedTime + cooldown) {
        let remainingTime = moment.duration(users[author.id].lastSavedTime + cooldown - currentDate);
        message.channel.send(`Még várnod kell \`${remainingTime.hours()} órát, ${remainingTime.minutes()} percet és ${remainingTime.seconds()} másodpercet\``)
    } else {
        if (currentDate < users[author.id].lastSavedTime + resetTime) {
            users[author.id].money += users[author.id].dailyDay * 50;
            let tick = "✅|";
            let cross = "❎|";
            message.channel.send(`>>> **__${author.tag}__ megkapta a napi Vidmániját! \`+${(users[author.id].dailyDay) * 50}\`**\n|${tick.repeat(users[author.id].dailyDay)}${(cross.repeat(5 - users[author.id].dailyDay))}`);
            if (users[author.id].dailyDay === 5) {
                users[author.id].dailyDay = 1
            } else {
                users[author.id].dailyDay += 1
            }
        } else {
            users[author.id].money += 50;
            users[author.id].dailyDay = 2;
            message.channel.send(`>>> **__${author.tag}__ megkapta a napi Vidmániját! \`+50\`**`);
        }
        users[author.id].lastSavedTime = currentDate;
        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
    }

};

exports.info = {
    syntax: '',
    description: 'Ezzel a paranncsal megkapod a napi Vidmánid!'
};