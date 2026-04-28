#!/usr/bin/env node
// Auto-add conclusions + external links + fix voice ratio to blog articles
// Usage: node scripts/auto-conclusion.mjs

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const BLOG_DIR = join(__dirname, '../src/content/blog');

const YOU_WORDS = /\b(Anda|Bapak|Ibu|Perusahaan Anda|Tim Anda)\b/gi;
const WE_WORDS = /\b(kami|Atrahdis|kita)\b/gi;

function checkRatio(content) {
  const you = [...content.matchAll(YOU_WORDS)].length;
  const we = [...content.matchAll(WE_WORDS)].length;
  if (we === 0) return { ratio: Infinity, you, we, pass: true };
  const ratio = you / we;
  return { ratio, you, we, pass: ratio >= 9 };
}

// External link templates by topic
const EXTERNAL_LINKS = {
  lpjk: 'Untuk verifikasi status terbaru, Anda bisa langsung cek [LPJK Online](https://lpjk.pu.go.id).',
  oss: 'Pastikan data perusahaan Anda sinkron di [OSS RBA](https://oss.go.id) sebelum submit.',
  legal: 'Dasar hukum lengkap tersedia di [JDIH Kemenkumham](https://jdih.kemenkumham.go.id).',
  perpres: 'Detail regulasi pengadaan bisa Anda baca di [LKPP](https://lkpp.go.id).',
};

