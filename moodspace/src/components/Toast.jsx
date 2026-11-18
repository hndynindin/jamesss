import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Toast() {
  const { toast, setToast } = useApp();
  if (!toast) return null;

  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 animate-fade-in-up">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg border backdrop-blur-md ${
          isError
            ? 'bg-red-50/95 border-red-200 text-red-800 dark:bg-red-950/90 dark:border-red-800 dark:text-red-200'
            : 'bg-[#FFF9F1]/95 border-[#C7B1E5] text-[#393343] dark:bg-[#272235]/95 dark:border-[#5D4C7A] dark:text-[#F3EEF9]'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[#8D78A9] dark:text-[#C7B1E5] shrink-0" />
        )}
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={() => setToast(null)}
          className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4 opacity-60" />
        </button>
      </div>
    </div>
  );
}

