import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  QrCode,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { User, UserRole } from '../../types';

interface LoginPageProps {
  users: User[];
  onLoginSuccess: (user: User) => void;
  onOpenPublicVerifier: () => void;
  onOpenArchitecture: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  users,
  onLoginSuccess,
  onOpenPublicVerifier,
  onOpenArchitecture,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('sarah.mansouri@univ-paris-tech.fr');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // When switching role tab, pre-select typical user email
  const handleRoleTabChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    if (role === 'STUDENT') {
      setEmail('sarah.mansouri@univ-paris-tech.fr');
    } else if (role === 'TEACHER') {
      setEmail('alexandre.chen@univ-paris-tech.fr');
    } else {
      setEmail('direction.scolarite@univ-paris-tech.fr');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!matchedUser) {
        setErrorMessage(
          "Identifiant ou email institutionnel introuvable. Veuillez vérifier vos accès."
        );
        return;
      }

      if (matchedUser.role !== selectedRole) {
        const roleLabel =
          selectedRole === 'STUDENT'
            ? 'Étudiant'
            : selectedRole === 'TEACHER'
            ? 'Professeur'
            : 'Administrateur';
        setErrorMessage(
          `Ce compte n'est pas autorisé pour l'espace ${roleLabel}. Rôle du compte : ${matchedUser.role}.`
        );
        return;
      }

