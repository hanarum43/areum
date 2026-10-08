import { useUiState } from "../lib/UiStateContext";

export default function GuidePage() {
  const ui = useUiState();

  return (
    <div>
      <h1>사용안내</h1>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3>처음 사용 3단계</h3>
        <ol>
          <li>
            <strong>계약방식 선택</strong> — 홈 또는 계약방법 안내에서 조건을 비교하고 행정실과 상의해
            방식을 정합니다.
            <div>
              <button className="btn btn-ghost" onClick={() => ui.navigate("guide-contract")}>
                계약방법 안내로 →
              </button>
            </div>
          </li>
          <li>
            <strong>기초자료 입력·저장</strong> — 학교명·학년도 등 공통값을 한 번만 입력하면 모든 서식에
            자동으로 반영됩니다.
            <div>
              <button className="btn btn-ghost" onClick={() => ui.navigate("data-entry")}>
                기초자료입력으로 →
              </button>
            </div>
          </li>
          <li>
            <strong>서식 작성·출력</strong> — 서식함에서 작성 가능한 서식을 확인하고 PDF 또는 HWPX로
            출력합니다.
            <div>
              <button className="btn btn-ghost" onClick={() => ui.navigate("forms")}>
                서식함으로 →
              </button>
            </div>
          </li>
        </ol>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <h3>자주 묻는 질문</h3>
        <dl>
          <dt style={{ fontWeight: 600 }}>Q. 입력한 자료가 서버에 저장되나요?</dt>
          <dd>아니요. 이 웹앱은 서버·데이터베이스를 쓰지 않습니다. 모든 자료는 브라우저 탭에만 있으며 새로고침하면 사라집니다. 작업 중간중간 "내보내기"에서 Excel로 꼭 저장하세요.</dd>
          <dt style={{ fontWeight: 600 }}>Q. 오프라인에서 쓸 수 있나요?</dt>
          <dd>이 연습용 구축은 로컬 개발 서버로 실행했을 때만 확인했습니다. 오프라인 패키징은 아직 검증하지 않았습니다.</dd>
          <dt style={{ fontWeight: 600 }}>Q. 계약방법을 시스템이 대신 정해주나요?</dt>
          <dd>아니요. 추정금액으로 계약방법을 자동 판정하지 않습니다. 최종 결정은 행정실 담당자가 법령과 금액을 검토해 내립니다.</dd>
          <dt style={{ fontWeight: 600 }}>Q. 모든 서식을 HWPX로 바로 받을 수 있나요?</dt>
          <dd>아니요. 이번 연습용 구축에서는 7종(F-019~F-025)만 실제 원본 HWPX 템플릿을 연결했습니다. 나머지는 PDF만 제공하며, 서식함 카드에 표시되지 않습니다.</dd>
        </dl>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <h3>용어 풀이</h3>
        <dl>
          <dt style={{ fontWeight: 600 }}>Form ID</dt>
          <dd>서식을 구분하는 코드(F-001~F-057). 매뉴얼 원본 번호와 함께 표시됩니다.</dd>
          <dt style={{ fontWeight: 600 }}>공통값</dt>
          <dd>여러 서식에 함께 쓰이는 값(학교명·학년도 등). 한 번 입력하면 전체에 반영됩니다.</dd>
          <dt style={{ fontWeight: 600 }}>반복행</dt>
          <dd>업체·위원·품목처럼 개수가 정해지지 않은 데이터. 표 형태로 추가·삭제합니다.</dd>
          <dt style={{ fontWeight: 600 }}>개인정보 가능 문서</dt>
          <dd>F-029·F-047·F-050처럼 개인정보가 들어갈 수 있는 서식. 자동 입력·저장을 금지하고 빈 양식만 출력합니다.</dd>
        </dl>
      </div>
    </div>
  );
}
