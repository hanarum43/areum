import { useRef, useState } from "react";
import type { useMasterData } from "../lib/useMasterData";
import { useUiState } from "../lib/UiStateContext";
import { useWorkspace } from "../lib/WorkspaceContext";
import { checkReadiness } from "../lib/formReadiness";
import { exportElementToPdf } from "../lib/pdfExport";
import { downloadBlob, fillHwpxTemplate } from "../lib/hwpxFill";

type Master = ReturnType<typeof useMasterData>;

const REPEAT_GROUP_IDS = new Set(["items", "companies", "committee", "evaluations"]);

export default function DocumentPreviewModal({ master }: { master: Master }) {
  const ui = useUiState();
  const workspace = useWorkspace();
  const previewRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const form = master.forms.find((f) => f.id === ui.previewFormId);
  if (!form) return null;

  const readiness = checkReadiness(form, workspace.data);
  const common = workspace.data.common;
  const simpleRequired = form.requiredFields.filter((id) => !REPEAT_GROUP_IDS.has(id));
  const repeatingRequired = form.requiredFields.filter((id) => REPEAT_GROUP_IDS.has(id));

  const fieldLabel = (id: string) => master.fields.find((f) => f.id === id)?.label ?? id;

  const handlePdf = async () => {
    if (!previewRef.current) return;
    setBusy("pdf");
    try {
      await exportElementToPdf(previewRef.current, `${form.id}_${form.name}.pdf`);
    } finally {
      setBusy(null);
    }
  };

  const handleHwpx = async () => {
    if (!form.hwpxTemplate) return;
    setBusy("hwpx");
    setNotice(null);
    try {
      const result = await fillHwpxTemplate(form.hwpxTemplate, {
        학교명: common["C-01"] ?? "",
        학년도: common["C-02"] ?? "",
      });
      if (result.remainingTokens.length > 0) {
        setNotice(`주의: 치환되지 않은 토큰이 남아 있습니다 — ${result.remainingTokens.join(", ")}`);
        return;
      }
      downloadBlob(result.blob, `${form.id}_${form.name}.hwpx`);
    } catch (err) {
      setNotice(`HWPX 생성 실패: ${String(err)}`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) ui.closePreview();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") ui.closePreview();
      }}
    >
      <div className="modal-panel">
        <div className="modal-header">
          <h2 id="preview-title" style={{ margin: 0 }}>
            {form.id} · {form.name}
          </h2>
          <button className="btn btn-ghost" onClick={ui.closePreview} aria-label="닫기">
            닫기 ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="a4-preview" ref={previewRef}>
            <p style={{ textAlign: "center", fontSize: 12 }}>매뉴얼 {form.manualNo}</p>
            <h2 style={{ textAlign: "center" }}>{form.name}</h2>
            <table className="table-plain" style={{ marginTop: 20 }}>
              <tbody>
                <tr>
                  <th>학교명</th>
                  <td colSpan={3}>{common["C-01"] || "—"}</td>
                </tr>
                <tr>
                  <th>학년도</th>
                  <td>{common["C-02"] || "—"}</td>
                  <th>문서번호</th>
                  <td>{common["C-06"] || "—"}</td>
                </tr>
                <tr>
                  <th>제목</th>
                  <td colSpan={3}>{common["D-02"] || "—"}</td>
                </tr>
              </tbody>
            </table>

            {repeatingRequired.includes("items") && workspace.data.items.length > 0 && (
              <>
                <h3>품목</h3>
                <table className="table-plain">
                  <thead>
                    <tr>
                      <th>품목명</th>
                      <th>수량</th>
                      <th>단가</th>
                      <th>금액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspace.data.items.map((row, i) => (
                      <tr key={i}>
                        <td>{row["R-04"]}</td>
                        <td>{row["R-05"]}</td>
                        <td>{Number(row["R-06"] || 0).toLocaleString()}</td>
                        <td>{(Number(row["R-05"] || 0) * Number(row["R-06"] || 0)).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {repeatingRequired.includes("companies") && workspace.data.companies.length > 0 && (
              <>
                <h3>업체</h3>
                <table className="table-plain">
                  <thead>
                    <tr>
                      <th>업체명</th>
                      <th>대표자</th>
                      <th>연락처</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workspace.data.companies.map((row, i) => (
                      <tr key={i}>
                        <td>{row["R-03"]}</td>
                        <td>{row["R-08"]}</td>
                        <td>{row["R-09"]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <p style={{ marginTop: 24, textAlign: "right", fontSize: 13 }}>
              담당자: {common["C-08"] || "—"} &nbsp; 교장: {common["C-07"] || "—"}
            </p>

            {form.protectedNote && (
              <p style={{ fontSize: 12, color: "var(--color-coral)" }}>
                * 개인정보 보호 대상({form.protectedNote.join(", ")})은 빈 양식으로 출력됩니다.
              </p>
            )}
          </div>

          <aside>
            <h3>서식 정보</h3>
            <p style={{ fontSize: 13 }}>
              작성주체: {form.author} · 업무단계: {form.stage}
            </p>
            {simpleRequired.length > 0 && (
              <>
                <strong style={{ fontSize: 13 }}>필수 입력값</strong>
                <ul style={{ fontSize: 13 }}>
                  {simpleRequired.map((id) => (
                    <li key={id}>
                      {fieldLabel(id)}: {common[id] ? "✓ 입력됨" : "미입력"}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {readiness.status === "needs-data" && (
              <div className="banner-privacy">누락된 자료: {readiness.missing.join(", ")}</div>
            )}
            {!form.hwpxTemplate && (
              <p style={{ fontSize: 12.5, color: "var(--color-text-muted)" }}>
                이 서식은 원본 HWPX 템플릿이 아직 준비되지 않아 HWPX 출력 버튼을 제공하지 않습니다(연습용
                구축의 범위 한계 — 매뉴얼 확인 필요).
              </p>
            )}
            {notice && <p style={{ fontSize: 12.5, color: "var(--color-coral)" }}>{notice}</p>}
          </aside>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" disabled={busy !== null} onClick={handlePdf}>
            {busy === "pdf" ? "생성 중…" : "PDF 저장"}
          </button>
          {form.hwpxTemplate && (
            <button className="btn btn-secondary" disabled={busy !== null} onClick={handleHwpx}>
              {busy === "hwpx" ? "생성 중…" : "HWPX 작성"}
            </button>
          )}
          <button className="btn btn-ghost" onClick={ui.closePreview}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
