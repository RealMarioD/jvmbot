/* eslint-disable no-shadow */
const giveRandom = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
};

const cards = ['Ász', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Király', 'Királynő', 'Bubi'];

const fs = require('fs');
const users = require('../assets/users.json');

exports.run = async (client, message, args) => {

    const suits = ['♥', `${client.guilds.get('650353727991185430').emojis.find(emoji => emoji.name == 'vidmanPikk')}`, `${client.guilds.get('650353727991185430').emojis.find(emoji => emoji.name == 'vidmanTreff')}`, '♦'];

    const determineHand = (cardpack, total, name) => {
        return `> ${name} ezeket a kártyákat fogja:\n> ${String(cardpack.map((c) => `[${c}${suits[giveRandom(3)]}]`).join(', '))} (${total})\n\n`;
    };

    if(!users[message.author.id]) {
        users[message.author.id] = {
            // eslint-disable-next-line comma-dangle
            money: 0
        };
    }

    if(args.length == 0) {message.channel.send('> ❌ Nem adtál meg tétet!');}
    else if(isNaN(Number(args[0]))) {message.channel.send('> ❌ ***i g e n***');}
    else if(users[message.author.id].money < args[0]) {message.channel.send('> ❌ Nincs annyi pénzed, mint amennyit fel akarsz tenni!');}
    else if(args[0] < 50 || args[0] > 10000) {message.channel.send('> ❌ Túl sokat vagy túl keveset akarsz felrakni! `(50-10000)`');}
    else {

        const bet = Number(args[0]);

        const gameCards = {
            dealer: [],
            player: [],
        };

        const countCards = (cards, deck) => {
            let total = 0;
            for (const card in cards) {
                switch (gameCards[deck][card]) {
                    case 'Ász':
                        if (total + 11 <= 21) total += 11;
                        else total += 1;
                        break;
                    case 'Király': case 'Királynő': case 'Bubi':
                        total += 10;
                        break;
                    default:
                        total += parseInt(gameCards[deck][card]);
                        break;
                }
            }
            return total;
        };

        const playOptions = (originalMessage, msg) => {
            msg.edit(msg.content + '\n\n> Kérsz még kártyát `(hit)` vagy megállsz `(stay)`?\n*30mp-ed van beírni a választásod.*');
            // await messages
            const filter = m => {
                return m.author.id === originalMessage.author.id;
            };

            originalMessage.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
                if (!['hit', 'stay'].includes(collected.first().content.toLowerCase())) {
                    message.channel.send('> Hibás válasz.');
                    originalMessage.channel.send(determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${originalMessage.author.username}`) + determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó')).then(msg => {
                        playOptions(originalMessage, msg);
                    });
                }
                else {
                    return selectMove(collected.first().content.toLowerCase(), originalMessage);
                }
            }).catch(() => {
                message.channel.send('> Lejárt az időd. Mivel nem adtál meg semmit, így automatikusan megállsz.');
                selectMove('stay', originalMessage);
            });
        };

        const selectMove = (choice, originalMessage) => {
            switch (choice) {
                case 'hit':
                    originalMessage.channel.send('> Kértél egy kártyát.');
                    gameCards['player'].push(cards[giveRandom(13)]);
                    if(countCards(gameCards['player'], 'player') > 21) {
                        do {
                            gameCards['dealer'].push(cards[giveRandom(13)]);
                        } while (countCards(gameCards['dealer'], 'dealer') < 17);
                    }
                    originalMessage.channel.send(determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${originalMessage.author.username}`) + determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó')).then((msg) => {
                        if (countCards(gameCards['player'], 'player') > 21) {
                            users[message.author.id].money -= bet;
                            fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                            return msg.edit(msg.content + `\n\n Túl sok pontod van. Elvesztetted a felrakott tétet. \`-${bet}\``);
                        }
                        else {
                            playOptions(originalMessage, msg);
                        }
                    });
                    break;
                case 'stay': {
                    do {
                        gameCards['dealer'].push(cards[giveRandom(13)]);
                    } while (countCards(gameCards['dealer'], 'dealer') < 17);
                    const finalPlayerTotal = countCards(gameCards['player'], 'player');
                    const finalDealerTotal = countCards(gameCards['dealer'], 'dealer');
                    message.channel.send(determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${originalMessage.author.username}`) + determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó')).then(msg => {
                        if (finalDealerTotal > 21) {
                            users[message.author.id].money += bet;
                            fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                            return msg.edit(msg.content + `\n\n> Az osztónak túl sok van! \`(${finalDealerTotal})\` Visszakaptad a felrakott tétet és nyertél \`+${bet}\` Vidmánit!`);
                        }
                        else if (finalPlayerTotal > finalDealerTotal) {
                            users[message.author.id].money += bet;
                            fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                            return msg.edit(msg.content + `\n\n> Neked összesen ${finalPlayerTotal} pontod, míg az osztónak ${finalDealerTotal} pontja van. Visszakaptad a felrakott tétet és nyertél \`+${bet}\` Vidmánit!`);
                        }
                        else if (finalPlayerTotal < finalDealerTotal) {
                            users[message.author.id].money -= bet;
                            fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                            return msg.edit(msg.content + `\n\n> Neked összesen ${finalPlayerTotal} pontod, míg az osztónak ${finalDealerTotal} pontja van. Elvesztetted a felrakott tétet. \`-${bet}\``);
                        }
                        else {
                            return msg.edit(msg.content + `\n\n> Neked összesen ${finalPlayerTotal} pontod, míg az osztónak ${finalDealerTotal} pontja van. Döntetlen! Visszakaptad a felrakott tétet.`);
                        }
                    });
                }
                break;
                default:
                    return message.channel.send('> Hibás választás. Game Over!');
            }
        };

        gameCards['player'].push(cards[giveRandom(13)]);
        gameCards['player'].push(cards[giveRandom(13)]);
        gameCards['dealer'].push(cards[giveRandom(13)]);

        const ownHand = determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${message.author.username}`);
        const dealerHand = determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó');

        message.channel.send(ownHand + dealerHand).then((msg) => {
            playOptions(message, msg);
        });

    }

};

exports.info = {

    name: 'blackjack',
    syntax: '<tét>',
    description: 'Avagy huszonegy. Ha neked több pontod van mint az osztónak nyersz. Vigyázz, ne legyen több pontod, mint huszonegy, különben veszítesz!\n"Got from Australia, perfected in Hungary."',
    requiredPerm: null

};