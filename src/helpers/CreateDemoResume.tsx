import { IntakeInfo } from "../components/ResumeIntakeForm/types"
import { 
    ResumeConfigTable, 
    ResumeSectionConfigTable, 
    ResumeSectionDataTable, 
    ResumeDataItemTable, 
    ResumeDataItemTypeTable, 
    TemplateTable 
} from "../db/tables"

const ResumeId = 1

export const CreateDemoResume = (info : IntakeInfo) =>{

    let sectionId = 1
    let dataItemId = 1

    console.log("Creating Resume")

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
    })
    
    console.log("    sectionId " + sectionId)
    ////////////////////////////////////////////////
    // Header
    ///////////////////////////////////////////////
    ResumeSectionConfigTable.insert({
        "id": sectionId,
        "title": "Custom Header",
        "resume_id": ResumeId,
        "template_id": 1,
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

    ResumeDataItemTable.insert({
        "id": dataItemId,
        title: "My Info",
        description: "about me info",
        data: JSON.stringify(me),
        type_id: 1,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: sectionId,  
        data_item_id: dataItemId
    })

    dataItemId++

    const name = [
        ["NAME", info.personal.name]
    ]

    ResumeDataItemTable.insert({
        "id": dataItemId,
        title: "My Name",
        description: "name",
        data: JSON.stringify(name),
        type_id: 1,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: sectionId,
        data_item_id: dataItemId
    })

    dataItemId++
    sectionId++

    ////////////////////////////////////////////////
    // SKILLS
    ///////////////////////////////////////////////
    console.log("    sectionId " + sectionId)
    ResumeSectionConfigTable.insert({
        "id": sectionId,
        "title": "C++ Skills",
        "resume_id": ResumeId,
        "template_id": 2,
        "section_order": 1,
        "section_type": "skills"
    })


    const cplusSkills : Array<Array<string>> = []
    const skillLabels : Array<Array<string>> = []

    info.skills.forEach((skillIn, i) => {
        cplusSkills.push([`Point_${i}`, skillIn.skills],)
        skillLabels.push([`SKILL_LABEL_${i}`, skillIn.title])
    })

    ResumeDataItemTable.insert({
        "id": dataItemId,
        title: "C++ Skills",
        description: "my c++ skills",
        data: JSON.stringify(cplusSkills),
        type_id: 2,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: sectionId,
        data_item_id: dataItemId
    })

    dataItemId++

    ResumeDataItemTable.insert({
        "id": dataItemId,
        title: "Skills Labels",
        description: "my skills labels",
        data: JSON.stringify(skillLabels),
        type_id: 2,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: sectionId,
        data_item_id: dataItemId
    })

    dataItemId++
    sectionId++

    ////////////////////////////////////////////////
    // Project
    ///////////////////////////////////////////////
    
    info.projects.forEach(proj =>{
        console.log("    sectionId " + sectionId)
        ResumeSectionConfigTable.insert({
            "id": sectionId,
            "title": "C++ Project",
            "resume_id": ResumeId,
            "template_id": 4,
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
    
        ResumeDataItemTable.insert({
            id: dataItemId,
            title: "Project",
            description: "raytracer",
            data: JSON.stringify(project),
            type_id: 3,
            "created_at" : Date.now().toString(),
            "updated_at" : Date.now().toString(),
        })
    
        ResumeSectionDataTable.insert({
            section_id: sectionId,
            data_item_id: dataItemId
        })
    
        dataItemId++
        sectionId++
    })
    
    ////////////////////////////////////////////////
    // Education
    ///////////////////////////////////////////////
    info.education.forEach(edu =>{
        console.log("    sectionId " + sectionId)
        ResumeSectionConfigTable.insert({
            "id": sectionId,
            "title": "Education",
            "resume_id": ResumeId,
            "template_id": 5,
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
    
        ResumeDataItemTable.insert({
            id: dataItemId,
            title: "University",
            description: "undergrad",
            data: JSON.stringify(uni),
            type_id: 3,
            "created_at" : Date.now().toString(),
            "updated_at" : Date.now().toString(),
        })

        ResumeSectionDataTable.insert({
            section_id: sectionId,
            data_item_id: dataItemId
        })

        dataItemId++
        sectionId++
    })

    ////////////////////////////////////////////////
    // Work section header
    ///////////////////////////////////////////////
    console.log("    sectionId " + sectionId)
    ResumeSectionConfigTable.insert({
        "id": sectionId,
        "title": "Work Title Section",
        "resume_id": ResumeId,
        "template_id": 6,
        "section_order": 2,
        "section_type": "section"
    })

    const work_title = [
        ["TITLE", "Experience"],
        ["SPACE", "0cm"],
    ]

    ResumeDataItemTable.insert({
        id: dataItemId,
        title: "Work Experience Title",
        description: "undergrad",
        data: JSON.stringify(work_title),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: sectionId,
        data_item_id: dataItemId
    })

    dataItemId++
    sectionId++

    ////////////////////////////////////////////////
    // Project section header
    ///////////////////////////////////////////////
    console.log("    sectionId " + sectionId)
    ResumeSectionConfigTable.insert({
        "id": sectionId,
        "title": "Project Title Section",
        "resume_id": ResumeId,
        "template_id": 6,
        "section_order": 7,
        "section_type": "section"
    })

    const project_title = [
        ["TITLE", "Projects"],
        ["SPACE", "0cm"],
    ]

    ResumeDataItemTable.insert({
        id: dataItemId,
        title: "Project Section Title",
        description: "projects",
        data: JSON.stringify(project_title),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })
    

    ResumeSectionDataTable.insert({
        section_id: sectionId,
        data_item_id: dataItemId
    })

    dataItemId++
    sectionId++

    ////////////////////////////////////////////////
    // Education Section Header
    ///////////////////////////////////////////////
    console.log("    sectionId " + sectionId)
    ResumeSectionConfigTable.insert({
        "id": sectionId,
        "title": "Education Title Section",
        "resume_id": ResumeId,
        "template_id": 6,
        "section_order": 9,
        "section_type": "section"
    })

    const edu_title = [
        ["TITLE", "Education"],
        ["SPACE", "0cm"],
    ]

    ResumeDataItemTable.insert({
        id: dataItemId,
        title: "Education Section Title",
        description: "education",
        data: JSON.stringify(edu_title),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeSectionDataTable.insert({
        section_id: sectionId,
        data_item_id: dataItemId
    })

    dataItemId++
    sectionId++

    ////////////////////////////////////////////////
    // Jobs
    ///////////////////////////////////////////////
    info.jobs.forEach(inJob => {
        console.log("    sectionId " + sectionId)
        ResumeSectionConfigTable.insert({
            "id": sectionId,
            "title": "Current Job",
            "resume_id": ResumeId,
            "template_id": 3,
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

        ResumeDataItemTable.insert({
            id: dataItemId,
            title: `${inJob.title}@${inJob.company}`,
            description: "current job",
            data: JSON.stringify(jobData),
            type_id: 3,
            "created_at" : Date.now().toString(),
            "updated_at" : Date.now().toString(),
        })

        ResumeSectionDataTable.insert({
            section_id: sectionId,
            data_item_id: dataItemId
        })
        
        dataItemId++
        sectionId++
    })


    ResumeDataItemTypeTable.insert({
        "id": 1,
        name : "email"
    })

    ResumeDataItemTypeTable.insert({
        "id": 2,
        name : "skill"
    })

    ResumeDataItemTypeTable.insert({
        "id": 3,
        name : "experience"
    })

    ResumeDataItemTypeTable.insert({
        "id": 4,
        name : "project"
    })

    ResumeDataItemTypeTable.insert({
        "id": 5,
        name : "education"
    })


    const headerLaTeX = `
    \\newcommand{\\AND}{\\unskip\\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox\\ignorespaces}\\newsavebox\\ANDbox\\sbox\\ANDbox{$|$}\n\\begin{header}\n\\fontsize{31 pt}{31 pt}\\selectfont [[NAME]] 
    \\\\
    \\vspace{1 pt}
    \\normalsize
    \\mbox{Waterloo, ON}%
    \\kern 5.0 pt%
    \\AND%
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{tel:+01-[[PHONE]]}{+1 [[PHONE]]}}%
    \\kern 5.0 pt%
    \\AND%
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{mailto:[[EMAIL]]}{[[EMAIL]]}}%
    \\kern 5.0 pt%
    \\vspace{-3pt} %
    \\par
    \\kern-6pt %
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{[[LINKEDIN]]}{\\textcolor[HTML]{0366d6}{[[LINKEDIN]]}}}%
    \\kern 5.0 pt%
    \\AND%
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{[[WEBSITE]]}{\\textcolor[HTML]{0366d6}{[[WEBSITE]]}}}%
    \\kern 5.0 pt%
    \\AND%
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{[[GITHUB]]}{\\textcolor[HTML]{0366d6}{[[GITHUB]]}}}%
    \n\\end{header} 
    \n\\vspace{0.2cm}`;

    TemplateTable.insert({
        "id": 1,
        "name": "header template",
        "description": "this is a header template",
        "section_type": "header",
        "created_at" : Date.now().toString(),
        "content": headerLaTeX
    })

    let skillsLatex = ""

    info.skills.forEach((skillIn, i) => {
        skillsLatex = skillsLatex.concat(`\\textbf{[[SKILL_LABEL_${i}]]:} [[Point_${i}]] \\newline\n`)
    })

    TemplateTable.insert({
        "id": 2,
        "name": "skills template",
        "description": "this is a s template",
        "section_type": "header",
        "created_at" : Date.now().toString(),
        "content": skillsLatex
    })

     const expLatex = `
        \\begin{twocolentry}{
            05/2022 – 04/2023
        }
        \\fontsize{11 pt}{11 pt}\\textbf{[[TITLE]]}, [[COMPANY]] - Toronto ON, CA\\end{twocolentry}

        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                \\item [[POINT1]]
                \\item [[POINT2]]
                \\item [[POINT3]]
                \\item [[POINT4]]
            \\end{highlights}
        \\end{onecolentry}
        \n\\vspace{0.20 cm}
     `

    TemplateTable.insert({
        "id": 3,
        "name": "Exp template",
        "description": "this show's my experience",
        "section_type": "experience",
        "created_at" : Date.now().toString(),
        "content": expLatex
    })

    const proj_template = `
        \\begin{twocolentry_proj}{
        \\mbox{\\hrefWithoutArrow{[[URL]]}{\\textcolor[HTML]{0366d6}{[[URL]]}}}
        }{5.6cm}
        \\fontsize{11 pt}{11 pt}\\textbf{[[TITLE]]} - [[HIGHLIGHTS]]
        \\end{twocolentry_proj}
        \\begin{onecolentry}
            \\begin{highlights}
                \\item [[POINT1]]
                \\item [[POINT2]]
                \\item [[POINT3]]
                \\item [[POINT4]]
            \\end{highlights}
        \\end{onecolentry}
    `

    TemplateTable.insert({
        "id": 4,
        "name": "Project template",
        "description": "this show's my project",
        "section_type": "project",
        "created_at" : Date.now().toString(),
        "content": proj_template
    })

    const edu_template = `
        \\begin{twocolentry}{
            [[START_DATE]] – [[END_DATE]]
        }
        \\vspace{0.10 cm}
        \\textbf{[[UNI]]}, [[PROGRAM]] [[GPA]] 
        \\end{twocolentry}
    `
    TemplateTable.insert({
        "id": 5,
        "name": "Education Template",
        "description": "this show's my education",
        "section_type": "education",
        "created_at" : Date.now().toString(),
        "content": edu_template
    })

    const section_template = `
        \\section{[[TITLE]]}
        \\vspace{[[SPACE]]}
    `
    TemplateTable.insert({
        "id": 6,
        "name": "section title",
        "description": "header section",
        "section_type": "section",
        "created_at" : Date.now().toString(),
        "content": section_template
    })
}