import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ConfirmModal: React.FC = () => {
  const { confirmModal, closeConfirmModal } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && confirmModal?.isOpen) {
        closeConfirmModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmModal, closeConfirmModal]);

  if (!confirmModal || !confirmModal.isOpen) return null;

  const handleConfirm = () => {
    confirmModal.onConfirm();
    closeConfirmModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                confirmModal.isDestructive
                  ? 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FCA5A5]'
                  : 'bg-[#EFF6FF] text-[#1E40AF] border border-[#BFDBFE]'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base font-bold text-[#0B1C30]">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-[#515F74] mt-1 leading-relaxed">
                {confirmModal.message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={closeConfirmModal}
              className="px-4 py-2 text-xs font-semibold text-[#515F74] hover:text-[#0B1C30] hover:bg-[#F8FAF9] rounded-lg border border-[#CBD5E1] transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`px-4.5 py-2 text-xs font-semibold rounded-lg shadow-xs transition-colors ${
                confirmModal.isDestructive
                  ? 'bg-[#B91C1C] hover:bg-[#991B1B] text-white'
                  : 'bg-[#4A7C59] hover:bg-[#316342] text-white'
              }`}
            >
              {confirmModal.confirmText || confirmModal.confirmLabel || 'Confirm Action'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
