import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {playSound} from "./audio.js";
import {logDebug, logError} from "./logger.js";
import {notifyCompletion} from "./commandHandler.js";
import {checkSound, createGuild, getSound, getWelcomeMsg, guildExists, removeGuild, removeSound}
    from "./data/database.js";
import {updateFileRole} from "./data/storage.js";
import Discord from "discord.js";
import 'dotenv/config';
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";

// Fix dirname since we can't use require
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Setup intents and create bot
const botIntents = new Discord.Intents();
botIntents.add(Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
)
const bot = new Discord.Client({ intents: botIntents });

// Attach commands
bot.commands = [];
let cmdPath = path.join(__dirname, 'commands')
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'))
if(process.platform === "win32") {
    cmdPath = 'file://' + cmdPath
}

for(const file of cmdFiles) {
    const filePath = path.join(cmdPath, file)
    const cmd = await import(filePath)

    bot.commands.push(cmd.default.data.toJSON())
}

// Once bot is running we need some additional setup (e.g. deploy the commands!)
bot.once('ready', () => {
    logDebug("Bothony is active!")

    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

    rest.put(
        Routes.applicationCommands(bot.application.id),
        { body: bot.commands },
    ).then();
    logDebug("Commands deployed!")
});

// Login the bot
bot.login(process.env.TOKEN);

//On any voice channel update
bot.on('voiceStateUpdate', async (oldMember, newMember) => {
    let newUserChannel = newMember.channel
    let oldUserChannel = oldMember.channel

    if (newUserChannel !== null && !newMember.member.user.bot) { // Check user is still in a VC and not a bot
        if (newUserChannel === oldUserChannel) { // Mute / Unmute / Deafen / Undeafen
            // Do nothing
        } else {   // VC change
            let chanName = newUserChannel.name
            logDebug(newMember.member.user.username + ' joined ' + chanName + '!');

            if (newUserChannel === newUserChannel.guild.afkChannel) {  // Joined an AFK Channel
                // Do nothing
            } else {    // Switched to another channel
                let sound = await getSound(newUserChannel.guild.id, newMember.member.roles)
                if (sound) {
                    await playSound(newUserChannel, sound)
                }
            }
        }
    }
});

// When there is an interaction, handle it
bot.on('interactionCreate', async (interaction) => {
    // If it's a command we want to process it
    if (interaction.isCommand()) {
        const cmd = bot.commands.get(interaction.commandName)
        if (cmd) {
            try {
                await cmd.execute(interaction)
            } catch(err) {
                logError(err)
                await notifyCompletion(interaction, 'process the command.', false, true)
            }
        }
    }

    // TODO: Add other interactions in the future
    // TODO: E.G. Want a similarity comparison on sound files too
})

// Handle when a new person joins the server
bot.on('guildMemberAdd', async (member) => {
    let msg = await getWelcomeMsg(member.guild.id)
    if (msg) {
        let sysChan = member.guild.systemChannel
        sysChan.startTyping()

        sysChan.send(msg)
            .then(message => logDebug('Introduced new member, ' + member.user.username + ' to ' + member.guild.name))
            .catch(logError)

        sysChan.stopTyping()
    }
});

// Handle role name change
bot.on('roleUpdate', async (oldRole, newRole) => {
    if(oldRole.name !== newRole.name && await checkSound(oldRole.guild.id, oldRole.name)) {
        await updateFileRole(newRole.guild.id, oldRole.name, newRole.name)
        logDebug('Name for role ' + oldRole.name + ' changed to ' + newRole.name)
    }
})

// Handle role deletion
bot.on('roleDelete', async (role) => {
    if(await checkSound(role.guild.id, role.name)) {
        await removeSound(role.guild.id, role.name)
        logDebug('Role' + role.name + ' was removed')
    }
})

// Handle removal of / from guild
bot.on('guildDelete', async (guild) => {
    if(await guildExists(guild.id)) {
        await removeGuild(guild.id)
    }
})

// Handle joining to guild
bot.on('guildCreate', async (guild) => {
    if(!await guildExists(guild.id)) {
        await createGuild(guild.id)
    }
})