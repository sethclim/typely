import { openDB } from 'idb';

const DB_NAME = 'PDFDatabase';
const STORE_NAME = 'pdfs';
const DB_VERSION = 1;

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export async function savePDF(id : string, newHash : string, file : Blob) {
  const db = await getDB();

  await db.put(STORE_NAME, { id, hash: newHash, blob: file });
}

export async function getPDF(id : string) {
  const db = await getDB();
  const res = await db.get(STORE_NAME, id);
  if (!res) return null;
  return { hash: res.hash, url: URL.createObjectURL(res.blob) };
}

// export async function getAllPDFNames() {
//   const db = await getDB();
//   return db.getAllKeys(STORE_NAME);
// }
