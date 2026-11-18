import React, { useMemo, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  BookOpen,
  BarChart3,
  HeartHandshake,
  SmilePlus,
  Quote,
  RefreshCw,
  ArrowRight,
  Flame,
  Calendar,
  Loader2,
  Tag,
  Trophy,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { MOODS, MOOD_MAP, DAILY_QUOTES, EMOTION_TAGS } from '../constants/moods';
import {
  getGreeting,
  formatIndonesianDate,
  formatDateTime,
  toLocalDateKey,
  calculateStreak,
} from '../utils/dateUtils';
import DailyHabitTracker from '../components/DailyHabitTracker';
import EmotionalFirstAid from '../components/EmotionalFirstAid';

export default function DashboardPage({ onNavigate }) {
  const { user, moods, journals, addMood } = useApp();
  const [selectedMood, setSelectedMood] = useState('');
  const [intensity, setIntensity] = useState(3);
  const [note, setNote] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [quoteIdx, setQuoteIdx] = useState(() => new Date().getDate() % DAILY_QUOTES.length);

  const todayKey = toLocalDateKey(new Date());

  const todayMoods = useMemo(
    () => moods.filter((m) => toLocalDateKey(m.createdAt) === todayKey),
    [moods, todayKey]
  );

  const latestTodayMood = todayMoods[0] || null;
  const streak = useMemo(() => calculateStreak(moods), [moods]);

  const weeklyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toLocalDateKey(d);
      const dayEntries = moods.filter((m) => toLocalDateKey(m.createdAt) === key);
      const avgScore =
        dayEntries.length > 0
          ? Number(
            (
              dayEntries.reduce((sum, item) => sum + (MOOD_MAP[item.mood]?.score || 3), 0) /
              dayEntries.length
            ).toFixed(1)
          )
          : null;

      days.push({
        day: new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d),
        score: avgScore,
        count: dayEntries.length,
      });
    }
    return days;
  }, [moods]);

  const hasWeeklyData = weeklyData.some((d) => d.score !== null);
  const recentJournals = useMemo(() => journals.slice(0, 3), [journals]);
  const currentQuote = DAILY_QUOTES[quoteIdx];

  const toggleTag = (t) => {
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleQuickCheckIn = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!selectedMood) {
      setFormError('Pilih salah satu suasana hati terlebih dahulu.');
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
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8D78A9', '#C7B1E5', '#10B981'],
      });
      setSelectedMood('');
      setIntensity(3);
      setNote('');
      setSelectedTags([]);
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan check-in mood.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header Greeting Banner */}
      <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#E7DDF5] via-[#F7F3FC] to-[#FFF9F1] dark:from-[#29223B] dark:via-[#221D30] dark:to-[#1D1827] border border-[#E7DDF5] dark:border-[#342D46] shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#8D78A9] dark:text-[#C7B1E5] bg-white/80 dark:bg-[#2F2842] px-3.5 py-1.5 rounded-full shadow-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span className="capitalize">{formatIndonesianDate()}</span>
            </div>
            <h2 className="mt-3.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#393343] dark:text-white">
              {getGreeting()}, {user?.name?.split(' ')[0]}! ✨
            </h2>
            <p className="mt-1 text-sm text-[#6E637E] dark:text-[#C2B6D8] max-w-xl leading-relaxed">
              Selamat datang di ruang tenangmu. Dengarkan apa yang dirasakan tubuh dan pikiranmu hari ini tanpa beban.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/90 dark:bg-[#2A233A] border border-[#E7DDF5] dark:border-[#3A3250] min-w-[130px] shadow-xs">
              <p className="text-[11px] font-semibold text-[#8D78A9] dark:text-[#B9ABD0]">
                Mood Hari Ini
              </p>
              <p className="mt-1 text-base font-bold flex items-center gap-1.5">
                {latestTodayMood ? (
                  <>
                    <span>{MOOD_MAP[latestTodayMood.mood]?.emoji}</span>
                    <span>{MOOD_MAP[latestTodayMood.mood]?.label}</span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-[#8D78A9]">Belum dicatat</span>
                )}
              </p>
            </div>

            <div className="px-4 py-3 rounded-2xl bg-white/90 dark:bg-[#2A233A] border border-[#E7DDF5] dark:border-[#3A3250] min-w-[120px] shadow-xs">
              <p className="text-[11px] font-semibold text-[#8D78A9] dark:text-[#B9ABD0]">
                Konsistensi Jiwa
              </p>
              <p className="mt-1 text-base font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>{streak} Hari</span>
              </p>
            </div>
          </div>
        </div>

        {/* Quick Nav Shortcut Buttons */}
        <div className="mt-6 flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigate('mood')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#8D78A9] hover:bg-[#7A6596] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
          >
            <SmilePlus className="w-4 h-4" />
            Catat Mood Detail
          </button>
          <button
            onClick={() => onNavigate('journal')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#2C253D] hover:bg-white border border-[#E7DDF5] dark:border-[#3F3656] text-xs font-semibold transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#8D78A9] dark:text-[#C7B1E5]" />
            Tulis Jurnal
          </button>
          <button
            onClick={() => onNavigate('analytics')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#2C253D] hover:bg-white border border-[#E7DDF5] dark:border-[#3F3656] text-xs font-semibold transition cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-[#8D78A9] dark:text-[#C7B1E5]" />
            Lihat Analitik
          </button>
          <button
            onClick={() => onNavigate('selfcare')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FFF9F1] dark:bg-[#2C253D] hover:border-[#C7B1E5] border border-[#E7DDF5] dark:border-[#3F3656] text-xs font-semibold transition cursor-pointer"
          >
            <HeartHandshake className="w-4 h-4 text-[#8D78A9] dark:text-[#C7B1E5]" />
            Pojok Self-Care
          </button>
        </div>
      </section>

      {/* Habit Tracker Section */}
      <DailyHabitTracker />

      {/* Main Grid: Quick Check-in + Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Mood Check-In Card */}
        <section className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold">Check-in Suasana Hati Instan</h3>
              <p className="text-xs text-[#8D78A9] dark:text-[#B4A7CC]">
                Sentuh emosi yang paling mewakili energimu saat ini
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#F7F3FC] dark:bg-[#2B243B] text-[#8D78A9] dark:text-[#C7B1E5]">
              {todayMoods.length} catatan hari ini
            </span>
          </div>

          <form onSubmit={handleQuickCheckIn} className="space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              {MOODS.map((m) => {
                const active = selectedMood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedMood(m.id);
                      setFormError('');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${active
                        ? 'border-[#8D78A9] bg-[#E7DDF5] dark:bg-[#322A47] shadow-sm scale-[1.03]'
                        : 'border-[#E7DDF5] dark:border-[#322C42] bg-[#F7F3FC]/60 dark:bg-[#1A1624] hover:border-[#C7B1E5]'
                      }`}
                  >
                    <span className="text-2xl mb-1">{m.emoji}</span>
                    <span className="text-xs font-bold">{m.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedMood && (
              <div className="p-4 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] space-y-3.5 animate-fade-in-up border border-[#E7DDF5] dark:border-[#312A42]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#8D78A9]">
                    Kekuatan Rasa: <span className="text-[#393343] dark:text-white font-extrabold">{intensity}/5</span>
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setIntensity(lvl)}
                        className={`w-7 h-7 rounded-xl text-xs font-bold transition cursor-pointer ${intensity === lvl
                            ? 'bg-[#8D78A9] text-white shadow-xs'
                            : 'bg-white dark:bg-[#292338] text-[#8D78A9] border border-[#E7DDF5] dark:border-[#3A3250]'
                          }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ada cerita singkat tentang perasaan ini? (opsional)"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-[#231E30] border border-[#E7DDF5] dark:border-[#362F4A] text-xs focus:outline-none focus:ring-2 focus:ring-[#C7B1E5]"
                />

                {/* Quick Tags */}
                <div>
                  <p className="text-[11px] font-semibold text-[#8D78A9] mb-1.5">Tandai Pemicu Cepat:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EMOTION_TAGS.slice(0, 7).map((tag) => {
                      const isSel = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition ${isSel
                              ? 'bg-[#8D78A9] text-white border-[#8D78A9]'
                              : 'bg-white dark:bg-[#231E30] border-[#E7DDF5] dark:border-[#362F4A] text-[#8D78A9]'
                            }`}
                        >
                          {isSel && '✓ '}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {formError && <p className="text-xs text-red-500">{formError}</p>}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-2xl bg-[#8D78A9] hover:bg-[#7A6596] text-white text-xs font-semibold shadow-sm flex items-center gap-2 transition disabled:opacity-60 cursor-pointer"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>Simpan Check-in</span>
              </button>
            </div>
          </form>
        </section>

        {/* Daily Motivational Quote Card */}
        <section className="rounded-3xl p-6 bg-[#FFF9F1] dark:bg-[#231E2E] border border-[#E7DDF5] dark:border-[#362E48] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5]">
                <Quote className="w-4 h-4" />
                Kutipan Penyejuk Jiwa
              </span>
              <button
                onClick={() => setQuoteIdx((i) => (i + 1) % DAILY_QUOTES.length)}
                className="p-2 rounded-xl hover:bg-[#E7DDF5]/60 dark:hover:bg-[#312945] text-[#8D78A9] transition cursor-pointer"
                title="Ganti kutipan"
                aria-label="Ganti kutipan"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-4 text-base font-medium leading-relaxed text-[#393343] dark:text-[#F3EEF9]">
              “{currentQuote.text}”
            </p>
          </div>
          <p className="mt-4 text-xs font-semibold text-[#8D78A9] dark:text-[#B9ABD0]">
            — {currentQuote.author}
          </p>
        </section>
      </div>

      {/* Emotional First Aid Section */}
      <EmotionalFirstAid />

      {/* Bottom Grid: Weekly Overview + Recent Journals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Mood Overview */}
        <section className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold">Ringkasan Mood Mingguan</h3>
              <p className="text-xs text-[#8D78A9] dark:text-[#B4A7CC]">
                Grafik rata-rata skor emosi 7 hari terakhir (1–5)
              </p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-semibold text-[#8D78A9] hover:text-[#393343] dark:hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              Detail Analitik <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {hasWeeklyData ? (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodGradDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8D78A9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#C7B1E5" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7DDF5" opacity={0.5} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#8D78A9' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12, fill: '#8D78A9' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '14px',
                      border: '1px solid #E7DDF5',
                      backgroundColor: '#FFF9F1',
                      color: '#393343',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [value ?? 'Belum ada data', 'Skor Mood']}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#8D78A9"
                    strokeWidth={2.5}
                    fill="url(#moodGradDash)"
                    connectNulls
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523]">
              <BarChart3 className="w-8 h-8 text-[#C7B1E5] mb-2" />
              <p className="text-sm font-semibold">Belum ada data mood minggu ini</p>
              <p className="text-xs text-[#8D78A9] mt-1">
                Catat suasana hatimu hari ini untuk mulai melihat tren mingguan.
              </p>
            </div>
          )}
        </section>

        {/* Recent Journal Entries */}
        <section className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold">Jurnal Terbaru</h3>
              <p className="text-xs text-[#8D78A9] dark:text-[#B4A7CC]">
                Catatan refleksi pribadimu ({journals.length} tersimpan)
              </p>
            </div>
            <button
              onClick={() => onNavigate('journal')}
              className="text-xs font-semibold text-[#8D78A9] hover:text-[#393343] dark:hover:text-white inline-flex items-center gap-1 cursor-pointer"
            >
              Semua Jurnal <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentJournals.length > 0 ? (
            <div className="space-y-3">
              {recentJournals.map((j) => (
                <div
                  key={j.id}
                  onClick={() => onNavigate('journal')}
                  className="p-4 rounded-2xl bg-[#F7F3FC]/80 dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] hover:border-[#8D78A9] transition cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm truncate">{j.title}</h4>
                    {j.moodTag && MOOD_MAP[j.moodTag] && (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-[#282138] border border-[#E7DDF5] dark:border-[#3A3250] shrink-0 font-semibold">
                        {MOOD_MAP[j.moodTag].emoji} {MOOD_MAP[j.moodTag].label}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-[#6E637E] dark:text-[#B9ABD0] line-clamp-2 leading-relaxed">
                    {j.content}
                  </p>
                  <p className="mt-2 text-[11px] text-[#8D78A9]">{formatDateTime(j.createdAt)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523]">
              <BookOpen className="w-8 h-8 text-[#C7B1E5] mb-2" />
              <p className="text-sm font-semibold">Belum ada catatan jurnal</p>
              <p className="text-xs text-[#8D78A9] mt-1 mb-3">
                Tuangkan pikiran dan perasaanmu di ruang yang aman dan privat.
              </p>
              <button
                onClick={() => onNavigate('journal')}
                className="px-4 py-2 rounded-xl bg-[#8D78A9] text-white text-xs font-semibold cursor-pointer"
              >
                Tulis Jurnal Pertama
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
