export function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 11) return 'Selamat pagi';
  if (hour >= 11 && hour < 15) return 'Selamat siang';
  if (hour >= 15 && hour < 19) return 'Selamat sore';
  return 'Selamat malam';
}

export function formatIndonesianDate(dateInput = new Date()) {
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
}

export function formatDateTime(dateInput) {
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatTime(dateInput) {
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function toLocalDateKey(dateInput = new Date()) {
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStreak(moodEntries) {
  if (!moodEntries || moodEntries.length === 0) return 0;
  const uniqueDays = new Set(moodEntries.map((m) => toLocalDateKey(m.createdAt)));
  let streak = 0;
  const cursor = new Date();

  // If no entry today, start checking from yesterday
  if (!uniqueDays.has(toLocalDateKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  while (uniqueDays.has(toLocalDateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

