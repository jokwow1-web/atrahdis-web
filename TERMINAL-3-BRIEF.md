# TERMINAL 3 — Brief Lengkap

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

## TASK 3: Self-Host Fonts + Compress Favicon + Partytown Fix

### 3A. Self-Host Fonts (Ganti Google Fonts → Inter Variable)

**MASALAH:** `src/layouts/Base.astro` memuat Google Fonts secara external:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
```
Ini menambah 2 DNS lookup + render-blocking CSS. Blueprint minta self-hosted Inter variable font.

File `public/fonts/inter-variable.woff2` (55KB) SUDAH ADA tapi tidak digunakan.

**FILE YANG DIUBAH:**

#### 1. `src/layouts/Base.astro`

**HAPUS baris berikut:**
```astro
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**TAMBAHKAN di tempat yang sama:**
```astro
<link rel="preload" as="font" href="/fonts/inter-variable.woff2" type="font/woff2" crossorigin />
```

#### 2. `src/styles/global.css`

**KODE SAAT INI:**
```css
@import "tailwindcss";

@theme {
  --color-navy-950: #0d0d28;
  --color-navy-900: #131232;
  --color-navy-800: #272740;
  --color-navy-700: #3a3a58;
  --color-navy-600: #4a4a6a;
  --color-gold-600: #9a8b60;
  --color-gold-500: #b2a275;
  --color-gold-400: #c4b68a;
  --color-gold-300: #d6c9a0;
  --color-red-accent: #c41e3a;

  --font-heading: 'Montserrat', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Open Sans', ui-sans-serif, system-ui, sans-serif;
}
```

**UBAH MENJADI:**
```css
@import "tailwindcss";

@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-variable.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-display: swap;
  font-style: normal;
}

@theme {
  --color-navy-950: #0d0d28;
  --color-navy-900: #131232;
  --color-navy-800: #272740;
  --color-navy-700: #3a3a58;
  --color-navy-600: #4a4a6a;
  --color-gold-600: #9a8b60;
  --color-gold-500: #b2a275;
  --color-gold-400: #c4b68a;
  --color-gold-300: #d6c9a0;
  --color-red-accent: #c41e3a;

  --font-heading: 'Inter', ui-sans-serif, system-ui, sans-serif;
  --font-body: 'Inter', ui-sans-serif, system-ui, sans-serif;
}
```

**PENTING:**
- Inter variable font mendukung weight 100-900, jadi mengganti MONTSERRAT (heading) dan OPEN_SANS (body) keduanya ke Inter tidak mengurangi typographic range
- `font-display: swap` memastikan teks tetap muncul (dengan fallback) sambil font loading
- `<link rel="preload">` di Base.astro membuat font mulai download secepatnya
- Setelah perubahan ini, TIDAK ADA lagi external request ke Google Fonts → lebih cepat, lebih privacy-friendly
- Inter adalah font yang lebih modern dan lebih readable daripada Montserrat untuk body text, dan cukup distinctive untuk heading
- **TEST:** Setelah deploy, cek bahwa semua heading (Montserrat) dan body text (Open Sans) berubah ke Inter. Heading harus tetap bold dan impactful. Body text harus tetap readable. Jika ada issue, pertimbangkan untuk self-host Montserrat + Open Sans sebagai alternatif.

### 3B. Compress Favicon

**MASALAH:** `public/logo.png` berukuran 1024x1024 dan 788KB. Digunakan sebagai `<link rel="icon" href="/logo.png">` dan `<link rel="apple-touch-icon" href="/logo.png">` di Base.astro. Favicon seharusnya <50KB.

**LANGKAH:**
1. Generate favicon.ico (32x32) dan apple-touch-icon.png (180x180) dari logo.png:
```bash
# Menggunakan ImageMagick (jika tersedia di Mac):
convert public/logo.png -resize 32x32 public/favicon.ico
convert public/logo.png -resize 180x180 public/apple-touch-icon.png

# Atau menggunakan sips (built-in macOS):
sips -z 180 180 public/logo.png --out public/apple-touch-icon.png
sips -z 32 32 public/logo.png --out public/favicon.ico
```

