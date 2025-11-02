import { HeaderInfo, Resume } from "../App";
import { DB } from "./index";

type InsertResume = {
    id: number;
    name: string;
};

export const ResumeTable = {
    insert: ({ id, name }: InsertResume) => {
        DB.runAndSave("INSERT INTO resume (id, name) VALUES (?, ?)", [
            id,
            name,
        ]);

        DB.notifyTable("resume");
    },
    findAll: () => {
        return DB.exec("SELECT * FROM resume");
    },
    updateHeader: (headerInfo: HeaderInfo) => {
        DB.update("resume", 1, headerInfo);
        DB.notifyTable("resume");
    },
    getResume: (id: number) => {
        const resRow = DB.exec("SELECT * FROM resume WHERE id = ?", [id])[0]
            ?.values?.[0];
        if (!resRow) return null;

        console.log("resume " + JSON.stringify(resRow));

        const resume: Resume = {
            name: resRow[1],
        };

        return resume;
    },
    subscribe: (cb: () => void) => DB.subscribe("resume", cb),
    // deleteById: (id) => {
    //     DB.runAndSave("DELETE FROM users WHERE id = ?", [id]);
    // },
};
