import { useState } from "react";
import type { useMasterData } from "../lib/useMasterData";
import { useWorkspace } from "../lib/WorkspaceContext";
import { exportWorkspaceToExcel } from "../lib/excelIO";

type Master = ReturnType<typeof useMasterData>;

export default function ExportPage({ master }: { master: Master }) {
  const workspace = useWorkspace();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const filledCommonCount = Object.values(workspace.data.common).filter((v) => v && v.trim() !== "").length;

  return (
    <div>
      <h1>내보내기</h1>
      <div className="banner-privacy">
        입력한 자료는 서버에 저장되지 않습니다. 작업을 마치면 아래에서 Excel로 직접 내려받아 학교 PC에
        보관해 주세요.
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3>업무자료 Excel 다운로드</h3>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
          공통·사업·문서별 값 {filledCommonCount}건 + 품목 {workspace.data.items.length}행, 업체{" "}
          {workspace.data.companies.length}행, 위원 {workspace.data.committee.length}행, 평가{" "}
          {workspace.data.evaluations.length}행을 포함합니다.
        </p>
        {!confirming ? (
          <button className="btn btn-primary" onClick={() => setConfirming(true)}>
            업무자료.xlsx 다운로드
          </button>
        ) : (
          <div>
            <p style={{ fontSize: 14 }}>입력 내용을 확인하셨나요? 확인 후 다운로드를 진행합니다.</p>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setConfirming(false)}>
                취소
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  await exportWorkspaceToExcel(workspace.data, "업무자료.xlsx");
                  setConfirming(false);
                  setDone(true);
                }}
              >
                확인했습니다 · 다운로드
              </button>
            </div>
          </div>
        )}
        {done && <p style={{ color: "var(--color-ok)", fontSize: 13 }}>다운로드를 시작했습니다.</p>}
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3>서식 일괄 출력</h3>
        <p style={{ fontSize: 14, color: "var(--color-text-muted)" }}>
          연습용 구축에서는 서식함에서 서식별로 PDF/HWPX를 개별 출력합니다. 선택 서식을 ZIP으로 묶는
          일괄 출력은 이번 범위에서 구현하지 않았습니다(다음 단계 과제).
        </p>
      </div>

      <p style={{ fontSize: 12.5, color: "var(--color-text-muted)", marginTop: 16 }}>
        참고: 전체 {master.forms.length}종 중 HWPX 템플릿이 실제로 연결된 서식은{" "}
        {master.forms.filter((f) => f.hwpxTemplate).length}종입니다.
      </p>
    </div>
  );
}
