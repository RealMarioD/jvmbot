const asd = require('../../asd.json');
const users = require('../../assets/users.json');
// const fs = require('fs');
exports.run = (client, message) => {
    for(const key in asd) {
        const member = message.guild.members.cache.find(x => x.user.username === key);
        if(member) {
            if(!users[member.id]) {
                let i = 0;
                for(i = 0; i < 100; i++) {
                    let szám = 35;
                    for(let j = 1; j <= i; j++) {
                        szám += (j - 1) * 40 + 20;
                    }
                    if(szám > asd[key]) break;
                }
                users[member.id] = {
                    money: 0,
                    lastSavedTime: null,
                    dailyDay: 1,
                    xp: asd[key],
                    level: i,
                    lastMessageTime: 0
                };
            }
            else {
                users[member.id].xp = asd[key];
                let i = 0;
                for(i = 0; i < 100; i++) {
                    let szám = 35;
                    for(let j = 1; j <= i; j++) {
                        szám += (j - 1) * 40 + 20;
                    }
                    if(szám > asd[key]) break;
                }
                users[member.id].level = i;
            }
        }
    }
    // fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
    message.channel.send('XP sikeresen átkonvertálva');
};

exports.info = {

    name: 'xpconvert',
    category: 'xp',
    syntax: '',
    description: 'Átkonvertálja Amaribot xp-jét',
    requiredPerm: null
};