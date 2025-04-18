export async function saveFile(content: string): Promise<void> {
    try {
        // Show the save file picker
        const handle: FileSystemFileHandle = await window.showSaveFilePicker({
            suggestedName: "example.txt",
            types: [
                {
                    description: "Text Files",
                    accept: {
                        "text/plain": [".txt"],
                    },
                },
            ],
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

export async function openFile(): Promise<string | undefined> {
    try {
        // Show the file picker dialog
        const [handle]: FileSystemFileHandle[] =
            await window.showOpenFilePicker({
                types: [
                    {
                        description: "Text Files",
                        accept: {
                            "text/plain": [".txt"],
                        },
                    },
                ],
                multiple: false,
            });

        // Get the file from the handle
        const file: File = await handle.getFile();

        // Read the contents as text
        const contents: string = await file.text();

        console.log("File contents:", contents);

        return contents;
    } catch (err) {
        if ((err as DOMException).name !== "AbortError") {
            console.error("Error opening file:", err);
            return undefined;
        }
    }
}
