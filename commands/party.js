const { getEmoji } = require('../util');
exports.run = (client, message, args) => {
    let partyID;
    let index;
    switch(args[0]) {
        case 'create':
            for(const party in client.party) {
                if(client.party[party].host.id == message.author.id) return message.channel.send(`> ❌ **| Neked már van egy party-d! \`${party}\`**`);
                if(client.party[party].members.includes(message.author)) return message.channel.send(`> ❌ **| Te már bent vagy egy party-ban! \`${party}\`**`);
            }
            partyID = Math.random().toString(36).substring(7);
            client.party[partyID] = {
                host: message.author,
                members: [message.author]
            };
            message.channel.send(`> ${getEmoji('vidmanOke')} **| Party létrehozva. Host: ${message.author.toString()} ID: \`${partyID}\`**`);
            break;
        case 'join':
            if(!args[1]) return message.channel.send('> ❌ **| Nem adtál meg party ID-t.**');
            partyID = args[1];
            if(!client.party[partyID]) return message.channel.send('❌ **| Nincs ilyen party.**');
            if(client.party[partyID].members.length == 5) return message.channel.send('> ❌ **| Ez a party már tele van.**');
            if(client.party[partyID].members.includes(message.author)) return message.channel.send('> ❌ **| Te már tagja vagy ennek a party-nak.**');
            client.party[partyID].members.push(message.author);
            message.channel.send(`> ${getEmoji('vidmanDerp')} **| Beléptél a(z) ${partyID} party-ba!**`);
            break;

        case 'leave':
            if(!args[1]) return message.channel.send('> ❌ **| Nem adtál meg party ID-t.**');
            partyID = args[1];
            if(!client.party[partyID]) return message.channel.send('❌ **| Nincs ilyen party.**');
            index = client.party[partyID].members.indexOf(message.author);
            if(index === undefined) return message.channel.send(`❌ **| Nem vagy tagja a(z) \`${partyID}\` partynak!**`);
            if(client.party[partyID].host.id == message.author.id) return message.channel.send('❌ **| Ennek a party-nak te vagy a hostja!**');
            client.party[partyID].members.splice(index, 1);
            message.channel.send(`> ${getEmoji('vidmanSzomoru')} **| Kiléptél a(z) ${partyID} party-ból!**`);
            break;

        case 'start':
            message.channel.send('WIP');
            break;

        case 'destroy':
            for(const party in client.party) {
                if(client.party[party].host.id == message.author.id) {
                    delete client.party[party];
                    return message.channel.send(`> ${getEmoji('veder')} **| \`${party}\` ID-vel rendelkező party-d törölve!**`);
                }
            }
            message.channel.send('> ❌ **| Nem vagy egy party hostja sem.**');
            break;

        default:
            message.channel.send(`> ❌ **| Hibás használat.**\n\`.${this.info.name} ${this.info.syntax}\``);
            break;
    }
};

exports.info = {

    name: 'party',
    category: 'szórakozás',
    syntax: '<create|join|leave|start> (<party ID>)',
    description: 'Ezzel a paranccsal közösen lehet blackjacket játszani.',
    requiredPerm: null

};