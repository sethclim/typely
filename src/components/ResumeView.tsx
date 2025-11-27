

import { useState } from 'react'

import { useResume } from '../context/resume/ResumeContext'
import { ResumeSectionConfigTable, ResumeSectionDataTable } from '../db/tables';

import Modal from "./Modal";
import ComboBox from './ComboBox';

import { ResumeTemplateDisplay } from './ResumeTemplateDisplay'
import { ComponentLibrary, DataItemComponent, TemplateItemComponent } from './ComponentLibrary';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { DataItem, Template } from '../types';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';

// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { OutputView } from './OutputView';

export const ResumeView = () => {
  const { resume: myResume } = useResume();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [draggingDataItem, setDraggingDataItem]= useState<DataItem | null>(null);
  const [draggingDataTemplate, setDraggingDataTemplate]= useState<Template | null>(null);

  const createResumeComponent = () => {
    if (myResume === null || selected == null)
      return;

    ResumeSectionConfigTable.insert({
      "resume_id": myResume!.id,
      "template_id": -1,
      "section_order": 0, //TODO needs to be the last one in the list
      "section_type": selected!
    })

    setSelected(null);
    setIsOpen(false);
  }

  function handleDragEnd(event : DragEndEvent) {
      const over = event.over
      const active = event.active
  
      if(!over || !active)
      {
        setDraggingDataItem(null)
        setDraggingDataTemplate(null)
        return;
      }
  
      const [overPrefix, section_id] = over.id.toString().split('-');
      const [activePrefix, active_id] = active.id.toString().split('-');
      // console.log("On Droppable overPrefix:" + overPrefix + " section_id " + section_id + " activePrefix " +  activePrefix  + " active id " + active_id)
      
      if (overPrefix === "dataitem" && activePrefix === "dataitem") {
        ResumeSectionDataTable.insert({
          section_id: parseInt(section_id),
          data_item_id: parseInt(active_id)
        })
      }
      else if (overPrefix === "template" && activePrefix === "template"){
        ResumeSectionConfigTable.updateTemplate(section_id, active_id)
      }

      setIsDragging(false);
      setDraggingDataItem(null)
      setDraggingDataTemplate(null)
    }

    function handleDragStart(event : DragStartEvent) {
      const active = event.active
      if(!active)
        return;

      setIsDragging(true);

      const [activePrefix, _] = active.id.toString().split('-');

      // console.log("activePrefix " + activePrefix)

      if(activePrefix === "dataitem")
      {
        setDraggingDataItem(active.data.current as unknown as DataItem)
      }
      else if(activePrefix === "template"){
        setDraggingDataTemplate(active.data.current as unknown as Template)
      }

    }

    const activationConstraint={
      delay: 250,
      tolerance: 5,
    }

  const mouseSensor = useSensor(MouseSensor, { activationConstraint });
  const sensors = useSensors(mouseSensor);

  return (
    <DndContext onDragStart={handleDragStart}  onDragEnd={handleDragEnd} sensors={sensors} >
      <div className='flex flex-1 flex-row w-lvw justify-start bg-white p-4 gap-2'>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={30} minSize={20}>
              <ComponentLibrary />
          </Panel>
          <PanelResizeHandle className="w-3 bg-white flex flex-col justify-center items-center data-[resize-handle-active]:bg-gray-200">
            <ArrowsRightLeftIcon
              className="h-3 w-3 text-black"
            />
          </PanelResizeHandle>
          <Panel minSize={45}>
            <div className='bg-black w-full h-full'>
              <h3 className='text-4xl font-extrabold text-white'>{myResume?.name}</h3>
              <div className='flex flex-row w-full h-full'>
                <PanelGroup direction="horizontal">
                  <Panel defaultSize={35} minSize={30}>
                    <div className='flex flex-col gap-4 p-4'>
                    {
                      myResume?.sections.map((section) => {
                        return <ResumeTemplateDisplay key={section.id} resumeSection={section} /> 
                      })
                    }
                      <button className='bg-white text-black rounded-lg' onClick={() => setIsOpen(true)}>Add New Component +</button>
                    </div>
                  </Panel>

                  <PanelResizeHandle className="w-2 mx-2 bg-white flex flex-col justify-center items-center data-[resize-handle-active]:bg-gray-200">
                    <ArrowsRightLeftIcon
                      className="h-2 w-2 text-black"
                    />
                  </PanelResizeHandle>
                  <Panel minSize={45}>
                    <OutputView resume={myResume} />
                  </Panel>
                </PanelGroup>
              </div>
            </div>
          </Panel>
        </PanelGroup>

         <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} width='w-80'>
          <h2 className="text-xl font-bold mb-4 text-black">New Resume Block</h2>uik
          <form>
            <p className="text-black">Type</p>
            <ComboBox selected={selected} onSelectedChange={setSelected} options={["Skills"]} />
          </form>
          <div className='flex flex-row gap-4'>
            <button
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
              onClick={() => createResumeComponent()}
            >
              Create
            </button>
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>

       <DragOverlay>
        {(isDragging && draggingDataItem)? (
          <DataItemComponent dataItem={draggingDataItem} />
        ): null}
        {(isDragging && draggingDataTemplate)? (
          <TemplateItemComponent template={draggingDataTemplate} />
        ): null}
      </DragOverlay>
    </DndContext>
  )
}