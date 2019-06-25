/* nesze mindenfele szar aminek nem talaltunk meg helyet */
function error(channel) {
    channel.send({embed: {color: 0xff0000, title: 'Helytelen használat. `.parancsok embed`'}});
}