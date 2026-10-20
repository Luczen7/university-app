import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  CreditCard,
  FileCheck,
  FileSpreadsheet,
  Calendar,
  BookOpen,
  Upload,
  Users,
  Layers,
  QrCode,
  FileCode,
  LogOut,
  Bell,
  RefreshCw,
  X,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Settings,
  Award,
} from 'lucide-react';
import { User, NotificationRecord } from '../../types';

interface SidebarProps {
  currentUser: User;
  activeView: string;
  setActiveView: (view: string) => void;
  onLogout: () => void;
  notifications: NotificationRecord[];
  onOpenNotifications: () => void;
  onResetData: () => void;
  users: User[];
  onSwitchUser: (userId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeView,
  setActiveView,
  onLogout,
  notifications,
  onOpenNotifications,
  onResetData,
  users,
  onSwitchUser,
  isOpenMobile,
  onCloseMobile,
}) => {
  const unreadCount = notifications.filter((n) => !n.lu).length;

  const roleConfig = {
    STUDENT: {
      label: 'Espace Étudiant',
      color: 'blue',
      badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      activeClass: 'bg-blue-600 text-white shadow-md shadow-blue-500/20',
      hoverClass: 'hover:bg-slate-800 text-slate-300 hover:text-white',
    },
    TEACHER: {
      label: 'Espace Enseignant',
      color: 'indigo',
      badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      activeClass: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20',
      hoverClass: 'hover:bg-slate-800 text-slate-300 hover:text-white',
    },
    ADMIN: {
      label: 'Administration Rectorat',
      color: 'purple',
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      activeClass: 'bg-purple-600 text-white shadow-md shadow-purple-500/20',
      hoverClass: 'hover:bg-slate-800 text-slate-300 hover:text-white',
    },
  }[currentUser.role];

  const handleNavClick = (view: string) => {
    setActiveView(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Brand & User Identity */}
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/40">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif font-black text-lg tracking-tight text-white uppercase">
                    USTP PARIS
                  </h1>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded border border-blue-400/30">
                    v2.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  Portail Universitaire Officiel
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card in Sidebar */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-3 mb-2.5">
              <div className="relative">
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.firstName}
                  className="w-10 h-10 rounded-xl object-cover border border-slate-700 shadow"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border mt-0.5 ${roleConfig.badgeClass}`}
                >
                  {roleConfig.label}
                </span>
              </div>
            </div>

            {/* Persona Switcher Selector for evaluation/demo */}
            <div className="mt-2 pt-2 border-t border-slate-800/80">
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Profil de test actif :
              </label>
              <select
                aria-label="Changer de profil actif"
                value={currentUser.id}
                onChange={(e) => onSwitchUser(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-lg py-1.5 px-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          </div>

          {/* Navigation Menu Links (Role-Specific) */}
          <div className="p-3 overflow-y-auto max-h-[calc(100vh-320px)] space-y-6 scrollbar-none">
            {/* Student Menu */}
            {currentUser.role === 'STUDENT' && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Espace Scolarité
                </span>
                <button
                  onClick={() => handleNavClick('STUDENT_CARD')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'STUDENT_CARD'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <span>Carte d'Étudiant (3D/NFC)</span>
                  </div>
                  {activeView === 'STUDENT_CARD' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('STUDENT_CERTIFICATE')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'STUDENT_CERTIFICATE'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <span>Certificat de Scolarité</span>
                  </div>
                  {activeView === 'STUDENT_CERTIFICATE' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('STUDENT_TRANSCRIPT')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'STUDENT_TRANSCRIPT'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                    <span>Relevé de Notes & ECTS</span>
                  </div>
                  {activeView === 'STUDENT_TRANSCRIPT' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('STUDENT_EXAMS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'STUDENT_EXAMS'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Examens & Rattrapages</span>
                  </div>
                  {activeView === 'STUDENT_EXAMS' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('STUDENT_COURSES')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'STUDENT_COURSES'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Supports de Cours</span>
                  </div>
                  {activeView === 'STUDENT_COURSES' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Teacher Menu */}
            {currentUser.role === 'TEACHER' && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Gestion Académique
                </span>
                <button
                  onClick={() => handleNavClick('TEACHER_GRADES')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'TEACHER_GRADES'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>Grille des Notes & Validation</span>
                  </div>
                  {activeView === 'TEACHER_GRADES' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('TEACHER_RETAKES')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'TEACHER_RETAKES'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Sessions de Rattrapage</span>
                  </div>
                  {activeView === 'TEACHER_RETAKES' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('TEACHER_RESOURCES')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'TEACHER_RESOURCES'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Upload className="w-4 h-4 text-blue-400" />
                    <span>Dépôt Pédagogique (Upload)</span>
                  </div>
                  {activeView === 'TEACHER_RESOURCES' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Admin Menu */}
            {currentUser.role === 'ADMIN' && (
              <div className="space-y-1">
                <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Contrôle & Administration
                </span>
                <button
                  onClick={() => handleNavClick('ADMIN_AUDIT')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'ADMIN_AUDIT'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Registre Anti-Fraude & QR</span>
                  </div>
                  {activeView === 'ADMIN_AUDIT' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('ADMIN_USERS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'ADMIN_USERS'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span>Annuaire Utilisateurs (RBAC)</span>
                  </div>
                  {activeView === 'ADMIN_USERS' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('ADMIN_CURRICULUM')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'ADMIN_CURRICULUM'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Formations & Maquette ECTS</span>
                  </div>
                  {activeView === 'ADMIN_CURRICULUM' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('ADMIN_EXAMS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'ADMIN_EXAMS'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>Gestion des Examens</span>
                  </div>
                  {activeView === 'ADMIN_EXAMS' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('ADMIN_GRADES')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'ADMIN_GRADES'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-rose-400" />
                    <span>Délibérations & Notes</span>
                  </div>
                  {activeView === 'ADMIN_GRADES' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleNavClick('ADMIN_SETTINGS')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    activeView === 'ADMIN_SETTINGS'
                      ? roleConfig.activeClass
                      : roleConfig.hoverClass
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Settings className="w-4 h-4 text-sky-400" />
                    <span>Paramètres & Logs Sécurité</span>
                  </div>
                  {activeView === 'ADMIN_SETTINGS' && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Tools Section for All Authenticated Users */}
            <div className="space-y-1 pt-2 border-t border-slate-800">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Outils & Sécurité
              </span>
              <button
                onClick={() => handleNavClick('PUBLIC_VERIFIER')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeView === 'PUBLIC_VERIFIER'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-400 hover:bg-slate-800 hover:text-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <QrCode className="w-4 h-4" />
                  <span>Contrôle QR Public</span>
                </div>
                {activeView === 'PUBLIC_VERIFIER' && <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleNavClick('ARCHITECTURE')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  activeView === 'ARCHITECTURE'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-amber-400 hover:bg-slate-800 hover:text-amber-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileCode className="w-4 h-4" />
                  <span>Architecture & SQL</span>
                </div>
                {activeView === 'ARCHITECTURE' && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Notifications, Reset & Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2">
          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-300 transition"
          >
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Journal Notifications</span>
            </div>
            {unreadCount > 0 && (
              <span className="bg-rose-500 text-white font-bold text-[10px] px-2 py-0.2 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Reset DB Button */}
          <button
            onClick={onResetData}
            title="Réinitialiser la base de données de test"
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 text-[11px] transition"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Réinitialiser Données Démo</span>
            </div>
            <span className="font-mono text-[9px] text-slate-500">Seed</span>
          </button>

          {/* Logout Button */}
          <button
            data-testid="sidebar-logout-btn"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-600/90 hover:bg-rose-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition shadow-md shadow-rose-900/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};
