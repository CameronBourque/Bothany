import {notifyCompletion, notifyProcessing} from "../commandHandler";
import {addSound} from "../database";
const { SlashCommandBuilder } = import('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Stops playing sounds users of the specified role when they join a voice channel.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to remove the sound for.')
                .setRequired(true)),
    async execute(cmd) {
        await notifyProcessing(cmd)

        const gID = cmd.guildId
        const role = cmd.options.getRole('role')
        const sound = cmd.options.getAttachment('soundfile')

        let success = await removeSound(gID, role)
        let msg = 'removed sound from ' + role.toString()

        await notifyCompletion(cmd, msg, success)
    }
}