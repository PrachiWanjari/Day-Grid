import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { MatrixQuadrantId, MatrixTask } from '../types';

interface MatrixTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; quadrant: MatrixQuadrantId; title: string; notes?: string }) => void;
  defaultQuadrant: MatrixQuadrantId;
  taskToEdit?: MatrixTask | null;
}

const QUADRANTS: { id: MatrixQuadrantId; title: string; desc: string; badge: string }[] = [
  { id: 'do-first', title: 'DO FIRST', desc: 'Urgent & Important (Crises & Deadlines)', badge: 'bg-[#FDF2F0] text-[#B93822] border-[#FCA5A5]' },
  { id: 'schedule', title: 'SCHEDULE', desc: 'Important, Not Urgent (Strategy & Growth)', badge: 'bg-[#E8F3EB] text-[#1E5031] border-[#A3C9AE]' },
  { id: 'delegate', title: 'DELEGATE', desc: 'Urgent, Not Important (Interruptions & Requests)', badge: 'bg-[#EFF6FF] text-[#1E40AF] border-[#BFDBFE]' },
  { id: 'eliminate', title: 'ELIMINATE', desc: 'Neither Urgent Nor Important (Distractions & Time Wasters)', badge: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]' },
];

export const MatrixTaskModal: React.FC<MatrixTaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  defaultQuadrant,
  taskToEdit,
}) => {
  const [quadrant, setQuadrant] = useState<MatrixQuadrantId>(defaultQuadrant);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setQuadrant(taskToEdit.quadrant);
      setTitle(taskToEdit.title);
      setNotes(taskToEdit.notes || '');
      setError(null);
    } else {
      setQuadrant(defaultQuadrant);
      setTitle('');
      setNotes('');
      setError(null);
    }
  }, [taskToEdit, defaultQuadrant, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task description.');
      return;
    }

    onSave({
      id: taskToEdit ? taskToEdit.id : undefined,
      quadrant,
      title: title.trim(),
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl w-full max-w-lg overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] bg-[#FBFBFA]">
          <div>
            <h3 className="font-display text-lg font-bold text-[#0B1C30]">
              {taskToEdit ? 'Edit Matrix Priority' : 'Add Priority Task'}
            </h3>
            <p className="font-body text-xs text-[#515F74]">
              {taskToEdit ? 'Update priority quadrant or item notes' : 'Categorize by urgency and long-term leverage'}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-[#64748B] hover:text-[#0B1C30] hover:bg-[#E8F3EB] rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-[#B91C1C] bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quadrant Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-tabular">
              Target Quadrant
            </label>
            <div className="space-y-2">
              {QUADRANTS.map((q) => {
                const isSelected = quadrant === q.id;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setQuadrant(q.id)}
                    className={`w-full p-3 rounded-lg border text-left transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-[#4A7C59] bg-[#E8F3EB]/40 ring-1 ring-[#4A7C59]'
                        : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAF9]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-xs text-[#0B1C30]">{q.title}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border font-tabular ${q.badge}`}>
                          {q.id === 'do-first' ? 'Urgent & Important' : q.id === 'schedule' ? 'Important' : q.id === 'delegate' ? 'Urgent' : 'Eliminate'}
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] mt-0.5">{q.desc}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-[#4A7C59] bg-[#4A7C59]' : 'border-[#CBD5E1]'}`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-tabular">
              Task Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Architect core component library..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15"
              autoFocus
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-2 font-tabular">
              Context / Leverage Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why does this matter? Who is responsible?"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#515F74] hover:text-[#0B1C30] hover:bg-[#F8FAF9] rounded-lg border border-[#CBD5E1] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#4A7C59] hover:bg-[#316342] active:scale-[0.99] rounded-lg shadow-xs transition-colors"
            >
              {taskToEdit ? 'Update Task' : 'Add to Matrix'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
