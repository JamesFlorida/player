// Simple IndexedDB wrapper for user playlists
const DB_NAME = "stockyardAppDB";
const STORE_NAME = "userPlaylists";
const DB_VERSION = 1;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export async function savePlaylist(id, data) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({ id, data });
    return tx.complete;
}

export async function loadPlaylist(id) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    return tx.objectStore(STORE_NAME).get(id);
}

export async function loadAllPlaylists() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    return tx.objectStore(STORE_NAME).getAll();
}

export async function deletePlaylist(id) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(id);
    return tx.complete;
}
