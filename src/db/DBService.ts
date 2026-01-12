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
