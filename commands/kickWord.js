import {notifyCompletion, notifyProcessing} from "../commandHandler.js";
import {addKickWord, removeKickWord} from "../data/database.js";
import {SlashCommandBuilder} from '@discordjs/builders';
import {logError} from "../logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName('kick_word')
        .setDescription('Manages what words (case insensitive) can get users kicked from the server.')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Adds a word to the list of kickable words.')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('The word to kick a user for using.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Removes a word from the list of kickable words.')
                .addStringOption(option =>
                    option.setName('word')
                        .setDescription('The word to no longer kick a user for using.')
                        .setRequired(true))),
    async execute(cmd) {
        await notifyProcessing(cmd)

        const gID = cmd.guildId
        const word = cmd.options.getString('word')

        let success = false
        let msg = ''
        try {
            if(cmd.options.getSubcommand() === 'add') {
                msg = 'added ' + word + ' to list of kickable words'
                success = addKickWord(gID, word)
            } else if(cmd.options.getSubcommand() === 'remove') {
                msg = 'removed ' + word + ' from list of kickable words'
                success = removeKickWord(gID, word)
            }
        } catch (err) {
            logError(err)
        } finally {
            await notifyCompletion(cmd, msg, success)
        }
    }
}
