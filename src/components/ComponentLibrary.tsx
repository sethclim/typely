import { useEffect, useState } from "react"
import { ResumeDataItemTable, TemplateTable,  } from '../db/tables';
import { DataItemRow, TemplateRow } from "../db/types";
import { DB } from "../db";
import { DataItem, DataItemType, Template } from "../types";
import ThreeWaySlider from "./ThreeWaySlider";

import SyntaxHighlighter from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/hljs';

type componentLibraryProps = {
    // latex_comps : Array<Block>
}

export function mapRowToDataItem(
    row: DataItemRow,
    // type: DataItemType
): DataItem {
   const d : DataItemType = {id: 14, name: "TODO"}
    return {
        id: row.id,
        type:  d,
        title: row.title,
        description: row.description,
        data: row.data,
        created_at: row.created_at,
        updated_at: row.updated_at
    };
}

export function mapRowToTemplate(
    row: TemplateRow,
): Template {
//    const d : DataItemType = {id: 14, name: "TODO"}
    return {
        id: row.id,
        name: row.name,
        sectionType: row.section_type,
        content: row.content,
        description: row.description,
    };
}

export const ComponentLibrary = (props : componentLibraryProps) => {

    const [dataItems, setDataItems] = useState<Array<DataItem>>();
    const [templates, setTemplates] = useState<Array<Template>>();

    const [level, setLevel] = useState("DataItems");

    useEffect(() => {
            const init = async () => {
                await DB.ready;
                const data = ResumeDataItemTable.getAll();
                const hydrated = data.map((item) => mapRowToDataItem(item))
                setDataItems(hydrated)

                const templateData = TemplateTable.getAll();
                const hydratedTemplate = templateData.map((item) => mapRowToTemplate(item))
                setTemplates(hydratedTemplate)
            }
            init();
        }, []
    )



    return (
        <div className="flex flex-col w-150">
            <h3 className="text-xl text-bold text-black">Component Library</h3>

            <ThreeWaySlider
                options={["DataItems", "Templates", "Instances"]}
                value={level}
                onChange={setLevel}
                className="w-full"
            />

            {
                (level == "DataItems") ?  
                    <div className="flex flex-col gap-4">
                    {
                        dataItems?.map((comp, index) => {
                            return (
                                <div className="max-h-20 text-black text-ellipsis overflow-hidden bg-white/40">
                                    <h3 className="text-xl text-bold">{comp.title}</h3>
                                    <p className="max-h-40 text-ellipsis">{comp.data}</p>
                                </div>
                            )
                        })
                    }
                    </div> 
                : null
            }

            {
                 (level == "Templates") ?  
                    <div className="flex flex-col gap-4">
                    {
                        templates?.map((template, index) => {
                            return (
                                <div className=" text-black text-ellipsis overflow-hidden bg-white/40">
                                    {/* <p>{JSON.stringify(template)}</p> */}
                                    <h3 className="text-xl text-bold">{template.name}</h3>
                                    <SyntaxHighlighter language="latex" style={nord} >
                                        {template.content}
                                    </SyntaxHighlighter>
                                    {/* <p className="max-h-40 text-ellipsis">{template.content}</p> */}
                                </div>
                            )
                        })
                    }
                    </div> 
                : null
            }

           
        </div>
    )
}