import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Bell,
  LogOut,
  QrCode,
  FileCode,
  CreditCard,
  FileCheck,
  FileSpreadsheet,
  Calendar,
  Upload,
  Users,
  Layers,
  ChevronDown,
  RefreshCw,
} from 'lucide-react';
import { User, NotificationRecord, UserRole } from '../../types';

interface AppNavbarProps {
  currentUser: User;
  onLogout: () => void;
  activeView: string;
  setActiveView: (view: string) => void;
  notifications: NotificationRecord[];
  onOpenNotifications: () => void;
  onResetData: () => void;
  users: User[];
  onSwitchUser: (userId: string) => void;
}

export const AppNavbar: React.FC<AppNavbarProps> = ({
  currentUser,
  onLogout,
  activeView,
  setActiveView,
  notifications,
  onOpenNotifications,
  onResetData,
  users,
  onSwitchUser,
}) => {
  const unreadCount = notifications.filter((n) => !n.lu).length;

  const roleTheme = {
    STUDENT: {
      badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      label: 'Espace Étudiant',
      icon: UserCheck,
      color: 'blue',
      activeTab: 'bg-blue-600 text-white shadow-sm',
    },
    TEACHER: {
      badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      label: 'Espace Enseignant',
      icon: BookOpen,
      color: 'indigo',
      activeTab: 'bg-indigo-600 text-white shadow-sm',
    },
    ADMIN: {
      badge: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      label: 'Rectorat / Administration',
      icon: ShieldCheck,
      color: 'purple',
      activeTab: 'bg-purple-600 text-white shadow-sm',
    },
  }[currentUser.role];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-lg">
      {/* Upper Status Line */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-4 py-1.5 text-xs flex justify-between items-center border-b border-slate-800/80">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold text-white tracking-wide uppercase">
            USTP PARIS
          </span>
          <span className="hidden sm:inline text-slate-400">
            • Système Universitaire Numérique & Certification QR
          </span>
          <span className="text-slate-500 hidden md:inline">
            | Année Académique 2025-2026
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetData}
            title="Réinitialiser les données de test"
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded text-[11px] transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Données</span>
          </button>
          <div className="flex items-center gap-1 text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40 text-[11px] font-mono">
            <ShieldCheck className="w-3 h-3" />
            <span>SHA-256 Sceau Actif</span>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Portal title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md border border-blue-400/30">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-lg tracking-tight text-white">
                  UniPortal
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${roleTheme.badge}`}
                >
                  {roleTheme.label}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Université des Sciences & Technologies de Paris
              </p>
            </div>
          </div>

          {/* Quick Access Tools */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveView('PUBLIC_VERIFIER')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeView === 'PUBLIC_VERIFIER'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/60'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Contrôle QR Public</span>
            </button>
            <button
              onClick={() => setActiveView('ARCHITECTURE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                activeView === 'ARCHITECTURE'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-amber-400 hover:bg-amber-950/40 border border-amber-900/60'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Architecture & SQL</span>
            </button>
          </div>

          {/* Right User Controls & Logout */}
          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="Journal des notifications email"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Card & Persona Quick Switcher */}
            <div className="flex items-center gap-2 bg-slate-800/90 pl-2 pr-3 py-1.5 rounded-xl border border-slate-700">
              <img
                src={currentUser.profilePhoto}
                alt={currentUser.firstName}
                className="w-8 h-8 rounded-full object-cover border border-slate-600 shadow-xs"
              />
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-white leading-tight">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {currentUser.role === 'STUDENT'
                    ? 'Étudiant(e)'
                    : currentUser.role === 'TEACHER'
                    ? 'Professeur'
                    : 'Administrateur'}
                </div>
              </div>

              {/* Quick Persona Switcher for reviewer convenience */}
              <select
                aria-label="Changer de compte démonstration"
                value={currentUser.id}
                onChange={(e) => {
                  const target = users.find((u) => u.id === e.target.value);
                  if (target) {
                    onSwitchUser(target.id);
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
                <optgroup label="Professeurs">
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

            {/* Logout Button */}
            <button
              data-testid="header-logout-btn"
              onClick={onLogout}
              className="flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition shadow-xs cursor-pointer"
              title="Se déconnecter et retourner à la page de connexion"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role-Specific Secondary Navigation Bar (Extremely intuitive tabs) */}
      <div className="bg-slate-950/80 border-t border-slate-800 px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2 scrollbar-none">
          {/* Tabs for Student */}
          {currentUser.role === 'STUDENT' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveView('STUDENT_CARD')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'STUDENT_CARD'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Ma Carte d'Étudiant (3D/QR)</span>
              </button>
              <button
                onClick={() => setActiveView('STUDENT_CERTIFICATE')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'STUDENT_CERTIFICATE'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" />
                <span>Certificat de Scolarité</span>
              </button>
              <button
                onClick={() => setActiveView('STUDENT_TRANSCRIPT')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'STUDENT_TRANSCRIPT'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Relevé de Notes & ECTS</span>
              </button>
              <button
                onClick={() => setActiveView('STUDENT_EXAMS')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'STUDENT_EXAMS'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Examens & Rattrapages</span>
              </button>
              <button
                onClick={() => setActiveView('STUDENT_COURSES')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'STUDENT_COURSES'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Supports de Cours</span>
              </button>
            </div>
          )}

          {/* Tabs for Teacher */}
          {currentUser.role === 'TEACHER' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveView('TEACHER_GRADES')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'TEACHER_GRADES'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Grille des Notes & Publication</span>
              </button>
              <button
                onClick={() => setActiveView('TEACHER_RETAKES')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'TEACHER_RETAKES'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Automatisation des Rattrapages</span>
              </button>
              <button
                onClick={() => setActiveView('TEACHER_RESOURCES')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'TEACHER_RESOURCES'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Dépôt de Supports Pédagogiques</span>
              </button>
            </div>
          )}

          {/* Tabs for Admin */}
          {currentUser.role === 'ADMIN' && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveView('ADMIN_AUDIT')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'ADMIN_AUDIT'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Registre Anti-Fraude & QR Codes</span>
              </button>
              <button
                onClick={() => setActiveView('ADMIN_USERS')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'ADMIN_USERS'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Annuaire & Inscriptions (RBAC)</span>
              </button>
              <button
                onClick={() => setActiveView('ADMIN_CURRICULUM')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  activeView === 'ADMIN_CURRICULUM'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Formations & Maquette ECTS</span>
              </button>
            </div>
          )}

          {/* Mobile Tools shortcut */}
          <div className="flex md:hidden items-center gap-2 pl-4 border-l border-slate-800">
            <button
              onClick={() => setActiveView('PUBLIC_VERIFIER')}
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium ${
                activeView === 'PUBLIC_VERIFIER'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-400'
              }`}
            >
              🔍 Vérif QR
            </button>
            <button
              onClick={() => setActiveView('ARCHITECTURE')}
              className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap font-medium ${
                activeView === 'ARCHITECTURE'
                  ? 'bg-amber-600 text-white'
                  : 'text-amber-400'
              }`}
            >
              💻 Code & SQL
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
