import {notifyCompletion, notifyProcessing} from "../commandHandler.js";
import {togglePoggerKick} from "../data/database.js";
import {SlashCommandBuilder} from '@discordjs/builders';
import {logError} from "../logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName('poggers')
        .setDescription('Determines whether to kick someone for saying poggers.')
        .addBooleanOption(option =>
            option.setName('value')
                .setDescription('Whether to kick someone for saying poggers.')
                .setRequired(true)),
    async execute(cmd) {
        await notifyProcessing(cmd)

        const gID = cmd.guildId
        const val = cmd.options.getBoolean('value')

        let msg = 'decided '
        if (!val) {
            msg = msg + 'not '
        }
        msg = msg + 'to kick people who say poggers'

        let success = false
        try {
            success = await togglePoggerKick(gID, val)
        } catch (err) {
            logError(err)
        } finally {
            await notifyCompletion(cmd, msg, success)
        }
    }
}
