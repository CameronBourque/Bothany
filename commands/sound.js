import {notifyCompletion, notifyProcessing} from "../commandHandler.js";
import {removeSound, setSound} from "../data/database.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import {logError} from "../logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName('sound')
        .setDescription('Manage what sounds are played when a user joins a voice channel.')
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Stops playing sounds for users of the specified role when they join a voice channel.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to remove the sound for.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('set')
                .setDescription('Sets what sound will play when a user with a specified role joins a voice channel. ')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to set the sound for.')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option.setName('soundfile')
                        .setDescription('The sound to play for the specified role.')
                        .setRequired(true))),
    async execute(cmd) {
        await notifyProcessing(cmd)

        const gID = cmd.guildId
        const role = cmd.options.getRole('role')
        let success = false
        let msg = ''

        try {
            if (cmd.options.getSubcommand() === 'remove') {
                msg = 'removed sound from ' + role.name + ' role'
                success = await removeSound(gID, role.name.toString())
            } else if (cmd.options.getSubcommand() === 'set') {
                const sound = cmd.options.getAttachment('soundfile')
                msg = 'set sound for ' + role.name + ' role'
                success = await setSound(gID, role.name.toString(), sound)
            }
        } catch (err) {
            logError(err)
        } finally {
            await notifyCompletion(cmd, msg, success)
        }
    }
}
