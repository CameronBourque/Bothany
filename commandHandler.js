// Let the user know that their command is being processed
export async function notifyProcessing(cmd) {
    await cmd.deferReply();
}

// Tell the user the outcome of their command
export async function notifyCompletion(cmd, msg, success, ephemeral = false) {
    let outcome = 'Unsuccessfully '
    if(success) {
        outcome = 'Successfully '
    }

    await cmd.editReply({
        content: outcome + msg,
        ephemeral: ephemeral
    })
}