      onLoginSuccess(matchedUser);
    }, 400);
  };

  const handleQuickLogin = (targetUser: User) => {
    setSelectedRole(targetUser.role);
    setEmail(targetUser.email);
    setPassword('password123');
    onLoginSuccess(targetUser);
  };

  const studentUsers = users.filter((u) => u.role === 'STUDENT');
  const teacherUsers = users.filter((u) => u.role === 'TEACHER');
  const adminUsers = users.filter((u) => u.role === 'ADMIN');

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between text-slate-100">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border-b border-indigo-950 px-4 py-2 text-xs flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2 text-blue-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-semibold uppercase tracking-wider">
            Portail Officiel d'Authentification Sécurisée
          </span>
          <span className="text-slate-400 hidden sm:inline">
            • Université des Sciences & Technologies de Paris (USTP)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPublicVerifier}
            className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 hover:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800/60 transition text-xs font-medium"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Contrôle QR Public</span>
          </button>
          <button
            onClick={onOpenArchitecture}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 bg-amber-950/60 hover:bg-amber-950 px-2.5 py-1 rounded-lg border border-amber-800/60 transition text-xs font-medium"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Architecture & SQL</span>
          </button>
        </div>
      </div>

      {/* Main Authentication Container */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-950/80 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Left Column: Brand, Institutional Heritage & Quick Accounts */}
          <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 via-blue-950 to-slate-950 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 text-white relative overflow-hidden">
            {/* Background ambient lighting */}
            <div className="absolute -top-20 -left-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              {/* Crest Logo */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/40">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-black font-serif tracking-tight text-white uppercase">
                    USTP PARIS
                  </h1>
                  <p className="text-xs text-blue-300 font-medium">
                    Université des Sciences & Technologies
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Portail Numérique Intégré v2.4</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                  Système Universitaire & Certification Anti-Fraude
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Accès différencié sécurisé (RBAC) pour les étudiants, enseignants et l'administration académique avec signature cryptographique SHA-256.
                </p>
              </div>

              {/* 1-Click Demo Profiles */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block mb-2.5">
                  Comptes de Démonstration (Accès Rapide) :
                </span>
                <div className="space-y-2 text-xs">
                  {studentUsers.slice(0, 1).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-blue-900/50 border border-slate-700/80 hover:border-blue-400/60 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.profilePhoto}
                          alt={u.firstName}
                          className="w-7 h-7 rounded-full object-cover border border-blue-400/40"
                        />
                        <div>
                          <div className="font-semibold text-white group-hover:text-blue-200">
                            {u.firstName} {u.lastName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            🎓 Étudiante L3 Info • Matricule ETU-2026-8819
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                        Se connecter →
                      </span>
                    </button>
                  ))}

                  {teacherUsers.slice(0, 1).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-indigo-900/50 border border-slate-700/80 hover:border-indigo-400/60 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.profilePhoto}
                          alt={u.firstName}
                          className="w-7 h-7 rounded-full object-cover border border-indigo-400/40"
                        />
                        <div>
                          <div className="font-semibold text-white group-hover:text-indigo-200">
                            Pr. {u.firstName} {u.lastName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            👨‍🏫 Enseignant • Architecture Web & BDD
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                        Se connecter →
                      </span>
                    </button>
                  ))}

                  {adminUsers.slice(0, 1).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u)}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-900/80 hover:bg-purple-900/50 border border-slate-700/80 hover:border-purple-400/60 transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.profilePhoto}
                          alt={u.firstName}
                          className="w-7 h-7 rounded-full object-cover border border-purple-400/40"
                        />
                        <div>
                          <div className="font-semibold text-white group-hover:text-purple-200">
                            {u.firstName} {u.lastName}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            🏛️ Direction Scolarité & Sceau Anti-Fraude
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                        Se connecter →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Footer Notice */}
            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Chiffrement certifié AES-256 & Signature QR RFC-6238</span>
            </div>
          </div>

          {/* Right Column: Role-Differentiated Login Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white text-slate-900">
            <div>
              {/* Role Selection Tabs */}
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                  Choisissez votre portail de connexion :
                </span>
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('STUDENT')}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                      selectedRole === 'STUDENT'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>Étudiant</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('TEACHER')}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                      selectedRole === 'TEACHER'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Professeur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('ADMIN')}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
                      selectedRole === 'ADMIN'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Rectorat / Admin</span>
                  </button>
                </div>
              </div>

              {/* Portal Header by Role */}
              <div className="mb-6">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      selectedRole === 'STUDENT'
                        ? 'bg-blue-600'
                        : selectedRole === 'TEACHER'
                        ? 'bg-indigo-600'
                        : 'bg-purple-600'
                    }`}
                  ></span>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedRole === 'STUDENT'
                      ? 'Connexion Espace Étudiant'
                      : selectedRole === 'TEACHER'
                      ? 'Portail Académique des Enseignants'
                      : 'Authentification Haute Sécurité Rectorat'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedRole === 'STUDENT'
                    ? 'Consultez vos notes en temps réel, téléchargez vos certificats et votre carte numérique.'
                    : selectedRole === 'TEACHER'
                    ? 'Saisissez les notes d’examens, gérez les rattrapages et publiez vos supports pédagogiques.'
                    : 'Administration des effectifs, validation des comptes et audit anti-fraude des QR Codes.'}
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {selectedRole === 'STUDENT'
                      ? 'Email Institutionnel ou Matricule Étudiant'
                      : selectedRole === 'TEACHER'
                      ? 'Identifiant Académique ou Email (@univ-paris-tech.fr)'
                      : 'Identifiant Administrateur / Rectorat'}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="prenom.nom@univ-paris-tech.fr"
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Mot de passe confidentiel
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "En environnement de démonstration, tous les comptes utilisent le mot de passe standard : password123"
                        )
                      }
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Aide mot de passe ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
                      selectedRole === 'STUDENT'
                        ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                        : selectedRole === 'TEACHER'
                        ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                        : 'bg-purple-600 hover:bg-purple-700 shadow-purple-500/20'
                    }`}
                  >
                    <span>
                      {loading
                        ? 'Vérification des accréditations...'
                        : `Ouvrir la session ${
                            selectedRole === 'STUDENT'
                              ? 'Étudiant'
                              : selectedRole === 'TEACHER'
                              ? 'Professeur'
                              : 'Administrateur'
                          }`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>

            {/* Bottom Links */}
            <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
              <span>Université Paris-Tech • Année 2025-2026</span>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={onOpenPublicVerifier}
                  className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Vérification QR Publique</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenArchitecture}
                  className="text-amber-700 hover:text-amber-900 font-semibold flex items-center gap-1"
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Schéma SQL & Fichiers</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-800">
        Système Universitaire Numérique • Certifié Anti-Falsification QR Code • Université Paris-Tech (USTP)
      </footer>
    </div>
  );
};
