import { useEffect } from 'react'
import './App.css'

import { DB } from "./db";

import { ResumeProvider } from './context/resume/ResumeProvider'
import { ResumeConfigTable, ResumeDataItemTable, ResumeDataItemTypeTable, ResumeSectionConfigTable, ResumeSectionDataTable, TemplateTable } from './db/tables';

import {DndContext, DragEndEvent} from '@dnd-kit/core';
import { ResumeView } from './components/ResumeView';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

function App() {

  function handleDragEnd(event : DragEndEvent) {
    const over = event.over
    const active = event.active

    if(!over || !active)
      return;

    const [overPrefix, section_id] = over.id.toString().split('-');
    const [activePrefix, active_id] = active.id.toString().split('-');
    console.log("On Droppable overPrefix:" + overPrefix + " section_id " + section_id + " activePrefix " +  activePrefix  + " active id " + active_id)
    
    if (overPrefix === "dataitem" && activePrefix === "dataitem") {
      ResumeSectionDataTable.insert({
        section_id: parseInt(section_id),
        data_item_id: parseInt(active_id)
      })
    }
    else if (overPrefix === "template" && activePrefix === "template"){
      ResumeSectionConfigTable.updateTemplate(section_id, active_id)
    }
  }

  useEffect(() => {
      const init = async () => {
        await DB.ready;

        ResumeConfigTable.insert({
          "id": 1,
          "name" : "Resume_1",
          "created_at" : Date.now().toString(),
          "updated_at" : Date.now().toString(),
        })

        ResumeSectionConfigTable.insert({
          "id": 1,
          "resume_id": 1,
          "template_id": 1,
          "section_order": 0,
          "section_type": "header"
        })

        ResumeSectionConfigTable.insert({
          "id": 2,
          "resume_id": 1,
          "template_id": 2,
          "section_order": 1,
          "section_type": "skills"
        })

        ResumeSectionDataTable.insert({
          section_id: 1,
          data_item_id: 1
        })

        ResumeSectionDataTable.insert({
          section_id: 2,
          data_item_id: 2
        })

        ResumeDataItemTable.insert({
          "id": 1,
          title: "email",
          description: "my email",
          data: '{"email": "sethclim@gmail.com"}',
          type_id: 1,
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

        const headerLaTeX = `\\newcommand{\\AND}{\\unskip
          \\cleaders\\copy\\ANDbox\\hskip\\wd\\ANDbox
          \\ignorespaces
          }
          \\newsavebox\\ANDbox
          \\sbox\\ANDbox{$|$}

          \\begin{header}
              \\fontsize{31 pt}{31 pt}\\selectfont Seth Climenhaga
          \\end{header}
          `;


        TemplateTable.insert({
          "id": 1,
          "name": "header template",
          "description": "this is a header template",
          "section_type": "header",
          "created_at" : Date.now().toString(),
          "content": headerLaTeX
        })

        const skillsLatex = `\\textbf{Languages:} C++, GO, Rust, C\\#, Python, Typescript, Lua, HLSL/GLSL \\newline
                              \\textbf{AR/VR:} Unity, Vive, HoloLens, Quest, Unity XR Interation Tool Kit  \\newline
                              \\textbf{Frameworks:} Vulkan, OpenGL, JUCE, Skia, Dear ImGui, GLFW, GLM, Kubernetes, WebRTC  \\newline
                              \\textbf{General:} OOP, Functional, Git, Docker, CI/CD (Terraform, GitHub Actions), SQL, AWS \\newline`

        TemplateTable.insert({
          "id": 2,
          "name": "skills template",
          "description": "this is a s template",
          "section_type": "header",
          "created_at" : Date.now().toString(),
          "content": skillsLatex
        })
      }
      init();
    }, []
  )

 return (
    <ResumeProvider resumeId={1}>
      <DndContext onDragEnd={handleDragEnd}>
        <Header />
        <ResumeView />
        <Footer />
      </DndContext>
    </ResumeProvider>
 )
}

export default App
