import { useEffect, useState } from "react";
import type {
  ContractMethod,
  FieldDef,
  FormDef,
  RepeatingGroupDef,
  WorkflowMap,
} from "./types";

interface MasterData {
  fields: FieldDef[];
  repeatingGroups: RepeatingGroupDef[];
  forms: FormDef[];
  contractMethods: ContractMethod[];
  workflows: WorkflowMap;
  loading: boolean;
  error: string | null;
}

const EMPTY: Omit<MasterData, "loading" | "error"> = {
  fields: [],
  repeatingGroups: [],
  forms: [],
  contractMethods: [],
  workflows: {},
};

export function useMasterData(): MasterData {
  const [state, setState] = useState<MasterData>({
    ...EMPTY,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const base = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${base}data/fields.json`).then((r) => r.json()),
      fetch(`${base}data/repeating-groups.json`).then((r) => r.json()),
      fetch(`${base}data/forms.json`).then((r) => r.json()),
      fetch(`${base}data/contract-methods.json`).then((r) => r.json()),
      fetch(`${base}data/workflows.json`).then((r) => r.json()),
    ])
      .then(([fields, repeatingGroups, forms, contractMethods, workflows]) => {
        if (cancelled) return;
        setState({
          fields,
          repeatingGroups,
          forms,
          contractMethods,
          workflows,
          loading: false,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState({ ...EMPTY, loading: false, error: String(err) });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
