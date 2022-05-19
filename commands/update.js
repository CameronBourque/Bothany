import {notifyCompletion, notifyProcessing} from "../commandHandler";
import {addSound, checkSound, updateSound} from "../database";
const { SlashCommandBuilder } = import('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Updates what sound will play when a user with a specified role joins a voice channel. ' +
            'If nothing exists for the role, then this works as if the add command was used.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to update the sound for.')
                .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('soundfile')
                .setDescription('The new sound to play for the specified role.')
                .setRequired(true)),
    async execute(cmd) {
        await notifyProcessing(cmd)

        const gID = cmd.guildId
        const role = cmd.options.getRole('role')
        const sound = cmd.options.getAttachment('soundfile')

        let success = false
        let msg = ''
        if(checkSound(gID, role)) {
            success = await updateSound(gID, role, sound)
            msg = 'updated sound for ' + role.toString()
        } else {
            success = await addSound(gID, role, sound)
            msg = 'added sound to ' + role.toString()
        }

        await notifyCompletion(cmd, msg, success)
    }
}