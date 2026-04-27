import { useEffect, useState } from 'react';

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

interface Props {
  snapToken: string;
  amount: number;
}

export default function PaymentButton({ snapToken, amount }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.snap) {
      setLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    script.setAttribute('data-client-key', 'YOUR_CLIENT_KEY');
    script.onload = () => setLoaded(true);
    script.onerror = () => setLoaded(false);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handlePay = () => {
    if (!window.snap) return;
    setLoading(true);
    window.snap.pay(snapToken, {
      onSuccess: (result) => {
        setLoading(false);
        console.log('Payment success:', result);
        window.location.reload();
      },
      onPending: (result) => {
        setLoading(false);
        console.log('Payment pending:', result);
      },
      onError: (result) => {
        setLoading(false);
        console.error('Payment error:', result);
        alert('Pembayaran gagal. Silakan coba lagi.');
      },
      onClose: () => {
        setLoading(false);
      },
    });
  };

  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

  return (
    <button
      onClick={handlePay}
      disabled={!loaded || loading}
      className="inline-flex items-center rounded-lg bg-gold-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? 'Memuat…' : `Bayar ${formatted}`}
    </button>
  );
}
