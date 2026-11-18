import React, { useState } from 'react';
import { ShieldAlert, HeartHandshake, ChevronRight, Sparkles, X, Check } from 'lucide-react';
import { EMOTIONAL_FIRST_AID } from '../constants/wellnessExtras';

export default function EmotionalFirstAid() {
  const [activeGuide, setActiveGuide] = useState(null);
  const [checkedSteps, setCheckedSteps] = useState({});

  const toggleCheck = (idx) => {
    setCheckedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="rounded-3xl p-6 bg-gradient-to-br from-[#FFF9F1] via-[#F7F3FC] to-[#E7DDF5] dark:from-[#211D2B] dark:via-[#1E1928] dark:to-[#2B233A] border border-[#E7DDF5] dark:border-[#38304C] shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-xl bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-500">
          <ShieldAlert className="w-4 h-4" />
        </div>
        <h3 className="text-base font-bold text-[#393343] dark:text-[#F3EEF9]">
          P3K Emosional (Emotional First-Aid)
        </h3>
      </div>
      <p className="text-xs text-[#8D78A9] dark:text-[#B4A7CC] mb-5 leading-relaxed">
        Panduan langkah darurat yang terbukti secara psikologis saat kamu mengalami ledakan cemas, amarah hebat, kesedihan mendalam, atau keletihan batin.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {EMOTIONAL_FIRST_AID.map((guide) => (
          <button
            key={guide.id}
            onClick={() => {
              setActiveGuide(guide);
              setCheckedSteps({});
            }}
            className="p-4 rounded-2xl bg-white/90 dark:bg-[#1E1928] border border-[#E7DDF5] dark:border-[#362E48] hover:border-[#8D78A9] text-left transition-all hover:scale-[1.01] cursor-pointer shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{guide.emoji}</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: guide.bg, color: guide.color }}
                >
                  Panduan Cepat
                </span>
              </div>
              <h4 className="font-bold text-xs text-[#393343] dark:text-white leading-snug">
                {guide.title}
              </h4>
            </div>

            <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-[#8D78A9]">
              <span>Buka Pertolongan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </button>
        ))}
      </div>

      {/* Guide Detail Modal */}
      {activeGuide && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#211D2B] border border-[#E7DDF5] dark:border-[#342D46] p-6 sm:p-7 shadow-2xl animate-fade-in-up">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeGuide.emoji}</span>
                <div>
                  <h3 className="text-base font-bold text-[#393343] dark:text-white">
                    {activeGuide.title}
                  </h3>
                  <p className="text-xs text-[#8D78A9]">Ikuti 4 langkah terarah ini dengan perlahan</p>
                </div>
              </div>
              <button
                onClick={() => setActiveGuide(null)}
                className="p-2 rounded-xl hover:bg-[#F7F3FC] dark:hover:bg-[#2B243D] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 my-5">
              {activeGuide.steps.map((item, idx) => {
                const isChecked = Boolean(checkedSteps[idx]);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCheck(idx)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                        : 'bg-[#F7F3FC] dark:bg-[#191523] border-[#E7DDF5] dark:border-[#312A42]'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition ${
                        isChecked
                          ? 'bg-emerald-500 text-white'
                          : 'bg-[#E7DDF5] dark:bg-[#2F2742] text-[#8D78A9]'
                      }`}
                    >
                      {isChecked ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-[#393343] dark:text-[#EAE2F8]">
                        {item.step}
                      </h5>
                      <p className="text-xs text-[#6E637E] dark:text-[#B4A7CC] mt-0.5 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3 rounded-2xl bg-[#FFF9F1] dark:bg-[#191523] border border-[#E7DDF5] dark:border-[#312A42] text-[11px] text-[#8D78A9] text-center mb-4">
              Ingatlah bahwa emosi adalah ombak yang datang dan pergi. Kamu tidak sendirian.
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveGuide(null)}
                className="px-5 py-2.5 rounded-2xl bg-[#8D78A9] text-white text-xs font-semibold cursor-pointer"
              >
                Aku Mengerti, Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

