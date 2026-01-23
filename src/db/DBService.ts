import initSqlJs from "sql.js";
import { InsertAllTemplates } from "../helpers/InsertAllTemplates";
import { SQLiteAutoBackupService } from "./backupService";
import { drizzle, SQLJsDatabase } from "drizzle-orm/sql-js";
import { migrate } from "./migrator";
import { ThemeTable } from "./tables";

type Listener = () => void;

export class DBService {
    storageKey: string | null = null;
    _rawDB: any;
    db: SQLJsDatabase<Record<string, never>> | null;
    SQL: any;
    ready!: Promise<boolean>;
    tablesReady!: Promise<boolean>;

    private tableListeners: Record<string, Listener[]> = {};

    constructor() {
        this._rawDB = null;
        this.db = null;
        this.SQL = null;
        // this.ready = this.init();
        this.tableListeners = {};
        // this.tablesReady = this.ready.then(() => this.initTables());
    }

    async init(storageKey: string = "myDb") {
        console.log("INIT DB " + storageKey);
        this.storageKey = storageKey;
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
        this.ready = Promise.resolve(true);
        await this.initTables();
        this.tablesReady = Promise.resolve(true);

        return this.db;
    }

    changeDB = (storageKey: string) => {
        this.storageKey = storageKey;
    };

    restoreDB = (data: Uint8Array) => {
        this.db = new this.SQL.Database(data);
    };

    private async initTables() {
        console.log("INIT TABLES");

        if (!this.db) throw Error("MISSING DB");
        console.log("migrating");
        await migrate(this.db);

        this.save();

        const res = ThemeTable.getAll();
        if (res.length <= 0) await InsertAllTemplates();
    }

    save() {
        if (this.storageKey === null) return;
        const data = this._rawDB?.export();
        localStorage.setItem(this.storageKey, JSON.stringify(Array.from(data)));
    }

    subscribe(table: string, cb: Listener) {
        if (!this.tableListeners[table]) this.tableListeners[table] = [];
        this.tableListeners[table].push(cb);
        return () => {
            this.tableListeners[table] = this.tableListeners[table].filter(
                (l) => l !== cb,
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
