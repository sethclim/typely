export interface Theme {
    id: number;
    name: string;
    description: string;
    sty_source: string;
    is_system: boolean;
    owner_user_id?: string;
    created_at: string;
}
export interface DataItemType {
    id: number;
    name: string;
}

export interface DataItem {
    id: number;
    type: DataItemType;
    title?: string;
    description?: string;
    data: Array<[string, string]>; // stored as JSON text in DB
    created_at: string; // ISO timestamp
    updated_at: string;
}

export interface Template {
    id: number;
    name: string;
    sectionType: string;
    content: string;
    description?: string;
}

export interface ResumeSection {
    id: number;
    title: string;
    sectionType: string;
    order: number;
    template: Template | undefined;
    items: DataItem[];
}

export interface ResumeConfig {
    id: number;
    uuid: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    sections: ResumeSection[];
    theme: Theme;
}
