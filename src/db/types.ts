export interface DataItemTypeRow {
    id?: number;
    name: string; // e.g. "project", "experience", "education", "skill"
}

export interface DataItemRow {
    id?: number;
    type_id: number; // FK → DataItemType.id
    title?: string;
    description?: string;
    data?: string; // stored as JSON text in DB
    created_at?: string; // ISO timestamp
    updated_at: string;
}

export interface TemplateRow {
    id?: number;
    theme_id?: number;
    name: string;
    section_type: string; // e.g. "project", "skills"
    content: string; // LaTeX or mustache template
    description?: string;
    created_at: string;
}

export interface ResumeConfigRow {
    id?: number | null;
    uuid?: string | null;
    name: string;
    createdAt?: string | null;
    updatedAt: string | null;
    themeId?: number | null;
}

export interface ResumeSectionConfigRow {
    id?: number;
    title?: string;
    resume_id: number; // FK → ResumeConfig.id
    section_type: string; // "project", "skills", etc.
    template_id: number; // FK → Template.id
    section_order: number;
}

export interface ResumeSectionDataRow {
    section_id: number; // FK → ResumeSectionConfig.id
    data_item_id: number; // FK → DataItem.id
}

export interface ThemeDataRow {
    id?: number;
    name: string;
    description: string;
    sty_source: string;
    is_system: boolean;
    owner_user_id?: string;
    created_at: string;
}
