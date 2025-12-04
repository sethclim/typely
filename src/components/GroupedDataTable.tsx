import { TrashIcon } from "@heroicons/react/20/solid";
import { DataItem } from "../types";


interface Props {
  dataItems: DataItem[];
  onRemove : (id : number) => void;
}

export default function GroupedTable({ dataItems, onRemove } : Props) {

    return (
        <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-50">
            <tr>
                <th className="px-2 py-2 text-left font-medium text-gray-700 border-r border-gray-200"></th>
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
                    <>
                        <td className="px-2 py-2 font-medium text-gray-700 text-left border-r border-gray-200"  rowSpan={item.data.length}>
                            <button >
                                <TrashIcon className="text-red-400 w-5 h-5" onClick={() => onRemove(item.id)} />
                            </button>
                        </td>
                        <td
                            className="px-2 py-2 font-medium text-gray-700 text-left border-r border-gray-200"
                            rowSpan={item.data.length}
                        >
                            {item.title}
                        </td>
                    </>
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
