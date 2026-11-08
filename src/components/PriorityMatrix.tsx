import React, { useState } from 'react';
import {
  Plus,
  CheckCircle2,
  Circle,
  Pencil,
  Trash2,
  ArrowRightLeft,
  Flame,
  CalendarCheck,
  UserCheck,
  Ban,
  CalendarPlus,
} from 'lucide-react';
import { MatrixQuadrantId, MatrixTask } from '../types';
import { MatrixTaskModal } from './MatrixTaskModal';
import { useApp } from '../context/AppContext';

interface PriorityMatrixProps {
  tasks: MatrixTask[];
  onToggleComplete: (id: string) => void;
  onAddTask: (data: { quadrant: MatrixQuadrantId; title: string; notes?: string }) => void;
  onEditTask: (id: string, updates: Partial<MatrixTask>) => void;
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, targetQuadrant: MatrixQuadrantId) => void;
}

interface QuadrantMeta {
  id: MatrixQuadrantId;
  title: string;
  subtitle: string;
  criteria: string;
  icon: React.ElementType;
  bgLight: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  headerBorder: string;
}

const QUADRANTS: QuadrantMeta[] = [
  {
    id: 'do-first',
    title: 'DO FIRST',
    subtitle: 'Urgent & Important',
    criteria: 'Crises, impending deadlines, critical blockers',
    icon: Flame,
    bgLight: 'bg-[#FFFBFB]',
    badgeBg: 'bg-[#FDF2F0]',
    badgeText: 'text-[#B93822]',
    badgeBorder: 'border-[#FCA5A5]',
    headerBorder: 'border-b-[#FCA5A5]/60',
  },
  {
    id: 'schedule',
    title: 'SCHEDULE',
    subtitle: 'Important, Not Urgent',
    criteria: 'Strategic growth, architecture, deep learning, health',
    icon: CalendarCheck,
    bgLight: 'bg-[#FBFDFB]',
    badgeBg: 'bg-[#E8F3EB]',
    badgeText: 'text-[#1E5031]',
    badgeBorder: 'border-[#A3C9AE]',
    headerBorder: 'border-b-[#A3C9AE]/60',
  },
  {
    id: 'delegate',
    title: 'DELEGATE',
    subtitle: 'Urgent, Not Important',
    criteria: 'Routine requests, triage, administrative handoffs',
    icon: UserCheck,
    bgLight: 'bg-[#FBFCFD]',
    badgeBg: 'bg-[#EFF6FF]',
    badgeText: 'text-[#1E40AF]',
    badgeBorder: 'border-[#BFDBFE]',
    headerBorder: 'border-b-[#BFDBFE]/60',
  },
  {
    id: 'eliminate',
    title: 'ELIMINATE',
    subtitle: 'Neither Urgent Nor Important',
    criteria: 'Distractions, social doomscrolling, busywork',
    icon: Ban,
    bgLight: 'bg-[#FAFAFA]',
    badgeBg: 'bg-[#F1F5F9]',
    badgeText: 'text-[#475569]',
    badgeBorder: 'border-[#CBD5E1]',
    headerBorder: 'border-b-[#CBD5E1]/60',
  },
];

