# Nicx Personal Voice — Calibration Document

**Versi:** 1.0
**Tanggal:** 2026-04-22
**Owner:** Nicx
**Channel:** Twitter/X @nickyvaliant, LinkedIn personal (Phase 2+)
**Status:** Draft — waiting for 10 manual tweets from Nicx to complete validation set

> Referensi utama: Brand Voice + Personal Brand Addendum v1.0, KB Marketing 01 & 02
> File ini TIDAK masuk build pipeline — standalone guide untuk channel personal Nicx

---

## 1. Pronouns

| Context | Pronouns | Catatan |
|---------|----------|---------|
| Personal (@nickyvaliant, LinkedIn personal) | `gue` / `lo` / `elo` | Full Nicx mode |
| Corporate (@atrahdis, website, LP, ads, email) | `Anda` / `Bapak` / `Ibu` | Banned: gue/lo/elo/gw/loe |

**Hard boundary:** Jangan campur. Kalau tweet dari @nickyvaliant menyebut Atrahdis, tetap pakai personal voice — bukan corporate copy.

---

## 2. Content Pillars

| Pillar | % Target | Format | Hook Pattern |
|--------|----------|--------|--------------|
| **1. Regulatory Reality Check** | 30% | Single tweet, max 280 char | "Update [regulasi]. Yang banyak di-miss: [insight]" |
| **2. Pain Case Anonymized** | 30% | Thread 6–10 tweet | "Kontraktor [size]. Tender [value]. [Silent Killer]. Begini urutannya:" |
| **3. Operator Mental Model** | 20% | Single tweet / short thread | "Kill Instinct #[n]: [statement]. Lo udah tombol [ya/tidak]?" |
| **4. Long-form Deep Audit** | 20% | Thread 10–15 tweet, 1x/2 minggu | "Deep audit [topic]. Data, pattern, verdict. Thread." |

**Cadence:** 3 single tweet/minggu (Selasa, Kamis, Sabtu) + 1 thread/2 minggu (Jumat sore). Reply engagement 15 menit/hari.

---

## 3. Approved Vocabulary

**Deep Audit language (pakai bebas):**
- Scarcity Operationally
- Architect Trap
- Kill Instinct
- War Chest
- Buying Back Time
- Cleared
- Auto-Reject
- Lockout SIKI
- Silent Killer

**High-impact words (from KB Marketing 01):**
- Tidur nyenyak, Certainty, Peace of mind, Risk-free

**Industry terminology:**
- K/M/B (BUKAN K1/K2/M1/M2/B1/B2 — format deprecated)
- PUPR, OSS-RBA, SIKI, SIMPK, KSWP, NIB
- PJT/PJSK/PJBU (kualifikasi baru)
- SBU, SKK, KTA, OSS

**Founder mental model:**
- Kill Instinct #1–5
- Architect Trap
- Buying Back Time
- System vs People
- 25B Roadmap (selective)

---

## 4. Banned Universal

**Banned words/phrases (semua channel, semua konteks):**
- `98% success rate`
- `kami terpercaya`
- `terdepan`
- `terbaik`
- `pasti lolos`
- `akses eksklusif LPJK`
- Fake urgency (deadline tanpa basis regulasi spesifik)
- Angka conversion tanpa backup
- Regulatory misinformation

**Banned generic words (ganti dengan alternatif):**
- `Proses` → ganti dengan nama sistem spesifik (SIKI, OSS-RBA, dll)
- `Administrasi` → ganti dengan `koordinasi regulasi`
- `Layanan` → ganti dengan advisory framing

---

## 5. Banned Buzzword Phrases

**Jangan pernah pakai:**
- `pada intinya`, `pada dasarnya`, `the bottom line is`
- `utilize` → pakai `pakai`
- `leverage` → pakai `pakai`
- `ecosystem`, `synergy`, `stakeholder alignment`
- `game-changer`, `disruptive`, `thought leader`

---

## 6. Topics Whitelist

Topik yang BOLEH dibahas:
1. SBU/OSS regulatory nuance (PUPR, SIKI, SIMPK, KSWP)
2. Pain cases anonymized (5 Silent Killer)
3. Procurement/tender strategy
4. Founder mental model (System vs People, 25B Roadmap — selective)
5. Construction industry pattern

---

## 7. Topics Blacklist

Topik yang DILARANG:
1. Politik / hot take politik
2. Gossip industry
3. Personal drama
4. Fake humility / humble brag
5. Detail pricing klien actual (breach confidentiality)

---

## 8. Hard Boundary: @atrahdis vs @nickyvaliant

| | @atrahdis (brand) | @nickyvaliant (personal) |
|---|---|---|
| Pronouns | Anda, Bapak, Ibu | gue, lo, elo |
| Tone | Formal-ish, professional | Brutal, Joker Principle direct |
| Enforcement | Build-time (voice-guard.ts) | Manual (this doc) |
| Joker Principle | Yes — applies strict | Yes — still applies |
| Regulatory accuracy | Yes — applies strict | Yes — still applies |

**Rule:** Kalau tweet dari @nickyvaliant menyebut Atrahdis, tetap pakai personal voice. Jangan jadi corporate spokesperson.

---

## 9. Hook Patterns

4 pola hook yang proven work:

### Pattern 1: Kontroversi
> "Semua bilang [X]. Gue bilang [anti-X]. Begini alasannya."

### Pattern 2: Pattern Break
> "Lo kira [asumsi umum]? Realita di field: [truth]"

### Pattern 3: Brutal Math
> "Tender Rp 2M. PPh Final 4% tanpa SBU = Rp 80jt hangus. Dengan SBU aktif = Rp 35jt. Gap: Rp 45jt. Lo tau berapa biaya SBU? Rp 4.5jt."

### Pattern 4: Pain Specific
> "47 kontraktor Jabar 2022. Termin Rp 1.2M ditahan. Alasan: [X]. Cara prevent: [Y]."

---

## 10. Thread Structure Template

Untuk thread 8–12 tweet:

| Tweet | Fungsi |
|-------|--------|
| 1 — Hook | Pattern break atau kontroversi |
| 2–3 — Setup | Context + pain point |
| 4–8 — Evidence | Case, data, pattern |
| 9–10 — Lesson | Takeaway actionable |
| 11–12 — CTA | Soft — "Share kalau ini relevan untuk procurement/tender lo" |

---

## 11. Reference Files

- **AI-generated tweet samples:** `docs/tweet-samples.md`
- **Manual tweet homework:** `docs/tweet-samples-manual.md` (Nicx isi)
- **Brand Voice Addendum:** `/Plan traffinc engine/atrahdis.id 2026 — Brand Voice + Personal Brand Addendum.md`
- **KB Marketing 01:** `Obsidian Vault/03_Sales/KB_Marketing/01_Master-KB-Marketing.md`
- **KB Marketing 02 (Joker Principle):** `Obsidian Vault/03_Sales/KB_Marketing/02_Joker-Principle-Authority-Marketing.md`
- **Voice guard enforcement:** `src/lib/voice-guard.ts`

---

## 12. Kill Criteria (90 hari)

| Metric | Target bulan 3 | Aksi jika miss |
|--------|---------------|----------------|
| Follower growth | +200 real followers | Review pillar mix |
| Engagement rate | > 2% per tweet | Review voice calibration |
| DM/inquiry terkait Atrahdis | ≥ 3 qualified DM | Pivot ke LinkedIn |
| Founder time | ≤ 3 jam/minggu | Auto-kill kalau lewat |

**Review go/no-go:** 21 Juli 2026 (90 hari dari launch).