import type { RepeatingGroupDef, RepeatingRow } from "../lib/types";
import { useWorkspace } from "../lib/WorkspaceContext";

type GroupKey = "items" | "companies" | "committee" | "evaluations";

function computeValue(groupId: string, columnId: string, row: RepeatingRow): string | number {
  if (groupId === "items" && columnId === "K-01") {
    const qty = Number(row["R-05"] ?? 0);
    const price = Number(row["R-06"] ?? 0);
    return qty * price;
  }
  if (groupId === "evaluations" && columnId === "K-03") {
    return Number(row["R-07"] ?? 0);
  }
  return "";
}

export default function RepeatingGroupEditor({ group }: { group: RepeatingGroupDef }) {
  const workspace = useWorkspace();
  const key = group.id as GroupKey;
  const rows = workspace.data[key];

  const emptyRow = (): RepeatingRow => {
    const row: RepeatingRow = {};
    group.columns.forEach((c) => {
      if (c.type !== "computed") row[c.id] = "";
    });
    return row;
  };

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table className="table-plain">
          <thead>
            <tr>
              {group.columns.map((c) => (
                <th key={c.id}>{c.label}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={group.columns.length + 1} style={{ color: "var(--color-text-muted)" }}>
                  행이 없습니다. 아래 "행 추가" 버튼으로 입력을 시작하세요.
                </td>
              </tr>
            )}
            {rows.map((row, idx) => (
              <tr key={idx}>
                {group.columns.map((c) => {
                  if (c.type === "computed") {
                    const v = computeValue(group.id, c.id, row);
                    return <td key={c.id}>{typeof v === "number" ? v.toLocaleString() : v}</td>;
                  }
                  if (c.type === "select") {
                    return (
                      <td key={c.id}>
                        <select
                          value={String(row[c.id] ?? "")}
                          onChange={(e) =>
                            workspace.updateRow(key, idx, { ...row, [c.id]: e.target.value })
                          }
                        >
                          <option value="">선택</option>
                          {c.options?.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                    );
                  }
                  return (
                    <td key={c.id}>
                      <input
                        type={c.type === "integer" || c.type === "currency" ? "number" : "text"}
                        value={String(row[c.id] ?? "")}
                        onChange={(e) =>
                          workspace.updateRow(key, idx, { ...row, [c.id]: e.target.value })
                        }
                        style={{ width: "100%", padding: 4 }}
                      />
                    </td>
                  );
                })}
                <td>
                  <button className="btn btn-ghost" onClick={() => workspace.removeRow(key, idx)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => workspace.addRow(key, emptyRow())}>
        + 행 추가
      </button>
    </div>
  );
}
