import type { useMasterData } from "../lib/useMasterData";
import { useUiState } from "../lib/UiStateContext";

type Master = ReturnType<typeof useMasterData>;

export default function HomePage({ master }: { master: Master }) {
  const ui = useUiState();

  const goToProcedure = (methodId: string) => {
    ui.selectMethod(methodId);
    ui.navigate("procedure");
  };

  return (
    <div>
      <h1>교복 학교주관구매 길라잡이</h1>
      <p className="subtitle">계약방법 안내부터 서식 작성·출력까지 한 곳에서</p>

      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fff8e8",
          borderColor: "#f3dba0",
        }}
      >
        <div>
          <strong>한눈에 보는 계약 업무 길라잡이</strong>
          <p style={{ margin: "4px 0 0", color: "var(--color-text-muted)", fontSize: 14 }}>
            처음이신가요? 3단계 사용안내로 바로 시작할 수 있습니다.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => ui.navigate("guide")}>
          시작
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>계약 방식을 선택해 주세요</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost" onClick={() => ui.navigate("data-entry")}>
            기초자료입력으로 →
          </button>
          <button className="btn btn-ghost" onClick={() => ui.navigate("forms")}>
            서식함으로 →
          </button>
        </div>
      </div>

      <div className="grid-4">
        {master.contractMethods.map((m) => (
          <div className="method-card" key={m.id}>
            <div className="accent" style={{ background: m.color }} />
            <div className="body">
              <span className="step-badge">{m.steps}단계</span>
              <h3 style={{ margin: 0 }}>{m.name}</h3>
              <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-muted)" }}>{m.description}</p>
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--color-text-muted)" }}>{m.condition}</p>
              <div style={{ flex: 1 }} />
              <button
                className="btn btn-secondary"
                style={{ alignSelf: "flex-start" }}
                onClick={() => goToProcedure(m.id)}
              >
                절차 확인 →
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 24, fontSize: 13, color: "var(--color-text-muted)" }}>
        카드를 눌러도 계약방법이 자동으로 확정되지 않습니다. 최종 선택은 행정실 담당자가 근거 법령과
        추정금액을 검토하여 결정합니다.
      </p>
    </div>
  );
}
