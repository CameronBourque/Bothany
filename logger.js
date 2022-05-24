export function logRoleIdentified(member, role) {
    console.log(member.member.user.username + ' has the role "' + role + '". Joining their channel!');
}

// These were made for code consistency's sake
export function logDebug(msg) {
    console.log(msg);
}

export function logError(error) {
    console.error('ERROR: ' + error, error.stack);
}