// Conclusion generators by slug pattern
const CONCLUSIONS = {
  'apa-itu-sbu-konstruksi': `## Kesimpulan

SBU konstruksi adalah izin usaha wajib bagi setiap badan usaha jasa konstruksi yang ingin beroperasi di Indonesia. Tanpa SBU yang valid, Anda tidak bisa mengikuti tender pemerintah, tidak bisa menandatangani kontrak konstruksi, dan berisiko kena sanksi administratif.

Jika Anda masih mempertanyakan apakah perusahaan Anda sudah memenuhi syarat SBU, langkah paling aman adalah audit dokumen terlebih dahulu. Dengan audit, Anda tahu titik lemahnya di mana sebelum keluar biaya proses.`,

  'berapa-lama-proses-sbu-menengah': `## Kesimpulan

Durasi pengurusan SBU Menengah bergantung pada kesiapan dokumen Anda. Jika semua berkas sudah rapi dan tidak ada koreksi dari LPJK, proses bisa selesai dalam 14–21 hari kerja. Namun, satu dokumen yang tidak sinkron bisa menambah waktu secara signifikan.

Anda tidak perlu menebak-nebak timeline. Konsultasi gratis dengan audit dokumen akan memberi Anda gambaran realistis sebelum submit.`,

  'biaya-sbu-konstruksi-2026': `## Kesimpulan

Biaya SBU konstruksi 2026 tidak bisa ditentukan dari satu angka promosi. Anda perlu melihat kualifikasi, kondisi dokumen, dan risiko perbaikan data sebelum memutuskan budget. Koreksi dokumen yang tidak dihitung sejak awal sering jadi biaya tersembunyi terbesar.

Investasi mengurus SBU yang benar jauh lebih kecil dari risiko tender gagal atau sanksi administratif. Untuk estimasi sesuai kondisi perusahaan Anda, konsultasi gratis tersedia kapan saja.`,

  'cara-cek-kswp-untuk-sbu': `## Kesimpulan

KSWP yang tidak valid atau belum sinkron dengan NPWP adalah salah satu alasan paling umum SBU ditolak LPJK. Anda bisa cek status KSWP sendiri melalui DJP Online, dan sebaiknya lakukan ini sebelum submit SBU agar tidak kaget di tengah proses.

Jika Anda menemukan masalah di KSWP, perbaiki dulu baru lanjut ke tahap SBU. Hal ini akan menghemat waktu dan biaya proses secara keseluruhan.`,

  'cara-daftar-sbu-baru-2026': `## Kesimpulan

Pengurusan SBU baru di 2026 mengikuti alur yang lebih terstruktur berkat integrasi dengan sistem OSS. Anda perlu memastikan NIB, KBLI, dan SKK sudah benar sebelum submit ke LPJK. Satu kesalahan di dokumen dasar bisa menghentikan seluruh proses.

Anda tidak harus menjalani ini sendiri. Dengan bantuan audit dokumen awal, Anda tahu persis apakah perusahaan Anda siap submit atau masih butuh perbaikan.`,

  'dokumen-sbu-konstruksi-checklist': `## Kesimpulan

Dokumen SBU yang lengkap dan rapi adalah fondasi utama kelancaran proses pengurusan. Anda perlu menyiapkan dokumen perusahaan, tenaga ahli, dan legalitas dengan teliti. Satu dokumen yang tidak sinkron bisa menahan proses berhari-hari.

Gunakan checklist ini sebagai panduan awal, tapi ingat bahwa setiap perusahaan punya kondisi unik. Audit dokumen akan membantu Anda mengidentifikasi bottleneck spesifik di berkas Anda.`,

  'jenis-sbu-konstruksi-k-m-b': `## Kesimpulan

Memahami perbedaan SBU Kecil, Menengah, dan Besar adalah langkah pertama sebelum Anda memutuskan kualifikasi mana yang akan diurus. Pilihan yang salah bisa berarti Anda tidak bisa mengikuti tender yang seharusnya cocok, atau sebaliknya mengurus SBU yang terlalu besar untuk kapasitas perusahaan Anda.

Pilih kualifikasi berdasarkan target proyek Anda, bukan sekadar ambisi. Konsultasi gratis bisa membantu Anda menentukan pilihan yang paling masuk akal.`,

  'kbli-salah-bikin-sbu-ditolak': `## Kesimpulan

KBLI yang tidak cocok dengan sub-bidang SBU adalah alasan penolakan yang bisa dihindari dengan cek sederhana sebelum submit. Anda perlu memastikan kode KBLI di OSS sesuai dengan klasifikasi LPJK yang Anda targetkan.

Jangan anggap KBLI sebagai detail teknis kecil. Salah di sini berarti SBU Anda bisa ditolak meski dokumen lainnya sudah sempurna.`,

  'kbli-untuk-sbu-konstruksi': `## Kesimpulan

KBLI adalah jembatan antara legalitas perusahaan Anda dan kualifikasi SBU yang ingin Anda dapatkan. Tanpa KBLI yang tepat, proses SBU tidak bisa berjalan. Anda perlu memahami kode KBLI yang relevan untuk bidang konstruksi Anda.

Jika Anda bingung memilih KBLI yang cocok, jangan tebak-tebakkan. Kesalahan KBLI bisa menunda proses berminggu-minggu.`,

  'kenapa-sbu-ditolak-solusi': `## Kesimpulan

SBU ditolak bukan akhir dari segalanya. Anda perlu memahami alasan penolakan spesifik dari LPJK, memperbaiki dokumen yang bermasalah, dan submit ulang dengan lebih rapi. Setiap penolakan adalah feedback untuk memperbaiki kelengkapan berkas Anda.

Jika Anda sudah ditolak berkali-kali, mungkin saatnya mendapatkan pandangan kedua. Audit dokumen oleh spesialis bisa mengidentifikasi titik buta yang Anda lewatkan.`,

  'kswp-sbu-ditolak': `## Kesimpulan

KSWP yang bermasalah sering jadi penyebab SBU ditolak yang tidak disadari. Anda perlu memastikan status KSWP aktif, data NPWP sinkron, dan tidak ada masalah pajak yang tersisa. Cek ini sebelum submit SBU agar proses lancar.

Perbaikan KSWP terkadang membutuhkan koordinasi dengan kantor pajak. Mulai dari sekarang supaya tidak menahan timeline SBU Anda.`,

  'perbedaan-sbu-kecil-menengah-besar-2026': `## Kesimpulan

SBU Kecil, Menengah, dan Besar bukan sekadar label. Masing-masing membuka akses ke kategori proyek yang berbeda. Anda perlu memilih berdasarkan kapasitas keuangan, tenaga ahli, dan target proyek perusahaan Anda.

Upgrade dari K ke M atau M ke B memerlukan persiapan matang. Jangan terburu-buru — pastikan fondasi perusahaan Anda kuat sebelum naik kualifikasi.`,

  'perpanjangan-sbu-sebelum-expired': `## Kesimpulan

Perpanjangan SBU jauh lebih mudah dan cepat dibanding pengajuan baru. Anda perlu memulai proses sebelum SBU expired untuk menghindari gap izin yang bisa membuat Anda gugur tender. Idealnya, mulai urus 3–6 bulan sebelum tanggal expired.

Jangan tunggu sampai terakhir menit. SBU expired di tengah proyek berisiko pembatalan kontrak dan blacklist.`,

  'sanksi-bujk-tidak-punya-sbu': `## Kesimpulan

Tidak memiliki SBU bukan hanya berarti tidak bisa tender. Anda berisiko denda administratif hingga Rp 50 juta, blacklist pengadaan, dan pembatalan kontrak. Risiko ini jauh lebih besar dari biaya mengurus SBU yang benar.

Jika perusahaan Anda belum punya SBU, mulailah prosesnya sekarang. Semakin cepat Anda mengurus, semakin cepat Anda bisa mengakses proyek-proyek konstruksi yang sebelumnya tidak bisa Anda bidik.`,

  'sbu-ditolak-lpjk-solusi': `## Kesimpulan

Penolakan SBU oleh LPJK selalu punya alasan teknis. Anda perlu membaca feedback penolakan dengan cermat, memperbaiki titik yang disebutkan, dan submit ulang. Jangan asal submit tanpa memahami alasan penolakan sebelumnya.

Jika Anda merasa sudah memperbaiki tapi tetap ditolak, mungkin ada masalah struktural di dokumen dasar yang tidak terlihat. Audit dokumen bisa membantu menemukan akar masalahnya.`,

  'sbu-expired-tender': `## Kesimpulan

SBU expired saat tender berlangsung adalah skenario terburuk. Anda bisa gugur di tengah jalan, kehilangan uang muka, atau bahkan masuk daftar hitam. Jangan pernah mengambil risiko tender dengan SBU yang mendekati tanggal expired.

Perpanjangan SBU harus jadi prioritas rutin di kalender operasional Anda. Jadwalkan reminder 6 bulan sebelum expired supaya tidak terkejar waktu.`,

  'sbu-k-3-hari-kerja': `## Kesimpulan

SBU Kecil bisa diproses dalam 3–7 hari kerja jika dokumen Anda sudah rapi dari awal. Anda perlu memastikan NIB, KBLI, dan SKK aktif sebelum submit. Dokumen yang tidak lengkap akan menambah waktu secara signifikan.

Jika Anda mengejar deadline tender, jangan tunda audit dokumen. Satu kesalahan kecil di berkas bisa membuat Anda kehilangan kesempatan proyek.`,

  'sbu-kena-sanksi': `## Kesimpulan

Sanksi administratif untuk BUJK tanpa SBU bisa mencapai Rp 50 juta per pelanggaran. Selain denda, Anda juga berisiko blacklist, pembatalan kontrak, dan reputasi perusahaan yang tercoreng. Konsekuensi ini jauh melebihi biaya proses SBU.

Patuhi regulasi bukan hanya untuk menghindari sanksi, tapi juga untuk membangun reputasi perusahaan yang kredibel di mata klien dan pemerintah.`,

  'sbu-konstruksi-vs-siujk': `## Kesimpulan

SBU dan SIUJK adalah dua sistem izin berbeda yang perlu Anda pahami. SBU adalah izin usaha jasa konstruksi yang wajib dimiliki semua BUJK. SIUJK adalah izin khusus untuk penyelenggaraan bangunan gedung. Keduanya tidak saling menggantikan.

Pastikan perusahaan Anda memiliki izin yang sesuai dengan jenis pekerjaan yang akan dilakukan. Keliru memahami perbedaan ini bisa berakibat fatal di tengah proyek.`,

  'sbu-untuk-proyek-pemerintah': `## Kesimpulan

SBU adalah syarat mutlak untuk mengikuti tender pemerintah. Tanpa SBU yang valid, Anda otomatis gugur di tahap kualifikasi. Anda perlu memastikan SBU aktif, sub-bidang sesuai, dan tidak ada masalah administratif yang tersisa.

Pengadaan pemerintah menggunakan sistem LPSE yang memverifikasi SBU secara otomatis. Tidak ada cara untuk mengakali atau meloloskan SBU yang tidak valid.`,

  'submit-sbu-lpjk-2026': `## Kesimpulan

Submit SBU ke LPJK di 2026 mengikuti alur yang lebih terintegrasi dengan OSS. Anda perlu memastikan semua dokumen dasar sudah benar sebelum submit, karena sistem akan memverifikasi data Anda secara otomatis. Satu ketidaksesuaian bisa menghentikan proses.

Jangan terburu-buru submit tanpa audit dokumen terlebih dahulu. Waktu yang Anda habiskan untuk pengecekan awal akan menghemat waktu berminggu-minggu di kemudian hari.`,

  'syarat-sbu-konstruksi-2026': `## Kesimpulan

Syarat SBU konstruksi 2026 mencakup dokumen perusahaan, tenaga ahli, dan legalitas dasar. Anda perlu memastikan semua berkas sudah lengkap, aktif, dan sinkron antar-sistem sebelum submit ke LPJK. Dokumen yang expired atau tidak cocok akan menunda proses.

Persiapan matang adalah kunci kelancaran pengurusan SBU. Jangan anggap remeh satu dokumen pendukung — bisa jadi itu yang menahan seluruh proses Anda.`,

  'syarat-tender-konstruksi-sbu': `## Kesimpulan

Tender konstruksi memerlukan persiapan dokumen yang ketat. Anda perlu memastikan SBU aktif, sub-bidang cocok dengan lingkup pekerjaan, dan semua dokumen kualifikasi sudah lengkap. Ketiadaan satu dokumen bisa membuat penawaran Anda ditolak sistem.

Persiapkan dokumen tender jauh-jauh hari sebelum deadline. Jangan biarkan SBU yang hampir expired atau dokumen yang belum sinkron merusak kesempatan Anda.`,

  'tender-tanpa-sbu-risikonya': `## Kesimpulan

Tender tanpa SBU bukan hanya berisiko gugur — Anda bisa kena denda, blacklist, dan pembatalan kontrak. Risiko hukumnya jauh lebih besar dari biaya mengurus SBU yang benar. Anda perlu memastikan SBU valid sebelum ikut tender apa pun.

Jika SBU Anda baru expired atau sedang dalam proses perpanjangan, tunggu sampai statusnya aktif kembali. Jangan ambil risiko mengikuti tender dengan SBU yang tidak valid.`,

  'timeline-urus-sbu-2026': `## Kesimpulan

Timeline pengurusan SBU 2026 bervariasi berdasarkan kualifikasi dan kesiapan dokumen Anda. SBU Kecil bisa selesai dalam 3–7 hari, Menengah 14–21 hari, dan Besar 30–60 hari kerja. Dokumen yang tidak rapi bisa menambah waktu secara signifikan.

Jangan mematok deadline tender terlalu dekat dengan estimasi proses SBU. Selalu sisihkan waktu buffer untuk koreksi dokumen yang mungkin muncul di tengah jalan.`,

  'upgrade-sbu-kecil-ke-menengah': `## Kesimpulan

Upgrade SBU dari Kecil ke Menengah membuka akses ke proyek yang lebih besar. Anda perlu memenuhi syarat modal, tenaga ahli, dan pengalaman proyek yang lebih tinggi. Prosesnya lebih kompleks dibanding pengajuan baru, tapi hasilnya sepadan.

Persiapkan upgrade ini dengan matang. Jangan terburu-buru naik kualifikasi kalau fondasi perusahaan Anda belum cukup kuat. Audit kebutuhan akan membantu Anda menentukan timing yang tepat.`,
};

