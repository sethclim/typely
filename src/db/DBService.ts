import initSqlJs from "sql.js";

// const WASM_URL =
//     "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm";

type Listener = () => void;

export class DBService {
    storageKey: string;
    db: any;
    SQL: any;
    ready: any;
    tablesReady: Promise<void>;

    private tableListeners: Record<string, Listener[]> = {};

    constructor(storageKey = "myDb") {
        this.storageKey = storageKey;
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

        const savedData = localStorage.getItem(this.storageKey);
        this.db = savedData
            ? new this.SQL.Database(new Uint8Array(JSON.parse(savedData)))
            : new this.SQL.Database();

        return this.db;
    }

    private async initTables() {
        this.runAndSave(`
            CREATE TABLE IF NOT EXISTS resume_config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now'))
            )
        `);
        this.runAndSave(`
            CREATE TABLE IF NOT EXISTS resume_section_config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                resume_id INTEGER NOT NULL,
                section_type TEXT NOT NULL,
                template_id INTEGER NOT NULL,
                section_order INTEGER DEFAULT 0,
                FOREIGN KEY (resume_id) REFERENCES resume_config(id) ON DELETE CASCADE,
                FOREIGN KEY (template_id) REFERENCES template(id)
            )
        `);
        this.runAndSave(`
            CREATE TABLE IF NOT EXISTS template (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                section_type TEXT NOT NULL,
                content TEXT NOT NULL,
                description TEXT,
                created_at TEXT DEFAULT (datetime('now'))
            )
        `);
        this.runAndSave(`
            CREATE TABLE IF NOT EXISTS resume_section_data (
                section_id INTEGER NOT NULL,
                data_item_id INTEGER NOT NULL,
                PRIMARY KEY (section_id, data_item_id),
                FOREIGN KEY (section_id) REFERENCES resume_section_config(id) ON DELETE CASCADE,
                FOREIGN KEY (data_item_id) REFERENCES data_item(id)
            )
        `);
        this.runAndSave(`
            CREATE TABLE IF NOT EXISTS resume_data_item (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type_id INTEGER NOT NULL,
                title TEXT,
                description TEXT,
                data TEXT, -- store JSON as TEXT
                created_at TEXT DEFAULT (datetime('now')),
                updated_at TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (type_id) REFERENCES data_item_type(id)
            )
        `);
        this.runAndSave(`
            CREATE TABLE IF NOT EXISTS resume_data_item_type (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL UNIQUE
            )
        `);
    }

    run(sql: string, params : any = []) {
        this.db.run(sql, params);
    }

    exec(sql: string, params: any = []) {
        return this.db.exec(sql, params);
    }

    save() {
        const data = this.db.export();
        localStorage.setItem(this.storageKey, JSON.stringify(Array.from(data)));
    }

    runAndSave(sql: string, params: any = []) {
        this.run(sql, params);
        this.save();
    }

    /**
     * Dynamic update helper
     * table: string - table name
     * id: number|string - row id to update
     * fields: object - keys = columns to update, values = new values
     */
    update(table: string, id: number, fields: any) {
        const keys = Object.keys(fields);
        if (keys.length === 0) return; // nothing to update

        const setClause = keys.map((k) => `${k} = ?`).join(", ");
        const values = keys.map((k) => fields[k]);

        // Append id for WHERE clause
        values.push(id);

        const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
        this.runAndSave(sql, values);

        this.notifyTable(table);
    }

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
