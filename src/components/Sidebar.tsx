import React from 'react';
import { ActiveTab } from '../types';
import {
  LayoutDashboard,
  GraduationCap,
  BarChart3,
  Building2,
  Users2,
  FileSpreadsheet,
  Settings,
  Database,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  studentsCount: number;
  companiesCount: number;
  mousCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  setIsMobileOpen,
  studentsCount,
  companiesCount,
  mousCount
}) => {
  const menuItems: Array<{
    id: ActiveTab;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: number | string;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard Utama',
      description: 'Ringkasan & statistik cepat',
      icon: LayoutDashboard
    },
    {
      id: 'students',
      label: 'Data Siswa Bekerja',
      description: 'Formulir, kelola & filter',
      icon: GraduationCap,
      badge: studentsCount
    },
    {
      id: 'statistics',
      label: 'Statistik & Presentasi',
      description: 'Grafik & keterserapan',
      icon: BarChart3
    },
    {
      id: 'companies',
      label: 'Mitra Industri & MOU',
      description: 'DUDIKA & arsip kontrak',
      icon: Building2,
      badge: `${companiesCount}/${mousCount}`
    },
    {
      id: 'organization',
      label: 'Struktur Organisasi',
      description: 'Bagan & pengurus BKK',
      icon: Users2
    },
    {
      id: 'reports',
      label: 'Pusat Laporan & PDF',
      description: 'Cetak kop resmi & Excel',
      icon: FileSpreadsheet
    },
    {
      id: 'settings',
      label: 'Pengaturan Sistem',
      description: 'Logo, kepala BKK & backup',
      icon: Settings
    }
  ];

  const handleSelect = (id: ActiveTab) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/aistudio/626_908fd773.png"
              alt="Logo SMKN 1 Warunggunung"
              className="w-10 h-10 rounded-xl object-contain p-0.5 bg-white border border-amber-400/90 shadow-md shrink-0"
            />
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide leading-none">
                SMKN 1 WARUNGGUNUNG
              </h2>
              <p className="text-[10px] text-amber-400 font-semibold tracking-wider uppercase mt-1">
                Sistem Bursa Kerja Khusus
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Navigasi Utama
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-900/60 to-blue-800/30 text-white border border-blue-600/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-2 rounded-lg transition shrink-0 ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800/60 text-slate-400 group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-semibold leading-tight ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Database & Security indicator */}
        <div className="p-3.5 m-3 rounded-xl bg-slate-950/70 border border-slate-800/90 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-300 font-semibold text-[11px]">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Database Permanen
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Aktif
            </span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Data tersimpan aman di penyimpanan lokal dan dapat dibackup kapan saja.
          </p>
        </div>

        {/* User Footer */}
        <div className="p-3.5 border-t border-slate-800 flex items-center justify-between text-xs bg-slate-950/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 text-[11px]">Admin Keamanan</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">VAN64</span>
        </div>
      </aside>
    </>
  );
};