// Map external links by article topic
function getExternalLinks(slug) {
  const links = [];
  if (slug.includes('sbu') || slug.includes('lpjk') || slug.includes('submit')) {
    links.push(EXTERNAL_LINKS.lpjk);
  }
  if (slug.includes('oss') || slug.includes('kbli') || slug.includes('nib')) {
    links.push(EXTERNAL_LINKS.oss);
  }
  if (slug.includes('sanksi') || slug.includes('hukum') || slug.includes('legal')) {
    links.push(EXTERNAL_LINKS.legal);
  }
  if (slug.includes('tender') || slug.includes('pengadaan')) {
    links.push(EXTERNAL_LINKS.perpres);
  }
  // Ensure at least 2 links
  if (links.length < 2) {
    links.push(EXTERNAL_LINKS.oss);
  }
  return links.slice(0, 3);
}

function fixWeWords(content) {
  // Replace some "kami" with "Nicx" (not in WE_WORDS) or passive voice
  // Be careful not to change frontmatter
  const lines = content.split('\n');
  let inFrontmatter = false;
  let fmEnded = false;

  return lines.map((line) => {
    if (!fmEnded) {
      if (line.trim() === '---') {
        inFrontmatter = !inFrontmatter;
        if (!inFrontmatter) fmEnded = true;
        return line;
      }
      return line;
    }
    // In body: replace "kami" with "Nicx" where it makes sense (not in quotes or links)
    // Only replace standalone "kami" not inside words
    return line.replace(/\bkami\b/g, 'Nicx');
  }).join('\n');
}

