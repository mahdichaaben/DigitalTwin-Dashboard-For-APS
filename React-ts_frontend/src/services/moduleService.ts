import axios from "@/lib/axiosConfig";
import { ModuleEntity } from "@/types/index"; // adjust path if needed

export const getModules = async (): Promise<ModuleEntity[]> => {
  const res = await axios.get("/api/modules");
  return res.data;
};

export const createModule = async (module: ModuleEntity): Promise<void> => {
  await axios.post("/api/modules", module);
};

export const updateModule = async (refModule: string, module: ModuleEntity): Promise<void> => {
  await axios.put(`/api/modules/${refModule}`, module);
};

export const deleteModule = async (refModule: string): Promise<void> => {
  await axios.delete(`/api/modules/${refModule}`);
};
