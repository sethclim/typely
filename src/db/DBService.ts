import initSqlJs from "sql.js";

// const WASM_URL =
//     "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm";

export class DBService {
    storageKey: string;
    db: any;
    SQL: any;
    ready: any;

    constructor(storageKey = "myDb") {
        this.storageKey = storageKey;
        this.db = null;
        this.SQL = null;
        this.ready = this.init();
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

    exec(sql: string, params = []) {
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
}
