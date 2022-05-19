import firebaseApp from "../firebase";
import {collection, getDocs, getDoc, getFirestore, query, where, setDoc, doc, deleteDoc} from "firebase/firestore";
import {logDebug, logError} from "../logger";

const db = getFirestore(firebaseApp);

// Check if the guild exists in the database
export async function guildExists(gID) {
    const q  = query(collection(db, "guilds"), where("gID", "==", parseInt(gID)))
    const snap = await getDocs(q)
    return snap.docs.length > 0;
}

// Create the guild in the database
export async function createGuild(gID, gName = '', limit=5) {
    try {
        await setDoc(doc(db, "guilds", gID), {
            gName: gName,
            sound_list: [],
            welcome_msg: "",
            sounds_limit: limit
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
        // TODO: Find all sounds associated and delete them

        await deleteDoc(doc(db, "guilds", gID))
        return true
    } catch (err) {
        logError(err)
    }
    return false
}

async function reachedLimit(gID) {
    // TODO: Check database
    const snap = await getDoc(doc(db, 'guilds', gID))
    if(!snap.exists()) {
        logError('Document doesn\'t exist for ' + gID)
        return true
    }

    logDebug(snap.data().toString())
    // TODO: Replace with comparison on sound array with sound limit
    return true
}

export async function getSound(gID, roles) {
    // TODO: Get from database

    return null
}

async function checkSound(gID, role) {
    // TODO: Check database

    return false
}

async function addSound(gID, role, sound) {
    if(!await reachedLimit(gID)) {
        // TODO: Add to database

    }
    return false
}

async function updateSound(gID, role, sound) {
    // TODO: Update in database

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
    // TODO: Delete from database

    return false
}

export async function getWelcomeMsg(gID) {
    // TODO: Get from database

    return ''
}

export async function setWelcomeMsg(gID) {
    // TODO: Update database

    return false
}

export async function removeWelcomeMsg(gID) {
    // TODO: Remove from database

    return false
}
