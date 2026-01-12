import initSqlJs from "sql.js";
import { InsertAllTemplates } from "../helpers/InsertAllTemplates";
import { SQLiteAutoBackupService } from "./backupService";
import { drizzle, SQLJsDatabase } from "drizzle-orm/sql-js";
import { migrate } from "./migrator";

type Listener = () => void;

export class DBService {
    storageKey: string;
    _rawDB: any;
    db: SQLJsDatabase<Record<string, never>> | null;
    SQL: any;
    ready: any;
    tablesReady: Promise<void>;

    private tableListeners: Record<string, Listener[]> = {};

    constructor(storageKey = "myDb") {
        this.storageKey = storageKey;
        this._rawDB = null;
        this.db = null;
        this.SQL = null;
        this.ready = this.init();
        this.tableListeners = {};
        this.tablesReady = this.ready.then(() => this.initTables());
    }

    async init() {
        this.SQL = await initSqlJs({
            locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });

        console.log("INIT DATA SERVICE ");

        const savedData = localStorage.getItem(this.storageKey);
        this._rawDB = savedData
            ? new this.SQL.Database(new Uint8Array(JSON.parse(savedData)))
            : new this.SQL.Database();

        console.log("this._rawDB " + this._rawDB);

        const autoBackup = new SQLiteAutoBackupService(this._rawDB);
        autoBackup.start(120_000);

        this.db = drizzle(this._rawDB);
        return this.db;
    }

    restoreDB = (data: Uint8Array) => {
        this.db = new this.SQL.Database(data);
    };

    private async initTables() {
        console.log("INIT TABLES");

        if (!this.db) throw Error("MISSING DB");
        console.log("migrating");
        await migrate(this.db);

        this.save();
        // this.runAndSave(`PRAGMA foreign_keys = ON;`);

        // this.runAndSave(`
        //         CREATE TABLE IF NOT EXISTS themes   (
        //             id INTEGER PRIMARY KEY AUTOINCREMENT,
        //             name TEXT,
        //             description TEXT,
        //             sty_source TEXT,
        //             is_system BOOLEAN,
        //             owner_user_id TEXT NULL,
        //             created_at TEXT DEFAULT (datetime('now'))
        //         )
        //     `);

        // this.runAndSave(`
        //     CREATE TABLE IF NOT EXISTS resume_config (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         theme_id INTEGER NOT NULL,
        //         uuid  TEXT UNIQUE NOT NULL,
        //         name TEXT NOT NULL,
        //         created_at TEXT DEFAULT (datetime('now')),
        //         updated_at TEXT DEFAULT (datetime('now')),
        //         FOREIGN KEY (theme_id) REFERENCES themes(id)
        //     )
        // `);
        // this.runAndSave(`
        //     CREATE TABLE IF NOT EXISTS resume_section_config (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         title TEXT NOT NULL,
        //         resume_id INTEGER NOT NULL,
        //         section_type TEXT NOT NULL,
        //         template_id INTEGER NOT NULL,
        //         section_order INTEGER DEFAULT 0,
        //         FOREIGN KEY (resume_id) REFERENCES resume_config(id) ON DELETE CASCADE,
        //         FOREIGN KEY (template_id) REFERENCES template(id)
        //     )
        // `);
        // this.runAndSave(`
        //     CREATE TABLE IF NOT EXISTS template (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         theme_id INTEGER NOT NULL,
        //         name TEXT NOT NULL,
        //         section_type TEXT NOT NULL,
        //         content TEXT NOT NULL,
        //         description TEXT,
        //         created_at TEXT DEFAULT (datetime('now')),
        //         FOREIGN KEY (theme_id) REFERENCES themes(id)
        //     )
        // `);
        // this.runAndSave(`
        //     CREATE TABLE IF NOT EXISTS resume_section_data (
        //         section_id INTEGER NOT NULL,
        //         data_item_id INTEGER NOT NULL,
        //         PRIMARY KEY (section_id, data_item_id),
        //         FOREIGN KEY (section_id) REFERENCES resume_section_config(id) ON DELETE CASCADE,
        //         FOREIGN KEY (data_item_id) REFERENCES resume_data_item(id) ON DELETE CASCADE
        //     )
        // `);
        // this.runAndSave(`
        //     CREATE TABLE IF NOT EXISTS resume_data_item (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         type_id INTEGER NOT NULL,
        //         title TEXT,
        //         description TEXT,
        //         data TEXT,
        //         created_at TEXT DEFAULT (datetime('now')),
        //         updated_at TEXT DEFAULT (datetime('now')),
        //           FOREIGN KEY (type_id) REFERENCES resume_data_item_type(id) ON DELETE CASCADE
        //     )
        // `);
        // this.runAndSave(`
        //     CREATE TABLE IF NOT EXISTS resume_data_item_type (
        //         id INTEGER PRIMARY KEY AUTOINCREMENT,
        //         name TEXT NOT NULL UNIQUE
        //     )
        // `);

        // this.runAndSave(`
        //     CREATE TRIGGER IF NOT EXISTS enforce_template_theme_match_insert
        //     BEFORE INSERT ON resume_section_config
        //     BEGIN
        //     SELECT
        //         CASE
        //         WHEN (
        //             SELECT t.theme_id FROM template t WHERE t.id = NEW.template_id
        //         ) != (
        //             SELECT r.theme_id FROM resume_config r WHERE r.id = NEW.resume_id
        //         )
        //         THEN RAISE(ABORT, 'Template theme does not match resume theme')
        //         END;
        //     END;
        // `);

        // this.runAndSave(`
        //     CREATE INDEX IF NOT EXISTS idx_template_theme ON template(theme_id);
        //     CREATE INDEX IF NOT EXISTS idx_resume_theme ON resume_config(theme_id);
        //     CREATE INDEX IF NOT EXISTS idx_section_resume ON resume_section_config(resume_id);
        //     CREATE INDEX IF NOT EXISTS idx_section_template ON resume_section_config(template_id);
        //     CREATE INDEX IF NOT EXISTS idx_data_type ON resume_data_item(type_id);
        // `);

        //FOR NOW
        InsertAllTemplates();
    }

