export async function saveJSONFile(content: string) {
    return saveFile(content, "example.json", [
        {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
        },
    ]);
}

export async function saveTextFile(content: string) {
    return saveFile(content, "example.txt", [
        {
            description: "Text Files",
            accept: { "text/plain": [".txt"] },
        },
    ]);
}

export async function saveFile(
    content: string,
    suggestedName: string,
    acceptTypes: FilePickerAcceptType[] = [
        {
            description: "Text Files",
            accept: { "text/plain": [".txt"] },
        },
    ]
): Promise<void> {
    console.log("acceptTypes " + JSON.stringify(acceptTypes));

    try {
        // Show the save file picker
        const handle: FileSystemFileHandle = await window.showSaveFilePicker({
            suggestedName: suggestedName,
            types: acceptTypes,
        });

        // Create a writable stream to the file
        const writable: FileSystemWritableFileStream =
            await handle.createWritable();

        // Write content
        await writable.write(content);

        // Save and close the file
        await writable.close();

        console.log("File saved!");
    } catch (err) {
        if ((err as DOMException).name !== "AbortError") {
            console.error("Error saving file:", err);
        }
    }
}

export async function openJSONFile() {
    const jsonRaw = await openFile([
        {
            description: "JSON Files",
            accept: { "application/json": [".json"] },
        },
    ]);

    if (jsonRaw) {
        const json = JSON.parse(jsonRaw);
        console.log("Parsed JSON:", json);

        return json;
    }
    return undefined;
}

export async function openTextFile() {
    const text = await openFile([
        {
            description: "Text Files",
            accept: { "text/plain": [".txt"] },
        },
    ]);

    console.log("Text content:", text);

    return text;
}

async function openFile(
    acceptTypes: FilePickerAcceptType[] = [
        {
            description: "Text Files",
            accept: { "text/plain": [".txt"] },
        },
    ]
): Promise<string | undefined> {
    try {
        const [handle]: FileSystemFileHandle[] =
            await window.showOpenFilePicker({
                types: acceptTypes,
                multiple: false,
            });

        const file: File = await handle.getFile();
        const contents: string = await file.text();
        return contents;
    } catch (err) {
        if ((err as DOMException).name !== "AbortError") {
            console.error("Error opening file:", err);
        }
        return undefined;
    }
}
