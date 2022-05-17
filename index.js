//Setup and log into the index account
import {} from 'dotenv/config'
import {playSound} from "./audio";
import {logRoleIdentified} from "./logger";

const Discord = require('discord.js');
const bot = new Discord.Client();

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
           console.log(newMember.member.user.username + ' joined ' + chanName + '!');

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

//NEW PERSON ON SERVER
bot.on('guildMemberAdd', (member) => {
    // TODO: Make this toggleable with a saved welcome message in the database

    let sysChan = member.guild.systemChannel;
    sysChan.startTyping();

    sysChan.send('What the fuck is up ' + member.user.username + '!')
        .then(message => console.log('Introduced new member, ' + member.user.username + ' to ' + member.guild.name))
        .catch(console.error);

    sysChan.stopTyping();
});