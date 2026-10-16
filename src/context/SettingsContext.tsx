import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const defaultSettings: UserSettings = {
  theme: 'system',
  speed: 'balanced',
  model: 'premium'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('agri_grade_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return defaultSettings;
  });

  // Synchronize settings with server when authenticated
  useEffect(() => {
    if (!token) return;
    fetch('/api/settings', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
          localStorage.setItem('agri_grade_settings', JSON.stringify(data.settings));
        }
      })
      .catch(() => {
        // ignore offline error
      });
  }, [token]);

  // Apply Theme to documentElement
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('agri_grade_settings', JSON.stringify(updated));

    if (token) {
      try {
        await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(updated)
        });
      } catch (err) {
        // saved locally
      }
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
