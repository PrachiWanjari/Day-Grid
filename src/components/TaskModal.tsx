import React, { useState, useEffect } from 'react';
import { X, Clock, Tag, FileText, AlertTriangle } from 'lucide-react';
import { ScheduleTask, ScheduleCategory } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<ScheduleTask, 'id' | 'completed' | 'date'> & { id?: string; date?: string; endTime?: string }) => void;
  taskToEdit?: ScheduleTask | null;
  existingTimes: string[];
  initialTime?: string;
}

const CATEGORIES: { label: ScheduleCategory; desc: string; color: string; bg: string; text: string }[] = [
  { label: 'Deep Work', desc: 'Uninterrupted high-cognition focus', color: '#4A7C59', bg: '#D1E7D7', text: '#166534' },
  { label: 'Quick Wins', desc: 'Low-friction administrative tasks', color: '#0284C7', bg: '#E0F2FE', text: '#0369A1' },
  { label: 'Wellness', desc: 'Meals, movement, hydration & rest', color: '#059669', bg: '#E8F3EB', text: '#1E5031' },
  { label: 'Meeting', desc: 'Collaborative syncs & discussions', color: '#D97706', bg: '#FEF3C7', text: '#92400E' },
  { label: 'Personal', desc: 'Errands, family & life obligations', color: '#7C3AED', bg: '#EDE9FE', text: '#5B21B6' },
];

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00',
];

const DURATIONS = [
  { label: '30m', minutes: 30 },
  { label: '45m', minutes: 45 },
  { label: '1h', minutes: 60 },
  { label: '1.5h', minutes: 90 },
  { label: '2h', minutes: 120 },
];

