// components/ModuleForm.tsx
import { ModuleEntity } from "@/types";

interface Props {
  form: ModuleEntity;
  editing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export default function ModuleForm({ form, editing, onChange, onSubmit, onCancel }: Props) {
  return (
    <div className="border border-gray-300 p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-3">
        {editing ? `Edit Module: ${form.refModule}` : "Add New Module"}
      </h2>

      <label className="block mb-2">
        Ref Module:
        <input
          type="text"
          name="refModule"
          value={form.refModule || ""}
          onChange={onChange}
          disabled={editing}
          className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
        />
      </label>

      <label className="block mb-2">
        Factory:
        <input
          type="text"
          name="refFactory"
          value={form.refFactory || ""}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
        />
      </label>

      <label className="block mb-2">
        Name Module:
        <input
          type="text"
          name="nameModule"
          value={form.nameModule || ""}
          onChange={onChange}
          className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
        />
      </label>

      <label className="block mb-4">
        Description:
        <textarea
          name="description"
          value={form.description || ""}
          onChange={onChange}
          rows={3}
          className="w-full border border-gray-300 rounded px-2 py-1 mt-1"
        />
      </label>

      <div className="flex gap-2">
        <button onClick={onSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          {editing ? "Update" : "Create"}
        </button>
        {editing && (
          <button onClick={onCancel} className="bg-gray-400 text-black px-4 py-2 rounded hover:bg-gray-500">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
