const { SlashCommandBuilder } = import('@discordjs/builders');
const { REST } = import('@discordjs/rest');
const { Routes } = import('discord-api-types/v9');

async function deployCommands(id) {
    const commands = [
        // The go to for managing sounds. Made ahead of time for feature expansion
        new SlashCommandBuilder().setName('sound')
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
                    .setDescription('Stops playing sounds for when a user with a specified role joins a voice channel.')
                    .addRoleOption(option =>
                        option.setName('role')
                            .setDescription('The role to remove the sound for.')
                            .setRequired(true)))
            .addSubcommand(subcommand =>
                subcommand.setName('update')
                    .setDescription('Updates what sound will play when a user with a specified role joins a voice channel.')),

        // These commands are planned to be deprecated with future feature expansion
        new SlashCommandBuilder().setName('add')
            .setDescription('Adds a sound to play when a user with a specified role joins a voice channel.')
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('The role to assign the sound to.')
                    .setRequired(true))
            .addAttachmentOption(option =>
                option.setName('soundfile')
                    .setDescription('The sound to play for the specified role.')
                    .setRequired(true)),
        new SlashCommandBuilder().setName('remove')
            .setDescription('Stops playing sounds for when a user with a specified role joins a voice channel.')
            .addRoleOption(option =>
                option.setName('role')
                    .setDescription('The role to remove the sound for.')
                    .setRequired(true)),
        new SlashCommandBuilder().setName('update')
            .setDescription('Updates what sound will play when a user with a specified role joins a voice channel.'),

        // Made for me only!
        new SlashCommandBuilder().setName('creator')
            .setDescription('Only the creator of this bot can use this command!')
            .addNumberOption(option =>
                option.setName('value')
                    .setDescription('This is a secret!')),
    ].map(command => command.toJSON());

    const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

    await rest.put(
        Routes.applicationCommands(id),
        { body: commands },
    );
}