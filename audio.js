import path from 'path';
import {fileURLToPath} from "url";

// Fix dirname since we can't use require
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function playSound (userChannel, sound) {
    userChannel.join().then(connection => {
        //TODO: Replace this with getting soundfile from storage/db
        const soundFile = path.join(__dirname, sound);

        const dispatcher = connection.play(soundFile, {volume: 1.0});

        dispatcher.on('finish', () => {
            userChannel.leave();
        });
    }).catch(function(error) {
        console.log('Unable to join the channel (no permission?)');
    });
}