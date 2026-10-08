import type { RepeatingRow, WorkspaceData } from "./types";
import { EMPTY_WORKSPACE } from "./types";

const REPEAT_SHEETS: { key: keyof WorkspaceData; sheet: string; columns: string[] }[] = [
  { key: "items", sheet: "품목", columns: ["품목명", "수량", "단가", "금액"] },
  { key: "companies", sheet: "업체", columns: ["업체명", "대표자 성명", "대표자 연락처"] },
  { key: "committee", sheet: "위원", columns: ["구분·직위", "성명"] },
  { key: "evaluations", sheet: "평가", columns: ["업체명", "평가항목", "배점", "점수"] },
];

const COLUMN_KEY_MAP: Record<string, string[]> = {
  품목: ["R-04", "R-05", "R-06", "K-01"],
  업체: ["R-03", "R-08", "R-09"],
  위원: ["R-01", "R-02"],
  평가: ["EVAL-COMPANY", "EVAL-ITEM", "EVAL-MAX", "R-07"],
};

export async function exportWorkspaceToExcel(data: WorkspaceData, filename: string): Promise<void> {
  const XLSX = await import("xlsx");
  const wb = XLSX.utils.book_new();

  const commonRows = Object.entries(data.common).map(([fieldId, value]) => ({
    "필드ID": fieldId,
    "값": value,
  }));
  const commonSheet = XLSX.utils.json_to_sheet(commonRows);
  XLSX.utils.book_append_sheet(wb, commonSheet, "업무자료");

  for (const { key, sheet, columns } of REPEAT_SHEETS) {
    const keys = COLUMN_KEY_MAP[sheet];
    const rows = (data[key] as RepeatingRow[]).map((row) => {
      const out: Record<string, string | number> = {};
      columns.forEach((col, i) => {
        out[col] = row[keys[i]] ?? "";
      });
      return out;
    });
    const ws = XLSX.utils.json_to_sheet(rows, { header: columns });
    XLSX.utils.book_append_sheet(wb, ws, sheet);
  }

  XLSX.writeFile(wb, filename);
}

export async function importWorkspaceFromExcel(file: File): Promise<WorkspaceData> {
  const XLSX = await import("xlsx");
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: "array" });

  const next: WorkspaceData = {
    common: {},
    items: [],
    companies: [],
    committee: [],
    evaluations: [],
  };

  const commonSheet = wb.Sheets["업무자료"];
  if (commonSheet) {
    const rows = XLSX.utils.sheet_to_json<{ "필드ID": string; "값": string }>(commonSheet);
    for (const row of rows) {
      if (row["필드ID"]) next.common[row["필드ID"]] = String(row["값"] ?? "");
    }
  }

  for (const { key, sheet, columns } of REPEAT_SHEETS) {
    const ws = wb.Sheets[sheet];
    if (!ws) continue;
    const keys = COLUMN_KEY_MAP[sheet];
    const rows = XLSX.utils.sheet_to_json<Record<string, string | number>>(ws);
    (next[key] as RepeatingRow[]) = rows.map((row) => {
      const out: RepeatingRow = {};
      columns.forEach((col, i) => {
        const v = row[col];
        out[keys[i]] = v === undefined ? "" : v;
      });
      return out;
    });
  }

  return { ...EMPTY_WORKSPACE, ...next };
}