    // run(sql: string, params: any = []) {
    //     this.db?.run(sql, params);
    // }

    // exec(sql: string, params: any = []) {
    //     return this.db?.exec(sql, params);
    // }

    save() {
        const data = this._rawDB?.export();
        localStorage.setItem(this.storageKey, JSON.stringify(Array.from(data)));
    }

    // runAndSave(sql: string, params: any = []) {
    //     this.run(sql, params);
    //     this.save();
    // }

    // insertAndGetId(
    //     table: string,
    //     columns: string,
    //     values: string,
    //     data: Array<any>
    // ): number {
    //     const stmt = this.db.prepare(`
    //         INSERT INTO ${table}
    //         ${columns}
    //         VALUES ${values}
    //         RETURNING id;
    //     `);

    //     stmt.bind(data);

    //     stmt.step();
    //     const row = stmt.getAsObject();
    //     stmt.free();

    //     const newId = row.id as number;
    //     return newId;
    // }

    /**
     * Dynamic update helper
     * table: string - table name
     * id: number|string - row id to update
     * fields: object - keys = columns to update, values = new values
     */
    // update(table: string, id: number, fields: any) {
    //     const keys = Object.keys(fields);
    //     if (keys.length === 0) return; // nothing to update

    //     const setClause = keys.map((k) => `${k} = ?`).join(", ");
    //     const values = keys.map((k) => fields[k]);

    //     // Append id for WHERE clause
    //     values.push(id);

    //     const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    //     this.runAndSave(sql, values);

    //     this.notifyTable(table);
    // }

    subscribe(table: string, cb: Listener) {
        if (!this.tableListeners[table]) this.tableListeners[table] = [];
        this.tableListeners[table].push(cb);
        return () => {
            this.tableListeners[table] = this.tableListeners[table].filter(
                (l) => l !== cb
            );
        };
    }

    notifyTable(table: string) {
        this.tableListeners[table]?.forEach((cb) => cb());
        // For simplicity, any child table change triggers 'resume'
        if (table !== "resume") {
            this.tableListeners["resume"]?.forEach((cb) => cb());
        }
    }
}
