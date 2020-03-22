const users = require('../assets/users.json');
const { items, listItems } = require('../util.js');
const fs = require('fs');

exports.run = (client, message, args) => {

    if (args.length === 0) {
        message.channel.send('>>> ❌ **| Hibás használat!**\n`.store <buy/sell/inv/list> <item> <darab>`');
    }
    else {
        const key = args[1];
        const user = users[message.author.id];
        if(Object.prototype.hasOwnProperty.call(items, key) == true || args[0] == 'inv' || args[0] == 'list') {
            if(args[2] || args[0] == 'inv' || args[0] == 'list') {
                const amt = parseInt(args[2]);
                if(amt > 0 || args[0] == 'inv' || args[0] == 'list') {
                    switch (args[0]) {
                        case 'buy': {
                            const totalAmount = items[key].price * amt;
                            if (user.money >= totalAmount) {
                                if (!user.collection) {
                                    user.collection = {};
                                    user.collection[key] = {
                                        amount: amt
                                    };
                                    user.money -= totalAmount;
                                }
                                else if(!user.collection[key]) {
                                    user.collection[key] = {
                                        amount: amt
                                    };
                                    user.money -= totalAmount;
                                }
                                else {
                                    user.collection[key].amount += amt;
                                    user.money -= items[key].price * amt;
                                }
                                fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                                message.channel.send(`>>> ✅ **| Vettél ${amt}db-ot \`${totalAmount}vm\`-ért ebből: \`${items[key].name}\`**`);
                            }
                            else {
                                message.channel.send('>>> ❌ **| Nincs elegendő pénzed!**');
                            }
                        }
                        break;

                        case 'sell': {
                            const totalPrice = (items[key].price / 2) * amt;
                            if(!user.collection) {
                                message.channel.send('>>> ❌ **| Üres az inventory-d!**');
                            }
                            else if(!user.collection[key]) {
                                message.channel.send('>>> ❌ **| Nincs ilyen itemed!**');
                            }
                            else if(user.collection[key].amount >= amt) {
                                user.money += totalPrice;
                                user.collection[key].amount -= amt;
                                fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                                message.channel.send(`>>> ✅ **| Eladtál ${amt}db-ot \`${totalPrice}vm\`-ért ebből: \`${items[key].name}\`**`);
                            }
                            else {
                                message.channel.send(`>>> ❌ **| Nincs \`${amt}\`db-od ebből: \`${items[key].name}\`**`);
                            }
                        }
                        break;

                        case 'inv': {
                            let finalMsg = `>>> __${message.author.tag} itemei:__\n\n`;
                            for(const item in user.collection) {
                                if(user.collection[item].amount != 0) {
                                    finalMsg += `**${items[item].name}** - __${user.collection[item].amount}__\n`;
                                }
                            }
                            if((finalMsg.length - message.author.tag.length) == 18) {
                                finalMsg += '*Wow, such empty.*';
                            }
                            message.channel.send(finalMsg);
                        }
                        break;

                        case 'list':
                            message.channel.send(listItems());
                            break;

                        default:
                            message.channel.send('>>> ❌ **| Hibás használat!**\n`.store <buy/sell/inv/list> <item> <darab>`');
                            break;
                    }
                }
                else {
                    message.channel.send('>>> ❌ **| *i g e n***');
                }
            }
            else {
                message.channel.send('>>> ❌ **| Nem adtál meg mennyiséget!**');
            }
        }
        else {
            message.channel.send('>>> ❌ **| Nincs ilyen item!**');
        }
    }
};


exports.info = {

    name: 'store',
    category: 'szórakozás',
    syntax: '<buy/sell/inv/list> <item> <darab>',
    description: 'Vidman Pláza, vagy amit akartok.',
    requiredPerm: null

};