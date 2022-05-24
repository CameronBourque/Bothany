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
    let info = 'I just had a massive update! Slash commands have been implemented to let you customize me to ' +
        'fit your needs. Any sounds that were set up will need to be reimplemented using these slash commands. Those ' +
        'sounds no longer work. I also have some other extra features. For me to work properly I need to be re-invited ' +
        'to the server. Kick me and re-invite me with this link: ' +
        'https://discord.com/api/oauth2/authorize?client_id=712522636143624234&permissions=36701186&scope=bot%20applications.commands' +
        '. Afterwards type /help for more information!'

    if(info) {
        bot.guilds.cache.forEach((guild) => {

            let sysChannel = guild.systemChannel
            sysChannel.send(info)
                .then(message => logDebug('Sent update info to ' + guild.id))
                .catch(logError)
        })
    }
}
