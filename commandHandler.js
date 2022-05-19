// Let the user know that their command is being processed
export async function notifyProcessing(cmd) {
    await cmd.deferReply();
}

// Tell the user the outcome of their command
export async function notifyCompletion(cmd, msg, success, ephemeral = false) {
    let outcome = 'Failed to '
    if(success) {
        outcome = 'Successfully '
    }

    await cmd.reply({
        content: outcome + msg,
        ephemeral: ephemeral
    })
}
