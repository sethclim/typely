import { and, eq, SQL, sql } from "drizzle-orm";
import { DB } from "./index";
import {
    resumeConfig,
    resumeDataItem,
    resumeDataItemType,
    resumeSectionConfig,
    resumeSectionData,
    template,
    themes,
} from "./schema";

import {
    DataItemRow,
    DataItemTypeRow,
    ResumeConfigRow,
    ResumeSectionConfigRow,
    ResumeSectionDataRow,
    TemplateRow,
    ThemeDataRow,
} from "./types";

export const RESUME_CONFIG_TABLE = "resume_config";
const RESUME_SECTION_CONFIG_TABLE = "resume_section_config";
const RESUME_SECTION_DATA_TABLE = "resume_section_data";
const RESUME_DATA_ITEM_TABLE = "resume_data_item";
const RESUME_DATA_ITEM_TYPE_TABLE = "resume_data_item_type";
const RESUME_TEMPLATE_TABLE = "template";
const THEME_TABLE = "themes";

// function mapRows<T = any>(columns: string[], values: any[][]): T[] {
//     return values.map((row) => {
//         const obj: any = {};
//         columns.forEach((col, i) => {
//             obj[col] = row[i];
//         });
//         return obj as T;
//     });
// }
// function getFullResumeQuery(resumeIdParam: number): SQL<any> {
//     return sql`SELECT * FROM resume_config WHERE id = ${resumeIdParam}`;
// }

function getFullResumeQuery(resumeIdParam: number): SQL<any> {
    return sql`
    SELECT  rc.id,
            rc.uuid,
            rc.name,
            json_object(
                'id', th.id,
                'name', th.name,
                'description', th.description,
                'sty_source', th.sty_source,
                'is_system', th.is_system,
                'owner_user_id', th.owner_user_id,
                'created_at', th.created_at
           ) AS theme,
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
                       FROM resume_section_data rsd
                       JOIN resume_data_item di ON di.id = rsd.data_item_id
                       LEFT JOIN resume_data_item_type dit ON dit.id = di.type_id
                       WHERE rsd.section_id = rs.id
                     ),
                     json('[]')
                   )
               )
             ),
             json('[]')
           ) AS sections
    FROM resume_config rc
    LEFT JOIN themes th ON th.id = rc.theme_id
    LEFT JOIN resume_section_config rs ON rs.resume_id = rc.id
    LEFT JOIN template t ON t.id = rs.template_id
    WHERE rc.id = ${resumeIdParam}
    GROUP BY rc.id;
    `;
}

function getFullThemesQuery(): string {
    return `
        SELECT
        t.id,
        t.name,
        t.description,
        t.sty_source,
        t.is_system,
        t.owner_user_id,
        t.created_at,

        COALESCE(
            json_group_array(
                json_object(
                    'id', tp.id,
                    'name', tp.name,
                    'section_type', tp.section_type,
                    'content', tp.content,
                    'description', tp.description
                )
            ) FILTER (WHERE tp.id IS NOT NULL),
            json('[]')
        ) AS templates

        FROM themes t
        LEFT JOIN template tp
            ON tp.theme_id = t.id

        GROUP BY t.id
        ORDER BY t.created_at DESC;
    `;
}

type UpdateResumeConfigThemeProps = Required<
    Pick<ResumeConfigRow, "id" | "themeId" | "updatedAt">
> & {
    notify: boolean;
};

