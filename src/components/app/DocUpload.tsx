import { useState, useCallback } from "react";

interface Document {
  id: string;
  file_name: string;
  doc_type: string;
  confidence_score?: number;
  validation_status?: string;
  uploaded_at?: string;
}

export default function DocUpload({
  dealId,
  documents,
}: {
  dealId: string;
  documents: Document[];
}) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localDocs, setLocalDocs] = useState<Document[]>(documents);

  const handleUpload = useCallback(async () => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const SUPABASE_URL = (import.meta as any).env.PUBLIC_SUPABASE_URL;
    const SUPABASE_ANON_KEY = (import.meta as any).env.PUBLIC_SUPABASE_ANON_KEY;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const path = `${dealId}/${Date.now()}_${file.name}`;

        const uploadRes = await fetch(`${SUPABASE_URL}/storage/v1/object/documents/${path}`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": file.type || "application/octet-stream",
          },
          body: file,
        });

        if (!uploadRes.ok) {
          throw new Error(`Upload gagal: ${file.name}`);
        }

        const docRes = await fetch(`${SUPABASE_URL}/rest/v1/documents`, {
          method: "POST",
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            deal_id: dealId,
            file_name: file.name,
            file_path: path,
            mime_type: file.type,
            file_size_bytes: file.size,
            doc_type: "general",
            validation_status: "pending",
          }),
        });

        if (docRes.ok) {
          const newDoc = await docRes.json();
          setLocalDocs((prev) => [newDoc[0], ...prev]);
        }
      }
      setFiles(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploading(false);
    }
  }, [files, dealId]);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h3 className="font-semibold text-slate-900">Dokumen</h3>

      <div className="mt-4 space-y-3">
        {localDocs.map((doc) => (
          <div key={doc.id} className="flex items-start justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{doc.file_name}</p>
              <div className="mt-1 flex items-center gap-2 text-xs">
                <span className={`rounded-full px-2 py-0.5 ${
                  doc.validation_status === "approved"
                    ? "bg-green-100 text-green-700"
                    : doc.validation_status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-amber-100 text-amber-700"
                }`}>
                  {doc.validation_status || "pending"}
                </span>
                {typeof doc.confidence_score === "number" && (
                  <span className="text-slate-500">Score: {(doc.confidence_score * 100).toFixed(1)}%</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
          className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
        />
        {files && files.length > 0 && (
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Mengunggah..." : `Upload ${files.length} file`}
          </button>
        )}
      </div>
    </div>
  );
}
