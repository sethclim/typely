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

function mapRows<T = any>(columns: string[], values: any[][]): T[] {
    return values.map((row) => {
        const obj: any = {};
        columns.forEach((col, i) => {
            obj[col] = row[i];
        });
        return obj as T;
    });
}

export function getFullResumeQuery(resumeIdParam = "?"): string {
    return `
    SELECT rc.id,
           rc.uuid,
           rc.name,
           COALESCE(
             json_group_array(
               json_object(
                 'id', rs.id,
                 'title', rs.title,
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
    insert: ({ uuid, name, created_at, updated_at }: ResumeConfigRow) => {
        DB.runAndSave(
            `INSERT INTO ${RESUME_CONFIG_TABLE} (uuid, name, created_at, updated_at) VALUES (?, ?, ?, ?)`,
            [uuid, name, created_at, updated_at]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    getResumeConfig: (id: number) => {
        const row = DB.exec(getFullResumeQuery(), [id]);

        console.log("RESUME!! " + JSON.stringify(row));

        return row;
    },
    getAllResumeConfig: () => {
        const res = DB.exec(`SELECT * FROM ${RESUME_CONFIG_TABLE}`);
        // console.log(`[${RESUME_CONFIG_TABLE}] ${JSON.stringify(res)}`);
        if (res.length === 0) return [];
        const rows = mapRows<ResumeConfigRow>(res[0].columns, res[0].values);
        // console.log("getAllResumeConfig rows!! " + JSON.stringify(rows));
        return rows;
    },
    update: ({ id, name, updated_at }: ResumeConfigRow) => {
        DB.runAndSave(
            `UPDATE ${RESUME_CONFIG_TABLE} SET name = ?, updated_at = ? WHERE id = ?`,
            [name, updated_at, id]
        );
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    delete: (id: number) => {
        DB.runAndSave(`DELETE FROM ${RESUME_CONFIG_TABLE}  WHERE id = ?`, [id]);
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    subscribe: (cb: () => void) => DB.subscribe(RESUME_CONFIG_TABLE, cb),
};

export const ResumeSectionConfigTable = {
    insert: ({
        id,
        resume_id,
        title,
        section_type,
        template_id,
        section_order,
    }: ResumeSectionConfigRow) => {
        if (id === undefined) {
            DB.runAndSave(
                `INSERT INTO ${RESUME_SECTION_CONFIG_TABLE} (resume_id, title, section_type, template_id, section_order) VALUES (?, ?, ?, ?, ?)`,
                [resume_id, title, section_type, template_id, section_order]
            );
        } else {
            DB.runAndSave(
                `INSERT INTO ${RESUME_SECTION_CONFIG_TABLE} (id, resume_id, title, section_type, template_id, section_order) VALUES (?, ?, ?, ?, ?, ?)`,
                [id, resume_id, title, section_type, template_id, section_order]
            );
        }

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    updateTemplate: (id: string, template_id: string) => {
        // console.log(
        //     `[ResumeSectionConfigTable] id: ${id} template_id: ${template_id}`
        // );
        DB.runAndSave(
            `UPDATE ${RESUME_SECTION_CONFIG_TABLE} SET template_id = ? WHERE id = ?`,
            [template_id, id]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    updateOrder: (id: string, newOrder: number) => {
        // console.log(`id ${id} newOrder ${newOrder}`);
        DB.runAndSave(
            `UPDATE ${RESUME_SECTION_CONFIG_TABLE} SET section_order = ? WHERE id = ?`,
            [newOrder, id]
        );
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    delete: (id: number) => {
        DB.runAndSave(
            `DELETE FROM ${RESUME_SECTION_CONFIG_TABLE}  WHERE id = ?`,
            [id]
        );
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const ResumeSectionDataTable = {
    insert: ({ section_id, data_item_id }: ResumeSectionDataRow) => {
        // console.log(
        //     `[ResumeSectionConfigTable] section_id: ${section_id} data_item_id: ${data_item_id}`
        // );
        DB.runAndSave(
            `INSERT INTO ${RESUME_SECTION_DATA_TABLE} (section_id, data_item_id) VALUES (?, ?)`,
            [section_id, data_item_id]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    delete: ({ section_id, data_item_id }: ResumeSectionDataRow) => {
        DB.runAndSave(
            `DELETE FROM ${RESUME_SECTION_DATA_TABLE} WHERE section_id = ? AND data_item_id = ?`,
            [section_id, data_item_id]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const ResumeDataItemTable = {
    insert: ({ id, title, description, data, type_id }: DataItemRow) => {
        if (id !== undefined) {
            // console.log(`ResumeDataItemTable insert with id ${id}`);
            DB.runAndSave(
                `INSERT INTO ${RESUME_DATA_ITEM_TABLE} (id, type_id, title, description, data) VALUES (?, ?, ?, ?, ?)`,
                [id, type_id, title, description, data]
            );
        } else {
            DB.runAndSave(
                `INSERT INTO ${RESUME_DATA_ITEM_TABLE} (type_id, title, description, data) VALUES (?, ?, ?, ?)`,
                [type_id, title, description, data]
            );
        }
        DB.notifyTable(RESUME_DATA_ITEM_TABLE);
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    getAll: () => {
        const res = DB.exec(`SELECT * FROM ${RESUME_DATA_ITEM_TABLE}`);
        // console.log(`[${RESUME_DATA_ITEM_TABLE}] ${JSON.stringify(res)}`);
        if (res.length === 0) return [];
        const rows = mapRows<DataItemRow>(res[0].columns, res[0].values);
        // console.log("rows!! " + JSON.stringify(rows));
        return rows;
    },
    update: ({
        id,
        title,
        description,
        data,
        type_id,
        updated_at,
    }: DataItemRow) => {
        DB.runAndSave(
            `UPDATE ${RESUME_DATA_ITEM_TABLE} SET type_id = ?, title = ?, description = ?, data = ?, updated_at = ? WHERE id = ?`,
            [type_id, title, description, data, updated_at, id]
        );
        DB.notifyTable(RESUME_DATA_ITEM_TABLE);
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    delete: (id: number) => {
        DB.runAndSave(`DELETE FROM ${RESUME_DATA_ITEM_TABLE}  WHERE id = ?`, [
            id,
        ]);
        DB.notifyTable(RESUME_DATA_ITEM_TABLE);
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    subscribe: (cb: () => void) => DB.subscribe(RESUME_DATA_ITEM_TABLE, cb),
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
    insert: ({ name, section_type, content, description }: TemplateRow) => {
        DB.runAndSave(
            `INSERT INTO ${RESUME_TEMPLATE_TABLE} (name, section_type, content, description) VALUES (?, ?, ?, ?)`,
            [name, section_type, content, description]
        );

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    getAll: () => {
        const res = DB.exec(`SELECT * FROM ${RESUME_TEMPLATE_TABLE}`);
        const rows = mapRows<TemplateRow>(res[0].columns, res[0].values);
        // console.log("template rows!! " + JSON.stringify(rows));
        return rows;
    },
    update: (id: number, content: string) => {
        // console.log(`[RESUME_CONFIG_TABLE] id: ${id}`);
        DB.runAndSave(
            `UPDATE ${RESUME_TEMPLATE_TABLE} SET content = ? WHERE id = ?`,
            [content, id]
        );

        DB.notifyTable(RESUME_TEMPLATE_TABLE);
    },
};
