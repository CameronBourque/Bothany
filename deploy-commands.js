import fs from 'node:fs';
import path from 'node:path';
const { SlashCommandBuilder } = import('@discordjs/builders');
const { REST } = import('@discordjs/rest');
const { Routes } = import('discord-api-types/v9');

export async function deployCommands(id) {
    const commands = []
    const cmdPath = path.join(__dirname, 'commands')
    const cmdFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'))

    for(const file of cmdFiles) {
        const filePath = path.join(cmdPath, file)
        const cmd = import(filePath)

        commands.push(cmd.data.toJSON())
    }

    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

    await rest.put(
        Routes.applicationCommands(id),
        { body: commands },
    );
}