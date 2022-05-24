import firebaseApp from "../firebase.js";
import {collection, getDocs, getDoc, getFirestore, query, where, setDoc, doc, deleteDoc, updateDoc, arrayUnion,
    arrayRemove} from "firebase/firestore";
import {logDebug, logError} from "../logger.js";
import {deleteDir, deleteFile, downloadFile, uploadFile} from "./storage.js";

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

async function reachedLimit(gID) {
    try {
        const snap = await getDoc(doc(db, 'guilds', gID))
        if (!snap.exists()) {
            logError('Document doesn\'t exist for ' + gID)
            return true
        }

        return snap.data().soundLimit > snap.data().roles.size()
    } catch (err) {
        logError(err)
    }

    return true
}

export async function getSound(gID, roles) {
    try {
        if (roles) {
            let guildRoles = (await getDoc(doc(db, 'guilds', gID))).data().roles
            roles.cache.forEach((role) => {
                if (guildRoles.includes(role.name)) {
                    return downloadFile(gID, role.name)
                }
            })
        }
    } catch (err) {
        logError(err)
    }

    return null
}

export async function checkSound(gID, role) {
    try {
        let guildRoles = (await getDoc(doc(db, 'guilds', gID))).data().roles

        logDebug(guildRoles)
        return guildRoles.has(role)
    } catch (err) {
        logError(err)
    }

    return false
}

async function addSound(gID, role, sound) {
    try {
        if (!await reachedLimit(gID)) {
            const gDoc = doc(db, 'guilds', gID)

            await updateDoc(gDoc, {
                roles: arrayUnion(role)
            })
        }
        return await uploadFile(gID, sound, role)
    } catch(err) {
        logError(err)
    }

    return false
}

async function updateSound(gID, role, sound) {
    try {
        if (!await deleteFile(gID, role))
            return null
        return await uploadFile(gID, sound, role)
    } catch (err) {
        logError(err)
    }

    return false
}

export async function setSound(gID, role, sound) {
    if(await checkSound(gID, role)) {
        return await updateSound(gID, role, sound)
    } else {
        return await addSound(gID, role, sound)
    }
}

export async function removeSound(gID, role) {
    try {
        const gDoc = doc(db, 'guilds', gID)

        await updateDoc(gDoc, {
            roles: arrayRemove(role)
        })

        return await deleteFile(gID, role)
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

export async function togglePoggerKick(gID, value) {
    // TODO: toggle it based on the bool value
}
