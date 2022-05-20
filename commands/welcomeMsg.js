import {notifyCompletion, notifyProcessing} from "../commandHandler.js";
import {removeWelcomeMsg, setWelcomeMsg} from "../data/database.js";
import { SlashCommandBuilder } from '@discordjs/builders';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome message')
        .setDescription('Manages Bothany\'s welcome message for new users in the server.')
        .addSubcommand(subcommand =>
            subcommand.setName('set')
                .setDescription('Sets Bothany\'s welcome message for new users in the server.')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('The message to send to new users.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Removes Bothany\'s welcome message for new users in the server.')),
    async execute(cmd) {
        await notifyProcessing(cmd)

        const gID = cmd.guildId
        let success = false
        let msg = ''

        if(cmd.options.getSubcommand() === 'remove') {
            success = removeWelcomeMsg(gID)
            msg = 'removed welcome message'
        } else if (cmd.options.getSubcommand() === 'add') {
            success = setWelcomeMsg(gID)
            msg = 'set welcome message'
        }

        await notifyCompletion(cmd, msg, success)
    }
}