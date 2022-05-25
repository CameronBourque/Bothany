import {logDebug, logError} from "./logger.js";
import {createGuild, guildExists} from "./data/database.js";

// Let the user know that their command is being processed
export async function notifyProcessing(cmd) {
    await cmd.deferReply();
}

// Tell the user the outcome of their command
export async function notifyCompletion(cmd, msg, success, ephemeral = false) {
    let outcome = 'Unsuccessfully '
    if(success) {
        outcome = 'Successfully '
    }

    await cmd.editReply({
        content: outcome + msg,
        ephemeral: ephemeral
    })
}

// Display help to user
export async function displayHelp(cmd) {
    let help = '**Commands:**\n' +
        '/help: Display this message.\n\n' +
        '/sound: Manages what sounds to associate with roles. When someone joins a voice channel with a ' +
        'role configured with a sound. I will play the sound. These can also be removed. I only support mp3, ogg, and' +
        ' webm files. If you change the name of the role I will update that for you. If you delete the role and' +
        'recreate it then you will have to re-add the sound. \n\n' +
        '/welcome_message: Manages how I introduce new people to the server. This defaults to not being set, meaning ' +
        'I won\'t say anything when someone new joins. If you set this and don\'t want it, then you can remove it so I' +
        ' stop introducing new members.\n\n' +
        '/kick_word: Manages a list of terms that can get a user kicked from the server. Terms can be added or' +
        ' removed. They are case insensitive ("A" is the same as "a").\n\n' +
        '**Permission Needs:**\n' +
        'View Channels: This is required for everything\n' +
        'Kick Members: Used to kick members violating the list of kickable words\n' +
        'Connect: So I can play sounds\n' +
        'Speak: So I can play sounds\n' +
        'Use Voice Activity: So I can play sounds\n\n' +
        '**Issues:**\n' +
        'Open issues you have here: https://github.com/CameronBourque/Bothany/issues'

    await cmd.editReply({
        content: help
    })
}

// Update information
export async function sendUpdateInfo(bot) {
    // Leave empty to not notify of update
    let info = ''

    if(info) {
        bot.guilds.cache.forEach((guild) => {

            let sysChannel = guild.systemChannel
            sysChannel.send(info)
                .then(message => logDebug('Sent update info to ' + guild.id))
                .catch(logError)
        })
    }
}
