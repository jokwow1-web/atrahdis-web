import { useCallback, useEffect, useRef, useState } from 'react';
import type { DealDocument } from '../../types/deal';
import { SBU_DOCUMENTS } from '../../types/deal';

interface Props {
  dealId: string;
  documents: DealDocument[];
}

type UploadState = Record<
  string,
  {
    status: 'idle' | 'uploading' | 'validating' | 'validated' | 'failed' | 'rejected';
    confidence?: number;
    progress: number;
    error?: string;
  }
>;

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'validated':
      return 'bg-gold-900/40 text-gold-400 border-gold-700/50';
    case 'validating':
    case 'uploaded':
      return 'bg-blue-900/40 text-blue-400 border-blue-700/50';
    case 'failed':
      return 'bg-red-900/40 text-red-400 border-red-700/50';
    case 'rejected':
      return 'bg-red-900/40 text-red-400 border-red-700/50';
    default:
      return 'bg-gray-800 text-gray-400 border-gray-700';
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'validated':
      return 'Tervalidasi';
    case 'validating':
      return 'Memvalidasi…';
    case 'uploaded':
      return 'Diunggah';
    case 'failed':
      return 'Gagal';
    case 'rejected':
      return 'Ditolak';
    default:
      return 'Belum diunggah';
  }
}

