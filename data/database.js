import firebaseApp from "../firebase.js";
import {collection, getDocs, getDoc, getFirestore, query, where, setDoc, doc, deleteDoc, updateDoc, arrayUnion,
    arrayRemove, deleteField} from "firebase/firestore";
import {logDebug, logError} from "../logger.js";

const db = getFirestore(firebaseApp);

// Check if the guild exists in the database
export async function guildExists(gID) {
    try {
        const q = query(collection(db, "guilds"), where("gID", "==", parseInt(gID)))
        const snap = await getDocs(q)
        return snap.docs.length > 0;
    } catch (err) {
        logError(err)
    }

    return false
}

// Create the guild in the database
export async function createGuild(gID, gName = '', limit=5) {
    try {
        await setDoc(doc(db, "guilds", gID), {
            gName: gName,
            roles: [],
            welcomeMsg: "",
            soundsLimit: limit,
            poggersKick: false,
        })
        logDebug("Created document for guild " + gID + " with a sound limit of " + limit)
        return true
    } catch(err) {
        logError(err)
    }
    return false
}

export async function removeGuild(gID) {
    try {
        await deleteDir(gID)

        await deleteDoc(doc(db, "guilds", gID))
        return true
    } catch (err) {
        logError(err)
    }
    return false
}

export async function getSound(gID, roles) {
    let result = null
    try {
        if (roles) {
            let guildRoles = (await getDoc(doc(db, 'guilds', gID))).data().roles

            roles.forEach((role) => {
                if (guildRoles[role.name]) {
                    result = guildRoles[role.name]
                }
            })
        }
    } catch (err) {
        logError(err)
    }

    return result
}

export async function checkSound(gID, role) {
    try {
        let guildRoles = (await getDoc(doc(db, 'guilds', gID))).data().roles

        return guildRoles[role]
    } catch (err) {
        logError(err)
    }

    return false
}

export async function setSound(gID, role, sound) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            [`roles.${role}`]: sound.url
        })

        return true
    } catch (err) {
        logError(err)
    }

    return false
}

export async function removeSound(gID, role) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        if(await checkSound(gID, role)) {
            await updateDoc(gDoc, {
                [`roles.${role}`]: deleteField()
            })
        }

        return true
    } catch (err) {
        logError(err)
    }

    return false
}

export async function updateRole(gID, oldRole, newRole) {
    try {
        const gDoc = doc(db, 'guilds', gID)
        if(await checkSound(gID, oldRole)) {
            let guildRoles = (await getDoc(gDoc)).data().roles

            await updateDoc(gDoc, {
                [`roles.${oldRole}`]: deleteField(),
                [`roles.${newRole}`]: guildRoles[oldRole]
            })
        }

        return true
    } catch (err) {
        logError(err)
    }

    return false
}

export async function getWelcomeMsg(gID) {
    try {
        return (await getDoc(doc(db, 'guilds', gID))).data().welcomeMsg
    } catch (err) {
        logError(err)
    }

    return ''
}

export async function setWelcomeMsg(gID, msg) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            welcomeMsg: msg
        })

        return (await getDoc(doc(db, 'guilds', gID))).data().welcomeMsg === msg
    } catch(err) {
        logError(err)
    }

    return false
}

export async function removeWelcomeMsg(gID) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            welcomeMsg: ""
        })

        return !(await getDoc(doc(db, 'guilds', gID))).data().welcomeMsg
    } catch (err) {
        logError(err)
    }

    return false
}

export async function isKickable(gID, message) {
    let out = ''

    try {
        const words = (await getDoc(doc(db, 'guilds', gID))).data().kickableWords
        words.forEach((word) => {
            if(message.toLowerCase().indexOf(word.toLowerCase()) !== -1) {
                out = word
            }
        })
    } catch (err) {
        logError(err)
    }

    return out
}

export async function addKickWord(gID, word) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            kickableWords: arrayUnion(word)
        })
    } catch (err) {
        logError(err)
    }

    return false
}

export async function removeKickWord(gID, word) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            kickableWords: arrayRemove(word)
        })
    } catch (err) {
        logError(err)
    }

    return false
}
