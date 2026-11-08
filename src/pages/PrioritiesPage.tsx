import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PriorityMatrix } from '../components/PriorityMatrix';
import { Target, Info, Filter, CheckCircle2, Flame, CalendarCheck, UserCheck, Ban } from 'lucide-react';

export const PrioritiesPage: React.FC = () => {
  const {
    matrixTasks,
    toggleMatrixComplete,
    addMatrixTask,
    editMatrixTask,
    deleteMatrixTask,
    moveMatrixTask,
  } = useApp();

  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = useMemo(() => {
    if (filterMode === 'pending') return matrixTasks.filter((t) => !t.completed);
    if (filterMode === 'completed') return matrixTasks.filter((t) => t.completed);
    return matrixTasks;
  }, [matrixTasks, filterMode]);

  // Quadrant counts
  const doFirstCount = matrixTasks.filter((t) => t.quadrant === 'do-first');
  const scheduleCount = matrixTasks.filter((t) => t.quadrant === 'schedule');
  const delegateCount = matrixTasks.filter((t) => t.quadrant === 'delegate');
  const eliminateCount = matrixTasks.filter((t) => t.quadrant === 'eliminate');

  const totalCompleted = matrixTasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Strategic Rule Banner */}
      <div className="bg-[#E8F3EB]/70 border border-[#A3C9AE] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#1E5031]">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-[#4A7C59] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-sm">The Eisenhower Priority Discipline</p>
            <p className="text-[#334155] leading-relaxed">
              "What is important is seldom urgent, and what is urgent is seldom important."
              Focus your prime energy on <strong>SCHEDULE</strong> to permanently eliminate recurring crises in <strong>DO FIRST</strong>.
            </p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-[#CBD5E1] shrink-0">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              filterMode === 'all'
                ? 'bg-[#4A7C59] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0B1C30]'
            }`}
          >
            All ({matrixTasks.length})
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              filterMode === 'pending'
                ? 'bg-[#4A7C59] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0B1C30]'
            }`}
          >
            Active ({matrixTasks.length - totalCompleted})
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`px-2.5 py-1 text-xs font-semibold rounded ${
              filterMode === 'completed'
                ? 'bg-[#4A7C59] text-white shadow-xs'
                : 'text-[#64748B] hover:text-[#0B1C30]'
            }`}
          >
            Done ({totalCompleted})
          </button>
        </div>
      </div>

      {/* Dynamic Quadrant Count Badges */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#FCA5A5]/60 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#B93822] uppercase font-tabular">1. Do First</span>
            <Flame className="w-4 h-4 text-[#B93822]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 font-tabular">
            <span className="text-2xl font-bold text-[#0B1C30]">{doFirstCount.length}</span>
            <span className="text-xs text-[#64748B]">
              ({doFirstCount.filter((t) => !t.completed).length} pending)
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Urgent & Important</div>
        </div>

        <div className="bg-white rounded-xl border border-[#A3C9AE]/60 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1E5031] uppercase font-tabular">2. Schedule</span>
            <CalendarCheck className="w-4 h-4 text-[#4A7C59]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 font-tabular">
            <span className="text-2xl font-bold text-[#0B1C30]">{scheduleCount.length}</span>
            <span className="text-xs text-[#64748B]">
              ({scheduleCount.filter((t) => !t.completed).length} pending)
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Important, Not Urgent</div>
        </div>

        <div className="bg-white rounded-xl border border-[#BFDBFE]/60 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#1E40AF] uppercase font-tabular">3. Delegate</span>
            <UserCheck className="w-4 h-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 font-tabular">
            <span className="text-2xl font-bold text-[#0B1C30]">{delegateCount.length}</span>
            <span className="text-xs text-[#64748B]">
              ({delegateCount.filter((t) => !t.completed).length} pending)
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Urgent, Not Important</div>
        </div>

        <div className="bg-white rounded-xl border border-[#CBD5E1] p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#475569] uppercase font-tabular">4. Eliminate</span>
            <Ban className="w-4 h-4 text-[#64748B]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1.5 font-tabular">
            <span className="text-2xl font-bold text-[#0B1C30]">{eliminateCount.length}</span>
            <span className="text-xs text-[#64748B]">
              ({eliminateCount.filter((t) => !t.completed).length} pending)
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">Neither Urgent nor Important</div>
        </div>
      </div>

      {/* Main 2×2 Matrix Component */}
      <PriorityMatrix
        tasks={filteredTasks}
        onToggleComplete={toggleMatrixComplete}
        onAddTask={addMatrixTask}
        onEditTask={editMatrixTask}
        onDeleteTask={deleteMatrixTask}
        onMoveTask={moveMatrixTask}
      />
    </div>
  );
};
