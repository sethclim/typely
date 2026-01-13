import { ResumeConfig, ResumeSection, Theme } from "../types";

export function hydrateResume(raw: any[]): ResumeConfig | null {
  if (!raw || raw.length === 0) return null;

  const row = raw[0];

  const id: number = row.id;
  const uuid: string = row.uuid;
  const name: string = row.name;
  const themeJSON: string = row.theme;      
  const sectionsJSON: string = row.sections;

  let sections: ResumeSection[] = [];
  try {
    const parsedSections = JSON.parse(sectionsJSON) as any[];

    if (parsedSections.length === 1 && parsedSections[0].id === null){
      sections = []
    }else{
      sections = parsedSections.map((s) => ({
        id: s.id,
        title: s.title,
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
    }
  } catch (e) {
    console.error("Failed to parse sections JSON", e);
  }

  // const copy = [...props.resume?.sections]
  sections.sort((a, b) => a.order - b.order);
  // console.log(`copy ${sections.length}`)

  let theme : Theme = JSON.parse(themeJSON)

  return {
    id,
    uuid,
    name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sections,
    theme
  };
}
