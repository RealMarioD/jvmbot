const { MessageEmbed } = require('discord.js');
const rpgData = require('../../assets/rpgData.json');
const users = require('../../assets/users.json');
const { giveRandom, getEmoji } = require('../../util');
const moment = require('moment');

exports.run = (client, message, args) => {

    const action = !args.length ? undefined : args[0];
    const currentDate = moment().valueOf();
    let firstTime = false;

    if(!users[message.author.id]) {
        users[message.author.id] = {
            money: 0,
            rpg: {
                maxHealth: 50,
                health: 50,
                level: 1,
                xp: 0,
                currentWeapon: rpgData.weapons.stick,
                currentMonster: undefined,
                diedAt: 0,
                items: {}
            }
        };
        firstTime = true;
    }
    else if(!users[message.author.id].rpg) {
        users[message.author.id].rpg = {
            maxHealth: 50,
            health: 50,
            level: 1,
            xp: 0,
            currentWeapon: rpgData.weapons.stick,
            currentMonster: undefined,
            diedAt: 0,
            items: {}
        };
        firstTime = true;
    }

    const u = users[message.author.id];

    let currentXPLimit = 0;
    for(let i = 1; i <= u.rpg.level; i++) currentXPLimit += Math.floor((i - 1) * 2.5 + 2.5);

    switch(action) {
        case 'rpg': default:
            if(u.rpg.diedAt == 0) doRpg();
            else if(currentDate < u.rpg.diedAt + 3600000) {
                const duration = moment.duration(u.rpg.diedAt + 3600000 - currentDate);
                message.channel.send(new MessageEmbed()
                    .setTitle(`💀 | ${message.author.tag}, halott vagy!`)
                    .setDescription(`Még \`${duration.minutes()} perc ${duration.seconds()} másodperc\` mire újraéledsz!`)
                );
            }
            else {
                u.rpg.diedAt = undefined;
                adventure(true);
            }
            break;

        case 'buy': case 'shop':
            shop(args[1], args[2]);
            break;

        case 'use':
            useItem(args[1], args[2]);
            break;

        case 'inv': case 'inventory':
            showInventory();
            break;
    }

    function doRpg() {
        if(!u.rpg.currentMonster) return adventure();
        const damage = giveRandom(u.rpg.currentWeapon.dmg);
        const enemyDamage = giveRandom(u.rpg.level);
        u.rpg.currentMonster.hp -= damage;
        u.rpg.health -= enemyDamage;
        const rpgEmbed = new MessageEmbed()
            .setFooter('JVMRPG Beta 1.0.2')
            .addField(`${message.author.tag}:`, `HP: ${u.rpg.health}/${u.rpg.maxHealth}\nLVL: ${u.rpg.level}\nXP: ${u.rpg.xp}/${currentXPLimit}\nFegyver: ${u.rpg.currentWeapon.name}`)
            .addField(`${u.rpg.currentMonster.name}:`, `HP: ${u.rpg.currentMonster.hp}/${u.rpg.currentMonster.maxHp}`);

        if(damage > 0) rpgEmbed.setDescription(`\`\`\`${message.author.tag} megsebezte az ellenséges ${u.rpg.currentMonster.name}-t ${damage} sebzéssel!\`\`\``);
        else rpgEmbed.setDescription(`\`\`\`Az ellenséges ${u.rpg.currentMonster.name} kivédte ${message.author.tag} támadását!\`\`\``);

        if(enemyDamage > 0) rpgEmbed.description += `\n\`\`\`Az ellenséges ${u.rpg.currentMonster.name} megsebezte ${message.author.tag}-t ${enemyDamage} sebzéssel!\`\`\``;
        if(u.rpg.health < 1) {
            rpgEmbed.description += '\n```Meghaltál! Újraéledési idő: 1 óra.```';
            u.rpg.diedAt = currentDate;
        }

        if(u.rpg.currentMonster.hp < 1) {
            const plusXp = giveRandom(2) + 1;
            const plusMoney = giveRandom(25) + giveRandom(25);
            u.rpg.xp += plusXp;
            u.money += plusMoney;
            if(u.rpg.xp >= currentXPLimit) {
                u.rpg.xp -= currentXPLimit;
                u.rpg.level += 1;
                if(u.rpg.health == u.rpg.maxHealth) u.rpg.health += 5;
                u.rpg.maxHealth += 5;
                rpgEmbed.description += `\n\`\`\`${message.author.tag} megölte az ellenséges ${u.rpg.currentMonster.name}-t!\nVidmani +${plusMoney}\nXP +${plusXp}\nSzintlépés! ${u.rpg.level - 1} => ${u.rpg.level}\nMax HP +5\`\`\``;
            }
            else rpgEmbed.description += `\n\`\`\`${message.author.tag} megölte az ellenséges ${u.rpg.currentMonster.name}-t!\nVidmani +${plusMoney}\nXP +${plusXp}\`\`\``;
            u.rpg.currentMonster = undefined;
        }
        message.channel.send(rpgEmbed)
        .then(msg => {
            const randomNum = giveRandom(101);
            if(randomNum > 50) {
                msg.react('🎁');
                const filter = (reaction, user) => reaction.emoji.name == '🎁' && user.id == message.author.id;
                msg.awaitReactions(filter, { max: 1, time: 15000, errors: ['time'] })
                .then(() => mysteryBox());
            }
        });
    }

    function mysteryBox() {
        const weaponArray = Object.entries(rpgData.weapons);
        const mysteryEmbed = new MessageEmbed()
        .setTitle('🎁 | Mystery Box!')
        .setDescription('```A halott szörny egy érdekes dobozt ejtett el...\n');
        let selectedWeapon;
        for(let i = 0; i < 100; i++) {
            selectedWeapon = weaponArray[giveRandom(weaponArray.length)];
            const chance = giveRandom(101);
            switch(selectedWeapon[1].rarity.toLowerCase()) {
                case 'common':
                    if(chance > 50) selectedWeapon = null;
                    break;

                case 'rare':
                    if(chance > 30) selectedWeapon = null;
                    break;

                case 'legendary':
                    if(chance > 10) selectedWeapon = null;
                    break;

                default:
                    selectedWeapon = null;
                    break;
            }
            if(selectedWeapon) break;
        }
        if(!selectedWeapon) mysteryEmbed.description += 'Üres...```';
        else mysteryEmbed.description += `Egy ${selectedWeapon[1].name}! (${selectedWeapon[1].rarity}) Elraktad későbbre.\`\`\``;
        if(!u.rpg.items[selectedWeapon[0]]) {
            u.rpg.items[selectedWeapon[0]] = {
                amount: 1,
                itemData: selectedWeapon[1]
            };
        }
        else u.rpg.items[selectedWeapon[0]].amount++;
        // fs.writeFileSync();
        message.channel.send(mysteryEmbed);
    }

    function adventure(revived) {
        const advEmbed = new MessageEmbed().setFooter('JVMRPG Beta 1.0.2');
        if(firstTime) {
            advEmbed.setTitle('Üdvözöllek a kalandok birodalmában!')
            .setDescription('```Kalandjaid során sok szörnnyel fog meggyűlni a bajod. Mindig légy résen, nehogy egy szörny legyen az utolsó dolog, amit látsz! Sok szerencsét!``````Útnak eredsz, szörnyeket és mindenféle tárgyakat keresve...```');
            return message.channel.send(advEmbed);
        }

        if(revived) {
            u.rpg.health = u.rpg.level;
            advEmbed.setTitle('Feléledtél!')
            .setDescription('```Várjunk. Az hogy lehet?.. Körbenézel. Szörnyek sehol, de még mindig sérülések tömege látható rajtad. Úgy néz ki valahogy túlélted, de a sérüléseid nem gyógyultak meg. Így nem kéne egyből visszamenni harcolni...\n(Gyógyíts magadon!)```');
            return message.channel.send(advEmbed);
        }

        if(giveRandom(101) > 50) return initMonster();

        advEmbed.setTitle('Tovább sétálsz...')
            .setDescription('```XP +1```');

        u.rpg.xp += 1;
        if(u.rpg.xp >= currentXPLimit) {
            u.rpg.xp -= currentXPLimit;
            u.rpg.level += 1;
            if(u.rpg.health == u.rpg.maxHealth) u.rpg.health += 5;
            u.rpg.maxHealth += 5;
            advEmbed.description += `\n\`\`\`Szintlépés! ${u.rpg.level - 1} => ${u.rpg.level}\nMax HP +5\`\`\``;
        }

        const foundMoney = giveRandom(u.rpg.level);
        const foundApple = [giveRandom(10000), giveRandom(u.rpg.level) + 1];
        const foundGuitar = [giveRandom(1000000), giveRandom(u.rpg.level) + 1];

        if(foundMoney > 0) {
            advEmbed.description += `\`\`\`Találtál ${foundMoney} Vidmanit!\`\`\``;
            u.money += foundMoney[1];
        }
        if(foundApple[0] == 6284) {
            advEmbed.description += `\`\`\`Kalandozásod során találtál egy almafát, amin összesen ${foundApple[1]}db alma volt! Összeszedted és elraktad későbbre mindet.`;
            if(!u.collection) {
                u.collection = {
                    alma: { amount: foundApple[1] }
                };
            }
            else if(!u.collection.alma) u.collection.alma = { amount: foundApple[1] };
            else u.collection.alma.amount += 1;
        }
        if(foundGuitar[0] == 231077) {
            advEmbed.description += `\`\`\`Kalandozásod során megbotlottál valamiben... mi ez? Csak nem ${foundGuitar[1]}db léggitár?! Elraktad későbbre mindet.`;
            if(!u.collection) {
                u.collection = {
                    leggitar: { amount: foundGuitar[1] }
                };
            }
            else if(!u.collection.leggitar) u.collection.leggitar = { amount: foundGuitar[1] };
            else u.collection.leggitar.amount += 1;
        }
        message.channel.send(advEmbed);
    }

    function initMonster() {
        const monsterName = rpgData.monsters[giveRandom(rpgData.monsters.length - 1)];
        const mHp = Math.floor((giveRandom(50) + 1) * u.rpg.level / 2);
        u.rpg.currentMonster = {
            name: monsterName,
            hp: mHp,
            maxHp: mHp
        };
        doRpg();
    }

    function findItem(name, where) {
        let returnValue;
        name = name.toLowerCase();
        switch(where) {
            case 'inv':
                Object.keys(u.rpg.items).map(key => ({
                    key: key, value: u.rpg.items[key]
                })).forEach((data) => {
                    if(data.value.itemData.name.toLowerCase().includes(name)) returnValue = data;
                });
                break;

            default:
                Object.keys(rpgData.shopItems).map(key => ({
                    key: key, value: rpgData.shopItems[key]
                })).forEach((data) => {
                    if(data.value.name.toLowerCase().includes(name)) returnValue = data;
                });
                break;
        }
        return returnValue;
    }

    function shop(item, boughtAmount) {
        if(!item) {
            const list = [];
            Object.keys(rpgData.shopItems).map(key => ({
                key: key, value: rpgData.shopItems[key]
            })).forEach((data) => {
                list.push(`\`${data.value.name}\` - **${data.value.price}** ${getEmoji('vidmani')}`);
            });
            return message.channel.send(new MessageEmbed()
                .setTitle('Shop itemek')
                .setDescription(list.join('\n'))
            );
        }
        if(!boughtAmount) {
            const selectedItem = findItem(item);
            if(!selectedItem) return message.reply('nincs ilyen item!');
            switch(selectedItem.value.type) {
                case 'heal':
                    message.channel.send(new MessageEmbed()
                        .setTitle(selectedItem.value.name)
                        .addField('Ár:', selectedItem.value.price, true)
                        .addField('Típus:', 'Gyógyító', true)
                        .addField('Regenerált HP:', selectedItem.value.healAmount)
                    );
                    break;

                default:
                    message.channel.send('Something broke...');
                    break;
            }
        }
        else {
            const selectedItem = findItem(item);
            if(!selectedItem) return message.reply('nincs ilyen item!');
            if(isNaN(boughtAmount)) return message.reply('nem számot adtál meg!');
            boughtAmount = Math.round(boughtAmount);

            const total = selectedItem.value.price * boughtAmount;
            if(u.money >= total) {
                u.money -= total;
                if(!u.rpg.items[selectedItem.key]) {
                    u.rpg.items[selectedItem.key] = {
                        amount: boughtAmount,
                        itemData: rpgData.shopItems[selectedItem.key]
                    };
                }
                else u.rpg.items[selectedItem.key].amount += boughtAmount;
                message.channel.send(new MessageEmbed()
                    .setTitle('✅ | Sikeres vásárlás')
                    .addField('Vásárló:', message.author.tag)
                    .addField('Megvett tárgy:', selectedItem.value.name, true)
                    .addField('Darab:', boughtAmount, true)
                    .addField('Összeg:', `**${total}** ${getEmoji('vidmani')}`)
                );
            }
            else message.reply(`nincs elég pénzed hogy vehess \`${boughtAmount}\`db \`${selectedItem.value.name}\` itemet!`);
        }
    }

    function useItem(item, useAmount) {
        if(!useAmount) useAmount = 1;
        const invItem = findItem(item, 'inv');
        if(!invItem) return message.reply('nincs ilyen item az inventorydban!');
        if(invItem.value.amount < useAmount) return message.reply(`nincs ${useAmount}db ${invItem.value.itemData.name} az inventorydban!`);

        const itemEmbed = new MessageEmbed()
                    .setTitle('✅ | Item felhasználva')
                    .addField('Item:', invItem.value.itemData.name, true)
                    .addField('Darab:', useAmount, true);

        switch(invItem.value.itemData.type) {
            case 'heal':
                u.rpg.health += invItem.value.itemData.healAmount * useAmount;
                if(u.rpg.health > u.rpg.maxHealth) u.rpg.health = u.rpg.maxHealth;
                u.rpg.items[invItem.key].amount -= useAmount;
                message.channel.send(itemEmbed);
                break;

            default:
                message.reply('error');
                break;
        }
    }

    function showInventory() {
        const invItems = [];
        Object.keys(u.rpg.items).map(key => ({
            key: key, value: u.rpg.items[key]
        })).forEach((data) => {
            invItems.push([data.value.itemData.name, data.value.amount]);
        });
        const invEmbed = new MessageEmbed().setDescription('')
            .setTitle(`🎒 | ${message.author.tag}'s inventory:`);
        for(const item in invItems) invEmbed.description += `${invItems[item][0]} - ${invItems[item][1]}db\n`;
        message.channel.send(invEmbed);
    }
};

exports.info = {

    name: 'rpg',
    category: 'pénzverde',
    syntax: '<rpg|shop|use|inventory> [item] [darab]',
    description: 'JVMRPG Beta 1.0.2',
    requiredPerm: 'developer'

};