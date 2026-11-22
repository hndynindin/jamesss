import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue', badge }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      glow: 'shadow-blue-500/5',
      iconBg: 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
    },
    green: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'shadow-emerald-500/5',
      iconBg: 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
    },
    yellow: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'shadow-amber-500/5',
      iconBg: 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
    },
    red: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'shadow-rose-500/5',
      iconBg: 'bg-rose-600/20 text-rose-400 border border-rose-500/30'
    },
    purple: {
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'shadow-purple-500/5',
      iconBg: 'bg-purple-600/20 text-purple-400 border border-purple-500/30'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div className={`p-4 rounded-2xl bg-[#1E293B]/70 border ${scheme.border} relative overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-opacity-60 hover:translate-y-[-2px] shadow-lg ${scheme.glow}`}>
      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">
          {title}
        </span>
        {Icon && (
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {/* Main value */}
      <div className="mt-2 flex items-baseline space-x-2">
        <h3 className="text-2xl font-extrabold text-white tracking-tight">
          {value}
        </h3>
        {badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            {badge}
          </span>
        )}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 flex items-center space-x-1">
          <span>{subtitle}</span>
        </p>
      )}

      {/* Subtle bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${scheme.bg.replace('/10', '/30')}`} />
    </div>
  );
};

export default StatCard;
