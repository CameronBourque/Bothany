//Setup and log into the index account
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.TOKEN);

//On any voice channel update
bot.on('voiceStateUpdate', (oldMember, newMember) => {
   let newUserChannel = newMember.channel;
   let oldUserChannel = oldMember.channel;

   if(newUserChannel !== null){ //VALID CHANNEL SWAP
       if(!newMember.member.user.bot && newUserChannel === oldUserChannel){ //MUTE AND UNMUTE
            if(newMember.member.roles.cache.find(r => r.name === process.env.SAD_ROLE) && newMember.selfDeaf){  //SAD
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
       else {   //CHANGING/JOINING CHANNELS
           let chanName = newUserChannel.name;
           console.log(newMember.member.user.username + ' joined ' + chanName + '!');

           if (!newMember.member.user.bot) {    //NOT A BOT
               if(newUserChannel === newUserChannel.guild.afkChannel){  //SWITCH TO AFK CHANNEL
                   // if (newMember.member.roles.cache.find( r=> r.name === process.env.AFK_ROLE)) {   //AFK
                   //     console.log(newMember.member.user.username + ' is in the role "' + process.env.AFK_ROLE + '". Joining their old channel!');
                   //
                   //     oldUserChannel.join().then(connection => {
                   //         const soundFile = require("path").join(__dirname, process.env.AFK_SOUNDFILE);
                   //         const dispatcher = connection.play(soundFile, {volume: 2.0});
                   //
                   //         dispatcher.on('finish', () => {
                   //             oldUserChannel.leave();
                   //         });
                   //     });
                   // }
               }
               else{    //SWITCHED TO OTHER CHANNEL THAN AFK
                   if (newMember.member.roles.cache.find( r=> r.name === process.env.MOMMY_ROLE)) {    //MOMMY
                       console.log(newMember.member.user.username + ' is in the role "' + process.env.MOMMY_ROLE + '". Joining their channel!');

                       newUserChannel.join().then(connection => {
                           const soundFile = require("path").join(__dirname, process.env.MOMMY_SOUNDFILE);
                           const dispatcher = connection.play(soundFile, {volume: 2.0});

                           dispatcher.on('finish', () => {
                               newUserChannel.leave();
                           });
                       });
                   // } else if (newMember.member.roles.cache.find(r => r.name === process.env.HELLO_ROLE)) { //HELLO
                   //     console.log(newMember.member.user.username + ' is in the role "' + process.env.HELLO_ROLE + '". Joining their channel!');
                   //
                   //     newUserChannel.join().then(connection => {
                   //         const soundFile = require("path").join(__dirname, process.env.HELLO_SOUNDFILE);
                   //         const dispatcher = connection.play(soundFile, {volume: 2.0});
                   //
                   //         dispatcher.on('finish', () => {
                   //             newUserChannel.leave();
                   //         });
                   //     });
                   // } else if (newMember.member.roles.cache.find(r => r.name === process.env.TRON_ROLE)) {   //TRON
                   //     console.log(newMember.member.user.username + ' is in the role "' + process.env.TRON_ROLE + '". Joining their channel!');
                   //
                   //     newUserChannel.join().then(connection => {
                   //         const soundFile = require("path").join(__dirname, process.env.TRON_SOUNDFILE);
                   //         const dispatcher = connection.play(soundFile, {volume: 2.0});
                   //
                   //         dispatcher.on('finish', () => {
                   //             newUserChannel.leave();
                   //         });
                   //     });
                   // } else if (newMember.member.roles.cache.find( r=> r.name === process.env.SAM_ROLE)) {    //SAM
                   //     console.log(newMember.member.user.username + ' is in the role "' + process.env.SAM_ROLE + '". Joining their channel!');
                   //
                   //     newUserChannel.join().then(connection => {
                   //         const soundFile = require("path").join(__dirname, process.env.SAM_SOUNDFILE);
                   //         const dispatcher = connection.play(soundFile, {volume: 2.0});
                   //
                   //         dispatcher.on('finish', () => {
                   //             newUserChannel.leave();
                   //         });
                   //     });
                   // }  else if (newMember.member.roles.cache.find( r=> r.name === process.env.SAM_ROLE)) {    //SAM
                   //     console.log(newMember.member.user.username + ' is in the role "' + process.env.SAM_ROLE + '". Joining their channel!');
                   //
                   //     newUserChannel.join().then(connection => {
                   //         const soundFile = require("path").join(__dirname, process.env.SAM_SOUNDFILE);
                   //         const dispatcher = connection.play(soundFile, {volume: 2.0});
                   //
                   //         dispatcher.on('finish', () => {
                   //             newUserChannel.leave();
                   //         });
                   //     });
                   } else if (newMember.member.roles.cache.find( r=> r.name === process.env.POGCHAMP_ROLE)) {    //MOMMY
                       console.log(newMember.member.user.username + ' is in the role "' + process.env.POGCHAMP_ROLE + '". Joining their channel!');

                       newUserChannel.join().then(connection => {
                           const soundFile = require("path").join(__dirname, process.env.POGCHAMP_SOUNDFILE);
                           const dispatcher = connection.play(soundFile, {volume: 2.0});

                           dispatcher.on('finish', () => {
                               newUserChannel.leave(); 
                           });
                       });
                   }
               }
           }
       }
   }
});

//NEW PERSON ON SERVER
bot.on('guildMemberAdd', (member) => {
    let sysChan = member.guild.systemChannel;
    sysChan.startTyping();

    sysChan.send('What the fuck is up ' + member.user.username + '!')
        .then(message => console.log('Introduced new member, ' + member.user.username + ' to ' + member.guild.name))
        .catch(console.error);

    sysChan.stopTyping();
});