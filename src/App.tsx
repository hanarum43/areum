import { WorkspaceProvider } from "./lib/WorkspaceContext";
import { UiStateProvider, useUiState } from "./lib/UiStateContext";
import { useMasterData } from "./lib/useMasterData";
import { NAV_ITEMS } from "./lib/nav";
import HomePage from "./pages/HomePage";
import ContractGuidePage from "./pages/ContractGuidePage";
import ProcedurePage from "./pages/ProcedurePage";
import DataEntryPage from "./pages/DataEntryPage";
import FormLibraryPage from "./pages/FormLibraryPage";
import ExportPage from "./pages/ExportPage";
import GuidePage from "./pages/GuidePage";
import DocumentPreviewModal from "./components/DocumentPreviewModal";

function Shell() {
  const ui = useUiState();
  const master = useMasterData();

  if (master.loading) {
    return <div className="app-main">마스터 데이터를 불러오는 중입니다…</div>;
  }
  if (master.error) {
    return <div className="app-main">데이터를 불러오지 못했습니다: {master.error}</div>;
  }

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        본문으로 바로가기
      </a>
      <header className="app-header">
        <div className="brand">교복 학교주관구매 길라잡이</div>
        <nav className="app-nav" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              aria-current={ui.page === item.key ? "page" : undefined}
              onClick={(e) => {
                e.preventDefault();
                ui.navigate(item.key);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main className="app-main" id="main-content">
        {ui.page === "home" && <HomePage master={master} />}
        {ui.page === "guide-contract" && <ContractGuidePage master={master} />}
        {ui.page === "procedure" && <ProcedurePage master={master} />}
        {ui.page === "data-entry" && <DataEntryPage master={master} />}
        {ui.page === "forms" && <FormLibraryPage master={master} />}
        {ui.page === "export" && <ExportPage master={master} />}
        {ui.page === "guide" && <GuidePage />}
      </main>

      <footer className="app-footer">
        연습용 웹앱 — 입력한 자료는 서버에 저장되지 않으며 새로고침 시 사라집니다.
      </footer>

      {ui.previewFormId && <DocumentPreviewModal master={master} />}
    </div>
  );
}

export default function App() {
  return (
    <UiStateProvider>
      <WorkspaceProvider>
        <Shell />
      </WorkspaceProvider>
    </UiStateProvider>
  );
}