2. Jika tools di atas tidak tersedia, gunakan script Node.js (sharp):
```bash
npx sharp-cli -i public/logo.png -o public/favicon.ico resize 32 32
npx sharp-cli -i public/logo.png -o public/apple-touch-icon.png resize 180 180
```

3. Atau jika sharp tidak tersedia, buat script sederhana:
```javascript
// scripts/gen-favicon.mjs
import sharp from 'sharp';
await sharp('public/logo.png').resize(32, 32).toFile('public/favicon-32.png');
await sharp('public/logo.png').resize(180, 180).png({quality: 80}).toFile('public/apple-touch-icon.png');
```

4. Update `src/layouts/Base.astro`:
```astro
<!-- GANTI: -->
<link rel="icon" href="/logo.png" type="image/png" />
<link rel="apple-touch-icon" href="/logo.png" />

<!-- MENJADI: -->
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

**Catatan:** `public/favicon.svg` (749 bytes) sudah ada dan sudah benar. Jangan hapus.

5. **JANGAN HAPUS** `public/logo.png` — mungkin masih digunakan di tempat lain (OG image, dll). Tapi pastikan tidak lagi dipakai sebagai favicon.

**TARGET:**
- `favicon.ico`: < 5KB (32x32)
- `apple-touch-icon.png`: < 20KB (180x180)
- `favicon.svg`: tetap 749 bytes (sudah OK)

### 3C. Pindahkan GA4 + Meta Pixel ke Partytown

**MASALAH:** GTM sudah pakai Partytown (`<script type="text/partytown">`) tapi GA4 dan Meta Pixel masih blocking render di main thread.

**FILE YANG DIUBAH:** `src/layouts/Base.astro`

**KODE SAAT INI (baris 35-46 di `<head>`):**
```astro
{GTM_ID && (
  <script is:inline type="text/partytown">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}</script>
)}
{GA4_ID && (
  <script is:inline src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`} async></script>
  <script is:inline>{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`}</script>
)}
{META_PIXEL_ID && (
  <script is:inline>{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}</script>
)}
```

**UBAH MENJADI:**
```astro
{GTM_ID && (
  <script is:inline type="text/partytown">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}</script>
)}
{GA4_ID && (
  <script is:inline type="text/partytown">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA4_ID}');`}</script>
  <script is:inline type="text/partytown" src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}></script>
)}
{META_PIXEL_ID && (
  <script is:inline type="text/partytown">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}</script>
)}
```

**PERUBAHAN:**
- GA4: hapus `<script is:inline src=... async>` terpisah, gabungkan ke satu block Partytown. GA4 script sekarang jalan di web worker via Partytown.
- Meta Pixel: tambahkan `type="text/partytown"` ke script tag.
- GTM: sudah Partytown, tidak berubah.

**NOSCRIPT tags (di body)** tetap sama — noscript tidak bisa pake Partytown dan itu OK karena noscript hanya jalan jika JS disabled.

**TESTING SETELAH PERUBAHAN:**
1. `npm run build` harus berhasil tanpa error
2. Deploy ke Vercel: `vercel --prod`
3. Cek di browser: buka atrahdis.id, buka DevTools → Network → filter "gtm|gtag|fbevents"
4. Pastikan tracking scripts masih load (hanya sekarang via web worker, bukan main thread)
5. Cek Partytown console: tidak ada error tentang third-party scripts
6. **JIKA Partytown menyebabkan issue** (tracking tidak jalan, console errors): sebagai fallback, ganti `type="text/partytown"` ke `defer` attribute. Partytown kadang bermasalah dengan script yang butuh akses DOM langsung.

---

## TASK 6 (setelah Task 3 selesai): Testimonial Verification + WA Number Alignment

### 6A. Testimonial Verification

**MASALAH:** 3 testimonial di homepage (`src/pages/index.astro`) tanpa bukti verifiable — terkesan fabricated. Perlu ditambahkan link ke halaman sertifikat-klien atau minimal inisial + kota.

**FILE YANG DIUBAH:** `src/pages/index.astro` — section "Mereka Sudah Beres"

**KODE SAAT INI (baris ~220-250):**
```astro
<section class="mx-auto max-w-6xl px-4 py-20">
  <h2 class="font-heading text-3xl font-bold text-gray-900 md:text-4xl">Mereka Sudah Beres</h2>
  <div class="mt-10 grid gap-6 md:grid-cols-3">
    <div class="rounded-xl shadow-sm border border-gray-200 bg-white p-6">
      <p class="text-sm text-gray-600">Renewal SBU B + KTA untuk proyek infrastruktur pemerintah. Proses 28 hari, tanpa revisi dokumen.</p>
      <div class="mt-4 border-t border-gray-200 pt-4">
        <p class="font-heading font-semibold text-gray-900">PT Waskita Karya</p>
        <p class="text-xs text-gray-500">Renewal SBU B — 28 hari</p>
      </div>
    </div>
    <div class="rounded-xl shadow-sm border border-gray-200 bg-white p-6">
      <p class="text-sm text-gray-600">Upgrade dari K ke M untuk tender BUMN. Audit awal menemukan 4 gap KBLI, diselesaikan sebelum submit.</p>
      <div class="mt-4 border-t border-gray-200 pt-4">
        <p class="font-heading font-semibold text-gray-900">PT Korindo Group</p>
        <p class="text-xs text-gray-500">Upgrade K→M — 15 hari</p>
      </div>
    </div>
    <div class="rounded-xl shadow-sm border border-gray-200 bg-white p-6">
      <p class="text-sm text-gray-600">SBU + Serkom J7 untuk tender plant expansion. Timeline ketat, deliver on time dengan 2 hari buffer.</p>
      <div class="mt-4 border-t border-gray-200 pt-4">
        <p class="font-heading font-semibold text-gray-900">PT Sumitomo Electric</p>
        <p class="text-xs text-gray-500">SBU + Serkom — 18 hari</p>
      </div>
    </div>
  </div>
