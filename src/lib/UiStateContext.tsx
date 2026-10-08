import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { PageKey } from "./nav";

interface UiApi {
  page: PageKey;
  navigate: (page: PageKey) => void;
  selectedMethod: string | null;
  selectMethod: (id: string | null) => void;
  previewFormId: string | null;
  openPreview: (formId: string) => void;
  closePreview: () => void;
}

const UiStateContext = createContext<UiApi | null>(null);

export function UiStateProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageKey>("home");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [previewFormId, setPreviewFormId] = useState<string | null>(null);

  const api = useMemo<UiApi>(
    () => ({
      page,
      navigate: (p) => {
        setPage(p);
        window.scrollTo(0, 0);
      },
      selectedMethod,
      selectMethod: setSelectedMethod,
      previewFormId,
      openPreview: setPreviewFormId,
      closePreview: () => setPreviewFormId(null),
    }),
    [page, selectedMethod, previewFormId],
  );

  return <UiStateContext.Provider value={api}>{children}</UiStateContext.Provider>;
}

export function useUiState(): UiApi {
  const ctx = useContext(UiStateContext);
  if (!ctx) throw new Error("useUiState는 UiStateProvider 내부에서만 사용합니다.");
  return ctx;
}
