import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  UserCheck,
  QrCode,
  FileCode,
  Bell,
  RefreshCw,
  LogOut,
} from 'lucide-react';
import { User, NotificationRecord } from '../../types';

interface HeaderProps {
  currentUser: User;
  activeTab: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'VERIFIER' | 'ARCHITECTURE';
  setActiveTab: (tab: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'VERIFIER' | 'ARCHITECTURE') => void;
  users: User[];
  onSwitchUser: (userId: string) => void;
  notifications: NotificationRecord[];
  onOpenNotifications: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  users,
  onSwitchUser,
  notifications,
  onOpenNotifications,
  onResetData,
}) => {
  const unreadCount = notifications.filter((n) => !n.lu).length;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-4 py-2 text-xs flex justify-between items-center border-b border-indigo-950/60">
        <div className="flex items-center gap-2 text-blue-200">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold tracking-wide uppercase">Portail Numérique Universitaire Officiel</span>
          <span className="hidden sm:inline text-blue-400/80">| Université des Sciences & Technologies de Paris (USTP)</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onResetData}
            title="Réinitialiser la base de données de test"
            className="flex items-center gap-1 text-slate-300 hover:text-white hover:bg-slate-800/80 px-2 py-0.5 rounded transition text-xs"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset DB</span>
          </button>
          <div className="flex items-center gap-1 text-emerald-300 font-mono text-[11px] bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Sécurité SHA-256 + QR Anti-Fraude Actifs</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(currentUser.role)}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg tracking-tight text-white font-serif">USTP</span>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-400/30 font-medium">
                  UniPortal v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Système Universitaire Intégré & Certification
              </p>
            </div>
          </div>

          {/* Navigation Tabs (RBAC + Tools) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => {
                setActiveTab('STUDENT');
                if (currentUser.role !== 'STUDENT') {
                  const defaultStudent = users.find((u) => u.role === 'STUDENT');
                  if (defaultStudent) onSwitchUser(defaultStudent.id);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'STUDENT'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Espace Étudiant</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('TEACHER');
                if (currentUser.role !== 'TEACHER') {
                  const defaultTeacher = users.find((u) => u.role === 'TEACHER');
                  if (defaultTeacher) onSwitchUser(defaultTeacher.id);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'TEACHER'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Espace Professeur</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('ADMIN');
                if (currentUser.role !== 'ADMIN') {
                  const defaultAdmin = users.find((u) => u.role === 'ADMIN');
                  if (defaultAdmin) onSwitchUser(defaultAdmin.id);
                }
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ADMIN'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Administration</span>
            </button>
            <button
              onClick={() => setActiveTab('VERIFIER')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'VERIFIER'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Vérification QR Publique</span>
            </button>
            <button
              onClick={() => setActiveTab('ARCHITECTURE')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ARCHITECTURE'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-amber-950/40'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Architecture & SQL</span>
            </button>
          </nav>

          {/* User Persona Switcher & Notifications */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Voir les notifications d'envoi d'emails"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Quick Switch Dropdown */}
            <div className="flex items-center gap-2 bg-slate-800/90 pl-2 pr-3 py-1.5 rounded-xl border border-slate-700">
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.firstName}
                className="w-7 h-7 rounded-full object-cover border border-slate-600"
              />
              <div className="text-left hidden md:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      currentUser.role === 'STUDENT'
                        ? 'bg-blue-400'
                        : currentUser.role === 'TEACHER'
                        ? 'bg-indigo-400'
                        : 'bg-purple-400'
                    }`}
                  ></span>
                  {currentUser.role === 'STUDENT'
                    ? 'Étudiant(e)'
                    : currentUser.role === 'TEACHER'
                    ? 'Professeur'
                    : 'Administrateur'}
                </div>
              </div>

              {/* Selector */}
              <select
                aria-label="Changer d'utilisateur ou rôle de test"
                value={currentUser.id}
                onChange={(e) => {
                  const targetUser = users.find((u) => u.id === e.target.value);
                  if (targetUser) {
                    onSwitchUser(targetUser.id);
                    setActiveTab(targetUser.role);
                  }
                }}
                className="bg-slate-900 text-slate-200 text-xs rounded border border-slate-700 py-1 px-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <optgroup label="Étudiants">
                  {users
                    .filter((u) => u.role === 'STUDENT')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        🎓 {u.firstName} {u.lastName}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Enseignants">
                  {users
                    .filter((u) => u.role === 'TEACHER')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        👨‍🏫 {u.firstName} {u.lastName}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Administration">
                  {users
                    .filter((u) => u.role === 'ADMIN')
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        🏛️ {u.firstName} {u.lastName}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-2 border-t border-slate-800 scrollbar-none">
          <button
            onClick={() => {
              setActiveTab('STUDENT');
              if (currentUser.role !== 'STUDENT') {
                const defaultStudent = users.find((u) => u.role === 'STUDENT');
                if (defaultStudent) onSwitchUser(defaultStudent.id);
              }
            }}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${
              activeTab === 'STUDENT' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🎓 Étudiant
          </button>
          <button
            onClick={() => {
              setActiveTab('TEACHER');
              if (currentUser.role !== 'TEACHER') {
                const defaultTeacher = users.find((u) => u.role === 'TEACHER');
                if (defaultTeacher) onSwitchUser(defaultTeacher.id);
              }
            }}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${
              activeTab === 'TEACHER' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            👨‍🏫 Professeur
          </button>
          <button
            onClick={() => {
              setActiveTab('ADMIN');
              if (currentUser.role !== 'ADMIN') {
                const defaultAdmin = users.find((u) => u.role === 'ADMIN');
                if (defaultAdmin) onSwitchUser(defaultAdmin.id);
              }
            }}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${
              activeTab === 'ADMIN' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            🏛️ Administration
          </button>
          <button
            onClick={() => setActiveTab('VERIFIER')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${
              activeTab === 'VERIFIER' ? 'bg-emerald-600 text-white' : 'text-emerald-400 hover:text-white'
            }`}
          >
            🔍 Vérif QR
          </button>
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`px-3 py-1 rounded-md text-xs whitespace-nowrap ${
              activeTab === 'ARCHITECTURE' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:text-white'
            }`}
          >
            💻 Architecture & SQL
          </button>
        </div>
      </div>
    </header>
  );
};
