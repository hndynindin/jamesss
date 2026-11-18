import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  authService,
  moodService,
  journalService,
  settingsService,
} from '../services/dataService';
import { INITIAL_HABITS } from '../constants/wellnessExtras';
import { toLocalDateKey } from '../utils/dateUtils';

const AppContext = createContext(null);

const HABITS_KEY = 'moodspace_habits_v1';

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({
    theme: 'light',
    dailyReminder: true,
    reminderTime: '20:00',
  });
  const [moods, setMoods] = useState([]);
  const [journals, setJournals] = useState([]);
  const [habits, setHabits] = useState([]);
  const [initializing, setInitializing] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Apply dark mode
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const loadUserData = useCallback(async (activeUser) => {
    if (!activeUser) {
      setMoods([]);
      setJournals([]);
      setHabits([]);
      setSettings({ theme: 'light', dailyReminder: true, reminderTime: '20:00' });
      return;
    }
    const [userMoods, userJournals, userSettings] = await Promise.all([
      moodService.list(activeUser.id),
      journalService.list(activeUser.id),
      settingsService.get(activeUser.id),
    ]);
    setMoods(userMoods);
    setJournals(userJournals);
    setSettings(userSettings);

    // Load user habits from localStorage
    try {
      const allHabits = JSON.parse(localStorage.getItem(HABITS_KEY) || '{}');
      const userHabitList = allHabits[activeUser.id] || INITIAL_HABITS.map((h) => ({
        ...h,
        history: {},
      }));
      setHabits(userHabitList);
    } catch {
      setHabits(INITIAL_HABITS.map((h) => ({ ...h, history: {} })));
    }
  }, []);

  const saveHabits = (newHabits) => {
    setHabits(newHabits);
    if (!user) return;
    try {
      const all = JSON.parse(localStorage.getItem(HABITS_KEY) || '{}');
      all[user.id] = newHabits;
      localStorage.setItem(HABITS_KEY, JSON.stringify(all));
    } catch {
      // Ignored
    }
  };

  const toggleHabit = (habitId) => {
    const today = toLocalDateKey(new Date());
    let nextState = false;
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        const hist = { ...(h.history || {}) };
        if (hist[today]) {
          delete hist[today];
          nextState = false;
        } else {
          hist[today] = true;
          nextState = true;
        }
        return { ...h, history: hist };
      }
      return h;
    });
    saveHabits(updated);
    return nextState;
  };

  const addHabit = ({ title, icon, category }) => {
    const newEntry = {
      id: `h_${Date.now()}`,
      title,
      icon: icon || '✨',
      category: category || 'Pribadi',
      custom: true,
      history: {},
    };
    saveHabits([...habits, newEntry]);
    showToast('Kebiasaan baru ditambahkan!');
  };

  const deleteHabit = (habitId) => {
    saveHabits(habits.filter((h) => h.id !== habitId));
    showToast('Kebiasaan dihapus.');
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!mounted) return;
        setUser(currentUser);
        await loadUserData(currentUser);
      } catch {
        // Ignore init error
      } finally {
        if (mounted) setInitializing(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [loadUserData]);

  const login = async (credentials) => {
    const loggedIn = await authService.login(credentials);
    setUser(loggedIn);
    await loadUserData(loggedIn);
    showToast(`Selamat datang kembali, ${loggedIn.name}!`);
    return loggedIn;
  };

  const register = async (payload) => {
    const created = await authService.register(payload);
    setUser(created);
    await loadUserData(created);
    showToast(`Akun berhasil dibuat. Selamat datang di MoodSpace, ${created.name}!`);
    return created;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setMoods([]);
    setJournals([]);
    setHabits([]);
    setSettings({ theme: 'light', dailyReminder: true, reminderTime: '20:00' });
    showToast('Kamu telah keluar dari akun.');
  };

  const updateProfile = async (payload) => {
    const updated = await authService.updateProfile(user.id, payload);
    setUser(updated);
    showToast('Profil berhasil diperbarui.');
    return updated;
  };

  const changePassword = async (payload) => {
    await authService.changePassword(user.id, payload);
    showToast('Kata sandi berhasil diubah.');
  };

  const updateSettings = async (patch) => {
    if (!user) return;
    const next = await settingsService.update(user.id, patch);
    setSettings(next);
    if (patch.theme) {
      showToast(
        patch.theme === 'dark' ? 'Mode Gelap diaktifkan.' : 'Mode Terang diaktifkan.'
      );
    } else {
      showToast('Pengaturan disimpan.');
    }
    return next;
  };

  // Mood CRUD
  const addMood = async (payload) => {
    const entry = await moodService.create(user.id, payload);
    setMoods((prev) => [entry, ...prev]);
    showToast('Catatan suasana hati tersimpan! ✨');
    return entry;
  };

  const editMood = async (entryId, payload) => {
    const updated = await moodService.update(user.id, entryId, payload);
    setMoods((prev) => prev.map((m) => (m.id === entryId ? updated : m)));
    showToast('Catatan suasana hati diperbarui.');
    return updated;
  };

  const deleteMood = async (entryId) => {
    await moodService.remove(user.id, entryId);
    setMoods((prev) => prev.filter((m) => m.id !== entryId));
    showToast('Catatan suasana hati dihapus.');
  };

  // Journal CRUD
  const addJournal = async (payload) => {
    const entry = await journalService.create(user.id, payload);
    setJournals((prev) => [entry, ...prev]);
    showToast('Jurnal baru berhasil disimpan! 📖');
    return entry;
  };

  const editJournal = async (entryId, payload) => {
    const updated = await journalService.update(user.id, entryId, payload);
    setJournals((prev) => prev.map((j) => (j.id === entryId ? updated : j)));
    showToast('Jurnal berhasil diperbarui.');
    return updated;
  };

  const deleteJournal = async (entryId) => {
    await journalService.remove(user.id, entryId);
    setJournals((prev) => prev.filter((j) => j.id !== entryId));
    showToast('Jurnal berhasil dihapus.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        settings,
        moods,
        journals,
        habits,
        initializing,
        toast,
        setToast,
        showToast,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        updateSettings,
        addMood,
        editMood,
        deleteMood,
        addJournal,
        editJournal,
        deleteJournal,
        toggleHabit,
        addHabit,
        deleteHabit,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
