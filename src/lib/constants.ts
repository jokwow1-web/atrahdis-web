export const WA_HUMAN = '6289699217161';
export const WA_ARA = '6289699217161';

export const IDENTITY = {
  legalName: 'PT Atrahdis Idea Nusantara',
  founder: 'Nicx (Nicky Valiant)',
  operatingSince: '2016',
  certificates: '280+',
  nib: '9120006530734',
  address: 'Jl. TB. Simatupang Kav. 41, Beltway Office Park, Ragunan, Pasar Minggu, Jakarta Selatan 12550',
  sbuQualifications: ['K', 'M', 'B'] as const,
};

// WA pre-fill links per context
export const WA_LINKS = {
  general: `https://wa.me/${WA_HUMAN}?text=Halo%20Nicx%2C%20saya%20mau%20tanya%20tentang%20SBU`,
  sbuK: `https://wa.me/${WA_HUMAN}?text=Halo%20Nicx%2C%20saya%20mau%20tanya%20tentang%20SBU%20Kecil`,
  sbuM: `https://wa.me/${WA_HUMAN}?text=Halo%20Nicx%2C%20saya%20mau%20tanya%20tentang%20SBU%20Menengah`,
  sbuB: `https://wa.me/${WA_HUMAN}?text=Halo%20Nicx%2C%20saya%20mau%20tanya%20tentang%20SBU%20Besar`,
  skk: `https://wa.me/${WA_HUMAN}?text=Halo%20Nicx%2C%20saya%20mau%20tanya%20tentang%20SKK`,
  ara: `https://wa.me/${WA_ARA}?text=Halo%20Ara%2C%20saya%20mau%20screening%20kebutuhan%20SBU`,
  checklist: `https://wa.me/${WA_HUMAN}?text=Saya%20mau%20dapat%20Checklist%20Dokumen%20SBU%20gratis`,
} as const;

// Backward compat
export const WA_CTA_URL = WA_LINKS.general;
export const WA_ARA_URL = WA_LINKS.ara;

export const ORG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['Organization', 'LocalBusiness'],
  '@id': 'https://atrahdis.id/#organization',
  name: IDENTITY.legalName,
  alternateName: ['Atrahdis', 'PT Atrahdis'],
  founder: {
    '@type': 'Person',
    name: IDENTITY.founder,
    jobTitle: 'SBU Specialist',
    knowsAbout: ['SBU Konstruksi', 'SKK', 'LPJK', 'OSS-RBA', 'KTA Asosiasi'],
  },
  foundingDate: '2017',
  description: 'Jasa pengurusan SBU Konstruksi Indonesia — Sertifikat Badan Usaha K, M, B. 280+ sertifikat diproses sejak 2016.',
  knowsAbout: [
    'SBU Konstruksi Indonesia',
    'Sertifikat Badan Usaha',
    'SKK J5-J9',
    'KTA Asosiasi Konstruksi',
    'ISO 9001/14001/45001',
    'OSS-RBA',
    'BUJKA/PMA',
    'LPJK',
  ],
  sameAs: [
    'https://www.linkedin.com/company/atrahdis',
    'https://sbu.atrahdis.id',
  ],
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. TB. Simatupang Kav. 41, Beltway Office Park',
    addressLocality: 'Jakarta Selatan',
    addressRegion: 'DKI Jakarta',
    postalCode: '12550',
    addressCountry: 'ID',
  },
  telephone: '+628131092903',
  url: 'https://atrahdis.id',
  priceRange: 'Rp 4.500.000 - Rp 50.000.000',
  numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 10 },
  areaServed: { '@type': 'Country', name: 'Indonesia' },
};

export const PERSON_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': 'https://atrahdis.id/#nicx',
  name: 'Nicx (Nicky Valiant)',
  jobTitle: 'SBU Specialist & Founder',
  worksFor: { '@id': 'https://atrahdis.id/#organization' },
  knowsAbout: ['SBU Konstruksi', 'LPJK', 'SKK J5-J9', 'KTA Asosiasi', 'OSS-RBA', 'BUJKA'],
  description: 'Nicx mengurus SBU konstruksi sejak 2016. 280+ sertifikat diproses secara personal. Pendiri PT Atrahdis Idea Nusantara.',
  image: 'https://atrahdis.id/nicx.webp',
  url: 'https://atrahdis.id/tentang',
};