//LEFT JOIN ${TEMPLATE_TABLE} t ON t.id = rs.template_id
export const ResumeConfigTable = {
    insert: async ({
        uuid,
        name,
        createdAt: created_at,
        updatedAt: updated_at,
        themeId: theme_id,
    }: ResumeConfigRow) => {
        if (!uuid || !theme_id) return;

        const res = await DB.db
            ?.insert(resumeConfig)
            .values({
                uuid,
                name,
                themeId: theme_id,
                createdAt: created_at ?? new Date().toISOString(),
                updatedAt: updated_at ?? new Date().toISOString(),
            })
            .returning();

        DB.save();

        console.log(`[ResumeConfigTable] insert ${res}`);

        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    getResumeConfig: async (resumeId: number) => {
        console.log(`[ResumeConfigTable] resumeId ${resumeId}`);
        const query = getFullResumeQuery(resumeId);
        console.log(`[ResumeConfigTable] query ${query}`);
        const res = DB.db!.all(query);
        // const resumeWithTheme = DB.db
        //     ?.select()
        //     .from(resumeConfig)
        //     .leftJoin(themes, eq(themes.id, resumeConfig.themeId))
        //     .where(eq(resumeConfig.id, resumeId))
        //     .all();

        // const resumeWithTheme = DB.db?.select().from(resumeConfig).all();

        console.log(`[ResumeConfigTable] result ${JSON.stringify(res)}`);
        return res || [];
    },
    getAllResumeConfig: () => {
        const rows = DB.db?.select().from(resumeConfig).all();
        return rows || [];
    },
    updateName: async ({
        id,
        name,
        updatedAt: updated_at,
    }: ResumeConfigRow) => {
        if (!id) return;

        await DB.db
            ?.update(resumeConfig)
            .set({
                name,
                updatedAt: updated_at ?? new Date().toISOString(),
            })
            .where(eq(resumeConfig.id, id));
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    updateTheme: async ({
        id,
        themeId: theme_id,
        updatedAt: updated_at,
        notify = true,
    }: UpdateResumeConfigThemeProps) => {
        if (!id || !theme_id) return;

        await DB.db
            ?.update(resumeConfig)
            .set({
                themeId: theme_id,
                updatedAt: updated_at ?? new Date().toISOString(),
            })
            .where(eq(resumeConfig.id, id));
        if (notify) DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    delete: async (id: number) => {
        if (!id) return;

        await DB.db?.delete(resumeConfig).where(eq(resumeConfig.id, id));
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    subscribe: (cb: () => void) => DB.subscribe(RESUME_CONFIG_TABLE, cb),
};

export const ResumeSectionConfigTable = {
    insert: async ({
        resume_id,
        title,
        section_type,
        template_id,
        section_order,
    }: ResumeSectionConfigRow): Promise<number> => {
        if (!title) return -1;

        const result = await DB.db
            ?.insert(resumeSectionConfig)
            .values({
                resumeId: resume_id,
                title,
                sectionType: section_type,
                templateId: template_id,
                sectionOrder: section_order,
            })
            .returning({ id: resumeSectionConfig.id });

        DB.save();

        if (!result) return -1;

        const newId = result[0].id;

        DB.notifyTable(RESUME_CONFIG_TABLE);
        return newId;
    },
    updateTemplate: async (
        id: number,
        template_id: number,
        notify: boolean = true
    ) => {
        if (!id) return;

        await DB.db
            ?.update(resumeSectionConfig)
            .set({ templateId: template_id })
            .where(eq(resumeSectionConfig.id, id));

        DB.save();

        if (notify) DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    updateOrder: async (id: number, newOrder: number) => {
        if (!id) return;

        await DB.db
            ?.update(resumeSectionConfig)
            .set({ sectionOrder: newOrder })
            .where(eq(resumeSectionConfig.id, id));
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    delete: async (id: number) => {
        if (!id) return;

        await DB.db
            ?.delete(resumeSectionConfig)
            .where(eq(resumeSectionConfig.id, id));
        DB.save();
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const ResumeSectionDataTable = {
    insert: async ({ section_id, data_item_id }: ResumeSectionDataRow) => {
        await DB.db?.insert(resumeSectionData).values({
            sectionId: section_id,
            dataItemId: data_item_id,
        });
        DB.save();
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    delete: async ({ section_id, data_item_id }: ResumeSectionDataRow) => {
        await DB.db
            ?.delete(resumeSectionData)
            .where(
                and(
                    eq(resumeSectionData.sectionId, section_id),
                    eq(resumeSectionData.dataItemId, data_item_id)
                )
            );
        DB.save();
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
};

export const ResumeDataItemTable = {
    insert: async ({
        title,
        description,
        data,
        type_id,
    }: DataItemRow): Promise<number> => {
        const result = await DB.db
            ?.insert(resumeDataItem)
            .values({
                typeId: type_id,
                title,
                description,
                data,
            })
            .returning({ id: resumeDataItem.id });

        if (!result) return -1;

        const newId = result[0].id;

        DB.save();

        DB.notifyTable(RESUME_DATA_ITEM_TABLE);
        DB.notifyTable(RESUME_CONFIG_TABLE);

        return newId;
    },
    getAll: () => {
        const rows = DB.db?.select().from(resumeDataItem).all();
        return rows || [];
    },
    update: async ({
        id,
        title,
        description,
        data,
        type_id,
        updated_at,
    }: DataItemRow) => {
        if (!id) return;

        await DB.db
            ?.update(resumeDataItem)
            .set({
                typeId: type_id,
                title,
                description,
                data,
                updatedAt: updated_at ?? new Date().toISOString(),
            })
            .where(eq(resumeDataItem.id, id));
        DB.save();
        DB.notifyTable(RESUME_DATA_ITEM_TABLE);
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    delete: async (id: number) => {
        if (!id) return;

        await DB.db?.delete(resumeDataItem).where(eq(resumeDataItem.id, id));
        DB.save();
        DB.notifyTable(RESUME_DATA_ITEM_TABLE);
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    subscribe: (cb: () => void) => DB.subscribe(RESUME_DATA_ITEM_TABLE, cb),
};

export const ResumeDataItemTypeTable = {
    insert: async ({ name }: DataItemTypeRow): Promise<number> => {
        const result = await DB.db
            ?.insert(resumeDataItemType)
            .values({ name })
            .returning({ id: resumeDataItemType.id });

        DB.save();
        if (!result) return -1;

        const newId = result[0].id;
        DB.notifyTable(RESUME_CONFIG_TABLE);

        return newId;
    },
};

export const TemplateTable = {
    insert: async ({
        name,
        theme_id,
        section_type,
        content,
        description,
    }: TemplateRow) => {
        if (!theme_id) return -1;
        const result = await DB.db
            ?.insert(template)
            .values({
                name,
                themeId: theme_id,
                sectionType: section_type,
                content,
                description,
            })
            .returning({ id: template.id });
        DB.save();
        if (!result) return -1;

        const newId = result[0].id;
        DB.notifyTable(RESUME_CONFIG_TABLE);
        DB.notifyTable(RESUME_TEMPLATE_TABLE);

        return newId;
    },
    getAll: () => {
        const rows = DB.db?.select().from(template).all();
        return rows || [];
    },
    update: async (id: number, content: string) => {
        if (!id) return;

        await DB.db
            ?.update(template)
            .set({ content })
            .where(eq(template.id, id));
        DB.save();
        DB.notifyTable(RESUME_TEMPLATE_TABLE);
    },
    delete: async (id: number) => {
        if (!id) return;

        await DB.db?.delete(template).where(eq(template.id, id));
        DB.save();
        DB.notifyTable(RESUME_TEMPLATE_TABLE);
        DB.notifyTable(RESUME_CONFIG_TABLE);
    },
    getByThemeId: (themeId: number) => {
        const rows = DB.db
            ?.select()
            .from(template)
            .where(eq(template.themeId, themeId))
            .all();

        return rows || [];
    },
    subscribe: (cb: () => void) => DB.subscribe(RESUME_TEMPLATE_TABLE, cb),
};

export interface ThemeThemeDataRowWithTemplates extends ThemeDataRow {
    templates: string;
}

export const ThemeTable = {
    insert: async ({
        name,
        description,
        sty_source,
        is_system,
        owner_user_id = "",
        created_at,
    }: ThemeDataRow): Promise<number> => {
        const result = await DB.db
            ?.insert(themes)
            .values({
                name,
                description,
                stySource: sty_source,
                isSystem: is_system,
                ownerUserId: owner_user_id,
                createdAt: created_at,
            })
            .returning({ id: themes.id });
        DB.save();
        if (!result) return -1;

        const newId = result[0].id;

        console.log(`[ThemeTable] insert newId ${newId}`);
        return newId;
    },
    get: (id: number) => {
        const row = DB.db?.select().from(themes).where(eq(themes.id, id)).get();

        return row || null;
    },
    update: async (id: number, content: string) => {
        if (!id) return;

        await DB.db
            ?.update(themes)
            .set({ stySource: content })
            .where(eq(themes.id, id));
        DB.save();
        DB.notifyTable(THEME_TABLE);
    },
    getAll: () => {
        const query = getFullThemesQuery();
        const result = DB.db?.all(query);
        console.log("result!! " + JSON.stringify(result));
        return result || [];

        // const res = DB.exec(getFullThemesQuery());
        // if (res.length === 0) return [];
        // const rows = mapRows<ThemeThemeDataRowWithTemplates>(
        //     res[0].columns,
        //     res[0].values
        // );
        // console.log("rows!! " + JSON.stringify(rows));
        // return rows;
    },
    subscribe: (cb: () => void) => DB.subscribe(THEME_TABLE, cb),
};
