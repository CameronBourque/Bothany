import {notifyCompletion, notifyProcessing} from "../commandHandler";
import {addSound, removeSound, updateSound} from "../database";
const { SlashCommandBuilder } = import('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sound')
        .setDescription('Manage what sounds are played when a user joins a voice channel.')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Adds a sound to play when a user with a specified role joins a voice channel.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to assign the sound to.')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option.setName('soundfile')
                        .setDescription('The sound to play for the specified role.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('remove')
                .setDescription('Stops playing sounds users of the specified role when they join a voice channel.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to remove the sound for.')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('update')
                .setDescription('Updates what sound will play when a user with a specified role joins a voice channel. ' +
                    'If nothing exists for the role, then this works as if the add command was used.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('The role to update the sound for.')
                        .setRequired(true))
                .addAttachmentOption(option =>
                    option.setName('soundfile')
                        .setDescription('The new sound to play for the specified role.')
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
        } else {
            const sound = cmd.options.getAttachment('soundfile')

            if (cmd.options.getSubcommand() === 'add') {
                success = await addSound(gID, role, sound)
                msg = 'added sound to ' + role.toString()
            } else if (cmd.options.getSubcommand() === 'update') {
                success = await updateSound(gID, role, sound)
                msg = 'updated sound for ' + role.toString()
            }
        }

        await notifyCompletion(cmd, msg, success)
    }
}