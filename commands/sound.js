import {notifyCompletion, notifyProcessing} from "../commandHandler";
import {addSound, checkSound, removeSound, setSound, updateSound} from "../database";
const { SlashCommandBuilder } = import('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sound')
        .setDescription('Manage what sounds are played when a user joins a voice channel.')
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Stops playing sounds users of the specified role when they join a voice channel.')
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

        if(cmd.options.getSubcommand() === 'remove') {
            success = await removeSound(gID, role)
            msg = 'removed sound from ' + role.toString()
        } else if (cmd.options.getSubcommand() === 'set') {
            const sound = cmd.options.getAttachment('soundfile')

            success = await setSound(gID, role, sound)
            msg = 'set sound for ' + role.toString()
        }

        await notifyCompletion(cmd, msg, success)
    }
}