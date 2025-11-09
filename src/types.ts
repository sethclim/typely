export interface DataItemType {
    id: number;
    name: string;
}

export interface DataItem {
    id: number;
    type: DataItemType;
    title?: string;
    description?: string;
    data?: string; // stored as JSON text in DB
    created_at: string; // ISO timestamp
    updated_at: string;
}

export interface Template {
    id: number;
    name: string;
    sectionType: "project" | "experience" | "education" | "skills" | "header";
    content: string;
    description?: string;
}

export interface ResumeSection {
    id: number;
    sectionType: string;
    order: number;
    template: Template | undefined;
    items: DataItem[];
}

export interface ResumeConfig {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    sections: ResumeSection[];
}
