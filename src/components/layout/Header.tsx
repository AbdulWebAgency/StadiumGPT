import React from 'react';
import type { UserPreferences, UserMemory } from '../../types';
import { ShieldAlert, LogOut, Settings, Award } from 'lucide-react';
import { logoutUser } from '../../services/firebase';

interface HeaderProps {
  user: UserPreferences;
  memory: UserMemory;
  onLogout: () => void;
  onTriggerSOS: () => void;
  onToggleContextPanel: () => void;
  onChangeLanguage: (lang: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  memory,
  onLogout,
  onTriggerSOS,
  onToggleContextPanel,
  onChangeLanguage,
}) => {
  const handleLogout = async () => {
    await logoutUser();
    onLogout();
  };

  return (
    <header 
      className="w-full bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md"
      role="banner"
    >
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-fifa-green flex items-center justify-center rounded-xl shadow-inner">
          <Award className="w-6 h-6 text-fifa-gold" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight font-fifa text-white flex items-center gap-1">
            Stadium<span className="text-fifa-gold">GPT</span>
          </h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            FIFA 2026 Companion
          </p>
        </div>
      </div>

      {/* Middle & Right Controls */}
      <div className="flex items-center gap-3">
        {/* Language Switcher Dropdown */}
        <div className="relative">
          <select
            value={memory.language}
            onChange={(e) => onChangeLanguage(e.target.value)}
            className="bg-slate-800 text-xs font-bold text-slate-300 border border-slate-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-fifa-green"
            aria-label="Change Language"
          >
            <option value="en">English (EN)</option>
            <option value="es">Español (ES)</option>
            <option value="pt">Português (PT)</option>
            <option value="fr">Français (FR)</option>
            <option value="ar">العربية (AR)</option>
          </select>
        </div>

        {/* Adjust Profile Preferences */}
        <button
          onClick={onToggleContextPanel}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors focus:ring-2 focus:ring-fifa-green outline-none"
          title={`Preferences (${user.displayName || 'Guest'})`}
          aria-label="View current AI memory profile"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>

        {/* Exit/Logout */}
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors focus:ring-2 focus:ring-slate-500 outline-none"
          title="Sign out or leave"
          aria-label="Sign out of profile"
        >
          <LogOut className="w-4.5 h-4.5" />
        </button>

        {/* PERMANENT SOS RED BUTTON */}
        <button
          onClick={onTriggerSOS}
          className="bg-fifa-red hover:bg-fifa-red-light text-white font-extrabold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-transform hover:scale-105 shadow-md shadow-fifa-red/30 animate-pulse focus:ring-4 focus:ring-fifa-red/50 outline-none"
          aria-label="SOS Emergency Assistance"
        >
          <ShieldAlert className="w-4.5 h-4.5 text-white" />
          <span>SOS</span>
        </button>
      </div>
    </header>
  );
};
