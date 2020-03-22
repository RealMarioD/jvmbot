exports.run = async (client, message) => {

    let list = '';

        if(!client.queue[0] || client.queue[0].length == 0) {
            message.channel.send('A lejátszási lista üres!');
        }
        else {
            for (let i = 0; i < client.queue[0].length; i++) {
                if(i == 0) {
                    list += `__Most szól:__ **${client.queue[1][i]}**\n\n`;
                }
                else {
                    list += `__${i}:__ **${client.queue[1][i]}**\n`;
                }
            }
            message.channel.send(list);
        }
};

exports.info = {

    name: 'queue',
    category: 'music',
    syntax: '',
    description: 'Visszaadja a lejátszási listát.',
    requiredPerm: null

};