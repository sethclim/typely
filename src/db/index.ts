import { hydrateResume } from "../helpers/ResumeHydrator";
import { DBService } from "./DBService";
import {
    ResumeConfigTable,
    ResumeSectionConfigTable,
    ResumeSectionDataTable,
} from "./tables";

// Singleton DB instance
export const DB = new DBService();

export const DuplicateResume = (id: number) => {
    const resume_raw = ResumeConfigTable.getResumeConfig(id);
    const resume = hydrateResume(resume_raw);

    if (!resume) return;

    console.log("resume " + JSON.stringify(resume));

    try {
        const uuid = crypto.randomUUID();
        ResumeConfigTable.insert({
            uuid: uuid,
            name: resume.name + " - Copy",
            created_at: Date.now().toString(),
            updated_at: Date.now().toString(),
        });

        const newResumeIdResult = DB.exec(`
            SELECT id FROM resume_config
            ORDER BY id DESC
            LIMIT 1
        `);
        const newResumeId = newResumeIdResult[0].values[0][0];
        console.log("newResumeId", newResumeId);

        // --- Step 2: Duplicate resume_section ---
        for (const row of resume.sections) {
            const sectionType = row.sectionType;
            const title = row.title;
            const order = row.order;
            const template = row.template;

            ResumeSectionConfigTable.insert({
                resume_id: newResumeId,
                title: title,
                section_type: sectionType,
                template_id: template?.id ?? -1,
                section_order: order,
            });

            const newSectionIdResult = DB.exec(`
                SELECT id 
                FROM resume_section_config 
                WHERE resume_id = ${newResumeId} 
                ORDER BY id DESC 
                LIMIT 1
            `);

            const newSectionId = newSectionIdResult[0].values[0][0];

            for (const item of row.items) {
                ResumeSectionDataTable.insert({
                    section_id: newSectionId,
                    data_item_id: item.id,
                });
            }
        }
    } catch (e) {
        throw e;
    }
};
