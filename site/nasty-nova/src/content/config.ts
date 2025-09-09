import { defineCollection, z } from 'astro:content';

const words = defineCollection({
  type: 'content',
  schema: z.object({
    id: z.string(),
    '語': z.string(),
    '読み': z.string(),
    '品詞': z.string(),
    '初出': z.string(),
    '怖度': z.number().int().min(1).max(5),
    'タグ': z.object({
      '情緒': z.array(z.string()).default([]),
      'モチーフ': z.array(z.string()).default([]),
      '仕掛け': z.array(z.string()).default([]),
    }),
    '関連': z.array(z.string()).default([]),
    'A11y': z
      .object({ contentWarnings: z.array(z.string()).default([]) })
      .partial()
      .default({}),
    'バグ演出': z.boolean().default(false),
    'モジバケ演出': z.boolean().default(false),
  }),
});

export const collections = { words };
