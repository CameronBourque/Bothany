import {notifyCompletion, notifyProcessing} from "../commandHandler.js";
import {checkSound, removeSound} from "../data/database.js";
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

        let success = true
        if(await checkSound(gID, role.name)) {
            success = await removeSound(gID, role.name)
        }
        let msg = 'removed sound from ' + role.name

        await notifyCompletion(cmd, msg, success)
    }
}