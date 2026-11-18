import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  TrendingUp,
  CalendarDays,
  Tag,
  Clock,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MOODS, MOOD_MAP } from '../constants/moods';
import { calculateStreak, toLocalDateKey, formatTime } from '../utils/dateUtils';

export default function AnalyticsPage() {
  const { moods } = useApp();
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDayKey, setSelectedDayKey] = useState(toLocalDateKey(new Date()));

  const stats = useMemo(() => {
    if (moods.length === 0) {
      return {
        total: 0,
        topMood: null,
        avgIntensity: 0,
        streak: 0,
      };
    }

    const counts = {};
    let intensitySum = 0;
    moods.forEach((m) => {
      counts[m.mood] = (counts[m.mood] || 0) + 1;
      intensitySum += Number(m.intensity || 3);
    });

    const topId = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return {
      total: moods.length,
      topMood: topId ? { ...MOOD_MAP[topId], count: counts[topId] } : null,
      avgIntensity: (intensitySum / moods.length).toFixed(1),
      streak: calculateStreak(moods),
    };
  }, [moods]);

  // Tag frequency analysis
  const topFactors = useMemo(() => {
    const tagCount = {};
    moods.forEach((m) => {
      if (m.tags && Array.isArray(m.tags)) {
        m.tags.forEach((t) => {
          tagCount[t] = (tagCount[t] || 0) + 1;
        });
      }
    });
    return Object.entries(tagCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [moods]);

  // Weekly Chart (last 7 days)
  const weeklyData = useMemo(() => {
    const arr = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toLocalDateKey(d);
      const dayEntries = moods.filter((m) => toLocalDateKey(m.createdAt) === key);
      const avgScore =
        dayEntries.length > 0
          ? Number(
              (
                dayEntries.reduce((s, e) => s + (MOOD_MAP[e.mood]?.score || 3), 0) /
                dayEntries.length
              ).toFixed(1)
            )
          : null;
      arr.push({
        label: new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(d),
        score: avgScore,
        entries: dayEntries.length,
      });
    }
    return arr;
  }, [moods]);

  // Monthly Chart (last 30 days)
  const monthlyData = useMemo(() => {
    const arr = [];
    for (let i = 29; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = toLocalDateKey(d);
      const dayEntries = moods.filter((m) => toLocalDateKey(m.createdAt) === key);
      const avgScore =
        dayEntries.length > 0
          ? Number(
              (
                dayEntries.reduce((s, e) => s + (MOOD_MAP[e.mood]?.score || 3), 0) /
                dayEntries.length
              ).toFixed(1)
            )
          : 0;
      arr.push({
        date: `${d.getDate()}/${d.getMonth() + 1}`,
        score: avgScore,
        count: dayEntries.length,
      });
    }
    return arr;
  }, [moods]);

  // Mood Distribution
  const distributionData = useMemo(() => {
    const counts = {};
    moods.forEach((m) => {
      counts[m.mood] = (counts[m.mood] || 0) + 1;
    });
    return MOODS.map((m) => ({
      id: m.id,
      name: `${m.emoji} ${m.label}`,
      shortName: m.label,
      emoji: m.emoji,
      value: counts[m.id] || 0,
      color: m.color,
    }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [moods]);

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const byDate = {};
    moods.forEach((m) => {
      const key = toLocalDateKey(m.createdAt);
      if (!byDate[key]) byDate[key] = [];
      byDate[key].push(m);
    });

    const cells = [];
    for (let i = 0; i < startOffset; i += 1) {
      cells.push(null);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const d = new Date(year, month, day);
      const key = toLocalDateKey(d);
      cells.push({
        day,
        key,
        entries: byDate[key] || [],
      });
    }
    return cells;
  }, [calendarMonth, moods]);

  const selectedDayEntries = useMemo(
    () => moods.filter((m) => toLocalDateKey(m.createdAt) === selectedDayKey),
    [moods, selectedDayKey]
  );

  const monthLabel = new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(calendarMonth);

  if (moods.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Riwayat & Analitik Mood</h2>
          <p className="text-sm text-[#8D78A9] dark:text-[#B4A7CC]">
            Visualisasi pola emosimu dari waktu ke waktu.
          </p>
        </div>

        <div className="rounded-3xl p-14 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] text-center shadow-sm">
          <BarChart3 className="w-14 h-14 text-[#C7B1E5] mx-auto mb-3" />
          <h3 className="text-lg font-bold">Belum Ada Data untuk Dianalisis</h3>
          <p className="text-sm text-[#8D78A9] dark:text-[#B4A7CC] mt-1.5 max-w-md mx-auto">
            Setelah kamu mencatat suasana hatimu pertama kali, grafik tren mingguan, kalender emosi, dan insight faktor pemicu akan otomatis tampil di sini.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7DDF5] dark:bg-[#322A47] text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5] mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          Data & Wawasan Emosional
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Riwayat & Analitik Mood</h2>
        <p className="text-sm text-[#8D78A9] dark:text-[#B4A7CC]">
          Pahami ritme emosi, faktor yang paling mempengaruhi pikiranmu, dan statistik kesehatan jiwamu.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-3xl p-5 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <p className="text-xs font-semibold text-[#8D78A9]">Total Catatan Emosi</p>
          <p className="mt-2 text-2xl font-bold">{stats.total}</p>
          <p className="text-[11px] text-[#8D78A9] mt-1">Refleksi tersimpan rapi</p>
        </div>

        <div className="rounded-3xl p-5 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <p className="text-xs font-semibold text-[#8D78A9]">Emosi Paling Sering</p>
          <p className="mt-2 text-xl font-bold flex items-center gap-1.5">
            <span>{stats.topMood?.emoji}</span>
            <span>{stats.topMood?.label}</span>
          </p>
          <p className="text-[11px] text-[#8D78A9] mt-1">{stats.topMood?.count} kali dirasakan</p>
        </div>

        <div className="rounded-3xl p-5 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <p className="text-xs font-semibold text-[#8D78A9]">Rata-rata Intensitas</p>
          <p className="mt-2 text-2xl font-bold">{stats.avgIntensity} <span className="text-sm font-normal text-[#8D78A9]">/ 5</span></p>
          <p className="text-[11px] text-[#8D78A9] mt-1">Kekuatan rasa harian</p>
        </div>

        <div className="rounded-3xl p-5 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <p className="text-xs font-semibold text-[#8D78A9]">Streak Sadar Hati</p>
          <p className="mt-2 text-2xl font-bold flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-amber-500" />
            {stats.streak} hari
          </p>
          <p className="text-[11px] text-[#8D78A9] mt-1">Konsistensi mencatat</p>
        </div>
      </div>

      {/* Weekly + Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#8D78A9]" />
            <div>
              <h3 className="text-base font-bold">Tren Mood Mingguan</h3>
              <p className="text-xs text-[#8D78A9]">Rata-rata skor suasana hati 7 hari terakhir</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 12, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="weeklyMoodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8D78A9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C7B1E5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7DDF5" opacity={0.5} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: '#8D78A9' }} axisLine={false} tickLine={false} />
                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 12, fill: '#8D78A9' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid #E7DDF5',
                    backgroundColor: '#FFF9F1',
                    color: '#393343',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  name="Skor Mood"
                  stroke="#8D78A9"
                  strokeWidth={2.5}
                  fill="url(#weeklyMoodGrad)"
                  connectNulls
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#8D78A9]" />
            <div>
              <h3 className="text-base font-bold">Distribusi Emosi</h3>
              <p className="text-xs text-[#8D78A9]">Proporsi emosi yang paling sering muncul</p>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {distributionData.map((entry) => (
                    <Cell key={entry.id} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '14px',
                    border: '1px solid #E7DDF5',
                    backgroundColor: '#FFF9F1',
                    color: '#393343',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 mt-2">
            {distributionData.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.emoji} {item.shortName}
                </span>
                <span className="font-bold text-[#8D78A9]">
                  {item.value}x ({Math.round((item.value / stats.total) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Trigger Factors Analysis / Faktor Pemicu Terbanyak */}
      {topFactors.length > 0 && (
        <section className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-[#8D78A9]" />
            <div>
              <h3 className="text-base font-bold">Faktor Lingkungan & Pemicu Terbanyak</h3>
              <p className="text-xs text-[#8D78A9]">Topik yang paling sering kamu hubungkan dengan suasana hatimu</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {topFactors.map((factor, i) => (
              <div
                key={factor.name}
                className="p-4 rounded-2xl bg-[#F7F3FC] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#332A46] text-center"
              >
                <span className="text-[11px] font-bold text-[#8D78A9] px-2 py-0.5 rounded-full bg-white dark:bg-[#282138] border border-[#E7DDF5] dark:border-[#3A3250]">
                  #{i + 1}
                </span>
                <p className="mt-2 text-sm font-bold text-[#393343] dark:text-[#EAE2F8]">{factor.name}</p>
                <p className="mt-0.5 text-xs text-[#8D78A9]">{factor.count} kali ditandai</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Monthly Chart */}
      <section className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-bold">Grafik Mood Bulanan (30 Hari Terakhir)</h3>
          <p className="text-xs text-[#8D78A9]">
            Menunjukkan dinamika fluktuasi suasana hati setiap hari
          </p>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E7DDF5" opacity={0.5} />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8D78A9' }} interval={3} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#8D78A9' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '14px',
                  border: '1px solid #E7DDF5',
                  backgroundColor: '#FFF9F1',
                  color: '#393343',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="score" name="Skor Mood" fill="#C7B1E5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Mood Calendar Section */}
      <section className="rounded-3xl p-6 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#8D78A9]" />
            <div>
              <h3 className="text-base font-bold">Kalender Mood Interaktif</h3>
              <p className="text-xs text-[#8D78A9]">Klik tanggal mana pun untuk menelaah catatan di hari tersebut</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
              }
              className="p-2 rounded-xl bg-[#F7F3FC] dark:bg-[#191523] hover:bg-[#E7DDF5] transition cursor-pointer"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold capitalize min-w-[130px] text-center">
              {monthLabel}
            </span>
            <button
              onClick={() =>
                setCalendarMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
              }
              className="p-2 rounded-xl bg-[#F7F3FC] dark:bg-[#191523] hover:bg-[#E7DDF5] transition cursor-pointer"
              aria-label="Bulan berikutnya"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-7 gap-1.5 text-center text-[11px] font-bold text-[#8D78A9] mb-2">
              {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((cell, idx) => {
                if (!cell) return <div key={`empty-${idx}`} className="h-12" />;
                const latest = cell.entries[0];
                const isSelected = selectedDayKey === cell.key;
                return (
                  <button
                    key={cell.key}
                    onClick={() => setSelectedDayKey(cell.key)}
                    className={`h-12 rounded-2xl border flex flex-col items-center justify-center transition cursor-pointer ${
                      isSelected
                        ? 'border-[#8D78A9] bg-[#E7DDF5] dark:bg-[#332A48] shadow-xs scale-[1.02]'
                        : 'border-[#F7F3FC] dark:border-[#2C253D] bg-[#F7F3FC]/60 dark:bg-[#191523] hover:border-[#C7B1E5]'
                    }`}
                  >
                    <span className="text-[11px] font-semibold leading-none">{cell.day}</span>
                    <span className="text-sm leading-none mt-1">
                      {latest ? MOOD_MAP[latest.mood]?.emoji : '·'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-[#FFF9F1] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42]">
            <h4 className="text-xs font-bold text-[#8D78A9] uppercase tracking-wider">
              Catatan Tanggal: {selectedDayKey}
            </h4>
            {selectedDayEntries.length === 0 ? (
              <p className="mt-4 text-xs text-[#8D78A9]">
                Tidak ada catatan mood yang tersimpan pada tanggal ini.
              </p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {selectedDayEntries.map((item) => {
                  const info = MOOD_MAP[item.mood];
                  return (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-white dark:bg-[#231E30] border border-[#E7DDF5] dark:border-[#342D46]"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>
                          {info?.emoji} {info?.label}
                        </span>
                        <span className="text-[#8D78A9]">{formatTime(item.createdAt)}</span>
                      </div>
                      {item.note && (
                        <p className="mt-1.5 text-xs text-[#6E637E] dark:text-[#C0B5D6]">
                          {item.note}
                        </p>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-[#F7F3FC] dark:bg-[#2C243B] text-[#8D78A9]"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
