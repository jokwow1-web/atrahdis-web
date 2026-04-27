export const PRICING = {
  'SBU-K': { label: 'SBU Kecil (K)', range: 'Konsultasi untuk estimasi', min: 4_500_000 },
  'SBU-M': { label: 'SBU Menengah (M)', range: 'Konsultasi untuk estimasi', min: 18_000_000 },
  'SBU-B': { label: 'SBU Besar (B)', range: 'Konsultasi untuk estimasi', min: 50_000_000 },
  'SKK-J5J6': { label: 'SKK J5/J6', range: 'Tergantung level & sub-bidang', fixed: 5_970_000 },
  'SKK-J7': { label: 'SKK J7', range: 'Tergantung level & sub-bidang', fixed: 7_470_000 },
  'SKK-J8': { label: 'SKK J8', range: 'Tergantung level & sub-bidang', fixed: 8_970_000 },
} as const;

export type ProductSlug = keyof typeof PRICING;