import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  BookHeart,
  Plus,
  Search,
  Calendar,
  Pencil,
  Trash2,
  X,
  Loader2,
  Clock,
  BookOpen,
  Sparkles,
  Download,
  Bookmark,
  FileText,
  Star,
  Copy,
  LayoutTemplate,
  Trophy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOODS, MOOD_MAP } from '../constants/moods';
import { JOURNAL_TEMPLATES, BADGES_LIST } from '../constants/gamification';
import { formatDateTime, toLocalDateKey, calculateStreak } from '../utils/dateUtils';

const JOURNAL_PROMPTS = [
  'Hal apa yang paling membuatmu merasa bersyukur atau tersenyum hari ini?',
  'Jika hari ini bisa diulang, apa yang ingin kamu lakukan dengan lebih tenang?',
  'Apa beban pikiran yang paling ingin kamu lepaskan saat ini?',
  'Bagaimana perasaan tubuhmu sekarang? Apa yang sedang ia butuhkan?',
  'Pesan cinta apa yang ingin kamu sampaikan kepada dirimu sendiri?',
  'Kebaikan kecil apa yang kamu terima atau kamu berikan hari ini?',
];

export default function JournalPage() {
  const { journals, moods, habits, addJournal, editJournal, deleteJournal, showToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [moodFilter, setMoodFilter] = useState('all');
  const [favoriteOnly, setFavoriteOnly] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('moodspace_fav_journals') || '[]');
    } catch {
      return [];
    }
  });

  // Modal state for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodTag, setMoodTag] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  // Read Modal
  const [viewingEntry, setViewingEntry] = useState(null);

  // Gamification achievements
  const streak = useMemo(() => calculateStreak(moods), [moods]);
  const unlockedBadges = useMemo(() => {
    return BADGES_LIST.filter((b) => {
      if (b.id === 'first_journal' && journals.length >= 1) return true;
      if (b.id === 'journal_3' && journals.length >= 3) return true;
      if (b.id === 'journal_7' && journals.length >= 7) return true;
      if (b.id === 'streak_3' && streak >= 3) return true;
      if (b.id === 'streak_7' && streak >= 7) return true;
      return false;
    });
  }, [journals.length, streak]);

  const toggleFavorite = (id, e) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('moodspace_fav_journals', JSON.stringify(next));
      showToast(next.includes(id) ? 'Disimpan ke Favorit ⭐' : 'Dihapus dari Favorit');
      return next;
    });
  };

  const filteredJournals = useMemo(() => {
    return journals.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q);
      const matchesDate = !dateFilter || toLocalDateKey(item.createdAt) === dateFilter;
      const matchesMood = moodFilter === 'all' || item.moodTag === moodFilter;
      const matchesFav = !favoriteOnly || favorites.includes(item.id);
      return matchesSearch && matchesDate && matchesMood && matchesFav;
    });
  }, [journals, searchQuery, dateFilter, moodFilter, favoriteOnly, favorites]);

  const openCreateModal = (promptText = '', initialBody = '', initialMood = '') => {
    setEditingEntry(null);
    setTitle(promptText ? 'Refleksi: ' + promptText.slice(0, 30) + '...' : '');
    setContent(initialBody || (promptText ? `Pertanyaan Refleksi: ${promptText}\n\nJawabanku: ` : ''));
    setMoodTag(initialMood || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const applyTemplate = (tpl) => {
    openCreateModal(tpl.name, tpl.content, tpl.moodDefault);
  };

  const openEditModal = (entry, e) => {
    if (e) e.stopPropagation();
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMoodTag(entry.moodTag || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim()) {
      setFormError('Judul jurnal wajib diisi.');
      return;
    }
    if (content.trim().length < 5) {
      setFormError('Isi jurnal minimal 5 karakter agar refleksimu bermakna.');
      return;
    }

    setSaving(true);
    try {
      if (editingEntry) {
        await editJournal(editingEntry.id, { title, content, moodTag });
      } else {
        await addJournal({ title, content, moodTag });
        confetti({
          particleCount: 45,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#8D78A9', '#C7B1E5', '#FFF9F1', '#10B981'],
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan jurnal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entryId, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Yakin ingin menghapus catatan jurnal ini?')) {
      await deleteJournal(entryId);
      if (viewingEntry?.id === entryId) setViewingEntry(null);
    }
  };

  const handleExportText = (entry, e) => {
    if (e) e.stopPropagation();
    const textContent = `====================================\nMOODSPACE DIGITAL JOURNAL\n====================================\nTanggal: ${formatDateTime(
      entry.createdAt
    )}\nSuasana Hati: ${
      entry.moodTag ? MOOD_MAP[entry.moodTag]?.label : 'Tidak ada'
    }\n\nJUDUL:\n${entry.title}\n\nISI CATATAN:\n${entry.content}\n====================================\n`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Jurnal_${entry.title.replace(/\s+/g, '_').slice(0, 20)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Jurnal berhasil diunduh sebagai file teks!');
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7DDF5] dark:bg-[#322A47] text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5] mb-2">
            <Bookmark className="w-3.5 h-3.5" />
            Buku Catatan Digital & Pencapaian Jiwa
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Jurnal Pribadiku</h2>
          <p className="text-sm text-[#8D78A9] dark:text-[#B4A7CC]">
            Tulis ceritamu, kumpulkan lencana refleksi, dan nikmati ketenangan menuangkan pikiranmu.
          </p>
        </div>

        <button
          onClick={() => openCreateModal()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#8D78A9] hover:bg-[#7A6596] text-white text-sm font-semibold shadow-md shadow-[#8D78A9]/20 transition cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Jurnal Bebas</span>
        </button>
      </div>

      {/* Gamification / Badges Showcase Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-white via-[#F7F3FC] to-[#FFF9F1] dark:from-[#211D2B] dark:via-[#1D1826] dark:to-[#2A2338] border border-[#E7DDF5] dark:border-[#38304C] shadow-sm">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center text-amber-500">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#393343] dark:text-white">
                Lencana Menulis & Refleksi Jiwa
              </h3>
              <p className="text-[11px] text-[#8D78A9]">
                Terbuka {unlockedBadges.length} dari {BADGES_LIST.length} lencana kebiasaan
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#E7DDF5] dark:bg-[#322A47] text-[#8D78A9] dark:text-[#C7B1E5]">
            Total {journals.length} Jurnal
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = unlockedBadges.some((b) => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-white dark:bg-[#282138] border-[#C7B1E5] dark:border-[#4B3D66] shadow-xs'
                    : 'bg-black/5 dark:bg-white/5 border-transparent opacity-40 grayscale'
                }`}
                title={badge.desc}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <p className="text-xs font-bold truncate text-[#393343] dark:text-white">{badge.title}</p>
                <p className="text-[10px] text-[#8D78A9] line-clamp-1 mt-0.5">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guided Journaling Templates Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-[#8D78A9]" />
            Template Terpandu (Mulai Menulis Cepat)
          </h3>
          <span className="text-xs text-[#8D78A9]">Klik untuk langsung memakai format</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {JOURNAL_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => applyTemplate(tpl)}
              className="p-4 rounded-2xl bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] hover:border-[#8D78A9] hover:shadow-xs text-left transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{tpl.icon}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E7DDF5] dark:bg-[#322A47] text-[#8D78A9] dark:text-[#C7B1E5]">
                    {tpl.badge}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-[#393343] dark:text-white mb-1">
                  {tpl.name}
                </h4>
                <p className="text-xs text-[#6E637E] dark:text-[#B4A7CC] line-clamp-2 leading-relaxed">
                  {tpl.desc}
                </p>
              </div>
              <span className="mt-3 text-[11px] font-semibold text-[#8D78A9] inline-flex items-center gap-1">
                Gunakan Template →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Writing Prompts / Inspirasi Pertanyaan */}
      <div className="rounded-3xl p-5 bg-[#FFF9F1] dark:bg-[#1E1928] border border-[#E7DDF5] dark:border-[#38304C]">
        <div className="flex items-center gap-2 text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5] mb-2">
          <Sparkles className="w-4 h-4" />
          Pertanyaan Pemantik Hari Ini:
        </div>
        <div className="flex flex-wrap gap-2">
          {JOURNAL_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => openCreateModal(prompt)}
              className="text-xs px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#2C253D] hover:bg-[#E7DDF5] text-[#564D65] dark:text-[#D7CCE8] border border-[#E7DDF5] dark:border-[#3F3752] transition cursor-pointer text-left"
            >
              💭 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 bg-white dark:bg-[#211D2B] p-4 rounded-3xl border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-[#8D78A9] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari judul atau isi jurnal pribadimu..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
          />
        </div>

        <div>
          <select
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
          >
            <option value="all">Semua Tag Emosi</option>
            {MOODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.emoji} {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Calendar className="w-4 h-4 text-[#8D78A9] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-xs focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter('')}
              className="p-2.5 rounded-xl bg-[#E7DDF5]/70 dark:bg-[#312945] text-[#8D78A9] hover:text-[#393343] cursor-pointer"
              title="Reset tanggal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          onClick={() => setFavoriteOnly((v) => !v)}
          className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-2xl border text-xs font-bold transition cursor-pointer ${
            favoriteOnly
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-300'
              : 'bg-[#F7F3FC] dark:bg-[#191523] text-[#8D78A9] border-[#E7DDF5] dark:border-[#312A42]'
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${favoriteOnly ? 'fill-current' : ''}`} />
          <span>Favorit ({favorites.length})</span>
        </button>
      </div>

      {/* Journal Cards Grid */}
      {filteredJournals.length === 0 ? (
        <div className="rounded-3xl p-14 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] text-center shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#F7F3FC] dark:bg-[#2A233A] flex items-center justify-center text-[#8D78A9] mb-4">
            <BookHeart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold">
            {journals.length === 0 ? 'Belum Ada Jurnal Tersimpan' : 'Tidak Menemukan Jurnal yang Sesuai'}
          </h3>
          <p className="text-xs text-[#8D78A9] dark:text-[#B4A7CC] mt-1.5 max-w-md mx-auto leading-relaxed">
            {journals.length === 0
              ? 'Pilih salah satu template di atas atau klik tombol tulis bebas untuk memulai catatan pertamamu!'
              : 'Coba ubah kata kunci pencarian atau matikan filter favorit/tanggal.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJournals.map((entry) => {
            const moodInfo = entry.moodTag ? MOOD_MAP[entry.moodTag] : null;
            const wordCount = entry.content.trim().split(/\s+/).filter(Boolean).length;
            const isFav = favorites.includes(entry.id);

            return (
              <article
                key={entry.id}
                onClick={() => setViewingEntry(entry)}
                className="group rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] hover:border-[#8D78A9] shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8D78A9] dark:text-[#B9ABD0]">
                      <Clock className="w-3 h-3" />
                      {formatDateTime(entry.createdAt)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {moodInfo && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#F7F3FC] dark:bg-[#2D263F] border border-[#E7DDF5] dark:border-[#3B324E] font-semibold">
                          {moodInfo.emoji} {moodInfo.label}
                        </span>
                      )}
                      <button
                        onClick={(e) => toggleFavorite(entry.id, e)}
                        className={`p-1 rounded-lg transition ${
                          isFav ? 'text-amber-500' : 'text-gray-300 hover:text-amber-400'
                        }`}
                        title={isFav ? 'Favorit' : 'Tandai Favorit'}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-3.5 font-bold text-base line-clamp-2 group-hover:text-[#8D78A9] transition">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-xs text-[#6E637E] dark:text-[#C0B5D6] line-clamp-4 leading-relaxed whitespace-pre-line">
                    {entry.content}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#F7F3FC] dark:border-[#2E2740] flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#8D78A9] flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    {wordCount} kata
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => handleExportText(entry, e)}
                      className="p-1.5 rounded-xl hover:bg-[#F7F3FC] dark:hover:bg-[#2D263F] text-[#8D78A9] transition cursor-pointer"
                      title="Unduh Teks (.txt)"
                      aria-label="Unduh teks jurnal"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => openEditModal(entry, e)}
                      className="p-1.5 rounded-xl hover:bg-[#F7F3FC] dark:hover:bg-[#2D263F] text-[#8D78A9] transition cursor-pointer"
                      title="Edit"
                      aria-label="Edit jurnal"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(entry.id, e)}
                      className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-400 hover:text-red-500 transition cursor-pointer"
                      title="Hapus"
                      aria-label="Hapus jurnal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] p-6 sm:p-7 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">
                {editingEntry ? 'Edit Catatan Jurnal' : 'Tulis Lembaran Jurnal Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl hover:bg-[#F7F3FC] dark:hover:bg-[#2E2740] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Judul Jurnal
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Beri judul untuk catatan hari ini..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">
                  Emosi Dominan Saat Menulis Ini
                </label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMoodTag((prev) => (prev === m.id ? '' : m.id))}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        moodTag === m.id
                          ? 'bg-[#8D78A9] text-white border-[#8D78A9] shadow-xs'
                          : 'bg-[#F7F3FC] dark:bg-[#191523] border-[#E7DDF5] dark:border-[#312A42]'
                      }`}
                    >
                      {m.emoji} {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider">
                    Isi Jurnal
                  </label>
                  <span className="text-[11px] text-[#8D78A9]">
                    {content.trim().split(/\s+/).filter(Boolean).length} kata
                  </span>
                </div>
                <textarea
                  rows={9}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuangkan apa yang kamu rasakan, alami, atau syukuri dengan jujur..."
                  className="w-full px-4 py-3 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-sm focus:outline-none focus:ring-2 focus:ring-[#C7B1E5] leading-relaxed resize-none font-sans"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-800">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#2B243D] text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-2xl bg-[#8D78A9] hover:bg-[#7A6596] text-white text-xs font-semibold flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingEntry ? 'Perbarui Jurnal' : 'Terbitkan Jurnal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Read Detail Modal */}
      {viewingEntry && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setViewingEntry(null)}
        >
          <div
            className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl bg-[#FFF9F1] dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] p-6 sm:p-8 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#8D78A9] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDateTime(viewingEntry.createdAt)}
                </p>
                <h3 className="mt-2 text-xl font-bold leading-snug">{viewingEntry.title}</h3>
              </div>
              <button
                onClick={() => setViewingEntry(null)}
                className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {viewingEntry.moodTag && MOOD_MAP[viewingEntry.moodTag] && (
              <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7DDF5] dark:bg-[#312945] text-xs font-semibold">
                <span>{MOOD_MAP[viewingEntry.moodTag].emoji}</span>
                <span>{MOOD_MAP[viewingEntry.moodTag].label}</span>
              </div>
            )}

            <div className="mt-6 p-5 rounded-2xl bg-white dark:bg-[#1C1726] border border-[#E7DDF5] dark:border-[#322944]">
              <p className="text-sm leading-relaxed whitespace-pre-line text-[#393343] dark:text-[#E5DCF5]">
                {viewingEntry.content}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#E7DDF5] dark:border-[#322C42] flex items-center justify-between">
              <button
                onClick={(e) => handleExportText(viewingEntry, e)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#2B243D] border border-[#E7DDF5] dark:border-[#3A3250] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#8D78A9]" /> Unduh .txt
              </button>

              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    const target = viewingEntry;
                    setViewingEntry(null);
                    openEditModal(target, e);
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-[#2B243D] border border-[#E7DDF5] dark:border-[#3A3250] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={(e) => handleDelete(viewingEntry.id, e)}
                  className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
