const { giveRandom, getEmoji, cmdUsage } = require('../../util');
const fs = require('fs');
const users = require('../../assets/users.json');

exports.run = async (client, message, args) => {

    if(!args.length) return cmdUsage(this, message);

    const bet = parseInt(args[0]);
    if(isNaN(bet)) return message.channel.send('> ❌ **Megadott érték nem szám.**');
    if(!users[message.author.id] || users[message.author.id].money < bet) return message.channel.send('> ❌ Nincs annyi pénzed, mint amennyit fel akarsz tenni!');
    if(bet < 50 || bet > 10000) {
        if(!users[message.author.id].collection ||
           !users[message.author.id].collection['penthouse'] ||
            users[message.author.id].collection['penthouse'].amount < 1) return message.channel.send('> ❌ Túl sokat vagy túl keveset akarsz felrakni! `(50-10000)`');
        else if(bet < 1 || bet > 1000000) return message.channel.send('> ❌ Túl sokat vagy túl keveset akarsz felrakni! `(1-1000000)`');
    }

    users[message.author.id].money -= bet;

    const gameCards = {
        dealer: [],
        player: [],
    };

    const cards = ['Ász', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Király', 'Királynő', 'Bubi'];
    const suits = ['♥', `${client.emojis.cache.find(emoji => emoji.name == 'vidmanPikk')}`, `${client.emojis.cache.find(emoji => emoji.name == 'vidmanTreff')}`, '♦'];

    pushCards('player');
    pushCards('dealer');
    pushCards('player');

    let ownHand = determineHand(gameCards['player'], 'player', `${message.author.username}`);
    let dealerHand = determineHand(gameCards['dealer'], 'dealer', 'Az osztó');
    let passedMsg;

    message.channel.send(ownHand + dealerHand)
    .then((msg) => {
        passedMsg = msg;
        playOptions();
    });

    function pushCards(user) {
        let toPush;
        do toPush = `${cards[giveRandom(13)]} ${suits[giveRandom(3)]}`;
        while(gameCards['player'].includes(toPush) || gameCards['dealer'].includes(toPush)); // check if card to be dealt is already in game or no

        gameCards[user].push(toPush);
    }

    function determineHand(cardPack, deckUser, name) {
        const total = countCards(cardPack, deckUser);
        return `> __**${name}**__ ezeket a kártyákat fogja:\n> ${String(cardPack.map((card) => `[${card}]`).join(', '))} (${total})\n\n`;
    }

    function countCards(cardPack, deckUser) {
        let total = 0;
        let addLater = 0;
        let crCardValue;
        for(const card in cardPack) {
            crCardValue = gameCards[deckUser][card].split(' ')[0];
            switch(crCardValue) {
                case 'Ász':
                    addLater++;
                    break;
                case 'Király': case 'Királynő': case 'Bubi':
                    total += 10;
                    break;
                default:
                    total += parseInt(crCardValue);
                    break;
            }
        }
        for(let i = 0; i < addLater; i++) {
            if(total + 11 > 21) total += 1;
            else total += 11;
        }
        return total;
    }

    function playOptions(userStay) {
        ownHand = determineHand(gameCards['player'], 'player', `${message.author.username}`);
        dealerHand = determineHand(gameCards['dealer'], 'dealer', 'Az osztó');

        if(countCards(gameCards['player'], 'player') == 21 && gameCards['player'].length == 2) { // Check for blackjack
            pushCards('dealer');
            if(countCards(gameCards['dealer'], 'dealer') == 21) { // Dealer has bj too, tie
                users[message.author.id].money += bet;
                return passedMsg.edit(determineHand(gameCards['player'], 'player', `${message.author.username}`) + determineHand(gameCards['dealer'], 'dealer', 'Az osztó') + '\n> Neked és az osztónak is blackjackje van. Döntetlen! Visszakaptad a felrakott tétet.');
            }
            else { // User has bj, win
                users[message.author.id].money += bet * 2;
                fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                return passedMsg.edit(ownHand + dealerHand + `\n> Blackjacked van! Visszakaptad a felrakott tétet és nyertél \`+${bet * 2}\` ${getEmoji('vidmani')}-t!`);
            }
        }

        if(countCards(gameCards['player'], 'player') > 21) { // Check for bust
            do pushCards('dealer');
            while(countCards(gameCards['dealer'], 'dealer') < 17);
            fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
            return passedMsg.edit(determineHand(gameCards['player'], 'player', `${message.author.username}`) + determineHand(gameCards['dealer'], 'dealer', 'Az osztó') + `\n> Túl sok pontod van. Elvesztetted a felrakott tétet. \`-${bet}\` ${getEmoji('vidmani')}`);
        }

        if(userStay) { // User chose to stay, check outcome
            if(countCards(gameCards['dealer'], 'dealer') > 21) { // Dealer bust check
                users[message.author.id].money += bet * 2;
                fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                return passedMsg.edit(ownHand + dealerHand + `\n> Az osztónak túl sok van! \`(${countCards(gameCards['dealer'], 'dealer')})\` Visszakaptad a felrakott tétet és nyertél \`+${bet}\` ${getEmoji('vidmani')}-t!`);
            }
            else if(countCards(gameCards['player'], 'player') > countCards(gameCards['dealer'], 'dealer')) { // User has more points check
                users[message.author.id].money += bet * 2;
                fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                return passedMsg.edit(ownHand + dealerHand + `\n> Neked összesen ${countCards(gameCards['player'], 'player')} pontod, míg az osztónak ${countCards(gameCards['dealer'], 'dealer')} pontja van. Visszakaptad a felrakott tétet és nyertél \`+${bet}\` ${getEmoji('vidmani')}-t!`);
            }
            else if(countCards(gameCards['player'], 'player') < countCards(gameCards['dealer'], 'dealer')) { // User has less points check
                fs.writeFileSync('./assets/users.json', JSON.stringify(users, null, 2));
                return passedMsg.edit(ownHand + dealerHand + `\n> Neked összesen ${countCards(gameCards['player'], 'player')} pontod, míg az osztónak ${countCards(gameCards['dealer'], 'dealer')} pontja van. Elvesztetted a felrakott tétet. \`-${bet}\` ${getEmoji('vidmani')}`);
            }
            else { // if Tie
                users[message.author.id].money += bet;
                return passedMsg.edit(ownHand + dealerHand + `\n> Neked összesen ${countCards(gameCards['player'], 'player')} pontod, míg az osztónak ${countCards(gameCards['dealer'], 'dealer')} pontja van. Döntetlen! Visszakaptad a felrakott tétet.`);
            }
        }

        passedMsg.edit(ownHand + dealerHand + '\n> Kérsz még kártyát `(hit)` vagy megállsz `(stay)`?\n*30mp-ed van beírni a választásod.*');

        awaitSelection();

    }

    function awaitSelection() {
        const filter = m => m.author.id == message.author.id;
        message.channel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            if(!['hit', 'stay'].includes(collected.first().content.toLowerCase())) awaitSelection();
            else selectMove(collected.first().content.toLowerCase());
        }).catch(() => {
            message.channel.send('> Lejárt az időd. Mivel nem adtál meg semmit, így automatikusan megállsz.');
            selectMove('stay');
        });
    }

    function selectMove(move) {
        switch(move) {
            case 'hit':
                pushCards('player');
                playOptions();
                break;

            case 'stay':
                do pushCards('dealer');
                while(countCards(gameCards['dealer'], 'dealer') < 17);
                playOptions(true);
                break;

            default:
                return message.channel.send(`> Ömm... <@${client.config.ownerID}> ennek nem kéne történnie.. ${getEmoji('vidmanHyperThink')}`);
        }
    }

};

exports.info = {

    name: 'blackjack',
    category: 'pénzverde',
    syntax: '<tét>',
    description: 'Avagy huszonegy. Ha neked több pontod van mint az osztónak nyersz. Vigyázz, ne legyen több pontod, mint huszonegy, különben veszítesz!',
    requiredPerm: null,
    aliases: ['bj', 'black', 'blackj', 'blowjob']

};