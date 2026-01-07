import { saveToFile } from "../services/OPFS";

export class SQLiteAutoBackupService {
    private timer: number | null = null;
    private lastHash: string | null = null;

    constructor(private db: any) {}

    start(intervalMs = 60_000) {
        if (this.timer) return;

        this.timer = window.setInterval(() => this.backup(), intervalMs);
        window.addEventListener("beforeunload", () => this.backup());
    }

    stop() {
        if (this.timer) clearInterval(this.timer);
        this.timer = null;
    }

    private async backup() {
        try {
            const bytes = this.db.export();
            const hash = await this.hashBytes(bytes);

            if (hash === this.lastHash) return;
            this.lastHash = hash;

            await saveToFile(bytes);
            console.log("SQLite OPFS auto-backup complete");
        } catch (err) {
            console.error("Auto-backup failed", err);
        }
    }

    private async hashBytes(bytes: Uint8Array) {
        // Cast buffer to ArrayBuffer to satisfy TS
        const digest = await crypto.subtle.digest(
            "SHA-256",
            bytes.buffer as ArrayBuffer
        );

        return [...new Uint8Array(digest)]
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }
}
