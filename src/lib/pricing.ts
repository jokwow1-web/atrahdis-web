export const PRICING = {
  'SBU-K': { label: 'SBU Kecil (K)', range: 'Mulai Rp 4,5 jt', min: 4_500_000 },
  'SBU-M': { label: 'SBU Menengah (M)', range: 'Mulai Rp 18 jt', min: 18_000_000 },
  'SBU-B': { label: 'SBU Besar (B)', range: 'Mulai Rp 50 jt', min: 50_000_000 },
  'SKK-J5J6': { label: 'SKK J5/J6', range: 'Rp 5,97 jt', fixed: 5_970_000 },
  'SKK-J7': { label: 'SKK J7', range: 'Rp 7,47 jt', fixed: 7_470_000 },
  'SKK-J8': { label: 'SKK J8', range: 'Rp 8,97 jt', fixed: 8_970_000 },
} as const;

export type ProductSlug = keyof typeof PRICING;