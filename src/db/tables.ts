// import { HeaderInfo } from "../App";
import { DB } from "./index";
import {
    DataItemRow,
    DataItemTypeRow,
    ResumeConfigRow,
    ResumeSectionConfigRow,
    ResumeSectionDataRow,
    TemplateRow,
} from "./types";

const RESUME_CONFIG_TABLE = "resume_config";
const RESUME_SECTION_CONFIG_TABLE = "resume_section_config";
const RESUME_SECTION_DATA_TABLE = "resume_section_data";
const RESUME_DATA_ITEM_TABLE = "resume_data_item";
const RESUME_DATA_ITEM_TYPE_TABLE = "resume_data_item_type";
const RESUME_TEMPLATE_TABLE = "template";

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
                 'template',
                   CASE 
                     WHEN t.id IS NOT NULL THEN json_object(
                       'id', t.id,
                       'name', t.name,
                       'sectionType', t.section_type,
                       'content', t.content,
                       'description', t.description,
                       'created_at', t.created_at
                     )
                     ELSE json(NULL)
                   END,
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
    LEFT JOIN ${RESUME_TEMPLATE_TABLE} t ON t.id = rs.template_id
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
    getResumeConfig: (id: number) => {
        const row = DB.exec(getFullResumeQuery(), [id]);

        // console.log("RESUME!! " + JSON.stringify(row));

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
    insert: ({ section_id, data_item_id }: ResumeSectionDataRow) => {
        DB.runAndSave(
            `INSERT INTO ${RESUME_SECTION_DATA_TABLE} (section_id, data_item_id) VALUES (?, ?)`,
            [section_id, data_item_id]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const ResumeDataItemTable = {
    insert: ({ title, description, data, type_id }: DataItemRow) => {
        DB.runAndSave(
            `INSERT INTO ${RESUME_DATA_ITEM_TABLE} (type_id, title, description, data) VALUES (?, ?, ?, ?)`,
            [type_id, title, description, JSON.stringify(data)]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const ResumeDataItemTypeTable = {
    insert: ({ id, name }: DataItemTypeRow) => {
        DB.runAndSave(
            `INSERT INTO ${RESUME_DATA_ITEM_TYPE_TABLE} (id, name) VALUES (?, ?)`,
            [id, name]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const TemplateTable = {
    insert: ({ id, name, section_type, content, description }: TemplateRow) => {
        DB.runAndSave(
            `INSERT INTO ${RESUME_TEMPLATE_TABLE} (id, name, section_type, content, description) VALUES (?, ?, ?, ?, ?)`,
            [id, name, section_type, content, description]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};
