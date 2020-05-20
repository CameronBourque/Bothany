//Setup and log into the index account
require('dotenv').config();
const Discord = require('discord.js');
const index = new Discord.Client();

index.login(process.env.TOKEN);

//On any voice channel update
index.on('voiceStateUpdate', (oldMember, newMember) => {
   let newUserChannel = newMember.channel;

   if(newUserChannel !== null){
       let chanName = newUserChannel.name;
       console.log(newMember.member.user.username + ' joined ' + chanName + '!');

       if(!newMember.member.user.bot && newMember.member.roles.cache.find(r => r.name === process.env.ROLE)) {
           console.log(newMember.member.user.username + ' is in the role "' + process.env.ROLE + '". Joining their channel!');

           newUserChannel.join().then(connection => {
              const soundFile = require("path").join(__dirname, process.env.SOUNDFILE);
              const dispatcher = connection.play(soundFile, {volume: 2.0});

              dispatcher.on('finish', () => {
                  newUserChannel.leave();
              });
           });
       }
   }
});