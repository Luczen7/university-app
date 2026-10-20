import React from 'react';
import {
  Menu,
  Bell,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { User, NotificationRecord } from '../../types';

interface TopHeaderProps {
  currentUser: User;
  activeView: string;
  onOpenSidebarMobile: () => void;
  notifications: NotificationRecord[];
  onOpenNotifications: () => void;
  onLogout: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  currentUser,
  activeView,
  onOpenSidebarMobile,
  notifications,
  onOpenNotifications,
  onLogout,
}) => {
  const unreadCount = notifications.filter((n) => !n.lu).length;

  const viewTitles: Record<string, { category: string; title: string }> = {
    STUDENT_CARD: {
      category: 'Espace Étudiant',
      title: "Carte d'Étudiant Numérique & NFC",
    },
    STUDENT_CERTIFICATE: {
      category: 'Espace Étudiant',
      title: 'Certificat de Scolarité Officiel',
    },
    STUDENT_TRANSCRIPT: {
      category: 'Espace Étudiant',
      title: 'Relevé de Notes & Crédits ECTS',
    },
    STUDENT_EXAMS: {
      category: 'Espace Étudiant',
      title: 'Examens, Horaires & Convocations Rattrapages',
    },
    STUDENT_COURSES: {
      category: 'Espace Étudiant',
      title: 'Espace Pédagogique & Supports de Cours',
    },
    TEACHER_GRADES: {
      category: 'Espace Enseignant',
      title: 'Grille des Notes & Publication Asynchrone',
    },
    TEACHER_RETAKES: {
      category: 'Espace Enseignant',
      title: 'Planificateur Automatique de Rattrapages',
    },
    TEACHER_RESOURCES: {
      category: 'Espace Enseignant',
      title: 'Dépôt de Supports Pédagogiques',
    },
    ADMIN_AUDIT: {
      category: 'Rectorat / Administration',
      title: "Registre d'Audit Anti-Fraude & Révocation QR",
    },
    ADMIN_USERS: {
      category: 'Rectorat / Administration',
      title: 'Annuaire Utilisateurs & Contrôle RBAC',
    },
    ADMIN_CURRICULUM: {
      category: 'Rectorat / Administration',
      title: 'Formations & Maquette ECTS',
    },
    ADMIN_EXAMS: {
      category: 'Rectorat / Administration',
      title: 'Planification & Gestion des Examens',
    },
    ADMIN_GRADES: {
      category: 'Rectorat / Administration',
      title: 'Contrôle des Notes & PV de Délibération du Jury',
    },
    ADMIN_SETTINGS: {
      category: 'Rectorat / Administration',
      title: 'Paramètres Établissement, Audit Sécurité & Sauvegarde',
    },
    PUBLIC_VERIFIER: {
      category: 'Outil Public',
      title: "Contrôle d'Authenticité QR Code en Direct",
    },
    ARCHITECTURE: {
      category: 'Spécification Technique',
      title: 'Arborescence du Projet & Schéma SQL PostgreSQL',
    },
  };

  const currentMeta = viewTitles[activeView] || {
    category: 'Tableau de bord',
    title: 'Vue Principale',
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle + Breadcrumb Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebarMobile}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Ouvrir le menu de navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
              <span className="uppercase tracking-wider">{currentMeta.category}</span>
              <span>/</span>
              <span className="text-blue-600 font-mono">USTP 2025-2026</span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {currentMeta.title}
            </h2>
          </div>
        </div>

        {/* Right: Security Status, Notification Bell, User chip */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-mono text-[11px]">Sceau Cryptographique SHA-256</span>
          </div>

          {/* Notifications Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Journal des notifications d'envoi d'emails"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Chip */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <img
              src={currentUser.profilePhoto}
              alt={currentUser.firstName}
              className="w-8 h-8 rounded-full object-cover border border-slate-300 shadow-xs"
            />
            <div className="hidden md:block text-left text-xs">
              <span className="font-bold text-slate-900 block leading-tight">
                {currentUser.firstName} {currentUser.lastName}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
