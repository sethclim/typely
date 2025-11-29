import { ResumeConfigTable, ResumeSectionConfigTable, ResumeSectionDataTable, ResumeDataItemTable, ResumeDataItemTypeTable, TemplateTable } from "../db/tables"

export const CreateDemoResume = () =>{
    ResumeConfigTable.insert({
        "id": 1,
        "name" : "Demo Resume",
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })
    
    ResumeSectionConfigTable.insert({
        "id": 1,
        "title": "Custom Header",
        "resume_id": 1,
        "template_id": 1,
        "section_order": 0,
        "section_type": "header"
    })

    ResumeSectionConfigTable.insert({
        "id": 2,
        "title": "C++ Skills",
        "resume_id": 1,
        "template_id": 2,
        "section_order": 1,
        "section_type": "skills"
    })

    ResumeSectionConfigTable.insert({
        "id": 3,
        "title": "Current Job",
        "resume_id": 1,
        "template_id": 3,
        "section_order": 2,
        "section_type": "experience"
    })

    ResumeSectionConfigTable.insert({
        "id": 4,
        "title": "Previous Game Job",
        "resume_id": 1,
        "template_id": 3,
        "section_order": 3,
        "section_type": "experience"
    })



    ResumeSectionConfigTable.insert({
        "id": 5,
        "title": "Old Job",
        "resume_id": 1,
        "template_id": 3,
        "section_order": 4,
        "section_type": "experience"
    })


    ResumeSectionDataTable.insert({
        section_id: 1,
        data_item_id: 1
    })

    ResumeSectionDataTable.insert({
        section_id: 1,
        data_item_id: 3
    })

    ResumeSectionDataTable.insert({
        section_id: 2,
        data_item_id: 2
    })

    ResumeSectionDataTable.insert({
        section_id: 3,
        data_item_id: 4
    })

    ResumeSectionDataTable.insert({
        section_id: 4,
        data_item_id: 4
    })

    ResumeSectionDataTable.insert({
        section_id: 5,
        data_item_id: 4
    })


    const me = [
        ["EMAIL", "somebody@gmail.com"],
        ["PHONE", "111-111-1111"],
        ["GITHUB", "github.com/me"],
        ["WEBSITE", "https://about-me.com"],
        ["LINKEDIN", "https://linkedin/me.com"]
    ]

    ResumeDataItemTable.insert({
        "id": 1,
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
        "id": 2,
        title: "C++ Skills",
        description: "my c++ skills",
        data: JSON.stringify(cplusSkills),
        type_id: 2,
        "created_at" : Date.now().toString(),
        "updated_at" : Date.now().toString(),
    })

    ResumeDataItemTable.insert({
        "id": 3,
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
        "id": 4,
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
        "id": 4,
        title: "XYZ Interactive",
        description: "old job",
        data: JSON.stringify(job2),
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


    const headerLaTeX = `
    \\newcommand{\\AND}{\\unskip\\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox\\ignorespaces}\\newsavebox\\ANDbox\\sbox\\ANDbox{$|$}\n\\begin{header}\n\\fontsize{31 pt}{31 pt}\\selectfont {{NAME}} 
    \\\\
    \\vspace{1 pt}
    \\normalsize
    \\mbox{Waterloo, ON}%
    \\kern 5.0 pt%
    \\AND%
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{tel:+01-  {{PHONE}} }{+1  {{PHONE}} }}%
    \\kern 5.0 pt%
    \\AND%
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{mailto: {{EMAIL}} }{ {{EMAIL}}} }%
    \\kern 5.0 pt%
    \\vspace{-3pt} %
    \\par
    \\kern-6pt %
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{ {{LINKEDIN}} }{\\textcolor[HTML]{0366d6}{ {{LINKEDIN}} }}}%
    \\kern 5.0 pt%
    \\AND%
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{ {{WEBSITE}} }{\\textcolor[HTML]{0366d6}{ {{WEBSITE}} }}}%
    \\kern 5.0 pt%
    \\AND%
    \\kern 5.0 pt%
    \\mbox{\\hrefWithoutArrow{ {{GITHUB}} }{\\textcolor[HTML]{0366d6}{ {{GITHUB}} }}}%
    \n\\end{header}`;

    TemplateTable.insert({
        "id": 1,
        "name": "header template",
        "description": "this is a header template",
        "section_type": "header",
        "created_at" : Date.now().toString(),
        "content": headerLaTeX
    })

    const skillsLatex = `\\textbf{Languages:} {{LANGUAGES}} \\newline\n\\textbf{AR/VR:} {{VR}} \\newline\n\\textbf{Frameworks:} {{FRAMEWORKS}}  \\newline\n\\textbf{General:} {{GENERAL}} \\newline`

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
        \\fontsize{11 pt}{11 pt}\\textbf{ {{TITLE}} }, {{COMPANY}} - Toronto ON, CA\\end{twocolentry}

        \\vspace{0.10 cm}
        \\begin{onecolentry}
            \\begin{highlights}
                \\item {{POINT1}}
                \\item {{POINT2}}
                \\item {{POINT3}}
                \\item {{POINT4}}
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
}