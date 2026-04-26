import { useState } from "react";

interface Payment {
  id: string;
  payment_type: string;
  amount_idr: number;
  status: string;
  due_date?: string;
  paid_at?: string;
  snap_token?: string;
  snap_redirect_url?: string;
}

interface Deal {
  id: string;
  price_idr?: number;
  total_price_idr?: number;
  dp_amount_idr?: number;
  final_amount_idr?: number;
  status?: string;
}

export default function PaymentButton({
  deal,
  payments,
}: {
  deal: Deal;
  payments: Payment[];
}) {
  const [loading, setLoading] = useState(false);
  const [localPayments, setLocalPayments] = useState<Payment[]>(payments);

  const totalPaid = localPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + (p.amount_idr || 0), 0);

  const totalDue = deal.total_price_idr || deal.price_idr || 0;
  const remaining = Math.max(0, totalDue - totalPaid);

  const createPayment = async () => {
    setLoading(true);
    const ORCHESTRATOR_URL = (import.meta as any).env.PUBLIC_ORCHESTRATOR_URL;

    try {
      const res = await fetch(`${ORCHESTRATOR_URL}/api/v1/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deal_id: deal.id,
          amount_idr: remaining,
          payment_type: "full_payment",
        }),
      });

      if (!res.ok) throw new Error("Gagal membuat pembayaran");

      const data = await res.json();

      if (data.snap_token) {
        // Open Midtrans Snap popup
        if (typeof window !== "undefined" && (window as any).snap) {
          (window as any).snap.pay(data.snap_token, {
            onSuccess: () => {
              window.location.reload();
            },
            onPending: () => {
              alert("Pembayaran pending. Silakan selesaikan pembayaran Anda.");
            },
            onError: () => {
              alert("Pembayaran gagal. Coba lagi.");
            },
          });
        } else if (data.snap_redirect_url) {
          window.location.href = data.snap_redirect_url;
        }
      } else if (data.snap_redirect_url) {
        window.location.href = data.snap_redirect_url;
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal memproses pembayaran");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-900">Pembayaran</h3>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Total</span>
          <span className="font-semibold text-slate-900">Rp {totalDue.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Sudah Dibayar</span>
          <span className="font-semibold text-green-700">Rp {totalPaid.toLocaleString("id-ID")}</span>
        </div>
        <div className="flex justify-between border-t pt-2">
          <span className="text-slate-500">Sisa</span>
          <span className="font-bold text-slate-900">Rp {remaining.toLocaleString("id-ID")}</span>
        </div>
      </div>

      {remaining > 0 && (
        <button
          onClick={createPayment}
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Bayar Sekarang"}
        </button>
      )}

      {remaining === 0 && totalDue > 0 && (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-center text-sm text-green-700">
          Lunas
        </div>
      )}

      <script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="SB-Mid-client-epIMqVpndyiSnrFB"></script>
    </div>
  );
}
