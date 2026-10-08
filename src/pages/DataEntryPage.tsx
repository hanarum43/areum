import { useRef, useState } from "react";
import type { useMasterData } from "../lib/useMasterData";
import { useWorkspace } from "../lib/WorkspaceContext";
import RepeatingGroupEditor from "../components/RepeatingGroupEditor";
import { exportWorkspaceToExcel, importWorkspaceFromExcel } from "../lib/excelIO";

type Master = ReturnType<typeof useMasterData>;
type TabKey = "공통" | "사업" | "문서별" | "items" | "companies" | "committee" | "evaluations";

const TABS: { key: TabKey; label: string }[] = [
  { key: "공통", label: "공통정보" },
  { key: "사업", label: "사업정보" },
  { key: "문서별", label: "문서별정보" },
  { key: "items", label: "품목" },
  { key: "companies", label: "업체" },
  { key: "committee", label: "위원" },
  { key: "evaluations", label: "평가" },
];

export default function DataEntryPage({ master }: { master: Master }) {
  const workspace = useWorkspace();
  const [tab, setTab] = useState<TabKey>("공통");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const simpleFields = master.fields.filter((f) => f.group === tab);
  const group = master.repeatingGroups.find((g) => g.id === tab);

  const onUploadClick = () => fileInputRef.current?.click();
  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importWorkspaceFromExcel(file);
      workspace.loadFromWorkspace(data);
      setImportMessage(`"${file.name}" 불러오기 완료`);
    } catch (err) {
      setImportMessage(`불러오기 실패: ${String(err)}`);
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div>
      <h1>기초자료입력</h1>
      <div className="banner-privacy">
        입력한 업무자료는 서버 DB에 저장하지 않습니다. 새로고침하면 사라지므로, 작업 중 "업무자료.xlsx
        다운로드"로 직접 보관해 주세요.
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button className="btn btn-secondary" onClick={onUploadClick}>
          Excel 업로드
        </button>
        <input ref={fileInputRef} type="file" accept=".xlsx" hidden onChange={onFileChange} />
        <button
          className="btn btn-secondary"
          onClick={() => exportWorkspaceToExcel(workspace.data, "업무자료.xlsx")}
        >
          Excel 다운로드
        </button>
        {importMessage && <span style={{ alignSelf: "center", fontSize: 13, color: "var(--color-text-muted)" }}>{importMessage}</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 20 }}>
        <nav aria-label="기초자료 탭" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className="btn"
              style={{
                justifyContent: "flex-start",
                background: tab === t.key ? "var(--color-primary)" : "#fff",
                color: tab === t.key ? "#fff" : "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div className="card" style={{ padding: 20 }}>
          {simpleFields.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 480 }}>
              {simpleFields.map((f) => (
                <label key={f.id} style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 14 }}>
                  <span>
                    {f.label} {f.required && <span style={{ color: "var(--color-coral)" }}>*</span>}
                  </span>
                  {f.type === "select" ? (
                    <select
                      value={workspace.data.common[f.id] ?? ""}
                      onChange={(e) => workspace.setField(f.id, e.target.value)}
                    >
                      <option value="">선택</option>
                      {f.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : f.type === "longtext" ? (
                    <textarea
                      rows={4}
                      value={workspace.data.common[f.id] ?? ""}
                      onChange={(e) => workspace.setField(f.id, e.target.value)}
                    />
                  ) : (
                    <input
                      type={f.type === "date" ? "date" : f.type === "year" || f.type === "integer" || f.type === "currency" ? "number" : "text"}
                      value={workspace.data.common[f.id] ?? ""}
                      onChange={(e) => workspace.setField(f.id, e.target.value)}
                    />
                  )}
                </label>
              ))}
            </div>
          )}
          {group && <RepeatingGroupEditor group={group} />}
        </div>
      </div>
    </div>
  );
}
