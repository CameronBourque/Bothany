import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import {fileURLToPath} from "url";
import Discord from "discord.js";

// Fix dirname since we can't use require
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const commands = []
let cmdPath = path.join(__dirname, 'commands')
const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'))
if(process.platform === "win32") {
    cmdPath = 'file://' + cmdPath
}

for(const file of cmdFiles) {
    const filePath = path.join(cmdPath, file)
    const cmd = await import(filePath)

    commands.push(cmd.default.data.toJSON())
}

const botIntents = new Discord.Intents();
botIntents.add(Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
)
const bot = new Discord.Client({ intents: botIntents });

const rest = new REST({version: '9'}).setToken(process.env.TOKEN);

await rest.put(
    Routes.applicationGuildCommands(bot.application.id, process.env.GUILD_ID),
    { body: commands },
);