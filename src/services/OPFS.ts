async function getOPFSRoot() {
    if (!("storage" in navigator && "getDirectory" in navigator.storage)) {
        alert("OPFS is not supported in this browser.");
        throw new Error("OPFS not supported");
    }
    return await navigator.storage.getDirectory();
}

export async function saveToFile(content: any) {
    try {
        const root = await getOPFSRoot();
        const handle = await root.getFileHandle(`database.sqlite`, {
            create: true,
        });
        const writable = await handle.createWritable();
        await writable.write(content);
        await writable.close();
        console.log(`database saved.`);
    } catch (err) {
        console.error(err);
    }
}

export async function loadFile() {
    try {
        const root = await getOPFSRoot();
        const handle = await root.getFileHandle(`database.sqlite`);
        const file = await handle.getFile();
        const content = await file.text();
        console.log("loaded content " + content);
        return content;
    } catch (err) {
        console.error(err);
    }
}
