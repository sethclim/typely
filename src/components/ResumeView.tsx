

import { useEffect, useState } from 'react'

import { useResume } from '../context/resume/ResumeContext'
import { ResumeSectionConfigTable, ResumeSectionDataTable } from '../db/tables';

import Modal from "./Modal";
import ComboBox from './ComboBox';

import { ResumeSectionCard } from './ResumeTemplateDisplay'
import { ComponentLibrary, DataItemComponent, TemplateItemComponent } from './ComponentLibrary';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { DataItem, ResumeSection, Template } from '../types';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';

// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-ignore
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import { ArrowsRightLeftIcon } from "@heroicons/react/24/solid";
import { OutputView } from './OutputView';
import { CurrentResumeBlockViewer } from './CurrentResumeBlockViewer';

type ReplaceDataItemInfo = {
  section_id : string
  active :  DataItem
  match : DataItem
}

export const ResumeView = () => {
  const { resume: myResume } = useResume();
  const [isNewResumeOpen, setIsNewRsumeOpen] = useState(false);
  const [isReplaceDataItemOpen, setReplaceDataItemOpen] = useState(false);
  const [replaceDataItemData, setReplaceDataItemData] = useState<ReplaceDataItemInfo | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);

  const [draggingDataItem, setDraggingDataItem]= useState<DataItem | null>(null);
  const [draggingDataTemplate, setDraggingDataTemplate]= useState<Template | null>(null);
  const [draggingDataSection, setDraggingDataSection]= useState<ResumeSection | null>(null);

  useEffect(() => {
    console.log("DRAGING??? " + draggingDataSection)
  }, [draggingDataSection])

  const createResumeComponent = () => {
    if (myResume === null || selected == null || title == undefined)
      return;

    ResumeSectionConfigTable.insert({
      "resume_id": myResume!.id,
      "title": title,
      "template_id": -1,
      "section_order": 0, //TODO needs to be the last one in the list
      "section_type": selected!
    })

    setSelected(null);
    setIsNewRsumeOpen(false);
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

    if (overPrefix === "dataitem" && activePrefix === "dataitem") {
      //check if keys match then show dialog 
      console.log("DRAG END " + JSON.stringify(active.data) + JSON.stringify(over.data))

      const active_data_item_keys = active.data.current?.data.map((item : string[]) => item[0]).sort();

      const over_data_items_keys_list : [] = over.data.current?.map((item : DataItem) => item.data.map((item : string[]) => item[0]))

      console.log("active_data_item_keys " + JSON.stringify(active_data_item_keys) + " over_data_items_keys_list " + JSON.stringify(over_data_items_keys_list))


      const match = over.data.current?.find((item: DataItem) => {
        const keys = item.data.map((d: string[]) => d[0]).sort();
        return (
          keys.length === active_data_item_keys.length &&
          keys.every((k, i) => k === active_data_item_keys[i])
        );
      });

      if(match != undefined){
        //show modal
        setReplaceDataItemData({section_id: section_id, active : active.data.current as unknown as DataItem, match : match})
        setReplaceDataItemOpen(true)
      }else{
        ResumeSectionDataTable.insert({
          section_id: parseInt(section_id),
          data_item_id: parseInt(active_id)
        })
      }
    }
    else if (overPrefix === "template" && activePrefix === "template"){
      ResumeSectionConfigTable.updateTemplate(section_id, active_id)
    }
    else if(overPrefix === "section" && activePrefix === "section"){
      console.log("THIS IS OVER!!!")
    }

    setIsDragging(false);
    setDraggingDataItem(null)
    setDraggingDataTemplate(null)
    setDraggingDataSection(null)
  }

  function handleDragStart(event : DragStartEvent) {
    const active = event.active
    if(!active)
      return;

    setIsDragging(true);

    const [activePrefix, _] = active.id.toString().split('-');

    console.log("activePrefix " + activePrefix)

    if(activePrefix === "dataitem")
    {
      setDraggingDataItem(active.data.current as unknown as DataItem)
    }
    else if(activePrefix === "template"){
      setDraggingDataTemplate(active.data.current as unknown as Template)
    }
    else if(activePrefix === "section"){
      setDraggingDataSection(active.data.current as unknown as ResumeSection)
    }

  }

  const ReplaceDataItem = (section_id : string, old_data_item_id : number, new_data_item_id : number) => {
    // delete match
    ResumeSectionDataTable.delete({section_id : parseInt(section_id),  data_item_id : old_data_item_id})
    // add new
    ResumeSectionDataTable.insert({
      section_id: parseInt(section_id),
      data_item_id: new_data_item_id
    })
    setReplaceDataItemOpen(false)
    setReplaceDataItemData(null)
  }

  const AddDataItem = (section_id : string, active_id : number) => {
    ResumeSectionDataTable.insert({
      section_id: parseInt(section_id),
      data_item_id: active_id
    })
    setReplaceDataItemOpen(false)
    setReplaceDataItemData(null)
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
            <div className='bg-black w-full flex flex-col  min-h-full'>
              <h3 className='text-3xl font-bold text-white p-4'>{myResume?.name}</h3>
                <PanelGroup direction="horizontal" className="flex-1 h-full">
                    <Panel defaultSize={35} minSize={30}>
                      <CurrentResumeBlockViewer resume={myResume} setIsNewRsumeOpen={setIsNewRsumeOpen}  />
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
          </Panel>
        </PanelGroup>

         <Modal isOpen={isNewResumeOpen} onClose={() => setIsNewRsumeOpen(false)} width='w-100'>
          <h2 className="text-xl font-bold mb-4 text-black">New Resume Block</h2>
          <form>
            <p className="text-black">Title</p>
            <input className='bg-gray-200 w-64' value={title ?? ""} onChange={(e) => setTitle(e.target.value)}  />
            <p className="text-black">Type</p>
            <ComboBox selected={selected} onSelectedChange={setSelected} options={["Skills"]} />
          </form>
          <div className='flex flex-row gap-4'>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => createResumeComponent()}
            >
              Create
            </button>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => setIsNewRsumeOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>

        <Modal isOpen={isReplaceDataItemOpen} onClose={() => setReplaceDataItemOpen(false)} width='w-100'>
          <h2 className="text-xl font-bold mb-4 text-black">{replaceDataItemData?.active.title} has same keys as {replaceDataItemData?.match.title}</h2>
          <h2 className="text-xl font-bold mb-4 text-black">Do You Want To Replace?</h2>
          {/* <form>
            <p className="text-black">Title</p>
            <input className='bg-gray-200 w-64' value={title ?? ""} onChange={(e) => setTitle(e.target.value)}  />
            <p className="text-black">Type</p>
            <ComboBox selected={selected} onSelectedChange={setSelected} options={["Skills"]} />
          </form> */}
          <div className='flex flex-row gap-4'>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => ReplaceDataItem(replaceDataItemData?.section_id!, replaceDataItemData?.match.id!, replaceDataItemData?.active.id!)}
            >
              Yes
            </button>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => AddDataItem(replaceDataItemData?.section_id!, replaceDataItemData?.active.id!)}
            >
              No Add Anyways
            </button>
            <button
              className="mt-4 px-4 py-2 bg-black text-white rounded"
              onClick={() => setReplaceDataItemOpen(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
      {
        ((draggingDataSection === null)) ? (
          <DragOverlay>
            {(isDragging && draggingDataItem)? (
              <DataItemComponent dataItem={draggingDataItem} />
            ): null}
            {(isDragging && draggingDataTemplate)? (
              <TemplateItemComponent template={draggingDataTemplate} />
            ): null}
          </DragOverlay>
        ) : null
      }
    </DndContext>
  )
}