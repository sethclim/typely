import { DataItem } from "../types";


interface Props {
  dataItems: DataItem[];
}

export default function GroupedTable({ dataItems }: Props) {
//   // Parse all data items safely
//     const parsedItems = dataItems.map(item => {
//         if (!item.data) return { title: item.title, data: {} as Record<string, string> };

//         // Remove outer quotes if needed
//         let raw = item.data;

//         if(!raw)
//             return { title: item.title, data: {} as Record<string, string> };

//         console.log("RAW ", typeof raw)

//         if(typeof raw === "string" )
//         {
//             if (raw.startsWith('"') && raw.endsWith('"')) raw = raw.slice(1, -1);
//             // Replace Python-style quotes or escaped quotes
//             const fixed = raw.replace(/\\"/g, '"').replace(/'/g, '"');
//             try {
//             const parsed = JSON.parse(fixed) as Record<string, string>;
//             return { title: item.title, data: parsed };
//             } catch {
//             return { title: item.title, data: {} as Record<string, string> };
//             }
//         }
//         else{
//             return { title: item.title, data: raw as Record<string, string> };
//         }


//     });

    // console.log("parsedItems", parsedItems);

    return (
    <table className="w-full border-collapse border border-gray-200">
        <thead className="bg-gray-50">
        <tr>
            <th className="px-2 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Title</th>
            <th className="px-2 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Key</th>
            <th className="px-2 py-2 text-left font-medium text-gray-700">Value</th>
        </tr>
        </thead>
        <tbody className="bg-white">
        {dataItems.map((item, i) => {
            // const entries = Object.entries(item.data);
            if (item.data.length === 0) {
            return (
                <tr key={i}>
                    <td className="px-2 py-2 text-left border-r border-gray-200">{item.title}</td>
                    <td className="px-2 py-2 text-left border-r border-gray-200" colSpan={2}></td>
                </tr>
            );
            }

            return item.data.map(([key, value], j) => (
            <tr key={`${i}-${j}`} className="border-b  border-gray-200">
                {j === 0 && (
                <td
                    className="px-2 py-2 font-medium text-gray-700 text-left border-r border-gray-200"
                    rowSpan={item.data.length}
                >
                    {item.title}
                </td>
                )}
                <td className="px-2 py-2 text-gray-700 text-left border-r border-gray-200">{key}</td>
                <td className="px-2 py-2 text-gray-900 text-left">{value}</td>
            </tr>
            ));
        })}
        </tbody>
    </table>
    );

}
