const users = require('../assets/users.json')
const fs = require('fs')
exports.run = (client, message, args) => {

    let au = message.author
    if (!users[au.id]) {
        users[message.author.id] = {
            money: 0
        };
    }
    let response = Math.floor(Math.random() * (7 - 1 + 1));
    let win = false;
    if(response >= 4) { win = true }
    let responses = ['Nem sikerült..', 'BANG! Halott vagy.', 'Elég nagy rendetlenséget hagytál magad után az asztalon..', 'Nem vagy szerencsés, meghaltál.', 'Élet vagy halál? Az életet választod!', 'A fegyver kattant, de semmi sem történt!', 'Most szerencsés voltál...']

    if(win === true) {
        users[message.author.id].money += 100
        message.channel.send(`>>> **${responses[response]}**\n__${au.tag}__ kapott 100 Vidmánit!`)
    } else {
        if(users[message.author.id].money >= 50) {
            users[message.author.id].money -= 50
            message.channel.send(`>>> **${responses[response]}**\n__${au.tag}__ vesztett 50 Vidmánit.`)
        } else {
            message.channel.send(`>>> **${responses[response]}**\n__${au.tag}__ nem vesztett Vidmánit, mivel nincs elege veszíteni.`)
        }
    }

    fs.writeFileSync(`./assets/users.json`, JSON.stringify(users, null, 2))

}

exports.info = {
    syntax: '',
    description: 'Egy kis szerencse játék.'
}
