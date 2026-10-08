export type FieldType =
  | "text"
  | "year"
  | "date"
  | "select"
  | "currency"
  | "integer"
  | "textlist"
  | "longtext";

export interface FieldDef {
  id: string;
  group: "공통" | "사업" | "문서별";
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
}

export interface RepeatingColumnDef {
  id: string;
  label: string;
  type: FieldType | "computed";
  required?: boolean;
  options?: string[];
  formula?: string;
}

export interface RepeatingGroupDef {
  id: string; // items | companies | committee | evaluations
  label: string;
  columns: RepeatingColumnDef[];
}

export interface ContractMethod {
  id: string;
  name: string;
  shortName: string;
  description: string;
  condition: string;
  steps: number;
  color: string;
  coreForms: string[];
}

export interface WorkflowStep {
  step: number;
  name: string;
  desc: string;
  owner: "학교" | "업체" | "공동";
  todos: string[];
  cautions: string[];
  relatedForms: string[];
}

export type WorkflowMap = Record<string, WorkflowStep[]>;

export interface FormDef {
  id: string;
  manualNo: string;
  name: string;
  stage: string;
  type: string;
  author: string;
  contractMethods: string[];
  requiredFields: string[];
  outputModes: ("pdf" | "hwpx")[];
  hwpxTemplate: string | null;
  protectedNote: string[] | null;
  readOnly: boolean;
}

export type RepeatingRow = Record<string, string | number>;

export interface WorkspaceData {
  common: Record<string, string>; // C-xx, B-xx, D-xx (shared single values)
  items: RepeatingRow[];
  companies: RepeatingRow[];
  committee: RepeatingRow[];
  evaluations: RepeatingRow[];
}

export const EMPTY_WORKSPACE: WorkspaceData = {
  common: {},
  items: [],
  companies: [],
  committee: [],
  evaluations: [],
};
