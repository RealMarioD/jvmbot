const users = require('../assets/users.json');
const {items, listItems} = require('../util.js');
const fs = require('fs');

exports.run = (client, message, args) => {

    if (args.length === 0) {
        message.channel.send(`❌ **| Hibás használat!**\n\`.store <buy/sell/inv/> <item> <darab>\``)
    } else {
        if (!args[1]) {
            message.channel.send(listItems());
        }
        if (!args[2]) {
            message.channel.send(`❌ **| Nem adtál meg mennyiséget!**`)
        }
        let key;
        key = args[1];
        switch (args[0]) {
            case "buy":
                if (items.hasOwnProperty(key) === true) {
                    if (args[2]) {
                        let amt = parseInt(args[2]);
                        let totalAmount = users[message.author.id].money >= items[args[1]].price * amt;
                        if (totalAmount) {
                            users[message.author.id].money -= items[args[1]].price * amt;
                            if (!users[message.author.id].collection) {
                                users[message.author.id].collection = {};
                                users[message.author.id].collection[key] = amt
                            } else {
                                if (!users[message.author.id].collection[key]) {
                                    users[message.author.id].collection[key] = amt
                                } else {
                                    users[message.author.id].collection[key] += amt
                                }
                            }
                            fs.writeFileSync(`./assets/users.json`, JSON.stringify(users, null, 2));
                            message.channel.send(`✅ **| Vettél ${amt}db-ot \`${items[args[1]].price * amt}vm\`-ért ebből: \`${items[args[1]].name}\`**`)
                        } else {
                            message.channel.send(`❌ **| Nincs elegendő pénzed!**`)
                        }
                    } else {
                        message.channel.send(`❌ **| Nem adtál meg mennyiséget!**`)
                    }
                } else {
                    message.channel.send(`❌ **| Nincs ilyen item!**`)
                }

                break;
            case "sell":
                if (items.hasOwnProperty(args[1]) === true) {
                    let amt = parseInt(args[2]);
                    if (!users[message.author.id].collection) {
                        message.channel.send(`❌ **| Nincs mit eladnod!**`)
                    } else {
                        if (!users[message.author.id].collection[key]) {
                            message.channel.send(`❌ **| Nincs ilyen item az inventorydban!**`)
                        } else {
                            if (users[message.author.id].collection[key] < amt) {
                                message.channel.send(`❌ **| Nincs ${amt}db-od ebből: \`${items[key].name}\`**`)
                            } else {
                                users[message.author.id].collection[key] -= amt;
                                users[message.author.id].money += items[key].price / 2 * amt;
                                message.channel.send(`✅ **| Eladtál ${amt}db-ot \`${items[args[1]].price / 2 * amt}vm\`-ért ebből: \`${items[key].name}\`**`);
                                fs.writeFileSync(`./assets/users.json`, JSON.stringify(users, null, 2))
                            }
                        }

                    }
                } else {
                    message.channel.send(`❌ **| Nincs ilyen item!**`)
                }
                break;
            case"inv":
                break;
            default:
                message.channel.send(`❌ **| Hibás használat!**\n\`.store <buy/sell/inv/> <item> <darab>\``);
                break;
        }
    }

}
;

exports.info = {
    syntax: '<buy/sell/inv> <item> <darab>',
    description: 'Vidman Pláza, vagy amit akartok.'
};