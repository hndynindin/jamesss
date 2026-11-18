import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  RefreshCw,
  Wind,
  Play,
  Pause,
  RotateCcw,
  Heart,
  CheckCircle2,
  Circle,
  Copy,
  BellRing,
  Music,
} from 'lucide-react';
import {
  AFFIRMATIONS,
  SELF_CARE_TIPS,
  RELAXATION_ACTIVITIES,
} from '../constants/moods';
import { useApp } from '../context/AppContext';
import AmbientSoundPlayer from '../components/AmbientSoundPlayer';

const BREATH_PHASES = [
  { name: 'Tarik Napas', seconds: 4, scale: 'scale-125', hint: 'Tarik napas perlahan lewat hidung, rasakan dadamu mengembang...' },
  { name: 'Tahan', seconds: 4, scale: 'scale-125', hint: 'Tahan dengan tenang, rasakan keheningan di tubuhmu...' },
  { name: 'Hembuskan', seconds: 6, scale: 'scale-95', hint: 'Hembuskan panjang lewat mulut, lepaskan semua kepenatan...' },
];

export default function SelfCarePage() {
  const { showToast } = useApp();
  const [affirmationIdx, setAffirmationIdx] = useState(0);

  // Breathing exercise state
  const [isBreathing, setIsBreathing] = useState(false);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(BREATH_PHASES[0].seconds);
  const [cycles, setCycles] = useState(0);

  // Completed relaxation steps
  const [completedSteps, setCompletedSteps] = useState({});

  useEffect(() => {
    if (!isBreathing) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;
        setPhaseIdx((p) => {
          const next = (p + 1) % BREATH_PHASES.length;
          if (next === 0) {
            setCycles((c) => {
              const updated = c + 1;
              if (updated % 3 === 0) {
                confetti({
                  particleCount: 25,
                  spread: 45,
                  origin: { y: 0.7 },
                  colors: ['#C7B1E5', '#8D78A9', '#FFF9F1'],
                });
              }
              return updated;
            });
          }
          setSecondsLeft(BREATH_PHASES[next].seconds);
          return next;
        });
        return 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isBreathing]);

  const resetBreathing = () => {
    setIsBreathing(false);
    setPhaseIdx(0);
    setSecondsLeft(BREATH_PHASES[0].seconds);
    setCycles(0);
  };

  const randomAffirmation = () => {
    let next = Math.floor(Math.random() * AFFIRMATIONS.length);
    if (next === affirmationIdx) next = (next + 1) % AFFIRMATIONS.length;
    setAffirmationIdx(next);
  };

  const copyAffirmation = () => {
    navigator.clipboard?.writeText(AFFIRMATIONS[affirmationIdx]);
    showToast('Afirmasi disalin ke clipboard! ✨');
  };

  const toggleStep = (key) => {
    setCompletedSteps((prev) => {
      const next = !prev[key];
      if (next) {
        showToast('Langkah relaksasi selesai! 🌿');
      }
      return { ...prev, [key]: next };
    });
  };

  const currentPhase = BREATH_PHASES[phaseIdx];

  return (
    <div className="space-y-7">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7DDF5] dark:bg-[#322A47] text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5] mb-2">
          <Heart className="w-3.5 h-3.5" />
          Suaka Ketenangan & Pemulihan
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Pojok Self-Care</h2>
        <p className="text-sm text-[#8D78A9] dark:text-[#B4A7CC]">
          Tempat untuk bernapas sejenak, mendengarkan audio damai, memeluk diri, dan mengisi ulang energimu.
        </p>
      </div>

      {/* Interactive Ambient Sound Player */}
      <AmbientSoundPlayer />

      {/* Affirmation + Breathing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Affirmation */}
        <section className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#FFF9F1] via-[#F7F3FC] to-[#E7DDF5] dark:from-[#29223B] dark:via-[#221D30] dark:to-[#1E192A] border border-[#E7DDF5] dark:border-[#362E48] shadow-sm flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#2E2740] text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Afirmasi Penguat Hati Hari Ini
            </span>

            <p className="mt-6 text-xl sm:text-2xl font-bold leading-relaxed text-[#393343] dark:text-white">
              “{AFFIRMATIONS[affirmationIdx]}”
            </p>
            <p className="mt-3 text-xs text-[#8D78A9] dark:text-[#B4A7CC]">
              Ucapkan kalimat ini di dalam hatimu perlahan sebanyak tiga kali.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={randomAffirmation}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#8D78A9] hover:bg-[#7A6596] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Ganti Afirmasi Acak
            </button>
            <button
              onClick={copyAffirmation}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/90 dark:bg-[#2C253D] hover:bg-white border border-[#E7DDF5] dark:border-[#3F3656] text-xs font-semibold transition cursor-pointer"
            >
              <Copy className="w-4 h-4 text-[#8D78A9]" />
              Salin Kata Mutiara
            </button>
          </div>
        </section>

        {/* Breathing Exercise */}
        <section className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm flex flex-col items-center text-center justify-between">
          <div className="w-full flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-sm font-bold">
              <Wind className="w-4 h-4 text-[#8D78A9]" />
              Panduan Napas Ritmis 4-4-6
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F7F3FC] dark:bg-[#2B243B] text-[#8D78A9]">
              Siklus: {cycles} kali
            </span>
          </div>

          <div className="my-6 relative flex items-center justify-center w-48 h-48">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#E7DDF5] to-[#C7B1E5] dark:from-[#332A48] dark:to-[#463964] opacity-70 transition-transform duration-1000 ease-in-out ${
                isBreathing ? currentPhase.scale : 'scale-100'
              }`}
            />
            <div className="relative z-10 w-32 h-32 rounded-full bg-white dark:bg-[#262035] border-2 border-[#C7B1E5] flex flex-col items-center justify-center shadow-md">
              <span className="text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5]">
                {isBreathing ? currentPhase.name : 'Mulai?'}
              </span>
              <span className="text-3xl font-extrabold mt-0.5">{secondsLeft}s</span>
            </div>
          </div>

          <p className="text-xs text-[#6E637E] dark:text-[#C0B5D6] mb-4 min-h-[20px] max-w-sm">
            {isBreathing
              ? currentPhase.hint
              : 'Klik "Mulai Latihan" untuk melepaskan stres fisik dan meredakan detak jantung.'}
          </p>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsBreathing((v) => !v)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#8D78A9] hover:bg-[#7A6596] text-white text-xs font-semibold shadow-sm transition cursor-pointer"
            >
              {isBreathing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isBreathing ? 'Jeda Latihan' : 'Mulai Latihan'}
            </button>
            <button
              onClick={resetBreathing}
              className="p-2.5 rounded-2xl bg-[#F7F3FC] dark:bg-[#2B243D] text-[#8D78A9] hover:text-[#393343] transition cursor-pointer"
              aria-label="Reset latihan napas"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>

      {/* Self-Care Tips */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Heart className="w-5 h-5 text-[#8D78A9]" />
            Tips Merawat Diri Praktis
          </h3>
          <p className="text-xs text-[#8D78A9]">Lakukan kebiasaan kecil ini untuk menjaga energimu sepanjang hari</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {SELF_CARE_TIPS.map((tip) => (
            <div
              key={tip.id}
              className="rounded-3xl p-5 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-semibold mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F7F3FC] dark:bg-[#2C253D] text-[#8D78A9]">
                    {tip.category}
                  </span>
                  <span className="text-[#8D78A9]">{tip.duration}</span>
                </div>
                <h4 className="font-bold text-sm leading-snug">{tip.title}</h4>
                <p className="mt-2 text-xs text-[#6E637E] dark:text-[#C0B5D6] leading-relaxed">
                  {tip.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Relaxation Activities & Kind Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-bold">Aktivitas Relaksasi Interaktif</h3>
            <p className="text-xs text-[#8D78A9]">Beri centang saat kamu telah mempraktikkan setiap langkah</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RELAXATION_ACTIVITIES.map((act) => (
              <div
                key={act.id}
                className="rounded-3xl p-5 bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm mb-1">{act.title}</h4>
                  <p className="text-[11px] text-[#8D78A9] mb-3">{act.desc}</p>
                  <ul className="space-y-2.5">
                    {act.steps.map((step, idx) => {
                      const key = `${act.id}-${idx}`;
                      const done = Boolean(completedSteps[key]);
                      return (
                        <li key={key}>
                          <button
                            onClick={() => toggleStep(key)}
                            className="w-full text-left flex items-start gap-2 text-xs cursor-pointer group"
                          >
                            {done ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-4 h-4 text-[#C7B1E5] shrink-0 mt-0.5 group-hover:text-[#8D78A9]" />
                            )}
                            <span
                              className={`transition ${
                                done
                                  ? 'line-through text-[#8D78A9]/60'
                                  : 'text-[#4F465C] dark:text-[#D2C7E5]'
                              }`}
                            >
                              {step}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl p-6 bg-[#FFF9F1] dark:bg-[#231E2E] border border-[#E7DDF5] dark:border-[#362E48] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#8D78A9] dark:text-[#C7B1E5] mb-4">
              <BellRing className="w-4 h-4" />
              Pesan Sayang untuk Dirimu
            </div>
            <ul className="space-y-3.5 text-xs text-[#574E66] dark:text-[#CFC4E3] leading-relaxed">
              <li className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#2B243D] border border-[#E7DDF5]/80 dark:border-[#3C344E]">
                💧 <strong>Sudahkah terhidrasi?</strong> Satu gelas air putih dingin atau hangat akan menyegarkan kembali sel-sel tubuhmu.
              </li>
              <li className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#2B243D] border border-[#E7DDF5]/80 dark:border-[#3C344E]">
                🌿 <strong>Turunkan pundakmu.</strong> Tanpa sadar kita sering menahan ketegangan di leher. Buang napas panjang dan lemaskan sekarang.
              </li>
              <li className="p-3.5 rounded-2xl bg-white/90 dark:bg-[#2B243D] border border-[#E7DDF5]/80 dark:border-[#3C344E]">
                🌙 <strong>Tidak apa-apa istirahat.</strong> Nilai dirimu tidak diukur dari seberapa sibuk atau lelahnya kamu malam ini.
              </li>
            </ul>
          </div>

          <div className="mt-5 p-3 rounded-2xl bg-[#E7DDF5]/60 dark:bg-[#2F2742] text-[11px] text-center font-semibold text-[#8D78A9] dark:text-[#C7B1E5]">
            MoodSpace siap menemanimu kapan pun kamu butuh ruang jeda.
          </div>
        </section>
      </div>
    </div>
  );
}
