import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Circle, Plus, Trash2, Sparkles, Trophy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { toLocalDateKey } from '../utils/dateUtils';

export default function DailyHabitTracker() {
  const { habits, addHabit, toggleHabit, deleteHabit, showToast } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('✨');
  const [isAdding, setIsAdding] = useState(false);

  const todayKey = toLocalDateKey(new Date());

  const completedCount = habits.filter((h) => h.history && h.history[todayKey]).length;
  const progressPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  const handleToggle = (habitId) => {
    const isCompleted = toggleHabit(habitId);
    if (isCompleted) {
      if (completedCount + 1 === habits.length) {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#10B981', '#C7B1E5', '#F59E0B'],
        });
        showToast('Luar biasa! Semua kebiasaan baik hari ini tuntas! 🎉');
      } else {
        showToast('Kebiasaan diselesaikan! Terus melangkah 🌿');
      }
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle.trim(),
      icon: newIcon || '✨',
      category: 'Pribadi',
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <div className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-[#393343] dark:text-[#F3EEF9]">
              Pelacak Kebiasaan Sehat (Habit Tracker)
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#E7DDF5] dark:bg-[#322A47] text-[#8D78A9] dark:text-[#C7B1E5]">
              {completedCount}/{habits.length} Hari Ini
            </span>
          </div>
          <p className="text-xs text-[#8D78A9] dark:text-[#B4A7CC] mt-0.5">
            Membangun kesehatan mental berawal dari ritme mikro harian yang konsisten.
          </p>
        </div>

        <button
          onClick={() => setIsAdding((v) => !v)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F7F3FC] dark:bg-[#2B243B] hover:bg-[#E7DDF5] text-xs font-semibold text-[#8D78A9] dark:text-[#C7B1E5] transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tambah Kebiasaan</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-5 p-4 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42]">
        <div className="flex items-center justify-between text-xs font-bold mb-2">
          <span className="text-[#8D78A9] flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Progres Kebugaran Mental Hari Ini
          </span>
          <span className="text-[#393343] dark:text-white">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-white dark:bg-[#2A233A] overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8D78A9] via-[#C7B1E5] to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Habit Form Modal/Dropdown */}
      {isAdding && (
        <form onSubmit={handleAdd} className="mb-4 p-4 rounded-2xl bg-[#FFF9F1] dark:bg-[#2B243D] border border-[#E7DDF5] dark:border-[#3E3554] space-y-3 animate-fade-in-up">
          <div className="flex gap-2">
            <select
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="px-2.5 py-2 rounded-xl bg-white dark:bg-[#1F1A2B] border border-[#E7DDF5] text-sm"
            >
              <option value="💧">💧 Air</option>
              <option value="🧘">🧘 Tenang</option>
              <option value="📖">📖 Baca</option>
              <option value="🌿">🌿 Jalan</option>
              <option value="🌙">🌙 Tidur</option>
              <option value="🍎">🍎 Makan</option>
              <option value="✨">✨ Bebas</option>
            </select>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Contoh: Bersyukur sebelum tidur..."
              className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-[#1F1A2B] border border-[#E7DDF5] dark:border-[#3A3250] text-xs focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#8D78A9] text-white text-xs font-semibold cursor-pointer"
            >
              Simpan
            </button>
          </div>
        </form>
      )}

      {/* Habit Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {habits.map((habit) => {
          const isDone = Boolean(habit.history && habit.history[todayKey]);
          return (
            <div
              key={habit.id}
              onClick={() => handleToggle(habit.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                isDone
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200'
                  : 'bg-[#F7F3FC]/70 dark:bg-[#191523] border-[#E7DDF5] dark:border-[#312A42] hover:border-[#C7B1E5]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xl">{habit.icon}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold truncate ${isDone ? 'line-through opacity-75' : ''}`}>
                    {habit.title}
                  </p>
                  <p className="text-[10px] text-[#8D78A9] dark:text-[#A99CBD]">
                    {habit.category || 'Rutinitas'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                ) : (
                  <Circle className="w-5 h-5 text-[#C7B1E5] group-hover:text-[#8D78A9] transition" />
                )}
                {habit.custom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteHabit(habit.id);
                    }}
                    className="p-1 text-red-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

