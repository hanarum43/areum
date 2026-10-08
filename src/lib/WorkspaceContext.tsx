import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { EMPTY_WORKSPACE, type RepeatingRow, type WorkspaceData } from "./types";

type RepeatingKey = "items" | "companies" | "committee" | "evaluations";

interface WorkspaceApi {
  data: WorkspaceData;
  setField: (fieldId: string, value: string) => void;
  addRow: (group: RepeatingKey, row: RepeatingRow) => void;
  updateRow: (group: RepeatingKey, index: number, row: RepeatingRow) => void;
  removeRow: (group: RepeatingKey, index: number) => void;
  resetAll: () => void;
  loadFromWorkspace: (next: WorkspaceData) => void;
}

const WorkspaceContext = createContext<WorkspaceApi | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<WorkspaceData>(EMPTY_WORKSPACE);

  const api = useMemo<WorkspaceApi>(
    () => ({
      data,
      setField: (fieldId, value) =>
        setData((prev) => ({ ...prev, common: { ...prev.common, [fieldId]: value } })),
      addRow: (group, row) =>
        setData((prev) => ({ ...prev, [group]: [...prev[group], row] })),
      updateRow: (group, index, row) =>
        setData((prev) => {
          const rows = [...prev[group]];
          rows[index] = row;
          return { ...prev, [group]: rows };
        }),
      removeRow: (group, index) =>
        setData((prev) => {
          const rows = [...prev[group]];
          rows.splice(index, 1);
          return { ...prev, [group]: rows };
        }),
      resetAll: () => setData(EMPTY_WORKSPACE),
      loadFromWorkspace: (next) => setData(next),
    }),
    [data],
  );

  return <WorkspaceContext.Provider value={api}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceApi {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace는 WorkspaceProvider 내부에서만 사용합니다.");
  return ctx;
}
