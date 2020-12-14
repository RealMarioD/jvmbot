const { giveRandom, getEmoji, cmdUsage } = require('../../util');
const fs = require('fs');
const users = require('../../assets/users.json');

exports.run = async (client, message, args) => {

    const cards = ['Ász', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Király', 'Királynő', 'Bubi'];
    const suits = ['♥', `${client.emojis.cache.find(emoji => emoji.name == 'vidmanPikk')}`, `${client.emojis.cache.find(emoji => emoji.name == 'vidmanTreff')}`, '♦'];

    const determineHand = (cardpack, total, name) => {
        return `> __**${name}**__ ezeket a kártyákat fogja:\n> ${String(cardpack.map((c) => `[${c}]`).join(', '))} (${total})\n\n`;
    };

    if(!users[message.author.id]) {
        users[message.author.id] = {
            money: 0
        };
    }

    if(!args.length) return cmdUsage(this, message);
    else if(isNaN(parseInt(args[0]))) return message.channel.send('> ❌ **Megadott érték nem szám.**');
    else if(users[message.author.id].money < args[0]) return message.channel.send('> ❌ Nincs annyi pénzed, mint amennyit fel akarsz tenni!');
    if(args[0] < 50 || args[0] > 10000) {
        if(!users[message.author.id].collection || !users[message.author.id].collection['penthouse']) return message.channel.send('> ❌ Túl sokat vagy túl keveset akarsz felrakni! `(50-10000)`');
        else if(users[message.author.id].collection['penthouse'].amount < 1) return message.channel.send('> ❌ Túl sokat vagy túl keveset akarsz felrakni! `(50-10000)`');
    }

    const bet = parseInt(args[0]);

    const gameCards = {
        dealer: [],
        player: [],
    };

    const countCards = (cardsToCount, deck) => {
        let total = 0;
        for(const card in cardsToCount) {
            switch(gameCards[deck][card].split(' ')[0]) {
                case 'Ász':
                    if(total + 11 <= 21) total += 11;
                    else total += 1;
                    break;
                case 'Király': case 'Királynő': case 'Bubi':
                    total += 10;
                    break;
                default:
                    total += parseInt(gameCards[deck][card].split(' ')[0]);
                    break;
            }
        }
        return total;
    };

    const playOptions = (originalMessage, passedMsg) => {

        if(countCards(gameCards['player'], 'player') == 21 && gameCards['player'].length == 2) {
            pushCards('dealer');
            if(countCards(gameCards['dealer'], 'dealer') == 21) return passedMsg.edit(determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${originalMessage.author.username}`) + determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó') + '\n> Neked és az osztónak is blackjackje van. Döntetlen! Visszakaptad a felrakott tétet.');

            users[message.author.id].money += bet * 2;
            fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
            return passedMsg.edit(determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${originalMessage.author.username}`) + determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó') + `\n> Blackjacked van! Visszakaptad a felrakott tétet és nyertél \`+${bet * 2}\` ${getEmoji('vidmani')}-t!`);
        }

        passedMsg.edit(passedMsg.content + '\n\n> Kérsz még kártyát `(hit)` vagy megállsz `(stay)`?\n*30mp-ed van beírni a választásod.*');
        const filter = m => {
            return m.author.id === originalMessage.author.id;
        };

        originalMessage.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            if(!['hit', 'stay'].includes(collected.first().content.toLowerCase())) {
                message.channel.send('> Hibás válasz.');
                passedMsg.edit(determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${originalMessage.author.username}`) + determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó'))
                .then(msg => {
                    playOptions(originalMessage, msg);
                });
            }
            else return selectMove(collected.first().content.toLowerCase(), originalMessage, passedMsg);
        }).catch(() => {
            message.channel.send('> Lejárt az időd. Mivel nem adtál meg semmit, így automatikusan megállsz.');
            selectMove('stay', originalMessage);
        });
    };

    const selectMove = (choice, originalMessage, passedMsg) => {
        switch(choice) {
            case 'hit':
                pushCards('player');
                if(countCards(gameCards['player'], 'player') > 21) {
                    do pushCards('dealer');
                    while(countCards(gameCards['dealer'], 'dealer') < 17);
                }
                passedMsg.edit(determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${originalMessage.author.username}`) + determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó'))
                .then((msg) => {
                    if(countCards(gameCards['player'], 'player') > 21) {
                        users[message.author.id].money -= bet;
                        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                        return msg.edit(msg.content + `\n\n Túl sok pontod van. Elvesztetted a felrakott tétet. \`-${bet}\` ${getEmoji('vidmani')}`);
                    }
                    else playOptions(originalMessage, msg);
                });
                break;
            case 'stay': {
                do pushCards('dealer');
                while(countCards(gameCards['dealer'], 'dealer') < 17);
                const finalPlayerTotal = countCards(gameCards['player'], 'player');
                const finalDealerTotal = countCards(gameCards['dealer'], 'dealer');
                passedMsg.edit(determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${originalMessage.author.username}`) + determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó'))
                .then(msg => {
                    if(finalDealerTotal > 21) {
                        users[message.author.id].money += bet;
                        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                        return msg.edit(msg.content + `\n\n> Az osztónak túl sok van! \`(${finalDealerTotal})\` Visszakaptad a felrakott tétet és nyertél \`+${bet}\` ${getEmoji('vidmani')}-t!`);
                    }
                    else if(finalPlayerTotal > finalDealerTotal) {
                        users[message.author.id].money += bet;
                        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                        return msg.edit(msg.content + `\n\n> Neked összesen ${finalPlayerTotal} pontod, míg az osztónak ${finalDealerTotal} pontja van. Visszakaptad a felrakott tétet és nyertél \`+${bet}\` ${getEmoji('vidmani')}-t!`);
                    }
                    else if(finalPlayerTotal < finalDealerTotal) {
                        users[message.author.id].money -= bet;
                        fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                        return msg.edit(msg.content + `\n\n> Neked összesen ${finalPlayerTotal} pontod, míg az osztónak ${finalDealerTotal} pontja van. Elvesztetted a felrakott tétet. \`-${bet}\` ${getEmoji('vidmani')}`);
                    }
                    else return msg.edit(msg.content + `\n\n> Neked összesen ${finalPlayerTotal} pontod, míg az osztónak ${finalDealerTotal} pontja van. Döntetlen! Visszakaptad a felrakott tétet.`);
                });
                }
                break;
            default:
                return message.channel.send(`> Ömm... <@${client.config.ownerID}> ennek nem kéne történnie.. ${getEmoji('vidmanHyperThink')}`);
        }
    };

    function pushCards(user) {
        let toPush;
        do toPush = `${cards[giveRandom(13)]} ${suits[giveRandom(3)]}`;
        while(gameCards['player'].includes(toPush) || gameCards['dealer'].includes(toPush));

        gameCards[user].push(toPush);

    }

    pushCards('player');
    pushCards('dealer');
    pushCards('player');

    const ownHand = determineHand(gameCards['player'], countCards(gameCards['player'], 'player'), `${message.author.username}`);
    const dealerHand = determineHand(gameCards['dealer'], countCards(gameCards['dealer'], 'dealer'), 'Az osztó');

    message.channel.send(ownHand + dealerHand)
    .then((msg) => {
        playOptions(message, msg);
    });

};

exports.info = {

    name: 'blackjack',
    category: 'pénzverde',
    syntax: '<tét>',
    description: 'Avagy huszonegy. Ha neked több pontod van mint az osztónak nyersz. Vigyázz, ne legyen több pontod, mint huszonegy, különben veszítesz!\n"Got it from Australia, made it perfect in Hungary."',
    requiredPerm: null,
    aliases: ['bj', 'black', 'blackj', 'blowjob']

};