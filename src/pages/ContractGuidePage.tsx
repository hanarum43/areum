import type { useMasterData } from "../lib/useMasterData";
import { useUiState } from "../lib/UiStateContext";

type Master = ReturnType<typeof useMasterData>;

export default function ContractGuidePage({ master }: { master: Master }) {
  const ui = useUiState();

  return (
    <div>
      <h1>계약방법 안내</h1>
      <p className="subtitle">
        계약방법은 행정실 담당자가 근거 법령과 추정금액을 검토하여 최종 결정합니다. 아래 표는 비교를
        돕기 위한 참고 정보입니다.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table className="table-plain">
          <thead>
            <tr>
              <th>계약방법</th>
              <th>적용 조건(참고)</th>
              <th>단계 수</th>
              <th>공통 핵심 서식</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {master.contractMethods.map((m) => (
              <tr key={m.id}>
                <td>
                  <strong style={{ color: m.color }}>{m.name}</strong>
                </td>
                <td>{m.condition}</td>
                <td>{m.steps}단계</td>
                <td>{m.coreForms.join(", ")}</td>
                <td>
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      ui.selectMethod(m.id);
                      ui.navigate("procedure");
                    }}
                  >
                    이 방식으로 진행
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="banner-privacy" style={{ marginTop: 20 }}>
        수의계약(1인·2인견적)의 금액 기준은 매뉴얼 확인이 필요합니다 — 지방계약법의 최신 기준을
        행정실이 직접 확인해 주세요.
      </div>
    </div>
  );
}
