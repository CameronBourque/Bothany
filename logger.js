export async function logRoleIdentified(member, role) {
    console.log(member.member.user.username + ' has the role "' + role + '". Joining their channel!');
}