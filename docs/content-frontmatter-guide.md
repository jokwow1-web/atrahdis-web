# Content Frontmatter Guide — Task 4 Reference

**Versi:** 1.0
**Tanggal:** 2026-04-22
**Untuk:** Task 4 (Produksi Konten Massal)
**Enforced by:** `src/lib/voice-guard.ts` + `src/content.config.ts`

> **WAJIB BACA** sebelum nulis satu kata artikel: `docs/nicx-personal-voice.md` dan file ini.

---

## Required Frontmatter Fields

Setiap artikel/LP di `src/content/blog/` atau `src/content/lp/` WAJIB punya frontmatter ini:

### Blog

```yaml
---
title: "Judul artikel"          # max 70 chars
description: "Meta description"  # max 160 chars
channel: blog                     # blog | lp | ads | email
product: SBU-M                    # SBU-K | SBU-M | SBU-B | SKK | OSS | KTA
voice_mode: corporate             # corporate | personal (default: corporate)
publishedAt: 2026-05-01           # date
---
```

### Landing Page

```yaml
---
title: "Judul halaman"           # max 70 chars
description: "Meta description"  # max 160 chars
channel: lp                       # always 'lp' for landing pages
product: SBU-M                    # SBU-K | SBU-M | SBU-B | SKK | OSS | KTA
voice_mode: corporate             # corporate | personal (default: corporate)
ctaType: wa-human                 # wa-human | wa-ara | form
---
```

---

## Field Explanations

| Field | Values | Notes |
|-------|--------|-------|
| `channel` | `blog`, `lp`, `ads`, `email` | Determines which voice rules apply. Most content = `blog` or `lp`. |
| `product` | `SBU-K`, `SBU-M`, `SBU-B`, `SKK`, `OSS`, `KTA` | Ties content to service line. Uses K/M/B only (NOT K1/K2/M1/M2/B1/B2 — deprecated). |
| `voice_mode` | `corporate`, `personal` | Default: `corporate`. Personal hanya untuk founder byline articles (rare). |
| `ctaType` | `wa-human`, `wa-ara`, `form` | LP only. `wa-human` = 628131092903 (tim). `wa-ara` = 6289699217161 (dari ads). |

---

## Voice Rules per Channel

| Channel | Voice Mode | Pronouns | Tone | YOU/YOUR Ratio |
|---------|-----------|----------|------|----------------|
| blog + corporate | `corporate` | Anda, Perusahaan Anda | Formal-konversasional, otoritatif, edukatif | Minimum 9:1 |
| lp + corporate | `corporate` | Anda, Bapak/Ibu | Direct, action-driven, short punchy | Minimum 9:1 |
| ads + corporate | `corporate` | Bapak, Anda | Pain-first, urgency real only | N/A (character limited) |
| email + corporate | `corporate` | Bapak/Ibu → Anda | Hangat-professional, personal feel | Minimum 9:1 |
| blog + personal | `personal` | gue, lo | Full Nicx mode (rare — hanya byline articles) | N/A |

---

## Quick Reference: Banned Words

**Universal (all channels):**
`terpercaya`, `terdepan`, `pasti lolos`, `akses eksklusif LPJK`, `98% success rate`, `kami terpercaya`, `terbaik`

**Buzzword phrases (all channels):**
`pada intinya`, `pada dasarnya`, `the bottom line is`, `utilize`, `leverage`, `ecosystem`, `synergy`, `stakeholder alignment`, `game-changer`, `disruptive`, `thought leader`

**Corporate channel only (banned gue/lo/elo):**
`gue`, `lo`, `elo`, `gw`, `loe`

**Deprecated SBU format (use K/M/B only):**
`K1`, `K2`, `M1`, `M2`, `B1`, `B2`

---

## Example Frontmatter

### Blog post — SBU Kualifikasi K (corporate)

```yaml
---
title: "SBU Kualifikasi K: Syarat Lengkap dan Timeline Proses 2026"
description: "Panduan lengkap SBU Kualifikasi K untuk kontraktor kecil. Syarat, timeline, dan cara menghindari auto-reject dari SIKI."
channel: blog
product: SBU-K
voice_mode: corporate
publishedAt: 2026-05-15
---
```

### LP — SBU Kualifikasi M (corporate)

```yaml
---
title: "SBU Kualifikasi M — Nicx Audit Sendiri"
description: "Butuh SBU M? Nicx urus sejak 2016. Mulai 3 hari kerja. Audit dokumen sebelum submit."
channel: lp
product: SBU-M
voice_mode: corporate
ctaType: wa-human
---
```

### Blog post — Founder opinion (personal, rare)

```yaml
---
title: "Kenapa Sistem SIKI By Design Bukan Anomali"
description: "Perspektif dari 10 tahun handle SBU: SIKI auto-reject bukan bug, itu feature. Dan cara mengatasinya."
channel: blog
product: SBU-M
voice_mode: personal
publishedAt: 2026-05-20
---
```

---

## Voice Guard Integration

Build pipeline menjalankan `checkVoiceWithContext()` dari `src/lib/voice-guard.ts` untuk setiap konten di `src/content/`. Jika ada violation:

- **Banned words** → build error
- **Personal pronouns in corporate content** → build error
- **Deprecated SBU format** → build error
- **Buzzword phrases** → build error
- **YOU/YOUR ratio < 9:1** (corporate only) → build warning

Fix violation sebelum commit. Jangan suppress.

---

## Cross-Reference

- **Voice calibration doc:** `docs/nicx-personal-voice.md` (aturan lengkap per channel)
- **Voice guard code:** `src/lib/voice-guard.ts` (enforcement)
- **Content schema:** `src/content.config.ts` (frontmatter validation)
- **Tweet samples:** `docs/tweet-samples.md` (tone reference untuk @nicx channel)
- **Brand Voice Addendum:** sumber kebenaran untuk semua copy rules