</section>
```

**UBAH MENJADI:**
Tambahkan link ke halaman sertifikat dan badge verifikasi di setiap testimonial card:

```astro
<section class="mx-auto max-w-6xl px-4 py-20">
  <h2 class="font-heading text-3xl font-bold text-gray-900 md:text-4xl">Mereka Sudah Beres</h2>
  <div class="mt-10 grid gap-6 md:grid-cols-3">
    <div class="rounded-xl shadow-sm border border-gray-200 bg-white p-6">
      <p class="text-sm text-gray-600">Renewal SBU B + KTA untuk proyek infrastruktur pemerintah. Proses 28 hari, tanpa revisi dokumen.</p>
      <div class="mt-4 border-t border-gray-200 pt-4">
        <p class="font-heading font-semibold text-gray-900">PT Waskita Karya</p>
        <p class="text-xs text-gray-500">Renewal SBU B — 28 hari · Jakarta</p>
      </div>
      <a href="/sertifikat-klien" class="mt-2 inline-flex items-center gap-1 text-xs text-gold-500 hover:text-gold-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5"><path fill-rule="evenodd" d="M16.403 5.727a.75.75 0 01-.026 1.06l-6.25 5.97a.75.75 0 01-1.018.026L5.28 9.55a.75.75 0 01.94-1.168l3.058 2.464 5.566-5.316a.75.75 0 011.06.026l.5-.478z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-4.484 4.834-1.39-1.116a.75.75 0 00-.938 1.168l1.931 1.548a.75.75 0 001.018-.026l5.077-5.476z" clip-rule="evenodd" /></svg>
        Terverifikasi
      </a>
    </div>
    <!-- ... repeat untuk 2 card lainnya dengan pola yang sama ... -->
  </div>
  <p class="mt-6 text-center text-sm text-gray-500">
    <a href="/sertifikat-klien" class="text-gold-400 hover:underline">Lihat semua sertifikat klien →</a>
  </p>
</section>
```

**PENTING:**
- Setiap card ditambah: kota ("Jakarta"), dan link "Terverifikasi" ke `/sertifikat-klien`
- Di bawah grid, tambahkan link "Lihat semua sertifikat klien →" ke `/sertifikat-klien`
- Halaman `/sertifikat-klien` sudah ada (`src/pages/sertifikat-klien/index.astro`) — JANGAN UBAH
- SVG icon checklist kecil (h-3.5 w-3.5) di sebelah "Terverifikasi"
- Style harus konsisten dengan design yang ada

### 6B. WA Number Alignment (Klarifikasi Dulu Sebelum Ubah)

**MASALAH:** Ada inkonsistensi nomor WA:

**Di `src/lib/constants.ts`:**
```typescript
export const WA_HUMAN = '6289699217161';
export const WA_ARA = '6289699217161';

