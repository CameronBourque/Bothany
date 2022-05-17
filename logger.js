export async function logRoleIdentified(member, role) {
    console.log(member.member.user.username + ' has the role "' + role + '". Joining their channel!');
}

// These were made for code consistency's sake
export async function logDebug(msg) {
    console.log(msg);
}

export async function logError(error) {
    console.error(error);
}