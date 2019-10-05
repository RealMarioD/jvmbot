const users = require('../assets/users.json')
const fs = require('fs')
exports.run = (client, message, args) => {

    let au = message.author
    if(args.length == 0) {
        message.channel.send(`>>> __${au.tag}__, adj meg egy összeget, amit be akarsz dobni!`)
    } else {
        let zs = Number(args[0])

        if (!users[au.id]) {
            users[message.author.id] = {
                money: 0
            };
        }
        if(users[au.id].money < zs) {
            message.channel.send(`>>> __${au.tag}, nincs elég pénzed, hogy feltegyél ennyit!`)
        } else if(50 <= zs && zs <= 10000) {
            let response = Math.floor(Math.random() * (7 - 1 + 1));
            let win = false;
            if(response >= 4) { win = true }
            let responses = ['Nem sikerült..', 'BANG! Halott vagy.', 'Elég nagy rendetlenséget hagytál magad után az asztalon..', 'Nem vagy szerencsés, meghaltál.', 'Élet vagy halál? Az életet választod!', 'A fegyver kattant, de semmi sem történt!', 'Most szerencsés voltál...']
            if(win === true) {
                users[message.author.id].money += zs
                message.channel.send(`>>> **${responses[response]}**\n__${au.tag}__ kapott ${zs*2} Vidmánit!`)
            } else {
                users[message.author.id].money -= zs
                message.channel.send(`>>> **${responses[response]}**\n__${au.tag}__ vesztett ${zs} Vidmánit.`)
            }
            fs.writeFileSync(`./assets/users.json`, JSON.stringify(users, null, 2))
        } else {
            message.channel.send(`>>> __${au.tag}__, túl keveset vagy túl sokat akarsz felrakni! \`(50-10000)\``)
        }
    }

}

exports.info = {
    syntax: '',
    description: 'Egy kis szerencse játék.'
}
