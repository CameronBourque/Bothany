import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {playSound} from "./audio.js";
import {logDebug, logError} from "./logger.js";
import {
    checkSound,
    createGuild,
    doSpam,
    getSound,
    getWelcomeMsg,
    guildExists,
    isKickable,
    removeGuild,
    removeSound,
    updateRole
}
    from "./data/database.js";
import Discord, {Permissions} from "discord.js";
import 'dotenv/config';
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";
import {sendUpdateInfo} from "./messageSender.js";

// Fix dirname since we can't use require
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Setup intents and create bot
const botIntents = new Discord.Intents();
botIntents.add(Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.DIRECT_MESSAGE_TYPING,
)
const bot = new Discord.Client({ intents: botIntents });

// Attach commands
bot.commands = new Discord.Collection()
let commands = []
let cmdPath = path.join(__dirname, 'commands')
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'))
if(process.platform === "win32") {
    cmdPath = 'file://' + cmdPath
}

for(const file of cmdFiles) {
    const filePath = path.join(cmdPath, file)
    const cmd = await import(filePath)

    bot.commands.set(cmd.default.data.name, cmd.default)
    commands.push(cmd.default.data.toJSON())
}

// Once bot is running we need some additional setup (e.g. deploy the commands!)
bot.once('ready', () => {
    logDebug("Bothony is active!")

    const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

    rest.put(
        Routes.applicationCommands(bot.application.id),
        { body: commands },
    ).then();
    logDebug("Commands deployed!")

    // Notify guilds of important update information
    sendUpdateInfo(bot).then()
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
                let sound = await getSound(newUserChannel.guild.id, newMember.member.roles.cache)
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
            }
        }
    }

    // TODO: Add other interactions in the future?
})

// When someone sends a message, handle it
bot.on('messageCreate', async (message) => {
    if(!message.author.bot && !message.system && !message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        let kick = await isKickable(message.guildId, message.content)
        if(kick) {
            if(await doSpam(message.guildId)) {
                let i = 0
                while(i < 10) {
                    await message.author.send('Bad word!')
                    i++
                }
            }
            message.guild.members.kick(message, message.author.username + ' said a bad word! (' + kick + ')')
        }
    }
})

// Handle when a new person joins the server
bot.on('guildMemberAdd', async (member) => {
    let msg = await getWelcomeMsg(member.guild.id)
    if (msg) {
        while(msg.indexOf('${user}') !== -1) {
            msg = msg.replace('${user}', `<@${member.id}>`)
        }
        let sysChan = member.guild.systemChannel
        await sysChan.sendTyping()

        sysChan.send(msg)
            .then(message => logDebug('Introduced new member, ' + member.user.username + ' to ' + member.guild.name
                + ' with ' + message.content))
            .catch(logError)
    }
});

// Handle role name change
bot.on('roleUpdate', async (oldRole, newRole) => {
    if(oldRole.name !== newRole.name && await checkSound(oldRole.guild.id, oldRole.name)) {
        await updateRole(newRole.guild.id, oldRole.name, newRole.name)
        logDebug('Name for role ' + oldRole.name + ' changed to ' + newRole.name)
    }
})

// Handle role deletion
bot.on('roleDelete', async (role) => {
    if(await checkSound(role.guild.id, role.name)) {
        await removeSound(role.guild.id, role.name)
        logDebug('Role ' + role.name + ' was removed')
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
        await createGuild(guild.id, guild.name)
    }
})