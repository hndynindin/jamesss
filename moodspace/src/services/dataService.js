import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MOOD_MAP } from '../constants/moods';

const KEYS = {
  USERS: 'moodspace_users_v1',
  SESSION: 'moodspace_session_v1',
  MOODS: 'moodspace_moods_v1',
  JOURNALS: 'moodspace_journals_v1',
  SETTINGS: 'moodspace_settings_v1',
};

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const hashPassword = (password) => {
  let hash = 0;
  for (let i = 0; i < password.length; i += 1) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return `ms_${Math.abs(hash).toString(36)}_${password.length}`;
};

const generateId = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `id_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

// Seed initial realistic data for demo
const ensureDemoUser = () => {
  const users = readJSON(KEYS.USERS, []);
  if (users.length > 0) return;

  const demoId = 'demo-user-moodspace';
  const now = new Date();
  const daysAgo = (d, hour = 9) => {
    const dt = new Date(now);
    dt.setDate(dt.getDate() - d);
    dt.setHours(hour, 15, 0, 0);
    return dt.toISOString();
  };

  writeJSON(KEYS.USERS, [
    {
      id: demoId,
      name: 'Nadia Putri',
      email: 'demo@moodspace.id',
      passwordHash: hashPassword('demo1234'),
      avatar: 'preset:av-1',
      createdAt: daysAgo(14),
    },
  ]);

  writeJSON(KEYS.MOODS, [
    {
      id: generateId(),
      userId: demoId,
      mood: 'calm',
      intensity: 4,
      note: 'Pagi ini minum teh chamomile hangat dan merasa cukup tenang sebelum memulai tugas perkuliahan.',
      tags: ['Kuliah & Tugas', 'Waktu Sendiri'],
      createdAt: daysAgo(0, 8),
      updatedAt: daysAgo(0, 8),
    },
    {
      id: generateId(),
      userId: demoId,
      mood: 'happy',
      intensity: 5,
      note: 'Berhasil menyelesaikan revisi proyek bersama tim dengan lancar dan diapresiasi dosen!',
      tags: ['Pencapaian', 'Kuliah & Tugas'],
      createdAt: daysAgo(1, 16),
      updatedAt: daysAgo(1, 16),
    },
    {
      id: generateId(),
      userId: demoId,
      mood: 'tired',
      intensity: 3,
      note: 'Energi menipis setelah rapat daring seharian. Memutuskan untuk tidur lebih awal.',
      tags: ['Kelelahan', 'Pekerjaan'],
      createdAt: daysAgo(2, 21),
      updatedAt: daysAgo(2, 21),
    },
    {
      id: generateId(),
      userId: demoId,
      mood: 'anxious',
      intensity: 3,
      note: 'Sempat overthinking memikirkan tenggat waktu, tapi latihan napas 4-4-6 sangat membantu.',
      tags: ['Kuliah & Tugas', 'Kesehatan'],
      createdAt: daysAgo(3, 14),
      updatedAt: daysAgo(3, 14),
    },
    {
      id: generateId(),
      userId: demoId,
      mood: 'happy',
      intensity: 4,
      note: 'Jalan-jalan sore menikmati udara sejuk dan mencium aroma rumput basah.',
      tags: ['Waktu Sendiri', 'Cuaca', 'Hobi'],
      createdAt: daysAgo(4, 17),
      updatedAt: daysAgo(4, 17),
    },
    {
      id: generateId(),
      userId: demoId,
      mood: 'sad',
      intensity: 2,
      note: 'Hujan deras seharian membuat hati sedikit melankolis dan teringat rumah.',
      tags: ['Keluarga', 'Cuaca'],
      createdAt: daysAgo(5, 19),
      updatedAt: daysAgo(5, 19),
    },
    {
      id: generateId(),
      userId: demoId,
      mood: 'calm',
      intensity: 4,
      note: 'Akhir pekan yang sangat damai membaca buku favorit di sudut kamar.',
      tags: ['Hobi', 'Waktu Sendiri'],
      createdAt: daysAgo(6, 10),
      updatedAt: daysAgo(6, 10),
    },
  ]);

  writeJSON(KEYS.JOURNALS, [
    {
      id: generateId(),
      userId: demoId,
      title: 'Belajar Melangkah Lebih Pelan',
      content:
        'Hari ini aku mulai belajar bahwa hidup bukan perlombaan lari cepat. Memberikan jeda napas 5 menit di antara kesibukan ternyata mampu mengembalikan kejernihan pikiran yang sempat kalut. Aku bangga pada diriku yang sudah bertahan sampai titik ini.',
      moodTag: 'calm',
      createdAt: daysAgo(0, 9),
      updatedAt: daysAgo(0, 9),
    },
    {
      id: generateId(),
      userId: demoId,
      title: 'Apresiasi Momen-Momen Sederhana',
      content:
        'Tadi teman baikku mengirimkan pesan singkat: "Jangan lupa makan siang ya, semangat!". Rasanya begitu hangat mengetahui ada orang yang peduli tanpa syarat. Kebahagiaan memang sering kali bersembunyi dalam hal-hal yang paling sederhana.',
      moodTag: 'happy',
      createdAt: daysAgo(1, 20),
      updatedAt: daysAgo(1, 20),
    },
  ]);

  writeJSON(KEYS.SETTINGS, {
    [demoId]: {
      theme: 'light',
      dailyReminder: true,
      reminderTime: '20:00',
    },
  });
};

ensureDemoUser();

export const authService = {
  async getCurrentUser() {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return null;
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      return {
        id: data.user.id,
        email: data.user.email,
        name: profile?.name || data.user.user_metadata?.name || 'Pengguna',
        avatar: profile?.avatar || 'preset:av-1',
        createdAt: data.user.created_at,
      };
    }

    const session = readJSON(KEYS.SESSION, null);
    if (!session?.userId) return null;
    const users = readJSON(KEYS.USERS, []);
    const user = users.find((u) => u.id === session.userId);
    if (!user) return null;
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  },

  async register({ name, email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { name: cleanName } },
      });
      if (error) throw new Error(error.message);
      if (data.user) {
        await supabase.from('profiles').upsert({
          id: data.user.id,
          name: cleanName,
          avatar: 'preset:av-1',
        });
        await supabase.from('user_settings').upsert({
          user_id: data.user.id,
          theme: 'light',
          daily_reminder: true,
          reminder_time: '20:00',
        });
      }
      return {
        id: data.user.id,
        email: cleanEmail,
        name: cleanName,
        avatar: 'preset:av-1',
        createdAt: new Date().toISOString(),
      };
    }

    const users = readJSON(KEYS.USERS, []);
    if (users.some((u) => u.email === cleanEmail)) {
      throw new Error('Email sudah terdaftar. Silakan masuk atau gunakan email lain.');
    }

    const newUser = {
      id: generateId(),
      name: cleanName,
      email: cleanEmail,
      passwordHash: hashPassword(password),
      avatar: 'preset:av-1',
      createdAt: new Date().toISOString(),
    };

    writeJSON(KEYS.USERS, [...users, newUser]);
    writeJSON(KEYS.SESSION, { userId: newUser.id });

    const allSettings = readJSON(KEYS.SETTINGS, {});
    allSettings[newUser.id] = {
      theme: 'light',
      dailyReminder: true,
      reminderTime: '20:00',
    };
    writeJSON(KEYS.SETTINGS, allSettings);

    const { passwordHash: _, ...safeUser } = newUser;
    return safeUser;
  },

  async login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });
      if (error) throw new Error('Email atau kata sandi tidak sesuai.');
      return this.getCurrentUser();
    }

    const users = readJSON(KEYS.USERS, []);
    const user = users.find(
      (u) => u.email === cleanEmail && u.passwordHash === hashPassword(password)
    );
    if (!user) {
      throw new Error('Email atau kata sandi salah. Periksa kembali datamu.');
    }

    writeJSON(KEYS.SESSION, { userId: user.id });
    const { passwordHash: _, ...safeUser } = user;
    return safeUser;
  },

  async logout() {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
      return;
    }
    localStorage.removeItem(KEYS.SESSION);
  },

  async updateProfile(userId, { name, avatar }) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({ name: name.trim(), avatar })
        .eq('id', userId);
      if (error) throw new Error(error.message);
      return this.getCurrentUser();
    }

    const users = readJSON(KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Pengguna tidak ditemukan.');
    users[idx] = { ...users[idx], name: name.trim(), avatar };
    writeJSON(KEYS.USERS, users);
    const { passwordHash: _, ...safeUser } = users[idx];
    return safeUser;
  },

  async changePassword(userId, { currentPassword, newPassword }) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      return;
    }

    const users = readJSON(KEYS.USERS, []);
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Pengguna tidak ditemukan.');
    if (users[idx].passwordHash !== hashPassword(currentPassword)) {
      throw new Error('Kata sandi saat ini tidak sesuai.');
    }
    users[idx].passwordHash = hashPassword(newPassword);
    writeJSON(KEYS.USERS, users);
  },
};

export const moodService = {
  async list(userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data.map((item) => ({
        id: item.id,
        userId: item.user_id,
        mood: item.mood,
        emoji: MOOD_MAP[item.mood]?.emoji || '😊',
        intensity: item.intensity,
        note: item.note || '',
        tags: item.tags || [],
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    }

    const all = readJSON(KEYS.MOODS, []);
    return all
      .filter((m) => m.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(userId, { mood, intensity, note, tags = [] }) {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: userId,
          mood,
          intensity,
          note: note.trim(),
          tags,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        userId: data.user_id,
        mood: data.mood,
        emoji: MOOD_MAP[data.mood]?.emoji || '😊',
        intensity: data.intensity,
        note: data.note || '',
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }

    const entry = {
      id: generateId(),
      userId,
      mood,
      emoji: MOOD_MAP[mood]?.emoji || '😊',
      intensity: Number(intensity),
      note: note.trim(),
      tags,
      createdAt: now,
      updatedAt: now,
    };
    const all = readJSON(KEYS.MOODS, []);
    writeJSON(KEYS.MOODS, [entry, ...all]);
    return entry;
  },

  async update(userId, entryId, { mood, intensity, note, tags = [] }) {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('mood_entries')
        .update({ mood, intensity, note: note.trim(), tags, updated_at: now })
        .eq('id', entryId)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        userId: data.user_id,
        mood: data.mood,
        emoji: MOOD_MAP[data.mood]?.emoji || '😊',
        intensity: data.intensity,
        note: data.note || '',
        tags: data.tags || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }

    const all = readJSON(KEYS.MOODS, []);
    const idx = all.findIndex((m) => m.id === entryId && m.userId === userId);
    if (idx === -1) throw new Error('Catatan mood tidak ditemukan.');
    all[idx] = {
      ...all[idx],
      mood,
      emoji: MOOD_MAP[mood]?.emoji || '😊',
      intensity: Number(intensity),
      note: note.trim(),
      tags,
      updatedAt: now,
    };
    writeJSON(KEYS.MOODS, all);
    return all[idx];
  },

  async remove(userId, entryId) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);
      if (error) throw new Error(error.message);
      return;
    }

    const all = readJSON(KEYS.MOODS, []);
    writeJSON(
      KEYS.MOODS,
      all.filter((m) => !(m.id === entryId && m.userId === userId))
    );
  },
};

export const journalService = {
  async list(userId) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return data.map((item) => ({
        id: item.id,
        userId: item.user_id,
        title: item.title,
        content: item.content,
        moodTag: item.mood_tag || '',
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      }));
    }

    const all = readJSON(KEYS.JOURNALS, []);
    return all
      .filter((j) => j.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async create(userId, { title, content, moodTag }) {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userId,
          title: title.trim(),
          content: content.trim(),
          mood_tag: moodTag || null,
        })
        .select()
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        content: data.content,
        moodTag: data.mood_tag || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }

    const entry = {
      id: generateId(),
      userId,
      title: title.trim(),
      content: content.trim(),
      moodTag: moodTag || '',
      createdAt: now,
      updatedAt: now,
    };
    const all = readJSON(KEYS.JOURNALS, []);
    writeJSON(KEYS.JOURNALS, [entry, ...all]);
    return entry;
  },

  async update(userId, entryId, { title, content, moodTag }) {
    const now = new Date().toISOString();
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          title: title.trim(),
          content: content.trim(),
          mood_tag: moodTag || null,
          updated_at: now,
        })
        .eq('id', entryId)
        .eq('user_id', userId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return {
        id: data.id,
        userId: data.user_id,
        title: data.title,
        content: data.content,
        moodTag: data.mood_tag || '',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }

    const all = readJSON(KEYS.JOURNALS, []);
    const idx = all.findIndex((j) => j.id === entryId && j.userId === userId);
    if (idx === -1) throw new Error('Jurnal tidak ditemukan.');
    all[idx] = {
      ...all[idx],
      title: title.trim(),
      content: content.trim(),
      moodTag: moodTag || '',
      updatedAt: now,
    };
    writeJSON(KEYS.JOURNALS, all);
    return all[idx];
  },

  async remove(userId, entryId) {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', userId);
      if (error) throw new Error(error.message);
      return;
    }

    const all = readJSON(KEYS.JOURNALS, []);
    writeJSON(
      KEYS.JOURNALS,
      all.filter((j) => !(j.id === entryId && j.userId === userId))
    );
  },
};

export const settingsService = {
  async get(userId) {
    const defaults = { theme: 'light', dailyReminder: true, reminderTime: '20:00' };
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      if (!data) return defaults;
      return {
        theme: data.theme || 'light',
        dailyReminder: data.daily_reminder ?? true,
        reminderTime: data.reminder_time || '20:00',
      };
    }

    const all = readJSON(KEYS.SETTINGS, {});
    return { ...defaults, ...(all[userId] || {}) };
  },

  async update(userId, patch) {
    if (isSupabaseConfigured && supabase) {
      const current = await this.get(userId);
      const next = { ...current, ...patch };
      await supabase.from('user_settings').upsert({
        user_id: userId,
        theme: next.theme,
        daily_reminder: next.dailyReminder,
        reminder_time: next.reminderTime,
        updated_at: new Date().toISOString(),
      });
      return next;
    }

    const all = readJSON(KEYS.SETTINGS, {});
    const next = { theme: 'light', dailyReminder: true, reminderTime: '20:00', ...(all[userId] || {}), ...patch };
    all[userId] = next;
    writeJSON(KEYS.SETTINGS, all);
    return next;
  },
};
