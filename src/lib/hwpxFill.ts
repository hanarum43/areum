// 원본 HWPX 템플릿(Contents/section*.xml)에 삽입된 {{토큰}}만 치환하고,
// 그 외 XML 구조는 그대로 보존한다. 허용 토큰 외 값은 치환하지 않는다.
const ALLOWED_TOKENS = ["학교명", "학년도"] as const;
type AllowedToken = (typeof ALLOWED_TOKENS)[number];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export interface HwpxFillResult {
  blob: Blob;
  remainingTokens: string[]; // 치환 후에도 남아있는 {{...}} — 있으면 0건이어야 정상
}

export async function fillHwpxTemplate(
  templateUrl: string,
  tokenValues: Partial<Record<AllowedToken, string>>,
): Promise<HwpxFillResult> {
  const JSZip = (await import("jszip")).default;
  const res = await fetch(templateUrl);
  if (!res.ok) throw new Error(`템플릿을 불러오지 못했습니다: ${templateUrl}`);
  const buf = await res.arrayBuffer();
  const zip = await JSZip.loadAsync(buf);

  const sectionPaths = Object.keys(zip.files).filter((p) =>
    /^Contents\/section\d+\.xml$/.test(p),
  );

  for (const path of sectionPaths) {
    let xml = await zip.file(path)!.async("string");
    for (const token of ALLOWED_TOKENS) {
      const value = tokenValues[token];
      if (value === undefined) continue;
      xml = xml.split(`{{${token}}}`).join(escapeXml(value));
    }
    zip.file(path, xml);
  }

  // 재검증: 허용 토큰이 모두 채워졌다면 {{...}} 패턴이 남아있지 않아야 한다.
  const remainingTokens: string[] = [];
  for (const path of sectionPaths) {
    const xml = await zip.file(path)!.async("string");
    const matches = xml.match(/\{\{[^}]*\}\}/g);
    if (matches) remainingTokens.push(...matches);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  return { blob, remainingTokens: Array.from(new Set(remainingTokens)) };
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
