const users = require('../assets/users.json');
const fs = require('fs');
const moment = require('moment');
exports.run = (client, message) => {

    const author = message.author;
    if (!users[author.id]) {
        users[author.id] = {
            money: 0,
            lastSavedTime: null,
            dailyDay: 1
        };
    }

    const currentDate = moment().valueOf();
    const cooldown = 86400000;
    const resetTime = 129600000;

    if (currentDate < users[author.id].lastSavedTime + cooldown) {
        const remainingTime = moment.duration(users[author.id].lastSavedTime + cooldown - currentDate);
        message.channel.send(`Még várnod kell \`${remainingTime.hours()} órát, ${remainingTime.minutes()} percet és ${remainingTime.seconds()} másodpercet\``);
    }
    else {
        if (currentDate < users[author.id].lastSavedTime + resetTime) {
            users[author.id].money += users[author.id].dailyDay * 50;
            const tick = '✅|';
            const cross = '❎|';
            message.channel.send(`>>> **__${author.tag}__ megkapta a napi Vidmániját! \`+${(users[author.id].dailyDay) * 50}\`**\n|${tick.repeat(users[author.id].dailyDay)}${(cross.repeat(5 - users[author.id].dailyDay))}`);
            if (users[author.id].dailyDay === 5) {
                users[author.id].dailyDay = 1;
            }
            else {
                users[author.id].dailyDay += 1;
            }
        }
        else {
            users[author.id].money += 50;
            users[author.id].dailyDay = 2;
            message.channel.send(`>>> **__${author.tag}__ megkapta a napi Vidmániját! \`+50\`**`);
        }
        users[author.id].lastSavedTime = currentDate;
        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
    }

};

exports.info = {

    name: 'napimani',
    syntax: '',
    description: 'Ezzel a paranncsal megkapod a napi Vidmánid!',
    requiredPerm: null

};