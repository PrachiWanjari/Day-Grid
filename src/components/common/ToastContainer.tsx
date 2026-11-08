import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-18 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none select-none"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        let border = 'border-[#A3C9AE]';
        let bg = 'bg-white';
        let icon = <CheckCircle2 className="w-4 h-4 text-[#4A7C59] shrink-0" />;

        if (toast.type === 'error') {
          border = 'border-[#FCA5A5]';
          icon = <AlertCircle className="w-4 h-4 text-[#B91C1C] shrink-0" />;
        } else if (toast.type === 'warning') {
          border = 'border-[#FDE68A]';
          icon = <AlertTriangle className="w-4 h-4 text-[#D97706] shrink-0" />;
        } else if (toast.type === 'info') {
          border = 'border-[#BAE6FD]';
          icon = <Info className="w-4 h-4 text-[#0284C7] shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border ${border} ${bg} shadow-lg flex items-start gap-3 transition-all transform animate-in slide-in-from-bottom-2 fade-in duration-200`}
            role="status"
          >
            <div className="mt-0.5">{icon}</div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-[#0B1C30] leading-tight">
                {toast.title}
              </div>
              {toast.description && (
                <div className="text-[11px] text-[#515F74] mt-0.5 leading-snug line-clamp-2 font-body">
                  {toast.description}
                </div>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#94A3B8] hover:text-[#0B1C30] p-1 rounded-md transition-colors"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
