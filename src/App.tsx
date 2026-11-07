import React, { useState, useEffect, useCallback } from 'react';
import { db } from './services/db';
import { ActiveTab, User, Student, Company, MouDocument, BkkMember, YearlyStatistic, Department, SchoolSettings } from './types';
import { LoginView } from './components/LoginView';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentInputView } from './components/StudentInputView';
import { StatisticsView } from './components/StatisticsView';
import { IndustryMouView } from './components/IndustryMouView';
import { OrganizationView } from './components/OrganizationView';
import { ReportsCenterView } from './components/ReportsCenterView';
import { SettingsView } from './components/SettingsView';
import { ToastContainer, ToastMessage } from './components/Toast';
import { KeyRound, X } from 'lucide-react';
import { hashPassword, verifyPassword } from './utils/crypto';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => db.getCurrentUser());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFullscreenPresentation, setIsFullscreenPresentation] = useState(false);

  // Quick action from dashboard
  const [initialStudentModalOpen, setInitialStudentModalOpen] = useState(false);

  // Quick Change Password Modal from Navbar
  const [isQuickPasswordModalOpen, setIsQuickPasswordModalOpen] = useState(false);
  const [quickOldPass, setQuickOldPass] = useState('');
  const [quickNewPass, setQuickNewPass] = useState('');
  const [quickConfirmPass, setQuickConfirmPass] = useState('');
  const [quickPassError, setQuickPassError] = useState<string | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Database reactive state
  const [students, setStudents] = useState<Student[]>(() => db.getStudents());
  const [companies, setCompanies] = useState<Company[]>(() => db.getCompanies());
  const [mous, setMous] = useState<MouDocument[]>(() => db.getMous());
  const [members, setMembers] = useState<BkkMember[]>(() => db.getMembers());
  const [yearlyStats, setYearlyStats] = useState<YearlyStatistic[]>(() => db.getYearlyStatistics());
  const [departments, setDepartments] = useState<Department[]>(() => db.getDepartments());
  const [settings, setSettings] = useState<SchoolSettings>(() => db.getSettings());

  const refreshAllData = useCallback(() => {
    setStudents(db.getStudents());
    setCompanies(db.getCompanies());
    setMous(db.getMous());
    setMembers(db.getMembers());
    setYearlyStats(db.getYearlyStatistics());
    setDepartments(db.getDepartments());
    setSettings(db.getSettings());
    setCurrentUser(db.getCurrentUser());
  }, []);

  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      refreshAllData();
    });
    return () => unsubscribe();
  }, [refreshAllData]);

  // Handle Logout
  const handleLogout = () => {
    db.clearSession();
    setCurrentUser(null);
    showToast('info', 'Berhasil Logout', 'Sesi administrator telah berakhir.');
  };

  // Handle Quick Password Change
  const handleQuickPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickPassError(null);

    if (!currentUser) return;

    if (!quickOldPass) {
      setQuickPassError('Masukkan password lama.');
      return;
    }
    if (quickNewPass.length < 6) {
      setQuickPassError('Password baru minimal 6 karakter.');
      return;
    }
    if (quickNewPass !== quickConfirmPass) {
      setQuickPassError('Konfirmasi password tidak cocok.');
      return;
    }

    const isValid = await verifyPassword(quickOldPass, currentUser.passwordHash);
    const isInitial = (quickOldPass === 'VANJAZZ64');

    if (!isValid && !isInitial) {
      setQuickPassError('Password lama tidak cocok.');
      return;
    }

    const newHash = await hashPassword(quickNewPass);
    db.updateUserPassword(currentUser.id, newHash);
    db.setSession({
      ...currentUser,
      passwordHash: newHash
    });

    setIsQuickPasswordModalOpen(false);
    setQuickOldPass('');
    setQuickNewPass('');
    setQuickConfirmPass('');
    showToast('success', 'Password Diperbarui', 'Password akun VAN64 berhasil diubah.');
  };

  // If user is not logged in, show Login view
  if (!currentUser) {
    return (
      <>
        <LoginView
          onLoginSuccess={() => {
            const user = db.getCurrentUser();
            setCurrentUser(user);
            showToast('success', 'Selamat Datang', `Login berhasil sebagai ${user?.name || 'Administrator BKK'}.`);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        settings={settings}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        onOpenPasswordModal={() => setIsQuickPasswordModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onEnterPresentationMode={() => {
          setActiveTab('statistics');
          setIsFullscreenPresentation(true);
        }}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'students') {
              setInitialStudentModalOpen(false);
            }
          }}
          isMobileOpen={isMobileMenuOpen}
          setIsMobileOpen={setIsMobileMenuOpen}
          studentsCount={students.length}
          companiesCount={companies.length}
          mousCount={mous.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:ml-72 p-4 lg:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              companies={companies}
              mous={mous}
              members={members}
              yearlyStats={yearlyStats}
              settings={settings}
              setActiveTab={setActiveTab}
              onOpenAddStudentModal={() => {
                setActiveTab('students');
                setInitialStudentModalOpen(true);
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentInputView
              students={students}
              departments={departments}
              settings={settings}
              onRefreshData={refreshAllData}
              showToast={showToast}
              initialAddModalOpen={initialStudentModalOpen}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsView
              students={students}
              yearlyStats={yearlyStats}
              departments={departments}
              settings={settings}
              showToast={showToast}
              isFullscreenPresentation={isFullscreenPresentation}
              onTogglePresentationMode={() => setIsFullscreenPresentation(!isFullscreenPresentation)}
            />
          )}

          {activeTab === 'companies' && (
            <IndustryMouView
              companies={companies}
              mous={mous}
              settings={settings}
              onRefreshData={refreshAllData}
              showToast={showToast}
            />
          )}

          {activeTab === 'organization' && (
            <OrganizationView
              members={members}
              settings={settings}
              onRefreshData={refreshAllData}
              showToast={showToast}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsCenterView
              students={students}
              companies={companies}
              mous={mous}
              members={members}
              yearlyStats={yearlyStats}
              departments={departments}
              settings={settings}
              showToast={showToast}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              settings={settings}
              departments={departments}
              currentUser={currentUser}
              onRefreshData={refreshAllData}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Quick Password Modal from Navbar */}
      {isQuickPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Ubah Password Administrator</h3>
              </div>
              <button
                onClick={() => setIsQuickPasswordModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {quickPassError && (
              <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                {quickPassError}
              </div>
            )}

            <form onSubmit={handleQuickPasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Password Saat Ini</label>
                <input
                  type="password"
                  required
                  value={quickOldPass}
                  onChange={(e) => setQuickOldPass(e.target.value)}
                  placeholder="Ketik password saat ini (VANJAZZ64)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Password Baru (min 6 karakter)</label>
                <input
                  type="password"
                  required
                  value={quickNewPass}
                  onChange={(e) => setQuickNewPass(e.target.value)}
                  placeholder="Password baru yang aman"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Konfirmasi Password Baru</label>
                <input
                  type="password"
                  required
                  value={quickConfirmPass}
                  onChange={(e) => setQuickConfirmPass(e.target.value)}
                  placeholder="Ulangi password baru"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQuickPasswordModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Simpan Password Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toasts */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
