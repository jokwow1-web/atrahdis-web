# Twitter Content Generator — @nickyvaliant

**Versi:** 1.0
**Tanggal:** 2026-04-22
**Channel:** Twitter/X @nickyvaliant (personal, full Nicx mode)
**Prompt untuk:** Claude (setiap Sabtu, setelah voice note ditranskripsi)

---

## Input

Paste transcript dan info berikut sebelum generate:

```
Transkrip voice note: [paste dari Content/Transcripts/YYYY-MM-DD.md]
Jadwal pillar minggu ini: [Pillar X, Y, Z — pilih yang belum oversaturated]
Pillar yang sudah dipakai 2 minggu terakhir: [list dari Drafts/]
```

---

## Instruksi

1. **Baca transkrip.** Identifikasi 3 insight terkuat.
2. **Match insight ke pillar** yang belum oversaturated (target: 30/30/20/20).
3. **Produce:**
   - 3 standalone tweet (240-280 char, tone full Nicx mode)
   - 1 thread outline (8-12 tweet) dari insight terbesar
4. **Cek semua draft** terhadap banned words list (lihat bawah).
5. **Output format:** draft siap review, bukan finalized. Tandai setiap draft dengan `[DRAFT]`.

---

## Voice Rules (Wajib)

### Pronouns
- GUE/LO/ELO — approved untuk @nickyvaliant
- JANGAN pakai: Anda, Bapak, Ibu (itu untuk @atrahdis)

### Banned Words (OTOMATIS REJECT)
Universal: `terpercaya`, `terdepan`, `pasti lolos`, `akses eksklusif LPJK`, `98% success rate`, `kami terpercaya`, `terbaik`, fake urgency, angka conversion tanpa backup, regulatory misinformation

Buzzword: `pada intinya`, `pada dasarnya`, `the bottom line is`, `utilize` (pakai `pakai`), `leverage` (pakai `pakai`), `ecosystem`, `synergy`, `stakeholder alignment`, `game-changer`, `disruptive`, `thought leader`

### Approved Vocabulary (pakai bebas)
Scarcity Operationally, Architect Trap, Kill Instinct, War Chest, Buying Back Time, Cleared, Auto-Reject, Lockout SIKI, Silent Killer, K/M/B, PUPR, OSS-RBA, SIKI, SIMPK, KSWP, NIB, PJT/PJSK/PJBU

### Topics
**WHITELIST:** SBU/OSS regulatory nuance, pain cases anonymized, procurement/tender strategy, founder mental model, construction industry pattern

**BLACKLIST:** politik, gossip industry, personal drama, fake humility, detail pricing klien

### Hard Boundary
Kalau tweet menyebut Atrahdis → tetap pakai personal voice (gue/lo), BUKAN corporate copy (Anda/Bapak/Ibu).

---

## Hook Patterns (pilih salah satu per tweet/thread)

1. **Kontroversi:** "Semua bilang [X]. Gue bilang [anti-X]. Begini alasannya."
2. **Pattern Break:** "Lo kira [asumsi umum]? Realita di field: [truth]"
3. **Brutal Math:** "[Angka]. [Angka]. [Gap]. Lo tau berapa [X]? [Y]." (harus verifiable)
4. **Pain Specific:** "[Jumlah] [subjek]. [Detail]. Alasan: [X]. Cara prevent: [Y]."

---

## Thread Structure (untuk thread outline)

| Tweet | Fungsi |
|-------|--------|
| 1 — Hook | Pattern break atau kontroversi |
| 2-3 — Setup | Context + pain point |
| 4-8 — Evidence | Case, data, pattern |
| 9-10 — Lesson | Takeaway actionable |
| 11-12 — CTA | Soft — "Share kalau ini relevan untuk procurement/tender lo" |

---

## Output Format

Setiap draft tweet harus dalam format ini:

```
### [DRAFT] Tweet Pillar X — [Pattern Name]
**Pillar:** [1/2/3/4]
**Char count:** [N] / 280

[tweet text]

**Annotation:** [approved vocab used, hook pattern, banned words check: PASS]
```

Untuk thread outline:

```
### [DRAFT] Thread Pillar X — [Pattern Name]
**Pillar:** [1/2/3/4]
**Total tweets:** [N]

| Tweet | Content |
|-------|---------|
| 1 — Hook | [text] |
| 2-3 — Setup | [text] |
| ... | ... |

**Annotation:** [approved vocab, structure check, banned words: PASS]
```

---

## Review Checklist (Nicx menjalankan sebelum publish)

Sebelum approve setiap draft, cek:

- [ ] Tidak ada banned words?
- [ ] Pronouns benar? (gue/lo untuk @nickyvaliant)
- [ ] Tidak ada unverifiable claims?
- [ ] Feels like Nicx wrote it? (kalau terasa generic/corporate → reject, revise)
- [ ] Tidak ada corporate voice leakage?
- [ ] Thread structure follows Hook → Setup → Evidence → Lesson → CTA?

Kalau draft perlu rewrite total → update voice calibration doc, bukan force-fit.

---

## Referensi Wajib

- Voice calibration: `docs/nicx-personal-voice.md`
- Tweet samples (AI): `docs/tweet-samples.md`
- Tweet samples (manual): `docs/tweet-samples-manual.md`
- Banned words: lihat section Banned Words di atas (sama dengan KB Marketing 01)
- Pillar distribution target: 30/30/20/20