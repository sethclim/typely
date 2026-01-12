import { hydrateResume } from "../helpers/ResumeHydrator";
import { DBService } from "./DBService";
import { resumeConfig, resumeSectionConfig, resumeSectionData } from "./schema";
import { ResumeConfigTable } from "./tables";

// Singleton DB instance
export const DB = new DBService();

export const DuplicateResume = async (id: number) => {
    const resume_raw = await ResumeConfigTable.getResumeConfig(id);
    const resume = hydrateResume(resume_raw);

    if (!resume) return;

    console.log("resume " + JSON.stringify(resume));

    try {
        // --- Step 1: Duplicate resume_config ---
        const uuid = crypto.randomUUID();
        const newResumeResult = await DB.db
            ?.insert(resumeConfig)
            .values({
                uuid,
                name: resume.name + " - Copy",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                themeId: resume.theme?.id ?? null,
            })
            .returning({ id: resumeConfig.id });

        if (newResumeResult == undefined) throw Error("UNDEFINED");

        const newResumeId = newResumeResult[0].id;
        DB.notifyTable("resume_config");

        // --- Step 2: Duplicate resume_section_config + resume_section_data ---
        for (const section of resume.sections) {
            const templateId = section.template?.id ?? null;

            if (templateId === null) throw Error("null templateId");

            // Insert section
            const newSectionResult = await DB.db
                ?.insert(resumeSectionConfig)
                .values({
                    resumeId: newResumeId,
                    title: section.title,
                    sectionType: section.sectionType,
                    templateId,
                    sectionOrder: section.order,
                })
                .returning({ id: resumeSectionConfig.id });

            if (newSectionResult == undefined)
                throw Error("newSectionResult UNDEFINED");

            const newSectionId = newSectionResult[0].id;
            DB.notifyTable("resume_section_config");

            // Insert all section data items (M2M)
            for (const item of section.items) {
                await DB.db?.insert(resumeSectionData).values({
                    sectionId: newSectionId,
                    dataItemId: item.id,
                });
            }
            DB.notifyTable("resume_section_data");
        }
    } catch (e) {
        console.error("Failed to duplicate resume:", e);
        throw e;
    }
};
