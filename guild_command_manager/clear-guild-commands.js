import Discord from "discord.js";

const botIntents = new Discord.Intents();
botIntents.add(Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
)
const bot = new Discord.Client({ intents: botIntents });

// Clear commands from provided guild
bot.once('ready', () => {
    bot.guilds.cache.get(process.env.GUILD_ID).commands.set([])
})