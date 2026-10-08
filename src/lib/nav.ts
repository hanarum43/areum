export type PageKey =
  | "home"
  | "guide-contract"
  | "procedure"
  | "data-entry"
  | "forms"
  | "export"
  | "guide";

export const NAV_ITEMS: { key: PageKey; label: string }[] = [
  { key: "home", label: "홈" },
  { key: "guide-contract", label: "계약방법 안내" },
  { key: "procedure", label: "계약절차" },
  { key: "data-entry", label: "기초자료" },
  { key: "forms", label: "서식함" },
  { key: "export", label: "내보내기" },
  { key: "guide", label: "사용안내" },
];
