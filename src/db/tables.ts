import { HeaderInfo, Resume } from "../App";
import { DB } from "./index";
import { ResumeConfigRow } from "./types";

const RESUME_CONFIG_TABLE = "resume_config";

export const ResumeConfigTable = {
    insert: ({ id, name, created_at, updated_at }: ResumeConfigRow) => {
        DB.runAndSave(
            `INSERT INTO ${RESUME_CONFIG_TABLE} (id, name, created_at, updated_at) VALUES (?, ?, ?, ?)`,
            [id, name, created_at, updated_at]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    updateHeader: (headerInfo: HeaderInfo) => {
        DB.update(RESUME_CONFIG_TABLE, 1, headerInfo);
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    getResumeConfig: (id: number) => {
        const resRow = DB.exec(
            `SELECT * FROM ${RESUME_CONFIG_TABLE} WHERE id = ?`,
            [id]
        )[0]?.values?.[0];

        if (!resRow) return null;

        console.log(RESUME_CONFIG_TABLE + " " + JSON.stringify(resRow));

        const resume: ResumeConfigRow = {
            id: resRow[0],
            name: resRow[1],
            created_at: resRow[2],
            updated_at: resRow[3],
        };

        return resume;
    },
    subscribe: (cb: () => void) => DB.subscribe(RESUME_CONFIG_TABLE, cb),
    // deleteById: (id) => {
    //     DB.runAndSave("DELETE FROM users WHERE id = ?", [id]);
    // },
};
