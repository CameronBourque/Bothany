import fs from 'fs';
import path from 'path';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import {fileURLToPath} from "url";

// Fix dirname since we can't use require
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function deployCommands(id) {
    const commands = []
    let cmdPath = path.join(__dirname, 'commands')
    const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'))
    if(process.platform === "win32") {
        cmdPath = 'file://' + cmdPath
    }

    for(const file of cmdFiles) {
        const filePath = path.join(cmdPath, file)
        const cmd = import(filePath)

        commands.push(cmd.default.data.toJSON())
    }

    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

    await rest.put(
        Routes.applicationCommands(id),
        { body: commands },
    );
}