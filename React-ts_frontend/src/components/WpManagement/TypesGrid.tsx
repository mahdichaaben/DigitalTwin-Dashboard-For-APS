import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";
import { WorkpieceTypeDto } from "@/types/workpiece";
import { ModuleDto } from "@/types/module";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";

export default function TypesGrid() {
  const [types, setTypes] = useState<WorkpieceTypeDto[]>([]);
  const [modules, setModules] = useState<ModuleDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Filter modules to exclude those with "MOVE" or "HBW" in their names
  const filteredModules = modules.filter(module => {
    const allowedSerials = ['DPS001', 'DRILL001', 'MILL001', 'AIQS001'];
    return allowedSerials.includes(module.serialNumber);
  });

  // fetch types & modules
  const fetchTypes = () => {
    setLoading(true);
    api
      .get<WorkpieceTypeDto[]>("api/Workpiece/types")
      .then((res) => setTypes(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTypes();
    api.get<ModuleDto[]>("api/Factory/modules").then((res) => setModules(res.data));
  }, []);

  const getTypeColor = (color: string) => {
    switch ((color || "").toUpperCase()) {
      case "RED":
        return "#EF4444";
      case "BLUE":
        return "#3B82F6";
      case "WHITE":
        return "#F3F4F6";
      case "GREEN":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const openConfig = (type: WorkpieceTypeDto) => {
    setEditingType(type.id);
    const current = filteredModules
      .filter((m) => type.moduleNames.includes(m.name))
      .map((m) => m.serialNumber);
    setSelectedModules(current);
  };

  const closeModal = () => {
    setEditingType(null);
    setSelectedModules([]);
  };

  const handleSave = async () => {
    if (!editingType) return;
    setSaving(true);
    try {
      const payload = {
        modulesIds: selectedModules,
      };
      
      console.log('=== SAVE DEBUG ===');
      console.log('Selected modules order:', selectedModules);
      console.log('Module details in order:');
      selectedModules.forEach((id, index) => {
        const module = filteredModules.find(m => m.serialNumber === id);
        console.log(`${index + 1}. ${id} -> ${module?.name}`);
      });
      console.log('Sending payload:', payload);
      
      const response = await api.put(`api/Workpiece/types/${editingType}`, payload);
      
      console.log('API Response moduleNames:', response.data.moduleNames);
      console.log('Expected order:', selectedModules.map(id => {
        const module = filteredModules.find(m => m.serialNumber === id);
        return module?.name;
      }));
      console.log('Actual order from API:', response.data.moduleNames);
      console.log('=== END DEBUG ===');
      
      fetchTypes();
      closeModal();
    } catch (err) {
      console.error("Save error", err);
      // optionally show toast / error
    } finally {
      setSaving(false);
    }
  };

  // dnd sensors
  const sensors = useSensors(useSensor(PointerSensor));

  // remove module from ordered list
  const removeModuleAt = (index: number) => {
    setSelectedModules((prev) => prev.filter((_, i) => i !== index));
  };

  // remove by id (helper)
  const removeModuleById = (id: string) =>
    setSelectedModules((prev) => prev.filter((x) => x !== id));

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {types.map((t) => (
          <div
            key={t.id}
            className="p-4 border border-green-100 rounded-xl shadow-sm bg-white"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-md shadow"
                style={{ backgroundColor: getTypeColor(t.color) }}
              />
              <div>
                <div className="font-medium text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Modules Order:{" "}
                  <span className="text-sm text-gray-600">
                    {t.moduleNames && t.moduleNames.length
                      ? t.moduleNames
                          .filter(name => {
                            const upperName = name.toUpperCase();
                            return !upperName.includes('MOVE') && !upperName.includes('HBW');
                          })
                          .join(" → ")
                      : "None"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <button
                onClick={() => openConfig(t)}
                className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700"
              >
                Configure Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {editingType && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              if (!saving) closeModal();
            }}
          />

          <div className="relative z-10 w-full max-w-2xl mx-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-green-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Arrange Modules (order matters)
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Drag to reorder. Use the remove icon to delete a module from the sequence.
                    <br />

                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!saving) closeModal();
                    }}
                    className="px-3 py-1 rounded border text-sm hover:bg-blue-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-3 py-1 rounded bg-green-600 text-white text-sm disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Order"}
                  </button>
                </div>
              </div>

              {/* Live preview of sequence */}
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-2">Live preview</div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedModules.length === 0 ? (
                    <div className="text-sm text-gray-500">No modules selected</div>
                  ) : (
                    selectedModules.map((id, i) => {
                      const m = filteredModules.find((x) => x.serialNumber === id);
                      return (
                        <div
                          key={id}
                          className="flex items-center gap-2 px-3 py-1 rounded border bg-gray-50 text-sm"
                        >
                          <div className="text-xs text-gray-500">{i + 1}</div>
                          <div className="font-medium">{m?.name ?? id}</div>
                          {i < selectedModules.length - 1 && (
                            <div className="text-gray-400">→</div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ordered list (draggable) */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Ordered Sequence</div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={({ active, over }) => {
                      if (over && active.id !== over.id) {
                        const oldIndex = selectedModules.indexOf(active.id as string);
                        const newIndex = selectedModules.indexOf(over.id as string);
                        setSelectedModules((items) => arrayMove(items, oldIndex, newIndex));
                      }
                    }}
                  >
                    <SortableContext
                      items={selectedModules}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="flex flex-col gap-2 max-h-72 overflow-auto p-2 border rounded-md bg-gray-50">
                        {selectedModules.length === 0 ? (
                          <div className="text-sm text-gray-500 p-3">No modules selected yet.</div>
                        ) : (
                          selectedModules.map((id, idx) => {
                            const mod = filteredModules.find((m) => m.serialNumber === id);
                            return (
                              <SortableRow
                                key={id}
                                id={id}
                                index={idx}
                                label={mod?.name ?? id}
                                onRemove={() => removeModuleAt(idx)}
                              />
                            );
                          })
                        )}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>

                {/* Available modules to add */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">
                    Available Modules ({filteredModules.length} total)
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {filteredModules
                      .filter((m) => !selectedModules.includes(m.serialNumber))
                      .map((m) => (
                        <button
                          key={m.serialNumber}
                          onClick={() =>
                            setSelectedModules((prev) => [...prev, m.serialNumber])
                          }
                          className="px-3 py-1 rounded border text-sm hover:bg-gray-100"
                        >
                          + {m.name}
                        </button>
                      ))}
                  </div>

                  {/* quick helpers */}
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => setSelectedModules([])}
                      className="px-3 py-1 rounded border text-sm hover:bg-blue-50"
                    >
                      Clear sequence
                    </button>
                    <button
                      onClick={() =>
                        setSelectedModules((prev) => {
                          // append all filtered modules not yet present (keeps existing order first)
                          const missing = filteredModules
                            .map((m) => m.serialNumber)
                            .filter((id) => !prev.includes(id));
                          return [...prev, ...missing];
                        })
                      }
                      className="px-3 py-1 rounded border text-sm hover:bg-blue-50"
                    >
                      Add all missing
                    </button>
                  </div>
                </div>
              </div>

              {/* footer */}
              <div className="mt-6 text-right text-xs text-gray-500">
                Remember: order is critical — the system will process modules in this sequence.
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function SortableRow({
  id,
  label,
  index,
  onRemove,
}: {
  id: string;
  label: string;
  index: number;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between bg-white border rounded-md px-3 py-2 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-500">{index + 1}</div>
        <div className="font-medium text-gray-700">{label}</div>
      </div>

      <div className="flex items-center gap-2">
        <button
          {...listeners}
          title="Drag to reorder"
          className="cursor-grab p-1 rounded hover:bg-gray-100"
        >
          <GripVertical size={16} />
        </button>

        <button
          onClick={onRemove}
          title="Remove from sequence"
          className="p-1 rounded hover:bg-gray-100"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>
    </div>
  );
}