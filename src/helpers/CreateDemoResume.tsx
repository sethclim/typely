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

const ResumeId = 1


function groupTemplatesBySectionType(templates: Template[]) {
    return templates.reduce<Record<string, Template[]>>((acc, tpl) => {
        (acc[tpl.sectionType] ??= []).push(tpl);
        return acc;
    }, {});
}

export const CreateDemoResume = (info : IntakeInfo) =>{

    let dataItemId = 1

    console.log("Creating Resume")

    console.log("info.theme.templates " + JSON.stringify(info.theme.templates))

    const groupedTemplates = groupTemplatesBySectionType(info.theme.templates);

    console.log("groupedTemplates " + JSON.stringify(groupedTemplates))

    // const theme_id = ThemeTable.insert({
    //     name : "engineering",
    //     description : "",
    //     sty_source : latexThemes.engineering.config,
    //     is_system: true,
    //     created_at: ""
    // })
    
    // const headerLaTeX = `
    // \\newcommand{\\AND}{\\unskip\\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox\\ignorespaces}\\newsavebox\\ANDbox\\sbox\\ANDbox{$|$}\n\\begin{header}\n\\fontsize{31 pt}{31 pt}\\selectfont [[NAME]] 
    // \\\\
    // \\vspace{1 pt}
    // \\normalsize
    // \\mbox{Waterloo, ON}%
    // \\kern 5.0 pt%
    // \\AND%
    // \\kern 5.0 pt%
    // \\mbox{\\hrefWithoutArrow{tel:+01-[[PHONE]]}{+1 [[PHONE]]}}%
    // \\kern 5.0 pt%
    // \\AND%
    // \\kern 5.0 pt%
    // \\mbox{\\hrefWithoutArrow{mailto:[[EMAIL]]}{[[EMAIL]]}}%
    // \\kern 5.0 pt%
    // \\vspace{-3pt} %
    // \\par
    // \\kern-6pt %
    // \\kern 5.0 pt%
    // \\mbox{\\hrefWithoutArrow{[[LINKEDIN]]}{\\textcolor[HTML]{0366d6}{[[LINKEDIN]]}}}%
    // \\kern 5.0 pt%
    // \\AND%
    // \\kern 5.0 pt%
    // \\mbox{\\hrefWithoutArrow{[[WEBSITE]]}{\\textcolor[HTML]{0366d6}{[[WEBSITE]]}}}%
    // \\kern 5.0 pt%
    // \\AND%
    // \\kern 5.0 pt%
    // \\mbox{\\hrefWithoutArrow{[[GITHUB]]}{\\textcolor[HTML]{0366d6}{[[GITHUB]]}}}%
    // \n\\end{header} 
    // \n\\vspace{0.2cm}`;

    // const headerTemplateId = TemplateTable.insert({
    //     "name": "header template",
    //     "description": "this is a header template",
    //     "section_type": "header",
    //     "created_at" : Date.now().toString(),
    //     "content": headerLaTeX,
    //     theme_id : theme_id
    // })

    //------------------------------------------------------

    let skillsLatex = ""

    info.skills.forEach((_, i) => {
        skillsLatex = skillsLatex.concat(`\\textbf{[[SKILL_LABEL_${i}]]:} [[Point_${i}]] \\newline\n`)
    })

    const skillsTemplateId = TemplateTable.insert({
        "name": "skills template",
        "description": "this is a s template",
        "section_type": "header",
        "created_at" : Date.now().toString(),
        "content": skillsLatex,
        theme_id : info.theme.id
    })

    //------------------------------------------------------

    //  const expLatex = `
        // \\begin{twocolentry}{
        //     05/2022 – 04/2023
        // }
        // \\fontsize{11 pt}{11 pt}\\textbf{[[TITLE]]}, [[COMPANY]] - Toronto ON, CA\\end{twocolentry}

        // \\vspace{0.10 cm}
        // \\begin{onecolentry}
        //     \\begin{highlights}
        //         \\item [[POINT1]]
        //         \\item [[POINT2]]
        //         \\item [[POINT3]]
        //         \\item [[POINT4]]
        //     \\end{highlights}
        // \\end{onecolentry}
        // \n\\vspace{0.20 cm}
    //  `

    // const experienceTemplateId = TemplateTable.insert({
    //     "name": "Exp template",
    //     "description": "this show's my experience",
    //     "section_type": "experience",
    //     "created_at" : Date.now().toString(),
    //     "content": expLatex,
    //     theme_id : theme_id
    // })

    // const proj_template = `
        // \\begin{twocolentry_proj}{
        // \\mbox{\\hrefWithoutArrow{[[URL]]}{\\textcolor[HTML]{0366d6}{[[URL]]}}}
        // }{5.6cm}
        // \\fontsize{11 pt}{11 pt}\\textbf{[[TITLE]]} - [[HIGHLIGHTS]]
        // \\end{twocolentry_proj}
        // \\begin{onecolentry}
        //     \\begin{highlights}
        //         \\item [[POINT1]]
        //         \\item [[POINT2]]
        //         \\item [[POINT3]]
        //         \\item [[POINT4]]
        //     \\end{highlights}
        // \\end{onecolentry}
    // `

    // const projectTemplateId = TemplateTable.insert({
    //     "name": "Project template",
    //     "description": "this show's my project",
    //     "section_type": "project",
    //     "created_at" : Date.now().toString(),
    //     "content": proj_template,
    //     theme_id : theme_id
    // })

    // const edu_template = `
    //     \\begin{twocolentry}{
    //         [[START_DATE]] – [[END_DATE]]
    //     }
    //     \\vspace{0.10 cm}
    //     \\textbf{[[UNI]]}, [[PROGRAM]] [[GPA]] 
    //     \\end{twocolentry}
    // `
    // const eduTemplateId = TemplateTable.insert({
    //     "name": "Education Template",
    //     "description": "this show's my education",
    //     "section_type": "education",
    //     "created_at" : Date.now().toString(),
    //     "content": edu_template,
    //     theme_id : theme_id
    // })

    // const section_template = `
        // \\section{[[TITLE]]}
        // \\vspace{[[SPACE]]}
    // `
    // const sectionTemplateId = TemplateTable.insert({
    //     "name": "section title",
    //     "description": "header section",
    //     "section_type": "section",
    //     "created_at" : Date.now().toString(),
    //     "content": section_template,
    //     theme_id : theme_id
    // })

    //------------------------------------------------------------------------------

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
        "section_order": 0,
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
        "section_order": 1,
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
    
    info.projects.forEach(proj =>{
        const thisProjectSectionId = ResumeSectionConfigTable.insert({
            // "id": sectionId,
            "title": "C++ Project",
            "resume_id": ResumeId,
            "template_id": groupedTemplates["project"][0].id,
            "section_order": 8, 
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
    info.education.forEach(edu =>{
        const thisEducationSectionId = ResumeSectionConfigTable.insert({
            "title": "Education",
            "resume_id": ResumeId,
            "template_id": groupedTemplates["education"][0].id,
            "section_order": 11,
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
        "section_order": 2,
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
        "section_order": 7,
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
        "section_order": 9,
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

    ////////////////////////////////////////////////
    // Jobs
    ///////////////////////////////////////////////
    info.jobs.forEach((inJob, i) => {
        const thisJobSectionId = ResumeSectionConfigTable.insert({
            "title": `Job ${i + 1}`,
            "resume_id": ResumeId,
            "template_id": groupedTemplates["experience"][0].id,
            "section_order": 3,
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