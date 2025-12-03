import { openDB } from 'idb';

const DB_NAME = 'PDFDatabase';
const STORE_NAME = 'pdfs';
const DB_VERSION = 1;

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function savePDF(name : string, file : Blob) {
  const db = await getDB();
  await db.put(STORE_NAME, file, name);
}

export async function getPDF(name : string) {
  const db = await getDB();
  const file = await db.get(STORE_NAME, name);
  if (!file) return null;
  return URL.createObjectURL(file);
}

// export async function getAllPDFNames() {
//   const db = await getDB();
//   return db.getAllKeys(STORE_NAME);
// }
