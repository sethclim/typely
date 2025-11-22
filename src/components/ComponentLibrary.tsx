import { useEffect, useState } from "react"
import { ResumeDataItemTable,  } from '../db/tables';
import { DataItemRow } from "../db/types";
import { DB } from "../db";
import { DataItem, DataItemType } from "../types";

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

export const ComponentLibrary = (props : componentLibraryProps) => {

    const [dataItems, setDataItems] = useState<Array<DataItem>>();

    useEffect(() => {
            const init = async () => {
                await DB.ready;
                const data = ResumeDataItemTable.getAll();
                console.log("data " + JSON.stringify(data))
                const hydrated = data.map((item) => mapRowToDataItem(item))
                console.log("Hydrated " + JSON.stringify(hydrated))
                setDataItems(hydrated)
            }
            init();
        }, []
    )

    return (
        <div className="flex flex-col w-100">
            <h3 className="text-xl text-bold">Component Library</h3>
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
        </div>
    )
}