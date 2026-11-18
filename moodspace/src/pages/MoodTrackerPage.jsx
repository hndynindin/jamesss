import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  SmilePlus,
  Pencil,
  Trash2,
  Clock,
  Check,
  X,
  Loader2,
  Filter,
  Tag,
  Sparkles,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOODS, MOOD_MAP, INTENSITY_LABELS, EMOTION_TAGS } from '../constants/moods';
import { formatDateTime } from '../utils/dateUtils';

export default function MoodTrackerPage() {
  const { moods, addMood, editMood, deleteMood } = useApp();

  const [selectedMood, setSelectedMood] = useState('happy');
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editMoodVal, setEditMoodVal] = useState('happy');
  const [editIntensity, setEditIntensity] = useState(3);
  const [editNote, setEditNote] = useState('');
  const [editTags, setEditTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const toggleEditTag = (tag) => {
    setEditTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredMoods = useMemo(() => {
    return moods.filter((m) => {
      const matchMood = filterMood === 'all' || m.mood === filterMood;
      const matchSearch =
        !searchQuery.trim() ||
        (m.note && m.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (m.tags && m.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchMood && matchSearch;
    });
  }, [moods, filterMood, searchQuery]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#8D78A9', '#C7B1E5', '#F59E0B', '#10B981'],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!selectedMood) {
      setError('Pilih salah satu suasana hati terlebih dahulu.');
      return;
    }
    setSaving(true);
    try {
      await addMood({
        mood: selectedMood,
        intensity,
        note,
        tags: selectedTags,
      });
      triggerCelebration();
      setNote('');
      setIntensity(3);
      setSelectedTags([]);
    } catch (err) {
      setError(err.message || 'Gagal menyimpan catatan mood.');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);
    setEditMoodVal(entry.mood);
    setEditIntensity(entry.intensity);
    setEditNote(entry.note || '');
    setEditTags(entry.tags || []);
  };

  const handleSaveEdit = async (entryId) => {
    await editMood(entryId, {
      mood: editMoodVal,
      intensity: editIntensity,
      note: editNote,
      tags: editTags,
    });
    setEditingId(null);
  };

  const handleDelete = async (entryId) => {
    if (window.confirm('Apakah kamu yakin ingin menghapus catatan suasana hati ini?')) {
      await deleteMood(entryId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7DDF5] dark:bg-[#322A47] text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5] mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Ekspresi & Refleksi Harian
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Pelacak Suasana Hati</h2>
        <p className="text-sm text-[#8D78A9] dark:text-[#B4A7CC]">
          Catat perasaanmu secara jujur, amati faktor pemicunya, dan pelajari pola kesehatan mentalmu.
        </p>
      </div>

      {/* Main Check-In Form */}
      <section className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
        <h3 className="text-base font-bold mb-4 flex items-center gap-2">
          <SmilePlus className="w-5 h-5 text-[#8D78A9]" />
          Bagaimana keadaan hatimu sekarang?
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selection Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {MOODS.map((m) => {
              const active = selectedMood === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMood(m.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                    active
                      ? 'border-[#8D78A9] bg-gradient-to-b from-[#E7DDF5] to-[#F7F3FC] dark:from-[#312945] dark:to-[#221C30] shadow-md scale-[1.02]'
                      : 'border-[#E7DDF5] dark:border-[#322C42] bg-[#F7F3FC]/60 dark:bg-[#191523] hover:border-[#C7B1E5] hover:scale-[1.01]'
                  }`}
                >
                  <div className="text-3xl mb-2">{m.emoji}</div>
                  <div className="text-sm font-bold">{m.label}</div>
                  <div className="text-[11px] text-[#8D78A9] dark:text-[#B4A7CC] line-clamp-2 mt-0.5 leading-snug">
                    {m.description}
                  </div>
                  {active && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#8D78A9] dark:bg-[#C7B1E5]" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Intensity Slider */}
            <div className="p-5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#393343] dark:text-[#E5DCF5]">
                    Tingkat Intensitas Emosi
                  </label>
                  <span className="text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5] px-2.5 py-0.5 rounded-full bg-white dark:bg-[#2B243D]">
                    {intensity} / 5
                  </span>
                </div>
                <p className="text-xs text-[#8D78A9] dark:text-[#B4A7CC] mb-4">
                  {INTENSITY_LABELS[intensity]}
                </p>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-[#E7DDF5] dark:bg-[#322948] accent-[#8D78A9] cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#8D78A9] mt-3 font-medium">
                <span>1. Sangat Lembut</span>
                <span>3. Sedang</span>
                <span>5. Puncak</span>
              </div>
            </div>

            {/* Note input */}
            <div className="flex flex-col justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#393343] dark:text-[#E5DCF5]">
                Catatan Cerita Singkat
              </label>
              <textarea
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ceritakan sedikit apa yang memicu perasaan ini, apa yang sedang terjadi, atau hal apa yang kamu butuhkan..."
                className="w-full px-4 py-3 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5] resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Context / Trigger Tags */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#393343] dark:text-[#E5DCF5] flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#8D78A9]" />
              Faktor Pemicu / Konteks (Pilih yang relevan)
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOTION_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-[#8D78A9] text-white border-[#8D78A9] shadow-xs'
                        : 'bg-[#F7F3FC] dark:bg-[#191523] border-[#E7DDF5] dark:border-[#322C42] text-[#6E637E] dark:text-[#BFB3D4] hover:border-[#C7B1E5]'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-800">
              {error}
            </p>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 rounded-2xl bg-[#8D78A9] hover:bg-[#7A6596] text-white text-sm font-semibold shadow-md shadow-[#8D78A9]/20 flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Simpan Catatan Mood</span>
            </button>
          </div>
        </form>
      </section>

      {/* Mood History Section */}
      <section className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold">Riwayat & Jejak Emosi</h3>
            <p className="text-xs text-[#8D78A9] dark:text-[#B4A7CC]">
              Ditemukan {filteredMoods.length} catatan emosi tersimpan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8D78A9] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari catatan / tag..."
                className="pl-8 pr-3 py-2 rounded-xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#322C42] text-xs focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-[#8D78A9]" />
              <select
                value={filterMood}
                onChange={(e) => setFilterMood(e.target.value)}
                className="px-3 py-2 rounded-xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#322C42] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
              >
                <option value="all">Semua Emosi</option>
                {MOODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.emoji} {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredMoods.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] text-center">
            <p className="text-3xl mb-2">🌿</p>
            <p className="text-sm font-bold">Tidak ada riwayat mood yang cocok</p>
            <p className="text-xs text-[#8D78A9] mt-1 max-w-sm mx-auto">
              {moods.length === 0
                ? 'Catat suasana hatimu pertama kali menggunakan formulir di atas!'
                : 'Coba ubah kata kunci pencarian atau bersihkan filter emosi.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredMoods.map((entry) => {
              const info = MOOD_MAP[entry.mood] || MOODS[0];
              const isEditing = editingId === entry.id;

              return (
                <div
                  key={entry.id}
                  className="p-5 rounded-2xl bg-[#F7F3FC]/80 dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] hover:border-[#C7B1E5] transition"
                >
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {MOODS.map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setEditMoodVal(m.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer ${
                              editMoodVal === m.id
                                ? 'bg-[#8D78A9] text-white border-[#8D78A9]'
                                : 'bg-white dark:bg-[#251F34] border-[#E7DDF5] dark:border-[#38304C]'
                            }`}
                          >
                            {m.emoji} {m.label}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#8D78A9]">
                          Intensitas: {editIntensity}/5
                        </span>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={editIntensity}
                          onChange={(e) => setEditIntensity(Number(e.target.value))}
                          className="accent-[#8D78A9] flex-1 max-w-xs"
                        />
                      </div>

                      <textarea
                        rows={2}
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#251F34] border border-[#E7DDF5] dark:border-[#38304C] text-sm"
                        placeholder="Ubah penjelasan mood..."
                      />

                      <div className="flex flex-wrap gap-1.5">
                        {EMOTION_TAGS.map((tag) => {
                          const hasTag = editTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleEditTag(tag)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border ${
                                hasTag
                                  ? 'bg-[#8D78A9] text-white border-[#8D78A9]'
                                  : 'bg-white dark:bg-[#251F34] border-[#E7DDF5] dark:border-[#38304C]'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#251F34] text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" /> Batal
                        </button>
                        <button
                          onClick={() => handleSaveEdit(entry.id)}
                          className="px-4 py-1.5 rounded-xl bg-[#8D78A9] text-white text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" /> Simpan
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 min-w-0">
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs border"
                          style={{
                            backgroundColor: info.bgLight,
                            borderColor: info.border,
                          }}
                        >
                          {info.emoji}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-base">{info.label}</span>
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#E7DDF5] dark:bg-[#312945] text-[#8D78A9] dark:text-[#C7B1E5] font-semibold">
                              Intensitas {entry.intensity}/5
                            </span>
                          </div>

                          {entry.note ? (
                            <p className="mt-1.5 text-sm text-[#4E455C] dark:text-[#D5CAE8] break-words leading-relaxed">
                              {entry.note}
                            </p>
                          ) : (
                            <p className="mt-1 text-xs text-[#8D78A9]/80 italic">
                              Tanpa catatan tertulis.
                            </p>
                          )}

                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2.5">
                              {entry.tags.map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-[#282138] border border-[#E7DDF5] dark:border-[#38304C] text-[#8D78A9] dark:text-[#C7B1E5]"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}

                          <p className="mt-2 text-[11px] text-[#8D78A9] flex items-center gap-1.5">
                            <Clock className="w-3 h-3" />
                            {formatDateTime(entry.createdAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => startEdit(entry)}
                          className="p-2 rounded-xl hover:bg-white dark:hover:bg-[#2B243D] text-[#8D78A9] transition cursor-pointer"
                          title="Edit Catatan"
                          aria-label="Edit catatan"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-400 hover:text-red-500 transition cursor-pointer"
                          title="Hapus Catatan"
                          aria-label="Hapus catatan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
