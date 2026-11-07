import React, { useState } from 'react';
import { db } from '../services/db';
import { ActiveTab, SchoolSettings, User } from '../types';
import {
  Menu,
  X,
  LogOut,
  KeyRound,
  Sliders,
  ChevronDown,
  Sparkles,
  School,
  Briefcase
} from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  settings: SchoolSettings;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout: () => void;
  onOpenPasswordModal: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  onEnterPresentationMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  settings,
  setActiveTab,
  onLogout,
  onOpenPasswordModal,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  onEnterPresentationMode
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 border-b border-slate-800/90 backdrop-blur-md px-4 lg:px-6 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Hamburger (mobile) + Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-3">
            <div className="relative group shrink-0 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <img
                src={settings.logoUrl}
                alt="Logo SMKN 1 Warunggunung"
                className="w-10 h-10 rounded-xl object-contain p-0.5 bg-white border border-amber-400/80 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs lg:text-sm font-extrabold tracking-tight text-white uppercase flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  BURSA KERJA KHUSUS (BKK)
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  SMKN 1 WARUNGGUNUNG
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md hidden sm:block">
                {settings.namaSekolah} • Kab. Lebak, Banten
              </p>
            </div>
          </div>
        </div>

        {/* Center: Officials display (Kepala BKK & Kepala Sekolah) */}
        <div className="hidden xl:flex items-center gap-4 px-3 py-1 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-slate-400">Kepala BKK:</span>
            <span className="font-semibold text-amber-300 hover:text-amber-200 cursor-pointer" onClick={() => setActiveTab('settings')}>
              {settings.namaKepalaBkk}
            </span>
          </div>
          <div className="h-3 w-px bg-slate-800" />
          <div className="flex items-center gap-2">
            <School className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-slate-400">Kepala Sekolah:</span>
            <span className="font-semibold text-slate-200 hover:text-white cursor-pointer" onClick={() => setActiveTab('settings')}>
              {settings.namaKepalaSekolah}
            </span>
          </div>
        </div>

        {/* Right: Actions + Profile Dropdown */}
        <div className="flex items-center gap-2.5">
          {onEnterPresentationMode && (
            <button
              onClick={onEnterPresentationMode}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 rounded-lg transition shadow-sm"
              title="Mode Presentasi Layar Penuh"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Presentasi</span>
            </button>
          )}

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-slate-200 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-amber-500 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {currentUser?.username.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold leading-tight text-white">{currentUser?.username || 'VAN64'}</p>
                <p className="text-[10px] text-amber-400 leading-tight">Admin BKK</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isProfileDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-1.5 text-xs text-slate-200 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <p className="font-semibold text-white">{currentUser?.name || 'Administrator'}</p>
                  <p className="text-[11px] text-slate-400 font-mono">@{currentUser?.username || 'VAN64'}</p>
                </div>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onOpenPasswordModal();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                >
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Ubah Password</span>
                </button>

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    setActiveTab('settings');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition"
                >
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>Pengaturan BKK</span>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setIsProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
