import useModules from "@/utils/useModules";
import { ModuleEntity } from "@/types";
import { useState } from "react";
import ModuleTable from "@/components/Tables/ModuleTable";
import ModuleForm from "@/components/Forms/ModuleForm";
const emptyModule: ModuleEntity = {
  refModule: null,
  refFactory: null,
  nameModule: null,
  description: null,
};

export default function TestFetch() {
  const { modules, loading, error, create, update, remove } = useModules();
  const [form, setForm] = useState<ModuleEntity>(emptyModule);
  const [editingModule, setEditingModule] = useState<ModuleEntity | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmit = async () => {
    if (!form.refModule || !form.nameModule) return alert("Required fields missing");

    if (editingModule) {
      await update(editingModule.refModule!, form);
    } else {
      await create(form);
    }

    setForm(emptyModule);
    setEditingModule(null);
  };

  const onEdit = (module: ModuleEntity) => {
    setEditingModule(module);
    setForm(module);
  };

  const onCancel = () => {
    setEditingModule(null);
    setForm(emptyModule);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Modules CRUD</h1>

      {error && <p className="text-red-600 mb-2">Error: {error}</p>}

      {loading ? (
        <p>Loading modules...</p>
      ) : (
        <ModuleTable modules={modules} onEdit={onEdit} onDelete={remove} />
      )}

      <ModuleForm
        form={form}
        editing={!!editingModule}
        onChange={onChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