export default function DocUpload({ dealId, documents }: Props) {
  const [uploads, setUploads] = useState<UploadState>(() => {
    const initial: UploadState = {};
    documents.forEach((d) => {
      initial[d.doc_type] = {
        status: d.status === 'validated' ? 'validated' : d.status === 'failed' ? 'failed' : d.status === 'rejected' ? 'rejected' : d.status === 'validating' ? 'validating' : d.status === 'uploaded' ? 'uploaded' : 'idle',
        confidence: d.confidence,
        progress: d.status === 'validated' ? 100 : 0,
      };
    });
    return initial;
  });

  const [dragOver, setDragOver] = useState<string | null>(null);
  const pollingRef = useRef<Set<string>>(new Set());

  const pollStatus = useCallback(
    async (docType: string, docId: string) => {
      if (pollingRef.current.has(docId)) return;
      pollingRef.current.add(docId);

      const poll = async () => {
        try {
          const res = await fetch(`/api/deals/${dealId}/documents/${docId}/finalize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ poll: true }),
          });
          const data = await res.json().catch(() => ({}));
          const status = data.status || 'validating';

          setUploads((prev) => ({
            ...prev,
            [docType]: {
              ...prev[docType],
              status,
              confidence: data.confidence,
              progress: status === 'validated' ? 100 : prev[docType]?.progress ?? 50,
            },
          }));

          if (status === 'validated' || status === 'failed' || status === 'rejected') {
            pollingRef.current.delete(docId);
            return;
          }

          setTimeout(poll, 3000);
        } catch {
          setUploads((prev) => ({
            ...prev,
            [docType]: {
              ...prev[docType],
              status: 'failed',
              error: 'Gagal memeriksa status',
            },
          }));
          pollingRef.current.delete(docId);
        }
      };

      poll();
    },
    [dealId]
  );

  const uploadFile = useCallback(
    async (docType: string, file: File) => {
      setUploads((prev) => ({
        ...prev,
        [docType]: { status: 'uploading', progress: 10 },
      }));

      try {
        // 1. Get presigned URL
        const presRes = await fetch(`/api/deals/${dealId}/documents/presigned`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doc_type: docType, filename: file.name, content_type: file.type }),
        });
        if (!presRes.ok) throw new Error('Gagal mendapatkan presigned URL');
        const pres = await presRes.json();

        setUploads((prev) => ({ ...prev, [docType]: { ...prev[docType], progress: 40 } }));

        // 2. Upload file directly to presigned URL
        const uploadRes = await fetch(pres.presigned_url, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });
        if (!uploadRes.ok) throw new Error('Gagal mengunggah file');

        setUploads((prev) => ({ ...prev, [docType]: { ...prev[docType], progress: 70, status: 'validating' } }));

        // 3. Finalize
        const finRes = await fetch(`/api/deals/${dealId}/documents/${pres.doc_id}/finalize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ presigned_url: pres.presigned_url }),
        });
        if (!finRes.ok) throw new Error('Gagal finalisasi dokumen');
        const fin = await finRes.json();

        setUploads((prev) => ({
          ...prev,
          [docType]: {
            ...prev[docType],
            progress: 85,
            status: fin.status === 'validated' ? 'validated' : 'validating',
            confidence: fin.confidence,
          },
        }));

        // 4. Poll if still validating
        if (fin.status !== 'validated' && fin.status !== 'failed' && fin.status !== 'rejected') {
          pollStatus(docType, pres.doc_id);
        }
      } catch (err) {
        setUploads((prev) => ({
          ...prev,
          [docType]: {
            status: 'failed',
            progress: 0,
            error: err instanceof Error ? err.message : 'Upload gagal',
          },
        }));
      }
    },
    [dealId, pollStatus]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, docType: string) => {
      e.preventDefault();
      setDragOver(null);
      const file = e.dataTransfer.files?.[0];
      if (file) uploadFile(docType, file);
    },
    [uploadFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(docType, file);
    },
    [uploadFile]
  );

  const getDocState = (docType: string) => {
    const up = uploads[docType];
    const existing = documents.find((d) => d.doc_type === docType);
    if (up) return up;
    if (existing) {
      return {
        status: existing.status as UploadState[string]['status'],
        confidence: existing.confidence,
        progress: existing.status === 'validated' ? 100 : 0,
      };
    }
    return { status: 'idle' as const, progress: 0 };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar checklist */}
      <aside className="lg:col-span-1 bg-navy-900/50 border border-navy-700/50 rounded-xl p-4 h-fit">
        <h3 className="text-sm font-semibold text-white mb-3">Checklist Dokumen ({SBU_DOCUMENTS.length})</h3>
        <ul className="space-y-2">
          {SBU_DOCUMENTS.map((doc) => {
            const state = getDocState(doc.doc_type);
            return (
              <li key={doc.doc_type} className="flex items-center justify-between text-sm">
                <span className="text-gray-300 truncate pr-2">{doc.label}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${statusBadgeClass(state.status)}`}>
                  {statusLabel(state.status)}
                </span>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Upload areas */}
      <div className="lg:col-span-2 space-y-4">
        {SBU_DOCUMENTS.map((doc) => {
          const state = getDocState(doc.doc_type);
          return (
            <div
              key={doc.doc_type}
              onDragOver={(e) => { e.preventDefault(); setDragOver(doc.doc_type); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(e, doc.doc_type)}
              className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
                dragOver === doc.doc_type
                  ? 'border-blue-400 bg-blue-900/20'
                  : 'border-navy-700/50 bg-navy-900/30 hover:border-navy-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{doc.label}</p>
                  {state.error && <p className="text-xs text-red-400 mt-1">{state.error}</p>}
                  {state.confidence != null && state.status === 'validated' && (
                    <span className="inline-flex items-center mt-1 text-[10px] bg-gold-900/40 text-gold-400 px-2 py-0.5 rounded border border-gold-700/50">
                      Confidence {(state.confidence * 100).toFixed(0)}%
                    </span>
                  )}
                </div>
                <label className="cursor-pointer shrink-0">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, doc.doc_type)}
                    disabled={state.status === 'uploading' || state.status === 'validating'}
                  />
                  <span className="inline-flex items-center rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-navy-700 transition-colors disabled:opacity-50">
                    {state.status === 'uploading' ? 'Mengunggah…' : state.status === 'validating' ? 'Memvalidasi…' : 'Pilih File'}
                  </span>
                </label>
              </div>
              {state.status === 'uploading' || state.status === 'validating' ? (
                <div className="mt-3 h-1.5 w-full bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300 rounded-full"
                    style={{ width: `${state.progress}%` }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
