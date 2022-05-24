import {sendUpdateInfo} from "./messageSender.js";
import Discord from "discord.js";
import {logDebug} from "./logger.js";
import {REST} from "@discordjs/rest";
import {Routes} from "discord-api-types/v9";

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

// Once bot is running we need some additional setup (e.g. deploy the commands!)
bot.once('ready', () => {
    // Notify guilds of important update information
    sendUpdateInfo(bot)
});

// Login the bot
bot.login(process.env.TOKEN);
