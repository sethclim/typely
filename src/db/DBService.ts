import initSqlJs from "sql.js";

// const WASM_URL =
//     "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm";

type Listener = () => void;

export class DBService {
    storageKey: string;
    db: any;
    SQL: any;
    ready: any;

    private tableListeners: Record<string, Listener[]> = {};

    constructor(storageKey = "myDb") {
        this.storageKey = storageKey;
        this.db = null;
        this.SQL = null;
        this.ready = this.init();
        this.tableListeners = {};
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

    run(sql: string, params = []) {
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
