import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Play, Square, Sliders } from 'lucide-react';
import { AMBIENT_SOUNDS } from '../constants/moods';
import { soundEngine } from '../utils/soundEngine';

export default function AmbientSoundPlayer() {
  const [activeTrack, setActiveTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    return () => {
      soundEngine.stop();
    };
  }, []);

  const handleToggle = (trackId) => {
    if (activeTrack === trackId && isPlaying) {
      soundEngine.stop();
      setIsPlaying(false);
      setActiveTrack(null);
    } else {
      soundEngine.play(trackId, volume);
      setActiveTrack(trackId);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
  };

  return (
    <div className="rounded-3xl p-6 bg-gradient-to-br from-white via-[#F7F3FC] to-[#FFF9F1] dark:from-[#211D2B] dark:via-[#1D1826] dark:to-[#171420] border border-[#E7DDF5] dark:border-[#322C42] shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E7DDF5]/70 dark:bg-[#2D263F] text-xs font-bold text-[#8D78A9] dark:text-[#C7B1E5] mb-2">
            <Volume2 className="w-3.5 h-3.5" />
            Audio Relaksasi Ambien
          </div>
          <h3 className="text-lg font-bold">Suasana Suara untuk Menenangkan Diri</h3>
          <p className="text-xs text-[#8D78A9] dark:text-[#B4A7CC]">
            Dengarkan frekuensi tenang secara langsung di browsermu sambil menulis jurnal atau bernapas.
          </p>
        </div>

        {isPlaying && (
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white dark:bg-[#282138] border border-[#E7DDF5] dark:border-[#3A3250] shadow-xs">
            <button
              onClick={() => handleVolumeChange(volume === 0 ? 0.6 : 0)}
              className="p-1.5 text-[#8D78A9] hover:text-[#393343] dark:hover:text-white"
              title="Mute / Unmute"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-500 animate-pulse" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 accent-[#8D78A9] cursor-pointer"
            />
            <button
              onClick={() => {
                soundEngine.stop();
                setIsPlaying(false);
                setActiveTrack(null);
              }}
              className="px-2.5 py-1 text-xs font-semibold rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 hover:bg-red-100 transition"
            >
              Berhenti
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {AMBIENT_SOUNDS.map((sound) => {
          const isCurrent = activeTrack === sound.id && isPlaying;
          return (
            <div
              key={sound.id}
              onClick={() => handleToggle(sound.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#E7DDF5] dark:bg-[#322A47] border-[#8D78A9] shadow-sm scale-[1.02]'
                  : 'bg-white dark:bg-[#211D2B] border-[#E7DDF5] dark:border-[#322C42] hover:border-[#C7B1E5] hover:bg-[#F7F3FC]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl">
                    {sound.id === 'rain' && '🌧️'}
                    {sound.id === 'waves' && '🌊'}
                    {sound.id === 'forest' && '🍃'}
                    {sound.id === 'night' && '✨'}
                  </span>
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                      isCurrent
                        ? 'bg-[#8D78A9] text-white shadow-xs'
                        : 'bg-[#F7F3FC] dark:bg-[#2B243B] text-[#8D78A9]'
                    }`}
                  >
                    {isCurrent ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#393343] dark:text-[#F3EEF9]">{sound.name}</h4>
                <p className="mt-1 text-xs text-[#6E637E] dark:text-[#B4A7CC] line-clamp-2 leading-relaxed">
                  {sound.desc}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[11px] font-semibold text-[#8D78A9]">
                <span>{isCurrent ? 'Sedang Memutar...' : 'Putar Audio'}</span>
                {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

