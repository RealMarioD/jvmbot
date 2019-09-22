const users = require('../assets/users.json');
const fs = require('fs');
const moment = require('moment')
exports.run = (client, message, args) => {

    let au = message.author;
    if(!users[au.id]) {
        users[au.id] = {
            money: 0,
            lastSavedTime: null,
            dailyDay: 1
        }
    };

    let crDate = moment().valueOf();
    let cooldown = 86400000;
    let resetTime = 129600000;

    if(crDate < users[au.id].lastSavedTime + cooldown) {
        let remainingTime = moment.duration(users[au.id].lastSavedTime + cooldown - crDate)
        message.channel.send(`Még várnod kell \`${remainingTime.hours()}:${remainingTime.minutes()}:${remainingTime.seconds()}\``)
    } else {
        if(crDate < users[au.id].lastSavedTime + resetTime) {
            users[au.id].money += users[au.id].dailyDay * 50
            if(users[au.id].dailyDay == 5) {
                users[au.id].dailyDay = 1
            } else {
                users[au.id].dailyDay += 1
            }
            let tick = "☑|";
            let cross = "🇽|";
            message.channel.send(`>>> **__${au.tag}__ megkapta a napi Vidmániját! \`+${users[au.id].dailyDay * 50}\`**\n|${tick.repeat(users[au.id].dailyDay)}${(cross.repeat(5 - users[au.id].dailyDay))}`);
        } else {
            users[au.id].money += 50;
            users[au.id].dailyDay = 2;
            message.channel.send(`>>> **__${au.tag}__ megkapta a napi Vidmániját! \`+50\`**`);;
        }
        users[au.id].lastSavedTime = crDate;
        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
    }

};

exports.info = {
    syntax: '',
    description: 'Ezzel a paranncsal megkapod a napi Vidmánid!'
};