//Setup and log into the index account
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();

bot.login(process.env.TOKEN);

function logRoleIdentified(member, role) {
    console.log(member.member.user.username + ' has in the role "' + role + '". Joining their channel!');
}

function playSound (userChannel, sound) {
    userChannel.join().then(connection => {
        const soundFile = require("path").join(__dirname, sound);
        const dispatcher = connection.play(soundFile, {volume: 2.0});

        dispatcher.on('finish', () => {
            userChannel.leave();
        });
    });
}

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
                   // } else if (newMember.member.roles.cache.find( r=> r.name === process.env.SAD_ROLE)) {    //SAD
                   //     logRoleIdentified(newMember, process.env.SAD_ROLE);
                   //     playSound(newUserChannel, process.env.SAD_SOUNDFILE);
                   //
                   } else if (newMember.member.roles.cache.find( r=> r.name === process.env.POGCHAMP_ROLE)) {    //POGCHAMP
                       logRoleIdentified(newMember, process.env.POGCHAMP_ROLE);
                       playSound(newUserChannel, process.env.POGCHAMP_SOUNDFILE);

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