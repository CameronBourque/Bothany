// When a user types in chat we need to process the commands correctly
async function notifyProcessing(cmd) {
    await cmd.deferReply({ ephemeral: true });
}

async function notifyCompletion(cmd, msg, success) {
    let outcome = 'Failed.'
    if(success) {
        outcome = 'Successful!'
    }

    await cmd.reply({
        content: msg + ' ' + outcome,
        ephemeral: true
    })
}

async function addSound(role, sound) {
    // TODO: Add to database
}

async function removeSound(role) {
    // TODO: Remove from database
}

async function updateSound(role, sound) {
    // TODO: Update database
}

export async function cmdHandler(cmd) {
    if(cmd.commandName === 'sound') {
        notifyProcessing(cmd)

        const role = cmd.options.getRole('role')

        if(cmd.options.getSubcommand() === 'remove') {
            removeSound(role)
        } else {
            const sound = cmd.options.getAttachment('soundfile')

            if (cmd.options.getSubcommand() === 'add') {
                addSound(role, sound)
            } else if (cmd.options.getSubcommand() === 'update') {
                updateSound(role, sound)
            }
        }

        notifyCompletion(cmd);

    } else if(cmd.commandName === 'add') {
        const role = cmd.options.getRole('role')
        const sound = cmd.options.getAttachment('soundfile')

        addSound(role, sound);
    } else if(cmd.commandName === 'remove') {
        const role = cmd.options.getRole('role')

        removeSound(role)
    } else if(cmd.commandName === 'update') {
        const role = cmd.options.getRole('role')
        const sound = cmd.options.getAttachment('soundfile')

        updateSound(role, sound)

    } else if(cmd.commandName === 'override') {
        //TODO: Whatever I need to implement
    }
}