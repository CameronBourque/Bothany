import {notifyCompletion, notifyProcessing} from "../messageSender.js";
import {removeWelcomeMsg, setWelcomeMsg} from "../data/database.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import {logDebug, logError} from "../logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName('welcome_message')
        .setDescription('Manages Bothany\'s welcome message for new users in the server.')
        .addSubcommand(subcommand =>
            subcommand.setName('set')
                .setDescription('Sets Bothany\'s welcome message for new users in the server.')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('The message to send to new users. Use ${user} to insert the user\'s name in the message.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Removes Bothany\'s welcome message for new users in the server.')),
    async execute(cmd) {
        await notifyProcessing(cmd)

        const gID = cmd.guildId
        let success = false
        let msg = ''

        try {
            if (cmd.options.getSubcommand() === 'remove') {
                success = await removeWelcomeMsg(gID)
                msg = 'removed welcome message'
            } else if (cmd.options.getSubcommand() === 'set') {
                let welcome = cmd.options.getString('message')
                success = await setWelcomeMsg(gID, welcome)
                msg = 'set welcome message to "' + welcome + '"'
            }
        } catch (err) {
            logError(err)
        } finally {
            await notifyCompletion(cmd, msg, success)
        }
    }
}
