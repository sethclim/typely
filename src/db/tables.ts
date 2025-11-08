import { HeaderInfo } from "../App";
import { DB } from "./index";
import { DataItemRow, DataItemTypeRow, ResumeConfigRow, ResumeSectionConfigRow, ResumeSectionDataRow } from "./types";

const RESUME_CONFIG_TABLE = "resume_config";
const RESUME_SECTION_CONFIG_TABLE = "resume_section_config";
const RESUME_SECTION_DATA_TABLE = "resume_section_data";
const RESUME_DATA_ITEM_TABLE = "resume_section_data";
const RESUME_DATA_ITEM_TYPE_TABLE = "data_item_type";

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
};

export const ResumeSectionConfigTable = {
    insert: ({
        id,
        resume_id,
        section_type,
        template_id,
        section_order,
    }: ResumeSectionConfigRow) => {
        DB.runAndSave(
            `INSERT INTO ${RESUME_SECTION_CONFIG_TABLE} (id, resume_id, section_type, template_id, section_order) VALUES (?, ?, ?, ?, ?)`,
            [id, resume_id, section_type, template_id, section_order]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const ResumeSectionDataTable = {
    insert: ({
        section_id,
        data_item_id,
    }: ResumeSectionDataRow) => {
        DB.runAndSave(
            `INSERT INTO ${RESUME_SECTION_DATA_TABLE} (section_id, data_item_id) VALUES (?, ?)`,
            [section_id, data_item_id]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const ResumeDataItemTable = {
    insert: ({
        title,
        description,
        data,
        type_id
    }: DataItemRow) => {
       DB.runAndSave(
            `INSERT INTO ${RESUME_DATA_ITEM_TABLE} (type_id, title, description, data) VALUES (?, ?, ?, ?)`,
            [type_id, title, description, JSON.stringify(data)]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const ResumeDataItemTypeTable = {
    insert: ({
        id,
        name,
    }: DataItemTypeRow) => {
       DB.runAndSave(
        `INSERT INTO ${RESUME_DATA_ITEM_TYPE_TABLE} (id, name) VALUES (?, ?)`,
        [id, name]
    );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};
