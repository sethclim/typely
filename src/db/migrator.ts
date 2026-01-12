import { sql } from "drizzle-orm";
import type { SQLJsDatabase } from "drizzle-orm/sql-js";
import { migrations } from "./migrations";

const MIGRATIONS_TABLE = sql.identifier("__drizzle_migrations");

async function sha256(text: string) {
    const data = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return [...new Uint8Array(hashBuffer)]
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

type AppliedRow = {
    name: string;
    hash: string;
};

export async function migrate(db: SQLJsDatabase<any>) {
    const res = db.run(sql`
        CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            hash TEXT NOT NULL,
            created_at INTEGER NOT NULL
        );
    `);

    const applied = (await db.all(
        sql`SELECT name, hash FROM ${MIGRATIONS_TABLE};`
    )) as AppliedRow[];

    const appliedSet = new Set(applied.map((row) => row.hash));

    await db.transaction(async (tx) => {
        for (const migration of migrations) {
            const hash = await sha256(migration.sql);

            if (appliedSet.has(hash)) continue;

            const statements = migration.sql
                .split("--> statement-breakpoint")
                .map((s) => s.trim())
                .filter(Boolean);

            for (const stmt of statements) {
                await tx.run(stmt);
            }

            await tx.run(sql`
                INSERT INTO ${MIGRATIONS_TABLE} ("name", "hash", "created_at")
                VALUES (
                ${sql.raw(`'${migration.name}'`)},
                ${sql.raw(`'${hash}'`)},
                ${sql.raw(`${Date.now()}`)}
                );
            `);
        }
    });
}
