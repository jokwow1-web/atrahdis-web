# TERMINAL 2 — Brief Lengkap

## Proyek
Website atrahdis.id — Astro 6 + Tailwind CSS 4 + Vercel
Folder: `/Users/nicx/Yandex.Disk.localized/Downloads/atrahdis-web/`

## Identitas Brand
- **Nama:** PT Atrahdis Idea Nusantara
- **Warna:** Navy (#131232), Gold (#b2a275), Red-accent (#c41e3a), putih untuk body
- **Font heading:** Montserrat 400/500/600/700/800
- **Font body:** Open Sans 400/500/600/700
- **WA:** 6289699217161 (lewat `WA_LINKS` dari constants.ts)
- **Style:** Navy hero + footer, putih/gray-50 body section, gold accent CTA

---

## TASK 2: Overhaul Halaman Biaya + Fix CTA Contrast

### 2A. Halaman Biaya — Overhaul Total

**MASALAH:** Halaman `/biaya` saat ini hanya 30 baris, sangat basic — grid harga tanpa konteks, tanpa comparison table, tanpa FAQ schema, tanpa value proposition. CTA button pakai `text-white` di atas `bg-gold-500` (kontras buruk).

**FILE YANG DIUBAH:** `src/pages/biaya.astro`

**KODE SAAT INI (SELURUH FILE):**
```astro
---
import Base from '../layouts/Base.astro';
import { PRICING } from '../lib/pricing';
import { WA_CTA_URL } from '../lib/constants';

const products = Object.entries(PRICING);
---
<Base title="Biaya SBU & SKK Konstruksi" description="Daftar biaya SBU dan SKK konstruksi — estimasi setelah audit dokumen. Detail per sub-bidang tersedia via konsultasi.">
  <section class="mx-auto max-w-4xl px-4 py-16">
    <h1 class="text-3xl font-bold">Biaya</h1>
    <p class="mt-2 text-gray-600">Range harga publik. Detail per sub-bidang + multi-sub + bundling tersedia via konsultasi.</p>

    <div class="mt-12 grid gap-6 sm:grid-cols-2">
      {products.map(([slug, data]) => (
        <div class="rounded-xl border p-6">
          <h2 class="font-semibold">{data.label}</h2>
          <p class="mt-2 text-2xl font-bold text-blue-600">{data.range}</p>
          <p class="mt-1 text-sm text-gray-500">Range publik — detail via konsultasi</p>
        </div>
      ))}
    </div>

    <div class="mt-12 rounded-xl bg-navy-900 border border-gold-500/20 p-8 text-center">
      <p class="text-lg font-semibold">Butuh pricing detail per sub-bidang?</p>
      <p class="mt-2 text-sm text-gray-600">Detail per sub-bidang, multi-sub, dan KAP/ISO/SKK bundling.</p>
      <a href={WA_CTA_URL} class="mt-4 inline-block rounded-lg bg-gold-500 px-6 py-3 font-semibold text-white hover:bg-gold-400">
        Konsultasi via WhatsApp
      </a>
    </div>
  </section>
</Base>
```

**PRICING DATA (dari `src/lib/pricing.ts`):**
```typescript
export const PRICING = {
  'SBU-K': { label: 'SBU Kecil (K)', range: 'Konsultasi untuk estimasi', min: 4_500_000 },
  'SBU-M': { label: 'SBU Menengah (M)', range: 'Konsultasi untuk estimasi', min: 18_000_000 },
  'SBU-B': { label: 'SBU Besar (B)', range: 'Konsultasi untuk estimasi', min: 50_000_000 },
  'SKK-J5J6': { label: 'SKK J5/J6', range: 'Tergantung level & sub-bidang', fixed: 5_970_000 },
  'SKK-J7': { label: 'SKK J7', range: 'Tergantung level & sub-bidang', fixed: 7_470_000 },
  'SKK-J8': { label: 'SKK J8', range: 'Tergantung level & sub-bidang', fixed: 8_970_000 },
} as const;
```

**HARUS DIUBAH MENJADI (rewrite seluruh file):**

Struktur halaman baru:
1. **Hero section** (bg-navy-900): H1 kuat, subheading, trust signals
2. **Comparison table** (bg-gray-50): Kolom SBU-K vs SBU-M vs SBU-B dengan harga, timeline, scope
3. **SKK pricing** section: Table J5/J6, J7, J8
4. **"Apa yang termasuk" section**: Checklist per tier
5. **FAQ section** dengan FAQPage JSON-LD schema (min 5 Q&A)
6. **CTA section** (bg-navy-900)

**H1:** "Biaya SBU & SKK — Transparan, Tanpa Biaya Tersembunyi"
**Description:** "Daftar biaya SBU Kecil, Menengah, Besar dan SKK J5–J9. Estimasi setelah audit dokumen. Konsultasi gratis."

**COMPARISON TABLE (kerjakan manual, bukan loop dari PRICING):**

| | SBU Kecil (K) | SBU Menengah (M) | SBU Besar (B) |
|---|---|---|---|
| Mulai dari | Rp 4,5 juta | Rp 18 juta | Rp 50 juta |
| Timeline | 3–7 hari kerja | 14–21 hari kerja | 21–30 hari kerja |
| Modal perusahaan | ≤ Rp 5 miliar | Rp 5–25 miliar | > Rp 25 miliar |
| Nilai tender maks | Sampai Rp 5 miliar | Sampai Rp 25 miliar | > Rp 25 miliar |
| Laporan keuangan | Tidak wajib KAP | Wajib review KAP | Wajib audit KAP |
| SKK tenaga ahli | J5/J6 | J5/J6 minimum | J7+ minimum |

**SKK TABLE:**
| Level | Biaya per Berkas | Bidang Pekerjaan |
|---|---|---|
| J5/J6 | Rp 5.970.000 | Bangunan, Mekanikal, Elektrikal |
| J7 | Rp 7.470.000 | Bangunan besar, Infrastruktur |
| J8 | Rp 8.970.000 | Infrastruktur besar, EPC |

**FAQ SCHEMA (min 5):**
1. Berapa biaya SBU Kecil? → Mulai Rp 4,5 juta setelah audit dokumen...
2. Apakah ada biaya tersembunyi? → Tidak. Biaya ditentukan setelah audit...
3. Apa perbedaan biaya SBU K, M, dan B? → Tergantung modal perusahaan dan kompleksitas dokumen...
4. Berapa biaya SKK? → Mulai Rp 5,97 juta per berkas untuk J5/J6...
5. Apakah bisa bayar cicilan? → Konsultasi dulu untuk skema pembayaran...
6. Biaya sudah termasuk apa? → Audit dokumen, submit LPJK, monitoring, garansi perbaikan...

**CTA BUTTON:** Ganti `text-white` → `text-navy-900`. Gold (#b2a275) + white = kontras rendah. Gold + navy = kontras tinggi. Sudah benar di homepage.

**PENTING:**
- Import `WA_LINKS` bukan `WA_CTA_URL` (karena WA_CTA_URL sudah deprecated, pakai WA_LINKS.general)
- Pakai format Rupiah Indonesia: `Rp 4.500.000` (titik sebagai pemisah ribuan)
- FAQ section harus pakai `<details>/<summary>` accordion (sama seperti homepage FAQ)
- Table harus responsive (horizontal scroll di mobile: `overflow-x-auto`)
- Canonical URL: `https://atrahdis.id/biaya`

### 2B. Fix CTA Contrast di Seluruh Site

**MASALAH:** Beberapa CTA button menggunakan `text-white` di atas `bg-gold-500`. Gold (#b2a275) + white = kontras rendah (WCAG fail). Yang benar adalah `text-navy-900` seperti di homepage.

**CARI DAN FIX di SEMUA file:**
Cari pattern: `bg-gold-500` + `text-white` yang seharusnya `text-navy-900`.

File yang sudah BENAR (JANGAN UBAH):
- `src/pages/index.astro` — semua CTA sudah `text-navy-900`
- `src/layouts/Base.astro` — header CTA sudah `text-navy-900`
- `src/pages/layanan/index.astro` — CTA sudah `text-navy-900`

File yang perlu DICEK/FIX:
- `src/pages/biaya.astro` — CTA `text-white` → `text-navy-900` (akan di-rewrite di 2A)
- `src/pages/tools/kalkulator-sbu.astro` — CTA button baris 65: `text-white` → `text-navy-900`
- `src/pages/tools/kalkulator-sbu.astro` — result WA baris 80: `text-white` → `text-navy-900`
- Cek semua file di `src/pages/` untuk pattern yang sama

**GREP COMMAND:**
```bash
grep -rn "bg-gold-500.*text-white\|text-white.*bg-gold-500" src/
```

Setiap hasil yang `text-white` berdampingan dengan `bg-gold-500` harus diganti ke `text-navy-900`.

**KONTEKS WARNA (dari global.css):**
```css
--color-gold-500: #b2a275;   /* background button */
--color-navy-900: #131232;    /* text di atas gold button (KONTRAS TINGGI) */
--color-white: #ffffff;       /* JANGAN dipakai di atas gold — kontras rendah */
```

---

## TASK 5 (setelah Task 2 selesai): Google Maps Embed + Hero Image Optimization

### 5A. Google Maps Embed di Footer

**MASALAH:** Alamat fisik Beltway Office Park ada di footer sebagai teks, tapi tidak ada Google Maps embed. Ini penting untuk local SEO signal dan user yang ingin tahu lokasi.

**FILE YANG DIUBAH:** `src/layouts/Base.astro` — footer section

**ALAMAT:** Jl. TB. Simatupang Kav. 41, Beltway Office Park, Ragunan, Pasar Minggu, Jakarta Selatan 12550

**TAMBAHKAN di footer, di kolom pertama (setelah alamat):**
```astro
<div class="mt-4 aspect-video overflow-hidden rounded-lg">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.1!2d106.83!3d-6.29!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f1!2sBeltway+Office+Park!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
    width="100%"
    height="200"
    style="border:0;"
    allowfullscreen=""
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    title="Lokasi PT Atrahdis — Beltway Office Park, Jakarta Selatan"
  ></iframe>
</div>
```

**PENTING:** 
- Gunakan `loading="lazy"` agar tidak blocking render
- Width 100% agar responsive
- Height 200px — cukup untuk preview, tidak terlalu besar
- Aspect ratio video container untuk responsive
- Embed URL di atas adalah placeholder — **HARUS DIGANTI** dengan embed URL yang benar dari Google Maps:
  1. Buka Google Maps
  2. Cari "Beltway Office Park, Jakarta"
  3. Klik "Share" → "Embed a map"
  4. Copy URL dari iframe src
  5. Ganti placeholder URL di atas

**ALTERNATIF:** Jika embed iframe terlalu berat untuk footer, tambahkan di halaman `/tentang/index.astro` saja sebagai section peta yang lebih besar.

### 5B. Optimize Hero Image

**MASALAH:** `public/hero-sbu-atrahdis.webp` berukuran 75KB. Untuk above-the-fold LCP image, target <50KB.

**LANGKAH:**
1. Cek dimensi saat ini: 1200x630px (sudah OK)
2. Re-compress dengan kualitas lebih rendah:
```bash
# Jika cwebp tersedia:
cwebp -q 75 -resize 1200 0 public/hero-sbu-atrahdis.webp -o public/hero-sbu-atrahdis-opt.webp

# Atau pakai squoosh-cli (npm):
npx @nicolo-ribaudo/squoosh-cli --webp '{"quality":75,"target_size":45000}' public/hero-sbu-atrahdis.webp
```
3. Jika hasil < 50KB, replace file asli: `mv public/hero-sbu-atrahdis-opt.webp public/hero-sbu-atrahdis.webp`
4. Jika masih > 50KB, coba resize ke 1000x525 atau turunkan quality ke 65

**TARGET:** `hero-sbu-atrahdis.webp` < 50KB, tetap 1200x630 (atau minimal 1000x525)

**JANGAN UBAH:**
- Filename harus tetap `hero-sbu-atrahdis.webp` (direferensikan di `index.astro` dan OG image)
- Aspect ratio harus tetap landscape (≈ 1.9:1)
- Kualitas visual harus tetap acceptable — jangan sampai terlihat compression artifact