import type { CollectionEntry } from 'astro:content';

type Word = CollectionEntry<'words'>;

function tagScore(a: Word, b: Word): number {
  const cats: (keyof Word['data']['タグ'])[] = ['情緒', 'モチーフ', '仕掛け'];
  let sum = 0;
  for (const c of cats) {
    const A = new Set(a.data['タグ'][c] || []);
    const B = new Set(b.data['タグ'][c] || []);
    for (const k of A) if (B.has(k)) sum++;
  }
  return sum; // 3*T (we'll weight later)
}

export function related(from: Word, all: Word[], max = 4): Word[] {
  const explicit = new Set(from.data['関連'] || []);
  const scored = all
    .filter((w) => w.id !== from.id)
    .map((w) => {
      const T = tagScore(from, w);
      const H = explicit.has(w.slug) ? 1 : 0; // using slug as id (file name)
      const S = 3 * T + 1 * H; // phonetics omitted for v1
      return { w, S };
    })
    .filter((x) => x.S >= 3)
    .sort((a, b) => b.S - a.S);
  return scored.slice(0, max).map((x) => x.w);
}