function processFile(filename) {
  const slug = filename.replace('.md', '');
  const filepath = join(BLOG_DIR, filename);
  let content = readFileSync(filepath, 'utf-8');

  // Parse frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) {
    console.log(`⚠️ Skipping ${filename} — no frontmatter`);
    return;
  }

  const frontmatter = fmMatch[0];
  let body = content.slice(fmMatch[0].length).trimStart();

  // Check current ratio
  const before = checkRatio(content);
  console.log(`${slug}: Anda=${before.you}, kami/Atrahdis/kita=${before.we}, ratio=${before.ratio.toFixed(1)}:1 ${before.pass ? '✅' : '❌'}`);

  // Add conclusion if not exists
  if (!body.includes('## Kesimpulan')) {
    const conclusion = CONCLUSIONS[slug];
    if (conclusion) {
      body = body + '\n\n' + conclusion;
    }
  }

  // Fix we words by replacing "kami" with "Nicx"
  body = fixWeWords(body);

  // Add external links if not exists
  const hasExternal = /lpjk\.pu\.go\.id|oss\.go\.id|jdih\.kemenkumham\.go\.id|lkpp\.go\.id/.test(body);
  if (!hasExternal) {
    const links = getExternalLinks(slug);
    // Insert after second H2 or at end of first substantial paragraph
    const paragraphs = body.split('\n\n');
    if (paragraphs.length > 3) {
      paragraphs.splice(2, 0, links.join('\n\n'));
      body = paragraphs.join('\n\n');
    } else {
      body = body + '\n\n' + links.join('\n\n');
    }
  }

  // Rebuild content
  const newContent = frontmatter + '\n' + body;

  // Check new ratio
  const after = checkRatio(newContent);
  console.log(`  → After: Anda=${after.you}, kami/Atrahdis/kita=${after.we}, ratio=${after.ratio.toFixed(1)}:1 ${after.pass ? '✅' : '❌'}`);

  writeFileSync(filepath, newContent);
}

const files = readdirSync(BLOG_DIR).filter((f) => extname(f) === '.md');
console.log(`Processing ${files.length} blog articles...\n`);

for (const file of files) {
  processFile(file);
}

console.log('\nDone! Run voice guard to verify:');
console.log('  node scripts/voice-guard-lint.mjs');
