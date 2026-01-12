import {
    sqliteTable,
    integer,
    text,
    index,
    primaryKey,
} from "drizzle-orm/sqlite-core";

/* ---------------- THEMES ---------------- */

export const themes = sqliteTable("themes", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name"),
    description: text("description"),
    stySource: text("sty_source"),
    isSystem: integer("is_system", { mode: "boolean" }),
    ownerUserId: text("owner_user_id"),
    createdAt: text("created_at").default("datetime('now')"),
});

/* ---------------- TEMPLATE ---------------- */

export const template = sqliteTable(
    "template",
    {
        id: integer("id").primaryKey({ autoIncrement: true }),
        themeId: integer("theme_id")
            .notNull()
            .references(() => themes.id),
        name: text("name").notNull(),
        sectionType: text("section_type").notNull(),
        content: text("content").notNull(),
        description: text("description"),
        createdAt: text("created_at").default("datetime('now')"),
    }
    // (t) => ({
    //     themeIdx: index("idx_template_theme").on(t.themeId),
    // })
);

export const templateThemeIdx = index("idx_template_theme").on(
    template.themeId
);

/* ---------------- RESUME CONFIG ---------------- */

export const resumeConfig = sqliteTable("resume_config", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    themeId: integer("theme_id")
        .notNull()
        .references(() => themes.id),
    uuid: text("uuid").notNull().unique(),
    name: text("name").notNull(),
    createdAt: text("created_at").default("datetime('now')"),
    updatedAt: text("updated_at").default("datetime('now')"),
});

export const resumeConfigThemeIdx = index("idx_resume_theme").on(
    resumeConfig.themeId
);

/* ---------------- RESUME SECTION CONFIG ---------------- */

export const resumeSectionConfig = sqliteTable("resume_section_config", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    resumeId: integer("resume_id")
        .notNull()
        .references(() => resumeConfig.id, { onDelete: "cascade" }),
    sectionType: text("section_type").notNull(),
    templateId: integer("template_id")
        .notNull()
        .references(() => template.id),
    sectionOrder: integer("section_order").default(0),
});

export const resumeSectionResumeIdx = index("idx_section_resume").on(
    resumeSectionConfig.resumeId
);

export const resumeSectionTemplateIdx = index("idx_section_template").on(
    resumeSectionConfig.templateId
);

/* ---------------- DATA ITEM TYPE ---------------- */

export const resumeDataItemType = sqliteTable("resume_data_item_type", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull().unique(),
});

/* ---------------- DATA ITEM ---------------- */

export const resumeDataItem = sqliteTable("resume_data_item", {
    id: integer("id").primaryKey({ autoIncrement: true }),
    typeId: integer("type_id")
        .notNull()
        .references(() => resumeDataItemType.id, { onDelete: "cascade" }),
    title: text("title"),
    description: text("description"),
    data: text("data"),
    createdAt: text("created_at").default("datetime('now')"),
    updatedAt: text("updated_at").default("datetime('now')"),
});

export const resumeDataItemTypeIdx = index("idx_data_type").on(
    resumeDataItem.typeId
);

/* ---------------- SECTION ↔ DATA M2M ---------------- */

export const resumeSectionData = sqliteTable("resume_section_data", {
    sectionId: integer("section_id")
        .notNull()
        .references(() => resumeSectionConfig.id, { onDelete: "cascade" }),

    dataItemId: integer("data_item_id")
        .notNull()
        .references(() => resumeDataItem.id, { onDelete: "cascade" }),
});

export const resumeSectionDataPk = primaryKey({
    name: "resume_section_data_pk",
    columns: [resumeSectionData.sectionId, resumeSectionData.dataItemId],
});