function calculateEndTimeString(startTime: string, durationMinutes: number): string {
  const [h, m] = startTime.split(':').map(Number);
  const totalMins = (h || 0) * 60 + (m || 0) + durationMinutes;
  const endH = Math.floor(totalMins / 60) % 24;
  const endM = totalMins % 60;
  return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  taskToEdit,
  existingTimes,
  initialTime,
}) => {
  const [time, setTime] = useState('09:00');
  const [duration, setDuration] = useState(60);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ScheduleCategory>('Deep Work');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskToEdit) {
      setTime(taskToEdit.time);
      setTitle(taskToEdit.title);
      setCategory(taskToEdit.category);
      setNotes(taskToEdit.notes || '');
      setDuration(60);
      setError(null);
    } else {
      const preferredTime = initialTime || TIME_SLOTS.find((t) => !existingTimes.includes(t)) || '09:00';
      setTime(preferredTime);
      setTitle('');
      setCategory('Deep Work');
      setNotes('');
      setDuration(60);
      setError(null);
    }
  }, [taskToEdit, isOpen, existingTimes, initialTime]);

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

  // Live conflict detection
  const hasConflict = existingTimes.includes(time) && (!taskToEdit || taskToEdit.time !== time);
  const availableSlots = TIME_SLOTS.filter((t) => !existingTimes.includes(t));
  const calculatedEndTime = calculateEndTimeString(time, duration);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an activity title.');
      return;
    }

    if (title.trim().length > 120) {
      setError('Title cannot exceed 120 characters.');
      return;
    }

    if (hasConflict) {
      setError(`A task is already scheduled for ${time}. Please select an open time slot.`);
      return;
    }

    onSave({
      id: taskToEdit ? taskToEdit.id : undefined,
      date: taskToEdit ? taskToEdit.date : undefined,
      time,
      endTime: calculatedEndTime,
      title: title.trim(),
      category,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E293B]/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-xl border border-[#E2E8F0] shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#F1F5F9] bg-[#FBFBFA] shrink-0">
          <div>
            <h3 className="font-display text-lg font-bold text-[#0B1C30]">
              {taskToEdit ? 'Edit Schedule Block' : 'Add Time-Block'}
            </h3>
            <p className="font-body text-xs text-[#515F74]">
              {taskToEdit ? 'Adjust time slot, duration, details or category' : 'Schedule an intentional activity into your day'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0B1C30] hover:bg-[#E8F3EB] rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="flex items-center gap-2 p-3 text-xs text-[#B91C1C] bg-[#FEF2F2] border border-[#FCA5A5] rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0 text-[#DC2626]" />
              <span>{error}</span>
            </div>
          )}

          {/* Conflict Warning Banner */}
          {hasConflict && (
            <div className="p-3 bg-[#FFFBEB] border border-[#FDE68A] rounded-lg text-xs text-[#92400E] space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#D97706]" />
                <span>Scheduling Conflict at {time}</span>
              </div>
              <p className="text-[11px] text-[#78350F]">
                Another activity is already reserved for this slot. Switch to an open slot:
              </p>
              {availableSlots.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {availableSlots.slice(0, 4).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setTime(slot);
                        setError(null);
                      }}
                      className="px-2 py-1 text-[11px] font-tabular font-medium bg-white border border-[#F59E0B] text-[#92400E] rounded hover:bg-[#FEF3C7] transition-colors"
                    >
                      Use {slot}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-[11px] italic">No empty slots remaining today.</div>
              )}
            </div>
          )}

          {/* Time & Duration Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
                <Clock className="w-3.5 h-3.5 inline mr-1 text-[#4A7C59]" />
                Start Time
              </label>
              <select
                value={time}
                onChange={(e) => {
                  setTime(e.target.value);
                  setError(null);
                }}
                className={`w-full px-3 py-2 text-sm bg-white border rounded-lg text-[#0B1C30] font-tabular focus:outline-none ${
                  hasConflict
                    ? 'border-[#F59E0B] ring-1 ring-[#F59E0B]'
                    : 'border-[#CBD5E1] focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15'
                }`}
              >
                {TIME_SLOTS.map((t) => {
                  const isOccupied = existingTimes.includes(t) && (!taskToEdit || taskToEdit.time !== t);
                  return (
                    <option key={t} value={t}>
                      {t} {isOccupied ? '(Already Booked ⚠️)' : '— Open'}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
                Duration & End Time
              </label>
              <div className="flex items-center gap-1">
                {DURATIONS.map((dur) => (
                  <button
                    key={dur.minutes}
                    type="button"
                    onClick={() => setDuration(dur.minutes)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      duration === dur.minutes
                        ? 'bg-[#E8F3EB] border-[#4A7C59] text-[#1E5031] shadow-2xs'
                        : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#0B1C30]'
                    }`}
                  >
                    {dur.label}
                  </button>
                ))}
              </div>
              <div className="mt-1 text-[11px] font-tabular text-[#64748B] text-right">
                Finishes around <span className="font-semibold text-[#0B1C30]">{calculatedEndTime}</span>
              </div>
            </div>
          </div>

          {/* Task Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-[#334155] font-tabular">
                Activity Title <span className="text-[#DC2626]">*</span>
              </label>
              <span className={`text-[10px] font-tabular ${title.length > 100 ? 'text-[#D97706]' : 'text-[#64748B]'}`}>
                {title.length}/120
              </span>
            </div>
            <input
              type="text"
              maxLength={120}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError(null);
              }}
              placeholder="e.g. Design System Architecture, Deep Focus Session..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15"
              autoFocus
            />
          </div>

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
              <Tag className="w-3.5 h-3.5 inline mr-1 text-[#4A7C59]" />
              Focus Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.label;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setCategory(cat.label)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg text-left border transition-all ${
                      isSelected
                        ? 'border-[#4A7C59] bg-[#E8F3EB] text-[#1E5031] ring-1 ring-[#4A7C59]'
                        : 'border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAF9]'
                    }`}
                  >
                    <div className="font-semibold">{cat.label}</div>
                    <div className="text-[10px] text-[#64748B] truncate mt-0.5">{cat.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes / Sub-tasks */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#334155] mb-1.5 font-tabular">
              <FileText className="w-3.5 h-3.5 inline mr-1 text-[#4A7C59]" />
              Optional Notes / Action Items
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Links, meeting agenda, or bullet deliverables..."
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#CBD5E1] rounded-lg text-[#0B1C30] placeholder-[#94A3B8] focus:outline-none focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/15 resize-none"
            />
          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
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
              {taskToEdit ? 'Save Changes' : 'Schedule Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
