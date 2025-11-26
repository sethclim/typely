import { ResumeConfig, ResumeSection } from "../types";

export function hydrateResume(raw: any[]): ResumeConfig | null {
  if (!raw || raw.length === 0) return null;

  const row = raw[0];
  const values = row.values[0];

  const [id, name, sectionsJson] = values;

  let sections: ResumeSection[] = [];
  try {
    const parsedSections = JSON.parse(sectionsJson) as any[];
    sections = parsedSections.map((s) => ({
      id: s.id,
      sectionType: s.sectionType,
      order: s.order,
      template: s.template
        ? {
            id: s.template.id,
            name: s.template.name,
            sectionType: s.template.sectionType,
            content: s.template.content,
            description: s.template.description,
          }
        : undefined,
      items: Array.isArray(s.items)
        ? s.items.map((item: any) => ({
            id: item.id,
            type: {
              id: item.type?.id ?? 0,
              name: item.type?.name ?? "",
            },
            title: item.title,
            description: item.description,
            data: item.data,
            created_at: item.created_at ?? new Date().toISOString(),
            updated_at: item.updated_at ?? new Date().toISOString(),
          }))
        : [],
    }));
  } catch (e) {
    console.error("Failed to parse sections JSON", e);
  }

  return {
    id,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections,
  };
}
