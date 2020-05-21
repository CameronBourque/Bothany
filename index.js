//Setup and log into the index account
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.TOKEN);

//On any voice channel update
bot.on('voiceStateUpdate', (oldMember, newMember) => {
   let newUserChannel = newMember.channel;
   let oldUserChannel = oldMember.channel;

   if(newUserChannel !== null){
       if(!newMember.member.user.bot && newUserChannel === oldUserChannel){ //muting and unmuting
            if(newMember.member.roles.cache.find(r => r.name === process.env.SAD_ROLE) && newMember.selfDeaf){
                console.log(newMember.member.user.username + ' is in the role "' + process.env.SAD_ROLE + '". Playing sad music!');

                newUserChannel.join().then(connection => {
                    const soundFile = require("path").join(__dirname, process.env.SAD_SOUNDFILE);
                    const dispatcher = connection.play(soundFile, {volume: 0.5});

                    dispatcher.on('finish', () => {
                        newUserChannel.leave();
                    });
                });
            }
       }
       else {   //enter and leaving a channel
           let chanName = newUserChannel.name;
           console.log(newMember.member.user.username + ' joined ' + chanName + '!');

           if (!newMember.member.user.bot) {
               if (newMember.member.roles.cache.find(r => r.name === process.env.HELLO_ROLE)) {
                   console.log(newMember.member.user.username + ' is in the role "' + process.env.HELLO_ROLE + '". Joining their channel!');

                   newUserChannel.join().then(connection => {
                       const soundFile = require("path").join(__dirname, process.env.HELLO_SOUNDFILE);
                       const dispatcher = connection.play(soundFile, {volume: 2.0});

                       dispatcher.on('finish', () => {
                           newUserChannel.leave();
                       });
                   });
               } else if (newMember.member.roles.cache.find(r => r.name === process.env.TRON_ROLE)) {
                   console.log(newMember.member.user.username + ' is in the role "' + process.env.TRON_ROLE + '". Joining their channel!');

                   newUserChannel.join().then(connection => {
                       const soundFile = require("path").join(__dirname, process.env.TRON_SOUNDFILE);
                       const dispatcher = connection.play(soundFile, {volume: 2.0});

                       dispatcher.on('finish', () => {
                           newUserChannel.leave();
                       });
                   });
               } else if (newMember.member.roles.cache.find( r=> r.name === process.env.AFK_ROLE)) {
                   if(newUserChannel === newUserChannel.guild.afkChannel){
                       console.log(newMember.member.user.username + ' is in the role "' + process.env.AFK_ROLE + '". Joining their old channel!');

                       oldUserChannel.join().then(connection => {
                           const soundFile = require("path").join(__dirname, process.env.AFK_SOUNDFILE);
                           const dispatcher = connection.play(soundFile, {volume: 2.0});

                           dispatcher.on('finish', () => {
                               oldUserChannel.leave();
                           });
                       });
                   }
               }
           }
       }

   }
});

//Message events (FUTURE FEATURE)
bot.on('message', (msg) => {
    //FILL
});