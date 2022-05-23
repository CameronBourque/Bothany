import path from 'path';
import {fileURLToPath} from "url";
import {AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus }
    from "@discordjs/voice";

// Fix dirname since we can't use require
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function playSound (userChannel, sound) {
    const connection = joinVoiceChannel({
        channelId: userChannel.id,
        guildId: userChannel.guildId,
        adapterCreator: userChannel.guild.voiceAdapterCreator
    })

    const audioPlayer = createAudioPlayer()

    const subscription = connection.subscribe(audioPlayer)

    // TODO: Remove once we are able to retrieve and play the sound
    const soundFile = path.join(__dirname, 'sounds/afk.mp3');

    if(subscription) {
        connection.on(VoiceConnectionStatus.Ready, () => {
            // Play the sound
            audioPlayer.play(createAudioResource(soundFile))

            audioPlayer.on(AudioPlayerStatus.Idle, () => {
                audioPlayer.stop()
                connection.destroy()
            })
        })

        connection.on(VoiceConnectionStatus.Disconnected, () => {
            // Make sure it gets destroyed
            audioPlayer.stop()
            connection.destroy()
        })
    }

}