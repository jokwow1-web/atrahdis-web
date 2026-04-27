export type DealStatus = 'draft' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type StepStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';
export type DocStatus = 'missing' | 'uploaded' | 'validating' | 'validated' | 'failed' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface DealStep {
  id: string;
  step_number: number;
  title: string;
  status: StepStatus;
  completed_at?: string;
  notes?: string;
}

export interface DealDocument {
  id: string;
  doc_type: string;
  label: string;
  status: DocStatus;
  confidence?: number;
  presigned_url?: string;
  file_url?: string;
  uploaded_at?: string;
  validated_at?: string;
}

export interface Payment {
  id: string;
  amount: number;
  status: PaymentStatus;
  snap_token?: string;
  paid_at?: string;
  description?: string;
}

export interface Deal {
  id: string;
  package_name: string;
  sub_bidang: string;
  status: DealStatus;
  progress_percent: number;
  current_step: number;
  total_steps: number;
  created_at: string;
  updated_at: string;
  client_name: string;
  client_company: string;
  steps: DealStep[];
  documents: DealDocument[];
  payments: Payment[];
}

export interface DealsListResponse {
  deals: Deal[];
  total: number;
}

export interface PresignedUploadResponse {
  presigned_url: string;
  doc_id: string;
  expires_in: number;
}

export interface FinalizeDocumentResponse {
  doc_id: string;
  status: DocStatus;
  confidence?: number;
}

export const SBU_DOCUMENTS: { doc_type: string; label: string }[] = [
  { doc_type: 'akta_pendirian', label: 'Akta Pendirian Perusahaan' },
  { doc_type: 'sk_kemenkumham', label: 'SK Kemenkumham' },
  { doc_type: 'npwp_perusahaan', label: 'NPWP Perusahaan' },
  { doc_type: 'nib_oss', label: 'NIB OSS-RBA' },
  { doc_type: 'ktp_direktur', label: 'KTP Direktur Utama' },
  { doc_type: 'ijazah_direktur', label: 'Ijazah Direktur' },
  { doc_type: 'skk_direktur', label: 'SKK Direktur (J5-J9)' },
  { doc_type: 'ktp_teknis', label: 'KTP Tenaga Teknis' },
  { doc_type: 'ijazah_teknis', label: 'Ijazah Tenaga Teknis' },
  { doc_type: 'skk_teknis', label: 'SKK Tenaga Teknis' },
  { doc_type: 'spk_kontrak', label: 'SPK / Kontrak Kerja' },
  { doc_type: 'bukti_pengalaman', label: 'Bukti Pengalaman Kerja' },
  { doc_type: 'rekening_koran', label: 'Rekening Koran 3 Bulan' },
  { doc_type: 'pakta_integritas', label: 'Pakta Integritas' },
  { doc_type: 'spt_tahunan', label: 'SPT Tahunan Terakhir' },
];

export const DEFAULT_STEPS: string[] = [
  'Screening & Konsultasi',
  'Pengumpulan Dokumen',
  'Verifikasi Dokumen',
  'Pengajuan ke LPJK',
  'Audit Lapangan',
  'Koreksi Dokumen',
  'Pembayaran Retribusi',
  'Proses Sertifikasi',
  'Review Teknis',
  'Persetujuan Komite',
  'Cetak Sertifikat',
  'Tanda Tangan Digital',
  'Penerbitan SBU',
  'Pengiriman Sertifikat',
  'Onboarding Selesai',
];