export const PriorityMatrix: React.FC<PriorityMatrixProps> = ({
  tasks,
  onToggleComplete,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}) => {
  const { openConfirmModal, sendMatrixTaskToSchedule, selectedDate } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuadrant, setSelectedQuadrant] = useState<MatrixQuadrantId>('do-first');
  const [taskToEdit, setTaskToEdit] = useState<MatrixTask | null>(null);
  const [activeMoveMenuId, setActiveMoveMenuId] = useState<string | null>(null);

  const handleOpenAdd = (quadrant: MatrixQuadrantId) => {
    setSelectedQuadrant(quadrant);
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: MatrixTask) => {
    setTaskToEdit(task);
    setSelectedQuadrant(task.quadrant);
    setIsModalOpen(true);
  };

  const handleDeleteWithConfirm = (task: MatrixTask) => {
    openConfirmModal({
      title: 'Delete Priority Task?',
      message: `Are you sure you want to remove "${task.title}" from your priority matrix?`,
      confirmText: 'Delete Task',
      isDestructive: true,
      onConfirm: () => onDeleteTask(task.id),
    });
  };

  const handleSaveModal = (data: { id?: string; quadrant: MatrixQuadrantId; title: string; notes?: string }) => {
    if (data.id) {
      onEditTask(data.id, {
        quadrant: data.quadrant,
        title: data.title,
        notes: data.notes,
      });
    } else {
      onAddTask({
        quadrant: data.quadrant,
        title: data.title,
        notes: data.notes,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 2x2 Matrix Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUADRANTS.map((quad) => {
          const quadrantTasks = tasks.filter((t) => t.quadrant === quad.id);
          const Icon = quad.icon;

          return (
            <div
              key={quad.id}
              className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col overflow-hidden hover:border-[#CBD5E1] transition-all"
            >
              {/* Quadrant Header */}
              <div className={`p-4 sm:px-5 sm:py-4 border-b ${quad.headerBorder} ${quad.bgLight} flex items-center justify-between gap-3`}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${quad.badgeBorder} ${quad.badgeBg} ${quad.badgeText}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-sm font-bold text-[#0B1C30] tracking-wide">
                        {quad.title}
                      </h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border font-tabular ${quad.badgeBg} ${quad.badgeText} ${quad.badgeBorder}`}>
                        {quad.subtitle}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {quad.criteria}
                    </p>
                  </div>
                </div>

                {/* Add to Quadrant Button */}
                <button
                  onClick={() => handleOpenAdd(quad.id)}
                  className="p-1.5 text-[#515F74] hover:text-[#0B1C30] hover:bg-white rounded-lg border border-transparent hover:border-[#CBD5E1] transition-all shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
                  aria-label={`Add task to ${quad.title}`}
                  title={`Add task to ${quad.title}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quadrant Task List */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 min-h-[220px]">
                {quadrantTasks.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#E2E8F0] rounded-lg bg-[#FBFBFA]">
                    <p className="text-xs text-[#64748B] font-body">No tasks in this quadrant</p>
                    <button
                      onClick={() => handleOpenAdd(quad.id)}
                      className="mt-2 text-xs font-semibold text-[#4A7C59] hover:text-[#316342] inline-flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded"
                      aria-label={`Add priority task to ${quad.title}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add priority</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {quadrantTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border transition-all relative ${
                          task.completed
                            ? 'bg-[#FBFBFA] border-[#E2E8F0] opacity-75'
                            : 'bg-white border-[#CBD5E1] shadow-2xs hover:border-[#4A7C59]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2.5">
                          {/* Checkmark + Title */}
                          <div className="flex items-start gap-2.5 min-w-0 flex-1">
                            <button
                              onClick={() => onToggleComplete(task.id)}
                              className="mt-0.5 text-[#94A3B8] hover:text-[#4A7C59] transition-colors shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59] rounded"
                              aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Mark "${task.title}" complete`}
                              title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                            >
                              {task.completed ? (
                                <CheckCircle2 className="w-4 h-4 text-[#4A7C59]" />
                              ) : (
                                <Circle className="w-4 h-4" />
                              )}
                            </button>

                            <div className="min-w-0 flex-1">
                              <p
                                className={`text-xs font-medium leading-snug ${
                                  task.completed ? 'line-through text-[#64748B]' : 'text-[#0B1C30]'
                                }`}
                              >
                                {task.title}
                              </p>
                              {task.notes && (
                                <p className="text-[11px] text-[#64748B] mt-0.5 line-clamp-1">
                                  {task.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Actions Toolbar */}
                          <div className="flex items-center gap-1 shrink-0">
                            {/* Send to Schedule quick action */}
                            <button
                              onClick={() => sendMatrixTaskToSchedule(task.id)}
                              className="p-1 text-[#64748B] hover:text-[#4A7C59] hover:bg-[#E8F3EB] rounded transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
                              aria-label={`Schedule "${task.title}" into today (${selectedDate})`}
                              title={`Schedule into today (${selectedDate})`}
                            >
                              <CalendarPlus className="w-3.5 h-3.5" />
                            </button>

                            {/* Move dropdown trigger */}
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setActiveMoveMenuId(activeMoveMenuId === task.id ? null : task.id)
                                }
                                className="p-1 text-[#64748B] hover:text-[#0B1C30] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
                                aria-label={`Move "${task.title}" to another quadrant`}
                                title="Move to another quadrant"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                              </button>

                              {/* Dropdown menu for moving */}
                              {activeMoveMenuId === task.id && (
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#CBD5E1] rounded-lg shadow-lg z-20 py-1 text-xs">
                                  <div className="px-3 py-1 font-semibold text-[10px] text-[#94A3B8] uppercase tracking-wider font-tabular border-b border-[#F1F5F9]">
                                    Move to Quadrant
                                  </div>
                                  {QUADRANTS.filter((q) => q.id !== task.quadrant).map((targetQ) => (
                                    <button
                                      key={targetQ.id}
                                      onClick={() => {
                                        onMoveTask(task.id, targetQ.id);
                                        setActiveMoveMenuId(null);
                                      }}
                                      className="w-full text-left px-3 py-1.5 hover:bg-[#F8FAF9] text-[#334155] hover:text-[#0B1C30] flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4A7C59]"
                                    >
                                      <span>{targetQ.title}</span>
                                      <span className="text-[10px] text-[#94A3B8]">{targetQ.subtitle.split('&')[0]}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(task)}
                              className="p-1 text-[#64748B] hover:text-[#0B1C30] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A7C59]"
                              aria-label={`Edit priority "${task.title}"`}
                              title="Edit item"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteWithConfirm(task)}
                              className="p-1 text-[#64748B] hover:text-[#B91C1C] hover:bg-[#FEF2F2] rounded transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
                              aria-label={`Delete priority "${task.title}"`}
                              title="Delete item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quadrant Quick Add bar at bottom */}
                <button
                  onClick={() => handleOpenAdd(quad.id)}
                  className="w-full py-2 px-3 text-xs font-medium text-[#515F74] hover:text-[#316342] bg-[#F8FAF9] hover:bg-[#E8F3EB]/50 border border-dashed border-[#CBD5E1] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to {quad.title}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Matrix Task Modal */}
      <MatrixTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        defaultQuadrant={selectedQuadrant}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
