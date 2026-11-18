import React from 'react';
import { PRESET_AVATARS } from '../constants/moods';

export default function AvatarDisplay({ avatar, name = 'Pengguna', size = 'md' }) {
  const sizeClasses = {
    sm: 'w-9 h-9 text-base',
    md: 'w-11 h-11 text-xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const cls = sizeClasses[size] || sizeClasses.md;

  if (avatar && avatar.startsWith('data:image')) {
    return (
      <img
        src={avatar}
        alt={name}
        className={`${cls} rounded-full object-cover border-2 border-[#C7B1E5] dark:border-[#5D4C7A] shadow-sm`}
      />
    );
  }

  const presetId = avatar?.startsWith('preset:') ? avatar.replace('preset:', '') : 'av-1';
  const preset = PRESET_AVATARS.find((p) => p.id === presetId) || PRESET_AVATARS[0];

  return (
    <div
      className={`${cls} rounded-full flex items-center justify-center border-2 border-[#C7B1E5] dark:border-[#5D4C7A] shadow-sm select-none shrink-0`}
      style={{ backgroundColor: preset.bg }}
      aria-label={name}
    >
      <span>{preset.emoji}</span>
    </div>
  );
}

