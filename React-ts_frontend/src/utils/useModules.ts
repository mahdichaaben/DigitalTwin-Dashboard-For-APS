// hooks/useModules.ts
import { useEffect, useState } from "react";
import { ModuleEntity } from "@/types";
import * as moduleService from "@/services/moduleService";

export default function useModules() {
  const [modules, setModules] = useState<ModuleEntity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await moduleService.getModules();
      setModules(data);
    } catch (e: any) {
      setError(e.response?.data?.message || e.message || "Failed to fetch modules");
    } finally {
      setLoading(false);
    }
  };

  const create = async (module: ModuleEntity) => {
    await moduleService.createModule(module);
    fetchModules();
  };

  const update = async (refModule: string, module: ModuleEntity) => {
    await moduleService.updateModule(refModule, module);
    fetchModules();
  };

  const remove = async (refModule: string) => {
    await moduleService.deleteModule(refModule);
    fetchModules();
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return {
    modules,
    loading,
    error,
    fetchModules,
    create,
    update,
    remove,
  };
}
