import {displayHelp, notifyProcessing} from "../messageSender.js";
import {SlashCommandBuilder} from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Provides some information about the bot'),
    async execute(cmd) {
        await notifyProcessing(cmd)

        await displayHelp(cmd)
    }
}
