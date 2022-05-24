import {notifyCompletion, notifyProcessing} from "../commandHandler.js";
import {setSound} from "../data/database.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import {logError} from "../logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName('set')
        .setDescription('Sets what sound will play when a user with a specified role joins a voice channel. ')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to set the sound for.')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('soundfile')
                .setDescription('The sound to play for the specified role.')
                .setRequired(true)),
    async execute(cmd) {
        await notifyProcessing(cmd)

        const gID = cmd.guildId
        const role = cmd.options.getRole('role')
        const sound = cmd.options.getAttachment('soundfile')

        let success = false
        let msg = 'set sound for ' + role.name

        try {
            success = await setSound(gID, role.name, sound)
        } catch (err) {
            logError(err)
        } finally {
            await notifyCompletion(cmd, msg, success)
        }
    }
}
