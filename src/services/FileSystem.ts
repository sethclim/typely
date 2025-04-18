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
