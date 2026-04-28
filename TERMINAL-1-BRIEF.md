# TERMINAL 1 — Brief Lengkap

## Proyek
Website atrahdis.id — Astro 6 + Tailwind CSS 4 + Vercel
Folder: `/Users/nicx/Yandex.Disk.localized/Downloads/atrahdis-web/`

## Identitas Brand
- **Nama:** PT Atrahdis Idea Nusantara
- **Founder:** Nicx (Nicky Valiant)
- **Warna:** Navy (#131232), Gold (#b2a275), Red-accent (#c41e3a), putih untuk body
- **Font heading:** Montserrat 400/500/600/700/800
- **Font body:** Open Sans 400/500/600/700
- **WA:** 6289699217161 (semua link WA pakai nomor ini lewat `WA_LINKS` dari constants.ts)
- **Style:** Navy hero + footer, putih/gray-50 body section, gold accent CTA

---

## TASK 1: Hamburger Menu Mobile + OG/Twitter Meta Tags

### 1A. Hamburger Menu Mobile

**MASALAH:** Di `src/layouts/Base.astro`, navigasi desktop menggunakan `hidden md:flex` tapi TIDAK ADA hamburger menu untuk mobile. User di bawah 768px tidak bisa mengakses menu Layanan, Blog, Tools, dll. Ini mematikan konversi mobile (70%+ traffic Indonesia).

**FILE YANG DIUBAH:** `src/layouts/Base.astro`

**HEADER SAAT INI (baris 39-52):**
```astro
<header class="sticky top-0 z-50 border-b border-navy-700/50 bg-navy-950/80 backdrop-blur">
  <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
    <a href="/" class="font-heading text-xl font-bold tracking-tight text-white">Atrahdis</a>
    <div class="hidden gap-6 text-sm font-medium md:flex">
      <a href="/layanan" class="text-gray-300 hover:text-gold-400">Layanan</a>
      <a href="/#cara-kerja" class="text-gray-300 hover:text-gold-400">Cara Kerja</a>
      <a href="/tentang" class="text-gray-300 hover:text-gold-400">Tentang Kami</a>
      <a href="/blog" class="text-gray-300 hover:text-gold-400">Blog</a>
      <a href="/tools/kalkulator-sbu" class="text-gray-300 hover:text-gold-400">Tools</a>
    </div>
    <a href={WA_LINKS.general} class="rounded-lg bg-gold-500 px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-400">
      Konsultasi Gratis
    </a>
  </nav>
</header>
```

**UBAH MENJADI:**
Tambahkan:
1. Tombol hamburger (SVG icon, visible hanya di `<md`) dengan `id="menu-toggle"` dan `aria-label="Toggle menu"` `aria-expanded="false"`
2. Mobile menu panel `<div id="mobile-menu" class="hidden md:hidden ...">` yang berisi link yang sama dengan desktop nav + CTA button
3. `<script>` di bawah body yang toggle `hidden` class pada `#mobile-menu` dan update `aria-expanded`

**Hamburger icon (SVG):**
```html
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-6 w-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
</svg>
```

**Mobile menu style:** `bg-navy-950 border-t border-navy-700/50`, link dengan `block py-3 px-4 text-gray-300 hover:text-gold-400`, CTA button sama dengan desktop.

**PENTING:**
- WA sticky bar di bawah (sudah ada, `fixed bottom-0 md:hidden`) harus tetap berfungsi dan TIDAK tertutup mobile menu
- Mobile menu harus punya z-index di bawah WA bar (z-30 vs z-40) atau menu harus punya scroll jika terlalu panjang
- Setelah menu dibuka, klik link harus otomatis menutup menu
- CTA "Konsultasi Gratis" button harus tetap visible di desktop (sudah ada), dan juga muncul di mobile menu

### 1B. OG + Twitter Card Meta Tags

**MASALAH:** Tidak ada Open Graph atau Twitter Card meta tags. Ketika link atrahdis.id di-share ke WA, Telegram, LinkedIn, Facebook — tidak ada preview image/title.

**FILE YANG DIUBAH:** `src/layouts/Base.astro`

**TAMBAHKAN di `<head>`, SETELAH `<link rel="canonical">` dan SEBELUM `<title>`:**

Props interface perlu ditambahkan `image`:
```typescript
interface Props {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
}

const { title, description, canonical = Astro.url.href, image = '/hero-sbu-atrahdis.webp' } = Astro.props;
```

Lalu tambahkan di `<head>`:
```astro
<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={new URL(image, Astro.site!).href} />
<meta property="og:url" content={canonical} />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Atrahdis" />
<meta property="og:locale" content="id_ID" />
<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={new URL(image, Astro.site!).href} />
```

**PENTING:**
- Default image adalah `/hero-sbu-atrahdis.webp` (1200x630, sudah sesuai OG ratio)
- Halaman tertentu bisa override dengan `<Base image="/blog/custom.webp" ...>`
- `Astro.site` sudah diset ke `https://atrahdis.id` di `astro.config.mjs`

---

## TASK 4 (setelah Task 1 selesai): 4 Layanan Cluster Hub Pages

### KONTEKS
Saat ini `/layanan` (file: `src/pages/layanan/index.astro`) sudah punya 4 cluster cards dengan list layanan dan link "Lihat Detail →". Tapi link "Lihat Detail" di 3 kartu (Pendukung, Maintenance, Tender) masih menunjuk ke `/layanan` (diri sendiri). Blueprint meminta 4 halaman hub terpisah.

**4 HALAMAN BARU YANG HARUS DIBUAT:**

### `/layanan/sertifikasi-utama.astro`
- Path file: `src/pages/layanan/sertifikasi-utama.astro`
- H1: "Sertifikasi Utama — SBU, SKK, KTA"
- Produk cards: SBU Kecil, SBU Menengah, SBU Besar, SKK, Serkom, KTA
- Setiap card link ke halaman detail yang sudah ada (`/layanan/sbu-kecil`, `/layanan/sbu-menengah`, `/layanan/sbu-besar`, `/layanan/skk`)
- Related blog posts: link ke `/blog/sbu-k-3-hari-kerja`, `/blog/perbedaan-sbu-kecil-menengah-besar-2026`, `/blog/apa-itu-sbu-konstruksi`
- BreadcrumbList JSON-LD: Home > Layanan > Sertifikasi Utama
- CTA: WA link `WA_LINKS.sbuK` (atau general)
- Styling: konsisten dengan halaman layanan lain (bg-white body, bg-navy-900 sections)

### `/layanan/pendukung-sbu.astro`
- Path file: `src/pages/layanan/pendukung-sbu.astro`
- H1: "Pendukung Pemenuhan SBU — KAP, ISO, Peralatan"
- Produk cards: Laporan Keuangan KAP, ISO 37001, Persyaratan Peralatan, Dokumen Pengalaman
- Related blog posts: `/blog/dokumen-sbu-konstruksi-checklist`, `/blog/kbli-untuk-sbu-konstruksi`
- BreadcrumbList JSON-LD
- CTA: WA link `WA_LINKS.general`

### `/layanan/maintenance.astro`
- Path file: `src/pages/layanan/maintenance.astro`
- H1: "Maintenance Compliance — Jangan Sampai Lewat Deadline"
- Produk cards: LKPM, Surveilans LSBU, SBU Monitoring, OSS Compliance
- Related blog posts: `/blog/perpanjangan-sbu-sebelum-expired`, `/blog/sbu-expired-tender`
- BreadcrumbList JSON-LD
- CTA: WA link `WA_LINKS.general`

### `/layanan/tender-compliance.astro`
- Path file: `src/pages/layanan/tender-compliance.astro`
- H1: "Tender & Compliance Tambahan"
- Produk cards: SMK3, ISO 9001/14001/45001, BPJS, KSWP, PKKPR/PBG, NIB/KBLI, Bank Garansi
- Related blog posts: `/blog/syarat-tender-konstruksi-sbu`, `/blog/tender-tanpa-sbu-risikonya`
- BreadcrumbList JSON-LD
- CTA: WA link `WA_LINKS.general`

**CONTOH STRUKTUR HALAMAN (template yang sama untuk ke-4 halaman):**

```astro
---
import Base from '../../layouts/Base.astro';
import { WA_LINKS } from '../../lib/constants';

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://atrahdis.id' },
    { '@type': 'ListItem', position: 2, name: 'Layanan', item: 'https://atrahdis.id/layanan' },
    { '@type': 'ListItem', position: 3, name: 'Sertifikasi Utama', item: 'https://atrahdis.id/layanan/sertifikasi-utama' },
  ],
};
---

<Base
  title="Sertifikasi Utama — SBU, SKK, KTA Konstruksi"
  description="SBU Kecil, Menengah, Besar + SKK J5-J9 + KTA Asosiasi. Audit awal, garansi output, timeline realistis."
  canonical="https://atrahdis.id/layanan/sertifikasi-utama"
>
  <Fragment slot="head">
    <script type="application/ld+json" set:html={JSON.stringify(breadcrumbSchema)} />
  </Fragment>

  <!-- Hero -->
  <section class="bg-navy-900 text-white">
    <div class="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <h1 class="font-heading text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
        Sertifikasi Utama — SBU, SKK, KTA
      </h1>
      <p class="mt-6 text-lg leading-relaxed text-gray-300 md:text-xl">
        Semua kualifikasi K, M, B dengan audit awal dan garansi output.
      </p>
    </div>
  </section>

  <!-- Product Cards -->
  <section class="mx-auto max-w-6xl px-4 py-20">
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- Card untuk setiap produk -->
      <a href="/layanan/sbu-kecil" class="group rounded-xl shadow-sm border border-gray-200 bg-white p-6 transition hover:border-gold-500/30">
        <p class="font-heading text-sm font-semibold uppercase tracking-wider text-gold-400">SBU Kecil</p>
        <p class="mt-2 font-heading text-lg font-semibold text-gray-900 group-hover:text-gold-400">SBU K — Mulai Rp 4,5 Juta</p>
        <p class="mt-2 text-sm text-gray-600">3–7 hari kerja. Untuk kontraktor modal ≤ Rp 5 miliar.</p>
        <p class="mt-4 text-sm text-gold-400">Lihat Detail →</p>
      </a>
      <!-- ... cards lainnya ... -->
    </div>
  </section>

  <!-- Related Blog -->
  <section class="bg-gray-50">
    <div class="mx-auto max-w-6xl px-4 py-20">
      <h2 class="font-heading text-2xl font-bold text-gray-900">Panduan Terkait</h2>
      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <a href="/blog/sbu-k-3-hari-kerja" class="group ...">
          <p class="text-xs font-medium uppercase tracking-wider text-gold-400">SBU-K</p>
          <p class="mt-2 font-heading text-lg font-semibold text-gray-900 group-hover:text-gold-400">SBU Kecil 3 Hari Kerja</p>
        </a>
        <!-- ... -->
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="bg-navy-900 text-white">
    <div class="mx-auto max-w-6xl px-4 py-20 text-center">
      <h2 class="font-heading text-3xl font-bold text-white">Konsultasi Gratis</h2>
      <p class="mt-4 text-gray-300">Audit dokumen sebelum proses — tanpa biaya, tanpa komitmen.</p>
      <a href={WA_LINKS.general} class="mt-8 inline-block rounded-lg bg-gold-500 px-10 py-4 font-heading text-lg font-semibold text-navy-900 shadow-lg shadow-gold-500/20 transition hover:bg-gold-400">
        WhatsApp Sekarang →
      </a>
    </div>
  </section>
</Base>
```

**JUGA UPDATE:** `src/pages/layanan/index.astro` — ganti link "Lihat Detail" di setiap kartu agar mengarah ke halaman hub yang baru:
- Sertifikasi Utama → `/layanan/sertifikasi-utama`
- Pendukung Pemenuhan SBU → `/layanan/pendukung-sbu`
- Maintenance Compliance → `/layanan/maintenance`
- Tender & Compliance → `/layanan/tender-compliance`

**JANGAN UBAH:**
- Warna dan styling yang sudah ada (navy/gold/white palette)
- Struktur halaman layanan detail yang sudah ada (sbu-kecil, sbu-menengah, dll)
- WA link yang sudah menggunakan WA_LINKS dari constants

**DATA LAYANAN (dari llms.txt dan homepage):**
- SBU Kecil (K): Mulai Rp 4,5 jt, 3-7 hari, ≤ Rp 5 miliar
- SBU Menengah (M): Mulai Rp 18 jt, 14-21 hari, Rp 5-25 miliar
- SBU Besar (B): Mulai Rp 50 jt, 21-30 hari, > Rp 25 miliar
- SBU Spesialis: Rp 21 jt, complex review
- SKK J5/J6: Rp 5,97 jt/berkas
- SKK J7: Rp 7,47 jt/berkas
- SKK J8: Rp 8,97 jt/berkas
- KTA Asosiasi: mulai Rp 1,5 jt, 3-10 hari
- Laporan Keuangan KAP: konsultasi, 3-6 minggu
- ISO 9001/14001/45001/37001
- SMK3: Rp 6 jt, 14-21 hari
- Persyaratan Peralatan: konsultasi
- OSS/NIB/KBLI
- LKPM: retainer
- PKKPR: konsultasi
- BUJKA/PMA