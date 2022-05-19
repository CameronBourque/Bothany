import {notifyCompletion, notifyProcessing} from "../commandHandler";
import {addSound} from "../database";
const { SlashCommandBuilder } = import('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Adds a sound to play when a user with a specified role joins a voice channel.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to assign the sound to.')
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

        let success = await addSound(gID, role, sound)
        let msg = 'added sound to ' + role.toString()

        await notifyCompletion(cmd, msg, success)
    }
}