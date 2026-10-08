import type { FormDef, WorkspaceData } from "./types";

export type ReadinessStatus = "ready" | "needs-data" | "readonly";

export interface ReadinessResult {
  status: ReadinessStatus;
  missing: string[];
}

const REPEATING_GROUP_IDS = new Set(["items", "companies", "committee", "evaluations"]);

const REPEATING_LABEL: Record<string, string> = {
  items: "품목 입력",
  companies: "업체 입력",
  committee: "위원 입력",
  evaluations: "평가 입력",
};

export function checkReadiness(form: FormDef, data: WorkspaceData): ReadinessResult {
  if (form.readOnly) return { status: "readonly", missing: [] };

  const missing: string[] = [];
  for (const fieldId of form.requiredFields) {
    if (REPEATING_GROUP_IDS.has(fieldId)) {
      const rows = data[fieldId as keyof WorkspaceData] as unknown[];
      if (!rows || rows.length === 0) missing.push(REPEATING_LABEL[fieldId] ?? fieldId);
    } else {
      const value = data.common[fieldId];
      if (!value || value.trim() === "") missing.push(fieldId);
    }
  }
  return { status: missing.length === 0 ? "ready" : "needs-data", missing };
}
