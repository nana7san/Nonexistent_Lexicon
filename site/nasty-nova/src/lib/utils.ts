export function scaryDots(n: number): string {
  const full = '●'.repeat(Math.max(0, Math.min(5, n)));
  const empty = '○'.repeat(5 - Math.max(0, Math.min(5, n)));
  return `${full}${empty}`;
}

export function extractAExcerpt(markdown: string): string {
  // Extract the first paragraph after '### 表の意味' that is not an example label or quote.
  const parts = markdown.split('### 表の意味');
  if (parts.length < 2) return '';
  const section = parts[1];
  // Split into paragraphs by blank line
  const paras = section.split(/\n\s*\n+/).map((p) => p.trim()).filter(Boolean);
  for (const p of paras) {
    const plain = stripMarkdown(p).trim();
    if (!plain) continue;
    // Skip lines that are example labels or blockquotes
    if (/^用例[AB]/.test(plain)) continue;
    if (/^>\s*/.test(p)) continue;
    if (plain.startsWith('<details')) continue;
    // Use the first valid paragraph
    return plain.replace(/\n/g, ' ');
  }
  return '';
}

export function pickTopTags(tags: Record<string, string[]>, max = 3): string[] {
  const flat = [
    ...(tags['情緒'] || []),
    ...(tags['モチーフ'] || []),
    ...(tags['仕掛け'] || []),
  ];
  return flat.slice(0, max);
}

export function stripMarkdown(s: string): string {
  return s
    // bold/italic
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/_(.*?)_/g, '$1')
    // inline code
    .replace(/`([^`]+)`/g, '$1')
    // blockquote indicator if leaked
    .replace(/^>\s*/gm, '')
    // remove explicit example labels if present
    .replace(/用例[AB]\s*>?/g, '')
    .trim();
}
