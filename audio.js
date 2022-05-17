export async function playSound (userChannel, sound) {
    userChannel.join().then(connection => {
        //TODO: Replace this with getting soundfile from storage/db
        const soundFile = require("path").join(__dirname, sound);

        const dispatcher = connection.play(soundFile, {volume: 1.0});

        dispatcher.on('finish', () => {
            userChannel.leave();
        });
    }).catch(function(error) {
        console.log('Unable to join the channel (no permission?)');
    });
}