const users = require('../assets/users.json');
const {items, listItems} = require('../util.js');
const fs = require('fs');

exports.run = (client, message, args) => {

    if(args.length === 0) {
        message.channel.send(`❌ **| Hibás használat!**\n\`.store <buy/sell/inv/> <item> <darab>\``)
    } else {
        switch (args[0]) {
            case "buy":
                if(!args[1]) {
                    message.channel.send(listItems());
                } else {
                    itemkey = String(args[1]);
                    if(items.hasOwnProperty(args[1]) === true) {
                        if(!args[2]) {
                            message.channel.send(`❌ **| Nem adtál meg mennyiséget!**`)
                        } else {
                        let namount = Number(args[2]);
                            if(users[message.author.id].money >= items[args[1]].price * namount) {
                                users[message.author.id].money -= items[args[1]].price * namount;
                                if(!users[message.author.id].collection) {
                                    users[message.author.id].collection = {};
                                    users[message.author.id].collection[itemkey] = namount
                                } else {
                                    if(!users[message.author.id].collection[itemkey]) {
                                        users[message.author.id].collection[itemkey] = namount
                                    } else {
                                        users[message.author.id].collection[itemkey] += namount
                                    }
                                }
                                fs.writeFileSync(`./assets/users.json`, JSON.stringify(users, null, 2));
                                message.channel.send(`✅ **| Vettél ${namount}db-ot \`${items[args[1]].price * namount}vm\`-ért ebből: \`${items[args[1]].name}\`**`)
                            } else {
                                message.channel.send(`❌ **| Nincs elegendő pénzed!**`)
                            }
                        }
                    } else {
                        message.channel.send(`❌ **| Nincs ilyen item!**`)
                    }
                }
                break;
            case "sell":
                let itemkey;
                if (!args[1]) {
                    message.channel.send(listItems());
                } else {
                    itemkey = String(args[1]);
                    if (items.hasOwnProperty(args[1]) === true) {
                        if (!args[2]) {
                            message.channel.send(`❌ **| Nem adtál meg mennyiséget!**`)
                        } else {
                            let namount = Number(args[2]);
                            if (!users[message.author.id].collection) {
                                message.channel.send(`❌ **| Nincs mit eladnod!**`)
                            } else {
                                if (!users[message.author.id].collection[itemkey]) {
                                    message.channel.send(`❌ **| Nincs ilyen item az inventorydban!**`)
                                } else {
                                    if (users[message.author.id].collection[itemkey] < namount) {
                                        message.channel.send(`❌ **| Nincs ${namount}db-od ebből: \`${items[itemkey].name}\`**`)
                                    } else {
                                        users[message.author.id].collection[itemkey] -= namount;
                                        users[message.author.id].money += items[itemkey].price / 2 * namount;
                                        message.channel.send(`✅ **| Eladtál ${namount}db-ot \`${items[args[1]].price / 2 * namount}vm\`-ért ebből: \`${items[itemkey].name}\`**`);
                                        fs.writeFileSync(`./assets/users.json`, JSON.stringify(users, null, 2))
                                    }
                                }
                            }
                        }
                    } else {
                        message.channel.send(`❌ **| Nincs ilyen item!**`)
                    }
                }
                break;
            case "inv":
                break;
            default:
                message.channel.send(`❌ **| Hibás használat!**\n\`.store <buy/sell/inv/> <item> <darab>\``);
                break;
        }
    }
  
};
  
exports.info = {
    syntax: '<buy/sell/inv> <item> <darab>',
    description: 'Vidman Pláza, vagy amit akartok.'
};