// components/ModuleTable.tsx
import { ModuleEntity } from "@/types";

interface Props {
  modules: ModuleEntity[];
  onEdit: (m: ModuleEntity) => void;
  onDelete: (ref: string) => void;
}

const ModuleTable: React.FC<Props> = ({ modules, onEdit, onDelete }) => {
  return (
    <table className="w-full border-collapse border border-gray-300 mb-6">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-3 py-1">Ref</th>
          <th className="border px-3 py-1">Factory</th>
          <th className="border px-3 py-1">Name</th>
          <th className="border px-3 py-1">Description</th>
          <th className="border px-3 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {modules.length === 0 ? (
          <tr>
            <td colSpan={5} className="text-center p-4">
              No modules found
            </td>
          </tr>
        ) : (
          modules.map((m) => (
            <tr key={m.refModule}>
              <td className="border px-3 py-1">{m.refModule}</td>
              <td className="border px-3 py-1">{m.refFactory}</td>
              <td className="border px-3 py-1">{m.nameModule}</td>
              <td className="border px-3 py-1">{m.description}</td>
              <td className="border px-3 py-1 space-x-2">
                <button
                  onClick={() => onEdit(m)}
                  className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => m.refModule && onDelete(m.refModule)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ModuleTable;
