import { HeaderInfo } from "../App";
import { DB } from "./index";
import { DataItemRow, DataItemTypeRow, ResumeConfigRow, ResumeSectionConfigRow, ResumeSectionDataRow } from "./types";

const RESUME_CONFIG_TABLE = "resume_config";
const RESUME_SECTION_CONFIG_TABLE = "resume_section_config";
const RESUME_SECTION_DATA_TABLE = "resume_section_data";
const RESUME_DATA_ITEM_TABLE = "resume_data_item";
const RESUME_DATA_ITEM_TYPE_TABLE = "resume_data_item_type";

export function getFullResumeQuery(resumeIdParam = "?"): string {
  return `
    SELECT rc.id,
           rc.name,
           COALESCE(
             json_group_array(
               json_object(
                 'id', rs.id,
                 'sectionType', rs.section_type,
                 'order', rs.section_order,
                 'items',
                   COALESCE(
                     (
                       SELECT json_group_array(
                         json_object(
                           'id', di.id,
                           'type', json_object('id', dit.id, 'name', dit.name),
                           'title', di.title,
                           'description', di.description,
                           'data', json(di.data),
                           'created_at', di.created_at,
                           'updated_at', di.updated_at
                         )
                       )
                       FROM ${RESUME_SECTION_DATA_TABLE} rsd
                       JOIN ${RESUME_DATA_ITEM_TABLE} di ON di.id = rsd.data_item_id
                       LEFT JOIN ${RESUME_DATA_ITEM_TYPE_TABLE} dit ON dit.id = di.type_id
                       WHERE rsd.section_id = rs.id
                     ),
                     json('[]')
                   )
               )
             ),
             json('[]')
           ) AS sections
    FROM ${RESUME_CONFIG_TABLE} rc
    LEFT JOIN ${RESUME_SECTION_CONFIG_TABLE} rs ON rs.resume_id = rc.id
    WHERE rc.id = ${resumeIdParam}
    GROUP BY rc.id;
  `.trim();
}


//LEFT JOIN ${TEMPLATE_TABLE} t ON t.id = rs.template_id

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
        const row = DB.exec(getFullResumeQuery(), [id]);

        console.log("RESUME!! " + JSON.stringify(row));
        // const resRow = DB.exec(
        //     `SELECT * FROM ${RESUME_CONFIG_TABLE} WHERE id = ?`,
        //     [id]
        // )[0]?.values?.[0];

        // if (!resRow) return null;x

        // console.log(RESUME_CONFIG_TABLE + " " + JSON.stringify(resRow));

        // const resume: ResumeConfigRow = {
        //     id: resRow[0],
        //     name: resRow[1],
        //     created_at: resRow[2],
        //     updated_at: resRow[3],
        // };

        return row;
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
