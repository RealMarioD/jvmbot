const { MessageEmbed, Collection } = require('discord.js');
const { getEmoji, giveRandom, cmdUsage } = require('../../util');
const whiteCards = require('../../assets/whiteCards.json');
const blackCards = require('../../assets/blackCards.json');
const { escapeMarkdown } = require('discord.js').Util;

exports.run = (client, message, args) => {
    const players = new Collection();
    let dealer,
        counter = 0,
        currentRound = 1,
        rounds = 1,
        newCardsEachRound = true,
        toRemove = 0;
    if(args.length > 0) {
        if(!isNaN(args[0]) && args[0] < 6 && args[0] > 0) rounds = args[0];
        else return cmdUsage(this, message);
        if(args.length > 1 && args[1] == 'n' || args[1] == 'nem' || args[1] == 'no') newCardsEachRound = false;
    }
    let submissions = [];
    const questions = [];
    let currentQ;
    message.channel.send(new MessageEmbed()
        .setTitle('Üdvözlünk minden bátor játékost!')
        .setDescription('**Privát üzeneteket szükségesek a játékhoz, ha nem tudok neked írni nem fogsz tudni részt venni!**\n\nA játékoz való csatlakozáshoz kérlek reagálj erre az üzenetre!\nLegalább 3, de inkább több játékos kell egy játékhoz!')
        .setFooter(`Körök száma: ${rounds} | Új fehér kártyák körönként: ${newCardsEachRound ? 'Be' : 'Ki'}kapcsolva`)
    )
    .then(msg => {
        msg.react(getEmoji('bazisugroKatica'));
        const filter = (reaction) => reaction.emoji.name == 'bazisugroKatica';
        msg.awaitReactions(filter, { time: 15000 })
        .catch(err => {
            console.error(err);
            return msg.edit(`Ehh, valami probléma történt... <@${client.config.ownerID}>!!!`, { embeds: [] });
        })
        .then(collected => {
            collected.forEach(reaction => {
                reaction.users.cache.forEach(user => {
                    if(user.id != client.config.normalID && user.id != client.config.devID) {
                        players[user.id] = {
                            uData: user, // idfk why i named it uData, stays because lazy to change
                            cards: [],
                            points: 0
                        };
                    }
                });
            });
            if(Object.entries(players).length < 3) {
                return msg.edit(new MessageEmbed()
                    .setTitle('Kicsit kevesen vagytok...')
                    .setDescription('Egy játékhoz legalább 3 játékos kell, de jobb ha többen vagytok!')
                );
            }
            else if(Object.entries(players).length > 10 && rounds > 5) {
                return msg.edit(new MessageEmbed()
                    .setTitle('Nos...')
                    .setDescription('Az a baj, hogy a kártyaszettünk nem bírna el ennyi embert! Mivel kedves fejlesztőnk, Mario egy lusta D, ezért az egész bot meghalna, ha ti most az emberiség ellen fordítanátok a kártyapaklit. Nyomjatok egy kevesebb körös játékot!')
                );
            }

            /**
             * Fills questions[] with non-repeating questions.
             * Will actually break if 11 people attempt to play a 5 round game.
             * (as of 03/02/2021: 54 questions only, 11 * 5 = 55, meaning the do..while loop would infinitely loop because every black card would be used up.)
             */
            for(let i = 0; i < rounds; i++) {
                for(let j = 0; j < Object.entries(players).length; j++) {
                    let testQ;
                    do testQ = escapeMarkdown(blackCards[giveRandom(blackCards.length)], { bold: true, italic: true, underline: true });
                    while(questions.includes(testQ));
                    questions.push(testQ);
                }
            }

            drawWhiteC(players);
        });
    });

    // returns 10 white cards in an array
    function initWhiteC() {
        const cards = [];
        let crCard;
        for(let i = 0; i < 10; i++) {
            do crCard = whiteCards[giveRandom(whiteCards.length)];
            while(cards.includes(crCard));
            cards.push(crCard);
        }
        return cards;
    }

    function drawWhiteC() {
        counter--; // game():1 && game():5 for reason
        for(const player in players) players[player].cards = initWhiteC();
        game();
    }

    function game() {
        toRemove = 0;
        counter++; // :1
        if(counter >= Object.entries(players).length * currentRound) {
            if(currentRound < rounds) {
                currentRound++;
                if(newCardsEachRound) return drawWhiteC(); // :5
            }
            else return getGameWinners();
        }
        submissions = [];
        dealer = Object.entries(players)[counter - (Object.entries(players).length * (currentRound - 1))][1].uData; // really shitty way to basically never have to reset the counter and still be in array length
        currentQ = questions[counter]; // why we never reset the counter
        message.channel.send(new MessageEmbed()
            .setTitle(currentQ)
            .setDescription('Az opciókat megkapjátok DM-ben!')
            .addField('A fekete kártyát osztotta:', dealer.toString())
            .setFooter(`Kör: ${currentRound}/${rounds}`)
        )
        .then(() => { // prepare for hell
            for(const player in players) {
                if(player != dealer.id) {
                    let i = 0;
                    players[player].uData.send(new MessageEmbed()
                        .setTitle(currentQ)
                        .setDescription(`${players[player].cards.map((card) => { i++; return `**${i}.** ${card}\n`; }).join('')}\n**Választáshoz: \`.submit 1-10\`**`) // i love this line (just maps the white cards to be fancy, ugly but compact method)
                    )
                    .then(msg => collectSubmission(msg, players[player].uData))
                    .catch(() => message.channel.send(`${players[player].uData}, nem tudtam elküldeni a kártyáid! Büntetésből a fejlesztő nem foglalkozott azzal, hogy újrapróbálkozzak, szóval ez a menet másfél perc múlva folytatódik, ha csak nem szeretnél vakon bedobni egy kártyát.\nDM-ben:\`.submit 1-10\``));
                }
            }
        });
    }

    function collectSubmission(msg, user, penalty) {
        msg.channel.awaitMessages(m => m.content.startsWith('.submit'), { max: 1, time: 45000, errors: [ 'time' ] })
        .then(collected => {
            const subMsg = collected.first();
            const option = parseInt(subMsg.content.split(' ')[1]);
            if(isNaN(option) || option < 1 || option > 10) {
                msg.channel.send('Hmm... Valami nem stimmel. Újrapróbálnád?');
                return collectSubmission(msg, user);
            }
            const answer = players[subMsg.author.id].cards[option - 1];
            submissions.push({ player: subMsg.author, answer: answer });
            let replaceCard;
            do replaceCard = whiteCards[giveRandom(whiteCards.length)];
            while(players[subMsg.author.id].cards.includes(replaceCard));
            players[subMsg.author.id].cards[option - 1] = replaceCard;
            subMsg.react('✅');
            checkSubs(submissions);
        })
        .catch(() => {
            if(penalty) {
                msg.channel.send('Nem sikerült időben válaszolnod, ezért a játékmenet megőrzéséért érvénytelen a válaszod.');
                toRemove++;
                return checkSubs(submissions);
            }
            msg.channel.send('Helló... Kérlek válassz egy opciót! `.submit 1-10`');
            return collectSubmission(msg, user, true); // this is where the penalty var is used, prevents game getting stuck because of afk player. still shows up as undef in voting list and is voteable, dont know if it breaks anything, didnt test
        });
    }

    // this one fucking line absolutely needed to be in a fuction yes, still rather see only a function name then a fat fucking if
    function checkSubs() {
        if(submissions.length == Object.entries(players).length - 1 - toRemove) beginVote();
    }

    // makes funky embed and starts awaiting the vote (awaiting is in getWinner() dont get confused)
    function beginVote() {
        const voteEmbed = (new MessageEmbed()
            .setTitle(currentQ)
            .setDescription(`A \`.vote 1-${submissions.length}\` paranccsal tudod kiválasztani a nyertest.`)
        );
        for(let i = 0; i < submissions.length; i++) voteEmbed.addField(`**${i + 1}.:**`, submissions[i].answer);

        message.channel.send(dealer.toString(), voteEmbed)
        .then(msg => getWinner(msg));
    }

    function getWinner(msg, penalty) {
        msg.channel.awaitMessages(m => m.content.startsWith('.vote'), { max: 1, time: 45000, errors: [ 'time' ] })
        .then(collected => {
            const voteMsg = collected.first();
            const option = parseInt(voteMsg.content.slice(voteMsg.content.length - 2));
            if(isNaN(option) || option < 1 || option > submissions.length) {
                msg.channel.send('Hmm... Valami nem stimmel. Újrapróbálnád?');
                return getWinner(msg);
            }
            const winner = submissions[option - 1];
            players[winner.player.id].points++;
            msg.edit('', msg.embeds[0].addField('Nyertes:', winner.player.toString()));
            return game();
        })
        .catch(err => {
            console.error(err);
            if(penalty) {
                message.channel.send(`${dealer.toString()} nem válaszolt időben, ezért a játékmenet megőrzéséért érvénytelen szavazással, nyertes nélkül folytatódik a játék.`);
                return game();
            }
            message.channel.send(`Helló ${dealer.toString()}... Kérlek válassz egy opciót! \`.vote 1-${submissions.length}\``);
            return getWinner(msg, true); // same penalty shit as before
        });
    }

    // called when last round ends, shows winners
    function getGameWinners() {
        const sortedP = Object.entries(players).sort((a, b) => (b[1].points - a[1].points));
        const winnerEmbed = (new MessageEmbed()
            .setTitle('A játék nyertesei pont szerint rendezve:')
            .setDescription('')
            .setFooter('Emberiség-Ellenes-Kártyák')
        );
        for(let i = 0; i < sortedP.length; i++) winnerEmbed.description += `**${i + 1}.:** ${sortedP[i][1].uData} - ${sortedP[i][1].points}pont\n`;
        message.channel.send(winnerEmbed);
    }

};

exports.info = {

    name: 'cah',
    category: 'szórakozás',
    syntax: '[körök száma 1-5] [körönként új kártyák?]',
    description: 'Emberiség-ellenes-kártyák, aka Cards Against Humanity. Minden játékos kap 10 fehér kártyát, amivel a furcsábbnál furcsább fekete kártyákra kell válaszolni. Akinél éppen fekete kártya van, azaz osztó, a beadott fehér kártyák közül kell kiválasztania a számára legtetszőbbet, a választott pedig pontot kap. A játék végén a legtöbb pontot szerző játékos nyer.',
    requiredPerm: 'moderator',
    aliases: ['eek']

};
