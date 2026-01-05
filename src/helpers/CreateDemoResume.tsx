import { IntakeInfo } from "../components/ResumeIntakeForm/types"
import { 
    ResumeConfigTable, 
    ResumeSectionConfigTable, 
    ResumeSectionDataTable, 
    ResumeDataItemTable, 
    ResumeDataItemTypeTable, 
    TemplateTable, 
} from "../db/tables"
import { Template } from "../types";

export const ORDER_KEYS = [
  "Header",
  "SkillsSection",
  "Skills",
  "ExperienceSection",
  "Experience",
  "ProjectSection",
  "Project",
  "EducationSection",
  "Education",
] as const;

export type OrderKey = typeof ORDER_KEYS[number];

const ResumeId = 1

function groupTemplatesBySectionType(templates: Template[]) {
    return templates.reduce<Record<string, Template[]>>((acc, tpl) => {
        (acc[tpl.sectionType] ??= []).push(tpl);
        return acc;
    }, {});
}

type CountMap = Record<OrderKey, number>;

export const CreateDemoResume = (info : IntakeInfo) =>{

    const counts: CountMap = {
        Header: 1,
        SkillsSection: info.skills.length ? 1 : 0,
        Skills: info.skills.length,
        ExperienceSection: info.jobs.length ? 1 : 0,
        Experience: info.jobs.length,
        ProjectSection: info.projects.length ? 1 : 0,
        Project: info.projects.length,
        EducationSection: info.education.length ? 1 : 0,
        Education: info.education.length,
    };

    const finalPositions = new Map<OrderKey, number[]>();
    let cursor = 0;

    for (const key of ORDER_KEYS) {
        const n = counts[key];
        finalPositions.set(key, Array.from({ length: n }, (_, i) => cursor + i));
        cursor += n;
    }

    let dataItemId = 1

    console.log("Creating Resume")

    const groupedTemplates = groupTemplatesBySectionType(info.theme.templates);

    let skillsLatex = ""

    console.log("Theme " + info.theme.name)

    if(info.theme.name == "engineering")
    {
        info.skills.forEach((_, i) => {
            skillsLatex = skillsLatex.concat(`\\textbf{[[SKILL_LABEL_${i}]]:} [[Point_${i}]] \\newline\n`)
        })
    }else if (info.theme.name == "colorful"){
        skillsLatex += "\\tab \\begin{tabular}{r p{0.7\\textwidth}}"
        info.skills.forEach((_, i) => {
           skillsLatex += `\\texttt{\\large [[SKILL_LABEL_${i}]]} & [[Point_${i}]] \\\\ \n`
        })
        skillsLatex += "\\end{tabular}\\\\~\\\\"
    }

    const skillsTemplateId = TemplateTable.insert({
        "name": "skills template",
        "description": "this is a s template",
        "section_type": "header",
        "created_at" : Date.now().toString(),
        "content": skillsLatex,
        theme_id : info.theme.id
    })


    const infoDataItemTypeId = ResumeDataItemTypeTable.insert({
        name : "info"
    })

    const skillDataItemTypeId = ResumeDataItemTypeTable.insert({
        name : "skill"
    })

    const expDataItemTypeId = ResumeDataItemTypeTable.insert({
        name : "experience"
    })

    const projDataItemTypeId = ResumeDataItemTypeTable.insert({
        name : "project"
    })

    const eduDataItemTypeId = ResumeDataItemTypeTable.insert({
        name : "education"
    })

    ////////////////////////////////////////////////
    // RESUME CONFIG
    ///////////////////////////////////////////////
    const uuid = crypto.randomUUID();
    ResumeConfigTable.insert({
        uuid: uuid,
        "id": ResumeId,
        "name" : "Demo Resume",
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
        theme_id : info.theme.id
    })
    
    ////////////////////////////////////////////////
    // Header
    ///////////////////////////////////////////////
    const headerSectionId = ResumeSectionConfigTable.insert({
        "title": "Custom Header",
        "resume_id": ResumeId,
        "template_id": groupedTemplates["header"][0].id,
        "section_order": finalPositions.get("Header")![0],
        "section_type": "header"
    })

    const me = [
        ["EMAIL", info.personal.email],
        ["LINKEDIN", "https://linkedin/me.com"]
    ]

    if(info.personal.phone){
        me.push(["PHONE", info.personal.phone])
    }

    if(info.personal.github){
        me.push(["GITHUB", info.personal.github])
    }

    if(info.personal.website){
        me.push(["WEBSITE", info.personal.website],)
    }

    const myInfoDataItemId = ResumeDataItemTable.insert({
        title: "My Info",
        description: "about me info",
        data: JSON.stringify(me),
        type_id: infoDataItemTypeId,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: headerSectionId,  
        data_item_id: myInfoDataItemId
    })


    const name = [
        ["NAME", info.personal.name]
    ]

    const myNameDataItemId = ResumeDataItemTable.insert({
        title: "My Name",
        description: "name",
        data: JSON.stringify(name),
        type_id: infoDataItemTypeId,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: headerSectionId,
        data_item_id: myNameDataItemId
    })

    ////////////////////////////////////////////////
    // SKILLS
    ///////////////////////////////////////////////
    const skillsSectionId = ResumeSectionConfigTable.insert({
        // "id": sectionId,
        "title": "C++ Skills",
        "resume_id": ResumeId,
        "template_id": skillsTemplateId,
        "section_order": finalPositions.get("Skills")![0],
        "section_type": "skills"
    })

    const cplusSkills : Array<Array<string>> = []
    const skillLabels : Array<Array<string>> = []

    info.skills.forEach((skillIn, i) => {
        cplusSkills.push([`Point_${i}`, skillIn.skills],)
        skillLabels.push([`SKILL_LABEL_${i}`, skillIn.title])
    })

    const skillsDataItemId = ResumeDataItemTable.insert({
        title: "C++ Skills",
        description: "my c++ skills",
        data: JSON.stringify(cplusSkills),
        type_id: skillDataItemTypeId,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: skillsSectionId,
        data_item_id: skillsDataItemId
    })


    const skillsLabelsDataItemId = ResumeDataItemTable.insert({
        "id": dataItemId,
        title: "Skills Labels",
        description: "my skills labels",
        data: JSON.stringify(skillLabels),
        type_id: skillDataItemTypeId,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: skillsSectionId,
        data_item_id: skillsLabelsDataItemId
    })

    ////////////////////////////////////////////////
    // Project
    ///////////////////////////////////////////////
    info.projects.forEach((proj, i) =>{
        const thisProjectSectionId = ResumeSectionConfigTable.insert({
            "title": "C++ Project",
            "resume_id": ResumeId,
            "template_id": groupedTemplates["project"][0].id,
            "section_order": finalPositions.get("Project")![i], 
            "section_type": "project"
        })
        const project = [
            ["TITLE", proj.title],
            ["HIGHLIGHTS", "C++, Vulkan"],
            ["URL", "https://github/my-raytracer"],
            ["POINT1", proj.pointOne],
            ["POINT2", proj.pointTwo],
            ["POINT3", proj.pointThree],
            ["POINT4", proj.pointFour]
        ];
    
        const projectDataItemId = ResumeDataItemTable.insert({
            title: "Project",
            description: "raytracer",
            data: JSON.stringify(project),
            type_id: projDataItemTypeId,
            "created_at" : Date.now().toString(),
            "updated_at" : Date.now().toString(),
        })
    
        ResumeSectionDataTable.insert({
            section_id: thisProjectSectionId,
            data_item_id: projectDataItemId
        })
    
    })
    
    ////////////////////////////////////////////////
    // Education
    ///////////////////////////////////////////////
    info.education.forEach((edu, i) =>{
        const thisEducationSectionId = ResumeSectionConfigTable.insert({
            "title": "Education",
            "resume_id": ResumeId,
            "template_id": groupedTemplates["education"][0].id,
            "section_order": finalPositions.get("Education")![i],
            "section_type": "education"
        })

        const uni = [
            ["UNI", edu.school],
            ["PROGRAM", edu.program],
            ["START_DATE", edu.startDate],
            ["END_DATE", edu.endDate],
            ["GPA", "4.0"]
        ]
    
        const eduDataItemId = ResumeDataItemTable.insert({
            id: dataItemId,
            title: "University",
            description: "undergrad",
            data: JSON.stringify(uni),
            type_id: eduDataItemTypeId,
            "created_at" : Date.now().toString(),
            "updated_at" : Date.now().toString(),
        })

        ResumeSectionDataTable.insert({
            section_id: thisEducationSectionId,
            data_item_id: eduDataItemId
        })

    })

    ////////////////////////////////////////////////
    // Work section header
    ///////////////////////////////////////////////
    const workTitleSectionId = ResumeSectionConfigTable.insert({
        "title": "Work Title Section",
        "resume_id": ResumeId,
        "template_id": groupedTemplates["section"][0].id,
        "section_order": finalPositions.get("ExperienceSection")![0],
        "section_type": "section"
    })

    const work_title = [
        ["TITLE", "Experience"],
        ["SPACE", "0cm"],
    ]

    const experienceSectionDataItemId = ResumeDataItemTable.insert({
        title: "Work Experience Title",
        description: "undergrad",
        data: JSON.stringify(work_title),
        type_id: expDataItemTypeId,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: workTitleSectionId,
        data_item_id: experienceSectionDataItemId
    })

    ////////////////////////////////////////////////
    // Project section header
    ///////////////////////////////////////////////
    const projectHeaderSectionId = ResumeSectionConfigTable.insert({
        "title": "Project Title Section",
        "resume_id": ResumeId,
        "template_id": groupedTemplates["section"][0].id,
        "section_order": finalPositions.get("ProjectSection")![0],
        "section_type": "section"
    })

    const project_title = [
        ["TITLE", "Projects"],
        ["SPACE", "0cm"],
    ]

    const projectSectionDataItemId = ResumeDataItemTable.insert({
        title: "Project Section Title",
        description: "projects",
        data: JSON.stringify(project_title),
        type_id: projDataItemTypeId,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })
    

    ResumeSectionDataTable.insert({
        section_id: projectHeaderSectionId,
        data_item_id: projectSectionDataItemId
    })

    ////////////////////////////////////////////////
    // Education Section Header
    ///////////////////////////////////////////////
    const educationTitleSectionId = ResumeSectionConfigTable.insert({
        "title": "Education Title Section",
        "resume_id": ResumeId,
        "template_id": groupedTemplates["section"][0].id,
        "section_order": finalPositions.get("EducationSection")![0],
        "section_type": "section"
    })

    const edu_title = [
        ["TITLE", "Education"],
        ["SPACE", "0cm"],
    ]

    const eduSectionDataItemId = ResumeDataItemTable.insert({
        title: "Education Section Title",
        description: "education",
        data: JSON.stringify(edu_title),
        type_id: eduDataItemTypeId,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: educationTitleSectionId,
        data_item_id: eduSectionDataItemId
    })


    if (info.theme.name == "colorful"){
        ////////////////////////////////////////////////
        // Skills Section Header
        ///////////////////////////////////////////////
        const skillsTitleSectionId = ResumeSectionConfigTable.insert({
            "title": "Skills Title Section",
            "resume_id": ResumeId,
            "template_id": groupedTemplates["section"][0].id,
            "section_order": finalPositions.get("SkillsSection")![0],
            "section_type": "section"
        })
    
        const skills_title = [
            ["TITLE", "Skills"],
            ["SPACE", "0cm"],
        ]
    
        const skillsSectionDataItemId = ResumeDataItemTable.insert({
            title: "Skills Section Title",
            description: "education",
            data: JSON.stringify(skills_title),
            type_id: skillsTitleSectionId,
            "created_at" : Date.now().toString(),
            "updated_at" : Date.now().toString(),
        })
    
        ResumeSectionDataTable.insert({
            section_id: skillsTitleSectionId,
            data_item_id: skillsSectionDataItemId
        })
    }

    ////////////////////////////////////////////////
    // Jobs
    ///////////////////////////////////////////////
    info.jobs.forEach((inJob, i) => {
        const thisJobSectionId = ResumeSectionConfigTable.insert({
            "title": `Job ${i + 1}`,
            "resume_id": ResumeId,
            "template_id": groupedTemplates["experience"][0].id,
            "section_order": finalPositions.get("Experience")![i],
            "section_type": "experience"
        })

        const jobData = [
            ["TITLE", inJob.title],
            ["COMPANY", inJob.company],
            ["POINT1", inJob.pointOne],
            ["POINT2", inJob.pointTwo],
            ["POINT3", inJob.pointThree],
            ["POINT4", inJob.pointFour]
        ];

        const experienceDataItemId = ResumeDataItemTable.insert({
            title: `${inJob.title}@${inJob.company}`,
            description: "current job",
            data: JSON.stringify(jobData),
            type_id: expDataItemTypeId,
            "created_at" : Date.now().toString(),
            "updated_at" : Date.now().toString(),
        })

        ResumeSectionDataTable.insert({
            section_id: thisJobSectionId,
            data_item_id: experienceDataItemId
        })
    })

}