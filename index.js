import {} from 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import {playSound} from "./audio";
import {logDebug, logError, logRoleIdentified} from "./logger";
import Discord from "discord.js";
import {deployCommands} from "./deploy-commands";
import {cmdHandler, notifyCompletion} from "./commandHandler";

// Setup intents and create bot
const botIntents = new Discord.Intents();
botIntents.add(Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
)
const bot = new Discord.Client({ intents: botIntents });

// Attach commands
bot.commands = new Discord.Collection();
const cmdPath = path.join(__dirname, 'commands')
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'))

for(const file of cmdFiles) {
    const filePath = path.join(cmdPath, file)
    const cmd = import(filePath)

    bot.commands.set(cmd.data.name, cmd)
}

// Once bot is running we need some additional setup (e.g. deploy the commands!)
bot.once('ready', () => {
    logDebug("Bothony is active!");

    deployCommands(bot.user.id);
});

// Login the bot
bot.login(process.env.TOKEN);

//On any voice channel update
bot.on('voiceStateUpdate', (oldMember, newMember) => {
   let newUserChannel = newMember.channel;
   let oldUserChannel = oldMember.channel;

   if(newUserChannel !== null && !newMember.member.user.bot){ //VALID CHANNEL SWAP AND NOT BOT
       if(newUserChannel === oldUserChannel){ //MUTE AND UNMUTE
            // if(newMember.member.roles.cache.find(r => r.name === process.env.SAD_ROLE) && newMember.selfDeaf){  //SAD
            //     logRoleIdentified(newMember, process.env.SAD_ROLE);
            //     playSound(newUserChannel, process.env.SAD_SOUNDFILE);
            //
            // }
       }
       else {   //CHANGING/JOINING CHANNELS
           let chanName = newUserChannel.name;
           logDebug(newMember.member.user.username + ' joined ' + chanName + '!');

           if(newUserChannel === newUserChannel.guild.afkChannel){  //SWITCH TO AFK CHANNEL
               // if (newMember.member.roles.cache.find( r=> r.name === process.env.AFK_ROLE)) {   //AFK
               //     logRoleIdentified(newMember, process.env.AFK_ROLE);
               //     playSound(oldUserChannel, process.env.AFK_SOUNDFILE);
               //
               // }
           }
           else{    //SWITCHED TO A CHANNEL OTHER THAN AFK
               if (newMember.member.roles.cache.find( r=> r.name === process.env.MOMMY_ROLE)) {    //MOMMY
                   logRoleIdentified(newMember, process.env.MOMMY_ROLE);
                   playSound(newUserChannel, process.env.MOMMY_SOUNDFILE);

               // } else if (newMember.member.roles.cache.find(r => r.name === process.env.HELLO_ROLE)) { //HELLO
               //     logRoleIdentified(newMember, process.env.HELLO_ROLE);
               //     playSound(newUserChannel, process.env.HELLO_ROLE);
               //
               // } else if (newMember.member.roles.cache.find(r => r.name === process.env.TRON_ROLE)) {   //TRON
               //     logRoleIdentified(newMember, process.env.TRON_ROLE);
               //     playSound(newUserChannel, process.env.TRON_SOUNDFILE);
               //
               // } else if (newMember.member.roles.cache.find( r=> r.name === process.env.SAM_ROLE)) {    //SAM
               //     logRoleIdentified(newMember, process.env.SAM_ROLE);
               //     playSound(newUserChannel, process.env.SAM_SOUNDFILE);
               //
               } else if (newMember.member.roles.cache.find( r=> r.name === process.env.POGCHAMP_ROLE)) {    //POGCHAMP
                   logRoleIdentified(newMember, process.env.POGCHAMP_ROLE);
                   playSound(newUserChannel, process.env.POGCHAMP_SOUNDFILE);

               } else if (newMember.member.roles.cache.find( r=> r.name === process.env.RAT_KING_ROLE)) {    //RAT KING
                   logRoleIdentified(newMember, process.env.RAT_KING_ROLE);
                   playSound(newUserChannel, process.env.RAT_KING_SOUNDFILE);

               } else if (newMember.member.roles.cache.find( r=> r.name === process.env.NIGHT_NIGHT_ROLE)) {    //NIGHT NIGHT
                   logRoleIdentified(newMember, process.env.NIGHT_NIGHT_ROLE);
                   playSound(newUserChannel, process.env.NIGHT_NIGHT_SOUNDFILE);

               } else if (newMember.member.roles.cache.find( r=> r.name === process.env.COWBOY_ROLE)) {    //COWBOY
                   logRoleIdentified(newMember, process.env.COWBOY_ROLE);
                   playSound(newUserChannel, process.env.COWBOY_SOUNDFILE);

               }
           }
       }
   }
});

// When there is an interaction, handle it
bot.on('interactionCreate', async interaction => {
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

    // TODO: Add other interactions
    // TODO: Want a similarity comparison on sound files too
})

// Handle when a new person joins the server
bot.on('guildMemberAdd', (member) => {
    // TODO: Make this toggleable with a saved welcome message in the database

    let sysChan = member.guild.systemChannel;
    sysChan.startTyping();

    sysChan.send('What the fuck is up ' + member.user.username + '!')
        .then(message => logDebug('Introduced new member, ' + member.user.username + ' to ' + member.guild.name))
        .catch(logError);

    sysChan.stopTyping();
});