const { MessageEmbed, Collection } = require('discord.js');
const { getEmoji, giveRandom, cmdUsage } = require('../../util');
const whiteCards = require('../../assets/whiteCards.json');
const blackCards = require('../../assets/blackCards.json');
const { escapeMarkdown } = require('discord.js').Util;

exports.run = (client, message, args) => {
    const players = new Collection();
    let counter = -1;
    let currentRound = 1;
    let rounds = 1;
    let newCardsEachRound = false;
    if(args.length > 0) {
        if(!isNaN(args[0]) && args[0] < 6 && args[0] > 0) rounds = args[0];
        else return cmdUsage(this, message);
        if(args.length > 1 && args[1] == 'i' || args[1] == 'igen' || args[1] == 'y' || args[1] == 'yes') newCardsEachRound = true;
    }
    let submissions = [];
    let dealer;
    let question;
    message.channel.send(new MessageEmbed()
        .setTitle('Üdvözlünk minden bátor játékost!')
        .setDescription('**Privát üzeneteket szükségesek a játékhoz, ha nem tudok neked írni nem fogsz tudni részt venni!**\n\nA játékoz való csatlakozáshoz kérlek reagálj erre az üzenetre!\nLegalább 3, de inkább több játékos kell egy játékhoz!')
        .setFooter(`**Körök száma:** ${rounds} | **Új fehér kártyák körönként:** ${newCardsEachRound ? 'Be' : 'Ki'}kapcsolva`)
    )
    .then(msg => {
        msg.react(getEmoji('bazisugroKatica'));
        const filter = (reaction) => reaction.emoji.name == 'bazisugroKatica';
        msg.awaitReactions(filter, { time: 7500 })
        .catch(err => {
            console.error(err);
            msg.edit('Ehh, valami probléma történt... MARIOOO', { embeds: [] });
        })
        .then(collected => {
            collected.forEach(reaction => {
                reaction.users.cache.forEach(user => {
                    if(user.id != '711630742114926632') {
                        players[user.id] = {
                            uData: user,
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
            initGame(players);
        });
    });

    function initGame() {
        for(const player in players) players[player].cards = initWhiteC();
        game();
    }

    function game() {
        counter++;
        if(counter >= Object.entries(players).length) {
            if(currentRound < rounds) {
                currentRound++;
                if(newCardsEachRound) {
                    counter = -1;
                    return initGame();
                }
                else counter = 0;
            }
            else return getGameWinners();
        }
        submissions = [];
        dealer = Object.entries(players)[counter][1].uData;
        question = escapeMarkdown(blackCards[giveRandom(blackCards.length)], { bold: true, italic: true, underline: true });
        message.channel.send(new MessageEmbed()
            .setTitle(question)
            .setDescription('Az opciókat megkapjátok DM-ben!')
            .addField('A fekete kártytát osztotta:', dealer.toString())
        )
        .then(() => {
            for(const player in players) {
                if(player != dealer.id) {
                    let i = 0;
                    players[player].uData.send(new MessageEmbed()
                        .setTitle(question)
                        .setDescription(`${players[player].cards.map((card) => { i++; return `**${i}.** ${card}\n`; }).join('')}\n**Választáshoz: \`.submit 1-10\`**`)
                    )
                    .then(msg => collectSubmission(msg, players[player].uData))
                    .catch(() => message.channel.send(`${players[player].uData}, nem tudtam elküldeni a kártyáid!`));
                }
            }
        });
    }

    function collectSubmission(msg, user, penalty) {
        const filter = m => m.content.startsWith('.submit');
        msg.channel.awaitMessages(filter, { max: 1, time: 45000, errors: [ 'time' ] })
        .then(collected => {
            const cMsg = collected.first();
            const option = parseInt(cMsg.content.split(' ')[1]);
            if(isNaN(option) || option < 1 || option > 10) {
                msg.channel.send('Hmm... Valami nem stimmel. Újrapróbálnád?');
                return collectSubmission(msg, submissions);
            }
            const answer = players[cMsg.author.id].cards[option - 1];
            submissions.push({ player: cMsg.author, answer: answer });
            let crCard;
            do crCard = whiteCards[giveRandom(whiteCards.length)];
            while(players[cMsg.author.id].cards.includes(crCard));
            players[cMsg.author.id].cards[option - 1] = crCard;
            cMsg.react('✅');
            checkSubs(submissions);
        })
        .catch(() => {
            if(penalty) {
                msg.channel.send('Nem sikerült időben válaszolnod, ezért a játékmenet megőrzéséért érvénytelen a válaszod.');
                submissions.push({ player: user, answer: undefined });
                checkSubs(submissions);
            }
            msg.channel.send('Helló... Kérlek válassz egy opciót! `.submit 1-10`');
            return collectSubmission(msg, submissions, true);
        });
    }

    function checkSubs() {
        if(submissions.length == Object.entries(players).length - 1) beginVote();
    }

    function beginVote() {
        const voteEmbed = (new MessageEmbed()
            .setTitle(question)
            .setDescription(`A \`.vote 1-${submissions.length}\` paranccsal tudod kiválasztani a nyertest.`)
        );
        for(let i = 0; i < submissions.length; i++) voteEmbed.addField(`**${i + 1}.:**`, submissions[i].answer);

        message.channel.send(dealer.toString(), voteEmbed)
        .then(msg => getWinner(msg));
    }

    function getWinner(msg, penalty) {
        const filter = m => m.content.startsWith('.vote');
        msg.channel.awaitMessages(filter, { max: 1, time: 45000, errors: [ 'time' ] })
        .then(collected => {
            const cMsg = collected.first();
            const option = parseInt(cMsg.content.slice(cMsg.content.length - 2));
            if(isNaN(option) || option < 1 || option > submissions.length) {
                msg.channel.send('Hmm... Valami nem stimmel. Újrapróbálnád?');
                return collectSubmission(msg, submissions);
            }
            const winner = submissions[option - 1];
            players[winner.player.id].points++;
            msg.edit('', msg.embeds[0].addField('Nyertes:', winner.player.toString()));
            return game();
        })
        .catch(err => {
            console.error(err);
            if(penalty) {
                message.channel.send('Nem sikerült időben válaszolnod, ezért a játékmenet megőrzéséért érvénytelen szavazással, nyertes nélkül folytatódik a játék.');
                return game();
            }
            message.channel.send(`Helló ${dealer.toString()}... Kérlek válassz egy opciót! \`.vote 1-${submissions.length}\``);
            return getWinner(msg, true);
        });
    }

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
};

exports.info = {

    name: 'cah',
    category: 'szórakozás',
    syntax: '[körök száma 1-5] [körönként új kártyák?]',
    description: 'Emberiség-ellenes-kártyák, aka Cards Against Humanity. Minden játékos kap 10 fehér kártyát, amivel a furcsábbnál furcsább fekete kártyákra kell válaszolni. Akinél éppen fekete kártya van, azaz osztó, a beadott fehér kártyák közül kell kiválasztania a számára legtetszőbbet, a választott pedig pontot kap. A játék végén a legtöbb pontot szerző játékos nyer.',
    requiredPerm: 'moderator',
    aliases: ['eek']

};