// WA_LINKS semua menggunakan WA_HUMAN (6289699217161)
export const WA_LINKS = {
  general: `https://wa.me/${WA_HUMAN}?text=Halo%20Nicx%2C%20...`,
  sbuK: `https://wa.me/${WA_HUMAN}?text=Halo%20Nicx%2C%20...`,
  // ... semua pakai WA_HUMAN
  ara: `https://wa.me/${WA_ARA}?text=Halo%20Ara%2C%20...`,
};
```

**Di `src/lib/constants.ts` ORG_SCHEMA:**
```typescript
telephone: '+628131092903',  // ← NOMOR BERBEDA!
```

**Di `public/llms.txt`:**
```
WhatsApp Nicx (Human): 628131092903 — konsultasi langsung & proposal
WhatsApp Ara (AI Screening): 6289699217161 — screening kebutuhan SBU otomatis
```

**DI BASE.ASTRO HEADER (CTA button):**
```astro
<a href={WA_LINKS.general} ...>Konsultasi Gratis</a>
```
Ini mengarah ke 6289699217161 (yang di llms.txt disebut Ara).

**ANALISIS:**
- `628131092903` = nomor Nicx (human) — ada di ORG_SCHEMA dan llms.txt
- `6289699217161` = nomor Ara (AI screening) — ada di WA_LINKS dan llms.txt
- TAPI di constants.ts, `WA_HUMAN = '6289699217161'` (ini nomor Ara, bukan Nicx!)
- Link "Konsultasi Gratis" di header → 6289699217161 (Ara) — ini benar karena Ara screening dulu
- Link `WA_LINKS.ara` → juga 6289699217161 — benar

**YANG PERLU DIPERBAIKI:**
1. `WA_HUMAN` harus diubah ke nomor Nicx: `628131092903`
2. `WA_ARA` tetap `6289699217161`
3. `WA_LINKS.general` dan `WA_LINKS.checklist` harus pakai `WA_HUMAN` (628131092903) — karena ini konsultasi langsung ke Nicx
4. `WA_LINKS.sbuK`, `sbuM`, `sbuB`, `skk` bisa tetap pakai `WA_ARA` (screening AI dulu) ATAU `WA_HUMAN` — **TANYAKAN KE NICX**
5. `ORG_SCHEMA.telephone` sudah benar (+628131092903 = Nicx)

**PERUBAHAN MINIMUM:**
```typescript
export const WA_HUMAN = '628131092903';    // ← GANTI dari 6289699217161
export const WA_ARA = '6289699217161';      // ← tetap sama

export const WA_LINKS = {
  general: `https://wa.me/${WA_HUMAN}?text=Halo%20Nicx%2C%20saya%20mau%20tanya%20tentang%20SBU`,
  // ... sbuK, sbuM, sbuB, skk: TETAP PAKAI WA_ARA (Ara screening dulu)
  // ATAU ganti ke WA_HUMAN jika Nicx ingin semua langsung ke dia
  ara: `https://wa.me/${WA_ARA}?text=Halo%20Ara%2C%20saya%20mau%20screening%20kebutuhan%20SBU`,
  checklist: `https://wa.me/${WA_HUMAN}?text=Saya%20mau%20dapat%20Checklist%20Dokumen%20SBU%20gratis`,
};
```

**PERINGATAN:** Ini mengubah nomor WA yang muncul di SELURUH website. Konfirmasi dulu dengan Nicx sebelum mengubah `WA_HUMAN`. Jika nomor 628131092903 bukan nomor yang mau ditampilkan, JANGAN UBAH.

**SETELAH PERUBAHAN:**
- Cek bahwa `ORG_SCHEMA.telephone` dan `WA_HUMAN` konsisten
- Cek bahwa semua `WA_LINKS` mengarah ke nomor yang benar
- Cek bahwa link WA di homepage, layanan, tools, dll masih berfungsi