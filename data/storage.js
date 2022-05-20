import { getStorage, uploadBytes, ref, getDownloadURL, getStream, updateMetadata, listAll, getMetadata, deleteObject } from "firebase/storage";
import {logDebug, logError} from "../logger";

const storage = getStorage();

async function createDir(gID) {

}

export async function deleteDir(gID) {
    // Just empty files out, can't actually delete the directory from here
    listAll(ref(storage, gID.toString())).then((res) => {
        res.items.forEach((file) => {
            deleteObject(file)
        })
    }).catch((err) => {
        logError(err)
        return false
    })

    return true
}

async function dirExists(gID) {
    listAll(ref(storage)).then((res) => {
        res.prefixes.forEach((dir) => {
            if(dir.name === gID.toString()) {
                return true
            }
        })
    }).catch((err) => {
        logError(err)
    })

    return false
}

async function filesRemain(gID) {
    listAll(ref(storage, gID.toString())).then((res) => {
        return res.items.length > 0
    }).catch((err) => {
        logError(err)
    })

    return false
}

async function findFile(gID, role) {
    listAll(ref(storage, gID.toString())).then((res) => {
        res.items.forEach((file) => {
            getMetadata(file).then((metadata) => {
                if(metadata.customMetadata.role === role) {
                    return file
                }
            })
        })
    }).catch((err) => {
        logError(err)
    })

    return null
}

export async function uploadFile(gID, file, role) {
    if(!await dirExists(gID)) {
        await createDir(gID)
    }

    const metadata = {
        customMetadata: {
            'role': role
        }
    }

    // TODO: Replace with background task to notify once upload complete
    uploadBytes(ref(storage, gID.toString()), file, metadata).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
            logDebug(file.toString() + ' successfully uploaded: ' + url)
            return url
        })
    }).catch((err) => {
        logError(file.toString() + ' failed to upload: ' + err)
        return ''
    })
}

export async function updateFileRole(gID, oldRole, newRole) {
    let file = await findFile(gID, oldRole)

    const newMetadata = {
        customMetadata: {
            role: newRole
        }
    }

    updateMetadata(file, newMetadata).then((metadata) => {
        return metadata.customMetadata.role === newRole
    }).catch((err) => {
        logError(err)
        return false
    })
}

export async function downloadFile(gID, role) {
    let file = await findFile(gID, role)
    if(file) {
        return getStream(file)
    }
    return null
}

export async function deleteFile(gID, role) {

}