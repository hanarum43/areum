import { useMemo, useState } from "react";
import type { useMasterData } from "../lib/useMasterData";
import { useUiState } from "../lib/UiStateContext";
import { useWorkspace } from "../lib/WorkspaceContext";
import { checkReadiness } from "../lib/formReadiness";

type Master = ReturnType<typeof useMasterData>;

const STAGE_FILTERS = ["전체", "준비", "입찰", "평가", "계약", "구매", "사후평가", "참고"];

export default function FormLibraryPage({ master }: { master: Master }) {
  const ui = useUiState();
  const workspace = useWorkspace();
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState("전체");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return master.forms.filter((f) => {
      if (stage !== "전체" && f.stage !== stage) return false;
      if (query && !(f.name.includes(query) || f.id.includes(query.toUpperCase()))) return false;
      return true;
    });
  }, [master.forms, stage, query]);

  return (
    <div>
      <h1>서식함</h1>
      <p className="subtitle">전체 {master.forms.length}종(운영 52 + 참고 5) 서식을 검색·확인할 수 있습니다.</p>

      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        <input
          type="search"
          placeholder="서식명 또는 Form ID 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, minWidth: 240 }}
          aria-label="서식 검색"
        />
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {STAGE_FILTERS.map((s) => (
          <button
            key={s}
            className="btn"
            style={{
              padding: "6px 14px",
              fontSize: 13,
              background: stage === s ? "var(--color-primary)" : "#fff",
              color: stage === s ? "#fff" : "var(--color-text)",
              border: "1px solid var(--color-border)",
            }}
            onClick={() => setStage(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
        {filtered.map((form) => {
          const readiness = checkReadiness(form, workspace.data);
          return (
            <div key={form.id} className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 12.5, color: "var(--color-text-muted)" }}>
                    {form.id} · 매뉴얼 {form.manualNo}
                  </div>
                  <h3 style={{ margin: "2px 0 6px" }}>{form.name}</h3>
                </div>
                <span
                  className={
                    readiness.status === "readonly"
                      ? "badge badge-off"
                      : readiness.status === "ready"
                        ? "badge badge-ready"
                        : "badge badge-needs"
                  }
                >
                  {readiness.status === "readonly"
                    ? "○ 참고자료"
                    : readiness.status === "ready"
                      ? "● 작성가능"
                      : "▲ 자료필요"}
                </span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "8px 0" }}>
                <span className="badge badge-off">{form.stage}</span>
                <span className="badge badge-off">{form.author}</span>
                {form.hwpxTemplate && <span className="badge badge-off">HWPX 가능</span>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="btn btn-secondary"
                  disabled={form.readOnly}
                  onClick={() => ui.openPreview(form.id)}
                >
                  미리보기
                </button>
                {readiness.status === "needs-data" && (
                  <button className="btn btn-ghost" onClick={() => setExpanded(expanded === form.id ? null : form.id)}>
                    누락값 보기
                  </button>
                )}
              </div>
              {expanded === form.id && readiness.status === "needs-data" && (
                <div className="banner-privacy" style={{ marginTop: 10 }}>
                  누락: {readiness.missing.join(", ")}
                  <div style={{ marginTop: 8 }}>
                    <button className="btn btn-primary" onClick={() => ui.navigate("data-entry")}>
                      기초자료 입력하기
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
