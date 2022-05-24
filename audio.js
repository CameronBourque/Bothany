import {AudioPlayerStatus, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, VoiceConnectionStatus}
    from "@discordjs/voice";

export async function playSound (userChannel, sound) {
    const connection = joinVoiceChannel({
        channelId: userChannel.id,
        guildId: userChannel.guildId,
        adapterCreator: userChannel.guild.voiceAdapterCreator
    })

    const audioPlayer = createAudioPlayer()

    const subscription = connection.subscribe(audioPlayer)

    if(subscription) {
        connection.on(VoiceConnectionStatus.Ready, () => {
            // Play the sound
            audioPlayer.play(createAudioResource(sound))

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