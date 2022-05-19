import firebaseApp from "./firebase";
import {collection, getDocs, getFirestore, query, where, addDoc} from "firebase/firestore";
import {logDebug, logError} from "./logger";

const db = getFirestore(firebaseApp);

// Check if the guild exists in the database
export async function guildExists(gID) {
    const q  = query(collection(db, "guilds"), where("gID", "==", parseInt(gID)))
    const snap = await getDocs(q)
    return snap.docs.length > 0;
}

// Create the guild in the database
export async function createGuild(gID, gName, limit=5) {
    try {
        const decRef = await addDoc(collection(db, "guilds"), {
            gID: gID,
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

export async function reachedLimit(gID) {
    // TODO: Check database

    return false
}

export async function getSound(gID, role) {
    // TODO: Get from database

    return null
}

export async function checkSound(gID, role) {
    // TODO: Check database

    return false
}

export async function addSound(gID, role, sound) {
    // TODO: Add to database

    return false
}

export async function updateSound(gID, role, sound) {
    // TODO: Update in database

    return false
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
