import {notifyCompletion, notifyProcessing} from "../commandHandler.js";
import {checkSound, removeSound} from "../data/database.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import {logError} from "../logger.js";

export default {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Stops playing sounds for users of the specified role when they join a voice channel.')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('The role to remove the sound for.')
                .setRequired(true)),
    async execute(cmd) {
        await notifyProcessing(cmd)

        const gID = cmd.guildId
        const role = cmd.options.getRole('role')

        let success = false
        let msg = 'removed sound from ' + role.name

        try {
            if (await checkSound(gID, role.name)) {
                success = await removeSound(gID, role.name)
            }
        } catch (err) {
            logError(err)
        } finally {
            await notifyCompletion(cmd, msg, success)
        }
    }
}
