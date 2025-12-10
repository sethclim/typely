import { ResumeConfigTable, ResumeSectionConfigTable, ResumeSectionDataTable, ResumeDataItemTable, ResumeDataItemTypeTable, TemplateTable } from "../db/tables"

export const CreateDemoResume = () =>{

    const ResumeId = 1

    const HeaderSectionId = 1
    const SkillsSectionId = 2
    const CurrentJobSectionId = 3
    const PrevJobSectionId = 4
    const OldJobSectionId = 5
    const ProjectSectionId = 6
    const EducationSectionId = 7
    const WorkTitleSectionId = 8
    const ProjectTitleSectionId = 9
    const EducationTitleSectionId = 10

    const InfoDataItemId = 1
    const SkillDataItemId = 2
    const NameDataItemId = 3
    const Job1DataItemId = 4
    const Job2DataItemId = 5
    const ProjectDataItemId = 6
    const EducationDataItemId = 7
    const WorkSectionDataItemId = 8
    const ProjectSectionDataItemId = 9
    const EducationSectionDataItemId = 10

    ResumeConfigTable.insert({
        "id": ResumeId,
        "name" : "Demo Resume",
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })
    
    ResumeSectionConfigTable.insert({
        "id": HeaderSectionId,
        "title": "Custom Header",
        "resume_id": ResumeId,
        "template_id": 1,
        "section_order": 0,
        "section_type": "header"
    })

    ResumeSectionConfigTable.insert({
        "id": SkillsSectionId,
        "title": "C++ Skills",
        "resume_id": ResumeId,
        "template_id": 2,
        "section_order": 1,
        "section_type": "skills"
    })

    
    ResumeSectionConfigTable.insert({
        "id": CurrentJobSectionId,
        "title": "Current Job",
        "resume_id": ResumeId,
        "template_id": 3,
        "section_order": 3,
        "section_type": "experience"
    })
    
    ResumeSectionConfigTable.insert({
        "id": PrevJobSectionId,
        "title": "Previous Game Job",
        "resume_id": ResumeId,
        "template_id": 3,
        "section_order": 4,
        "section_type": "experience"
    })
    
    ResumeSectionConfigTable.insert({
        "id": OldJobSectionId,
        "title": "Old Job",
        "resume_id": ResumeId,
        "template_id": 3,
        "section_order": 5,
        "section_type": "experience"
    })
    
    ResumeSectionConfigTable.insert({
        "id": ProjectSectionId,
        "title": "C++ Project",
        "resume_id": ResumeId,
        "template_id": 4,
        "section_order": 7, 
        "section_type": "project"
    })
    
    ResumeSectionConfigTable.insert({
        "id": EducationSectionId,
        "title": "Education",
        "resume_id": ResumeId,
        "template_id": 5,
        "section_order": 9,
        "section_type": "education"
    })

    ResumeSectionConfigTable.insert({
        "id": WorkTitleSectionId,
        "title": "Work Title Section",
        "resume_id": ResumeId,
        "template_id": 6,
        "section_order": 2,
        "section_type": "section"
    })

    ResumeSectionConfigTable.insert({
        "id": ProjectTitleSectionId,
        "title": "Project Title Section",
        "resume_id": ResumeId,
        "template_id": 6,
        "section_order": 6,
        "section_type": "section"
    })

    ResumeSectionConfigTable.insert({
        "id": EducationTitleSectionId,
        "title": "Education Title Section",
        "resume_id": ResumeId,
        "template_id": 6,
        "section_order": 8,
        "section_type": "section"
    })
    
    ResumeSectionDataTable.insert({
        section_id: HeaderSectionId,  
        data_item_id: InfoDataItemId
    })

    ResumeSectionDataTable.insert({
        section_id: HeaderSectionId,
        data_item_id: NameDataItemId
    })

    ResumeSectionDataTable.insert({
        section_id: SkillsSectionId,
        data_item_id: SkillDataItemId
    })

    ResumeSectionDataTable.insert({
        section_id: CurrentJobSectionId,
        data_item_id: Job1DataItemId
    })

    ResumeSectionDataTable.insert({
        section_id: PrevJobSectionId,
        data_item_id: Job2DataItemId
    })

    ResumeSectionDataTable.insert({
        section_id: OldJobSectionId,
        data_item_id: Job1DataItemId
    })

    ResumeSectionDataTable.insert({
        section_id: ProjectSectionId,
        data_item_id: ProjectDataItemId
    })

    ResumeSectionDataTable.insert({
        section_id: EducationSectionId,
        data_item_id: EducationDataItemId
    })

    ResumeSectionDataTable.insert({
        section_id: WorkTitleSectionId,
        data_item_id: WorkSectionDataItemId
    })

    ResumeSectionDataTable.insert({
        section_id: ProjectTitleSectionId,
        data_item_id: ProjectSectionDataItemId
    })


    ResumeSectionDataTable.insert({
        section_id: EducationTitleSectionId,
        data_item_id: EducationSectionDataItemId
    })


    const me = [
        ["EMAIL", "somebody@gmail.com"],
        ["PHONE", "111-111-1111"],
        ["GITHUB", "github.com/me"],
        ["WEBSITE", "https://about-me.com"],
        ["LINKEDIN", "https://linkedin/me.com"]
    ]

    ResumeDataItemTable.insert({
        "id": InfoDataItemId,
        title: "My Info",
        description: "about me info",
        data: JSON.stringify(me),
        type_id: 1,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    const cplusSkills = [
        ["LANGUAGES", "C++, GO, Rust, C\\#, Python, Typescript, Lua, HLSL/GLSL"],
        ["VR","Unity, Vive, HoloLens, Quest, Unity XR Interation Tool Kit"],
        ["FRAMEWORKS", "Vulkan, OpenGL, JUCE, Skia, Dear ImGui, GLFW, GLM, Kubernetes, WebRTC"],
        ["GENERAL", "OOP, Functional, Git, Docker, CI/CD (Terraform, GitHub Actions), SQL, AWS"]
    ]

    ResumeDataItemTable.insert({
        "id": SkillDataItemId,
        title: "C++ Skills",
        description: "my c++ skills",
        data: JSON.stringify(cplusSkills),
        type_id: 2,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeDataItemTable.insert({
        "id": NameDataItemId,
        title: "My Name",
        description: "name",
        data: '[["NAME", "John Doe"]]',
        type_id: 1,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    const job1 = [
        ["TITLE", "Software Developer"], 
        ["COMPANY", "Acme Corp"], 
        ["POINT1", "Developed new APIs and wrote MySQL"],
        ["POINT2", "Improved key KPIs by 130%."],
        ["POINT3", "Regularly attended standups"],
        ["POINT4", "Saved corp \\$300,000 a year"]
    ]

    ResumeDataItemTable.insert({
        id: Job1DataItemId,
        title: "Acme Corp",
        description: "current job",
        data: JSON.stringify(job1),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

     const job2 = [
        ["TITLE", "Game Developer"], 
        ["COMPANY", "Game Company"], 
        ["POINT1", "Created multiplayer game with Unity Engine"],
        ["POINT2", "Developed character movement system."],
        ["POINT3", "Created an abstract networking layer"],
        ["POINT4", "Regularly collaborated with other team members"]
    ]

    ResumeDataItemTable.insert({
        id: Job2DataItemId,
        title: "XYZ Interactive",
        description: "old job",
        data: JSON.stringify(job2),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    const raytracer = [
        ["TITLE", "Vulkan RayTracer"],
        ["HIGHLIGHTS", "C++, Vulkan"],
        ["URL", "https://github/my-raytracer"],
        ["POINT1", "Created custom vulkan raytracer"],
        ["POINT2", "implemented dialetric material"],
    ]

    ResumeDataItemTable.insert({
        id: ProjectDataItemId,
        title: "Project",
        description: "raytracer",
        data: JSON.stringify(raytracer),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    const uni = [
        ["UNI", "University of Waterloo"],
        ["PROGRAM", "Honours Bachelor Computer Science"],
        ["START_DATE", "SEPT 2024"],
        ["END_DATE", "MAY 2028"],
        ["GPA", "4.0"]
    ]

    ResumeDataItemTable.insert({
        id: EducationDataItemId,
        title: "Uni",
        description: "undergrad",
        data: JSON.stringify(uni),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    const work_title = [
        ["TITLE", "Experience"],
        ["SPACE", "0cm"],
    ]

    ResumeDataItemTable.insert({
        id: WorkSectionDataItemId,
        title: "Work Experience Title",
        description: "undergrad",
        data: JSON.stringify(work_title),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    const project_title = [
        ["TITLE", "Projects"],
        ["SPACE", "0cm"],
    ]

    ResumeDataItemTable.insert({
        id: ProjectSectionDataItemId,
        title: "Project Section Title",
        description: "projects",
        data: JSON.stringify(project_title),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    const edu_title = [
        ["TITLE", "Education"],
        ["SPACE", "0cm"],
    ]

    ResumeDataItemTable.insert({
        id: EducationSectionDataItemId,
        title: "Education Section Title",
        description: "education",
        data: JSON.stringify(edu_title),
        type_id: 3,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
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

    const skillsLatex = `\\textbf{Languages:} [[LANGUAGES]] \\newline\n\\textbf{AR/VR:} [[VR]] \\newline\n\\textbf{Frameworks:} [[FRAMEWORKS]]  \\newline\n\\textbf{General:} [[GENERAL]] \\newline`

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