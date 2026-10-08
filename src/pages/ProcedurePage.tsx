import { useState } from "react";
import type { useMasterData } from "../lib/useMasterData";
import { useUiState } from "../lib/UiStateContext";
import { useWorkspace } from "../lib/WorkspaceContext";
import { checkReadiness } from "../lib/formReadiness";

type Master = ReturnType<typeof useMasterData>;

export default function ProcedurePage({ master }: { master: Master }) {
  const ui = useUiState();
  const workspace = useWorkspace();
  const methodId = ui.selectedMethod ?? master.contractMethods[0]?.id;
  const [stepIndex, setStepIndex] = useState(0);

  const method = master.contractMethods.find((m) => m.id === methodId);
  const steps = methodId ? master.workflows[methodId] ?? [] : [];
  const current = steps[stepIndex];

  if (!method) return <p>계약방법 데이터를 불러오지 못했습니다.</p>;

  return (
    <div>
      <h1>계약절차</h1>
      <p className="subtitle">
        <strong style={{ color: method.color }}>{method.name}</strong> · 총 {method.steps}단계
        &nbsp;
        <button className="btn btn-ghost" onClick={() => ui.navigate("guide-contract")}>
          계약방법 다시 선택
        </button>
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20 }}>
        <nav aria-label="계약절차 단계" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {steps.map((s, i) => (
            <button
              key={s.step}
              onClick={() => setStepIndex(i)}
              className="btn"
              style={{
                justifyContent: "flex-start",
                textAlign: "left",
                background: i === stepIndex ? method.color : "#fff",
                color: i === stepIndex ? "#fff" : "var(--color-text)",
                border: "1px solid var(--color-border)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  background: i < stepIndex ? "var(--color-ok)" : i === stepIndex ? "#fff" : "var(--color-bg-alt)",
                  color: i === stepIndex ? method.color : i < stepIndex ? "#fff" : "var(--color-text-muted)",
                }}
              >
                {i < stepIndex ? "✓" : s.step}
              </span>
              {s.name}
            </button>
          ))}
        </nav>

        {current && (
          <div className="card" style={{ padding: 20 }}>
            <span className="badge badge-off">
              {current.owner === "학교" ? "학교" : current.owner === "업체" ? "업체" : "학교·업체 공동"}
            </span>
            <h2>
              STEP {String(current.step).padStart(2, "0")} · {current.name}
            </h2>
            <p>{current.desc}</p>

            <h3>해야 할 일</h3>
            <ul>
              {current.todos.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>

            {current.cautions.length > 0 && (
              <div className="banner-privacy">
                <strong>주의사항</strong>
                <ul style={{ margin: "6px 0 0" }}>
                  {current.cautions.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            <h3>관련 서식</h3>
            {current.relatedForms.length === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>이 단계에는 연결된 서식이 없습니다(절차성 단계).</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="table-plain">
                  <thead>
                    <tr>
                      <th>코드</th>
                      <th>서식명</th>
                      <th>작성상태</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {current.relatedForms.map((formId) => {
                      const form = master.forms.find((f) => f.id === formId);
                      if (!form) return null;
                      const readiness = checkReadiness(form, workspace.data);
                      return (
                        <tr key={formId}>
                          <td>{form.id}</td>
                          <td>{form.name}</td>
                          <td>
                            <span
                              className={
                                readiness.status === "ready" ? "badge badge-ready" : "badge badge-needs"
                              }
                            >
                              {readiness.status === "ready" ? "● 작성가능" : "▲ 기초자료 필요"}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-ghost" onClick={() => ui.openPreview(form.id)}>
                              미리보기
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
              <button className="btn btn-secondary" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => i - 1)}>
                ← 이전 단계
              </button>
              <button
                className="btn btn-secondary"
                disabled={stepIndex === steps.length - 1}
                onClick={() => setStepIndex((i) => i + 1)}
              >
                다음 단계 →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
