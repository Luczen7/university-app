/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useUniversityStore } from './services/universityStore';
import { useAuthSession } from './store/authStore';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PublicVerifier } from './components/verify/PublicVerifier';
import { ArchitectureViewer } from './components/docs/ArchitectureViewer';
import { EmailNotificationModal } from './components/common/EmailNotificationModal';
import { Bell, Mail, X, ArrowLeft, LogIn } from 'lucide-react';
import { User } from './types';

export default function App() {
  const store = useUniversityStore();
  const auth = useAuthSession();

  // Active view inside authenticated session
  const [activeView, setActiveView] = useState<string>('DEFAULT');

  // Token for public verification
  const [verifierInitialToken, setVerifierInitialToken] = useState<string>('doc-card-sarah-8819');

  // Public unauthenticated mode ('LOGIN' | 'VERIFIER' | 'ARCHITECTURE')
  const [unauthScreen, setUnauthScreen] = useState<'LOGIN' | 'VERIFIER' | 'ARCHITECTURE'>('LOGIN');

  // Mobile sidebar drawer state
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

  // Email Notification Modal Preview
  const [emailModalData, setEmailModalData] = useState<{
    studentEmail: string;
    studentName: string;
    matiereNom: string;
    note: number;
  } | null>(null);

  // Notifications Drawer
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Check URL query parameters for ?verify=token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyToken = params.get('verify');
    if (verifyToken) {
      setVerifierInitialToken(verifyToken);
      if (auth.isAuthenticated) {
        setActiveView('PUBLIC_VERIFIER');
      } else {
        setUnauthScreen('VERIFIER');
      }
    }
  }, [auth.isAuthenticated]);

  // Set default view based on role upon login or role switch
  useEffect(() => {
    if (auth.isAuthenticated && store.currentUser) {
      if (store.currentUser.role === 'STUDENT') {
        if (!activeView.startsWith('STUDENT_') && activeView !== 'PUBLIC_VERIFIER' && activeView !== 'ARCHITECTURE') {
          setActiveView('STUDENT_CARD');
        }
      } else if (store.currentUser.role === 'TEACHER') {
        if (!activeView.startsWith('TEACHER_') && activeView !== 'PUBLIC_VERIFIER' && activeView !== 'ARCHITECTURE') {
          setActiveView('TEACHER_GRADES');
        }
      } else {
        if (!activeView.startsWith('ADMIN_') && activeView !== 'PUBLIC_VERIFIER' && activeView !== 'ARCHITECTURE') {
          setActiveView('ADMIN_AUDIT');
        }
      }
    }
  }, [auth.isAuthenticated, store.currentUser?.role, store.currentUser?.id]);

  const handleLoginSuccess = (user: User) => {
    store.switchUser(user.id);
    auth.login(user);
    if (user.role === 'STUDENT') {
      setActiveView('STUDENT_CARD');
    } else if (user.role === 'TEACHER') {
      setActiveView('TEACHER_GRADES');
    } else {
      setActiveView('ADMIN_AUDIT');
    }
    setUnauthScreen('LOGIN');
  };

  const handleLogout = () => {
    auth.logout();
    setUnauthScreen('LOGIN');
    setActiveView('DEFAULT');
    setIsSidebarMobileOpen(false);
  };

  const handleVerifyDoc = (docId: string) => {
    setVerifierInitialToken(docId);
    if (auth.isAuthenticated) {
      setActiveView('PUBLIC_VERIFIER');
    } else {
      setUnauthScreen('VERIFIER');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEmailPreview = (
    studentEmail: string,
    studentName: string,
    matiereNom: string,
    note: number
  ) => {
    setEmailModalData({
      studentEmail,
      studentName,
      matiereNom,
      note,
    });
  };

  const currentFormation =
    store.formations.find((f) => f.formationId === store.currentStudent?.formationId) ||
    store.formations[0];

  // =========================================================================
  // UNAUTHENTICATED VIEWS (Dedicated Login Page, Public Verifier, Architecture)
  // =========================================================================
  if (!auth.isAuthenticated) {
    if (unauthScreen === 'VERIFIER') {
      return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
          <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold font-serif shadow">
                USTP
              </div>
              <div>
                <h1 className="text-sm font-bold">Portail Public de Contrôle QR Code</h1>
                <p className="text-[10px] text-slate-400">Université Paris-Tech • Vérification Anti-Fraude</p>
              </div>
            </div>
            <button
              onClick={() => setUnauthScreen('LOGIN')}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow"
            >
              <LogIn className="w-4 h-4" />
              <span>Accéder à la Connexion</span>
            </button>
          </header>

          <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-4">
              <button
                onClick={() => setUnauthScreen('LOGIN')}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour à la page de connexion</span>
              </button>
            </div>
            <PublicVerifier
              initialToken={verifierInitialToken}
              documents={store.documents}
              users={store.users}
              students={store.students}
              formations={store.formations}
            />
          </main>
        </div>
      );
    }

    if (unauthScreen === 'ARCHITECTURE') {
      return (
        <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
          <header className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center font-bold font-serif shadow">
                USTP
              </div>
              <div>
                <h1 className="text-sm font-bold">Spécification Technique & Schéma SQL</h1>
                <p className="text-[10px] text-slate-400">Clean Architecture & Arborescence Fichiers</p>
              </div>
            </div>
            <button
              onClick={() => setUnauthScreen('LOGIN')}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition shadow"
            >
              <LogIn className="w-4 h-4" />
              <span>Accéder à la Connexion</span>
            </button>
          </header>

          <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            <div className="mb-4">
              <button
                onClick={() => setUnauthScreen('LOGIN')}
                className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Retour à la page de connexion</span>
              </button>
            </div>
            <ArchitectureViewer />
          </main>
        </div>
      );
    }

    // Default: Dedicated Login Page
    return (
      <LoginPage
        users={store.users}
        onLoginSuccess={handleLoginSuccess}
        onOpenPublicVerifier={() => setUnauthScreen('VERIFIER')}
        onOpenArchitecture={() => setUnauthScreen('ARCHITECTURE')}
      />
    );
  }

  // =========================================================================
  // AUTHENTICATED ROLE PORTAL (Permanent Sidebar Layout)
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex font-sans antialiased">
      {/* Permanent Left Sidebar Navigation */}
      <Sidebar
        currentUser={store.currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        onLogout={handleLogout}
        notifications={store.notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onResetData={store.resetToSeed}
        users={store.users}
        onSwitchUser={(id) => {
          store.switchUser(id);
          const u = store.users.find((userItem) => userItem.id === id);
          if (u) auth.login(u);
        }}
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
      />

      {/* Main Content Area (Offset by permanent sidebar on lg+ screens) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader
          currentUser={store.currentUser}
          activeView={activeView}
          onOpenSidebarMobile={() => setIsSidebarMobileOpen(true)}
          notifications={store.notifications}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onLogout={handleLogout}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {/* Public QR Verifier Tool */}
          {activeView === 'PUBLIC_VERIFIER' && (
            <div className="space-y-4">
              <PublicVerifier
                initialToken={verifierInitialToken}
                documents={store.documents}
                users={store.users}
                students={store.students}
                formations={store.formations}
              />
            </div>
          )}

          {/* Architecture & SQL Viewer */}
          {activeView === 'ARCHITECTURE' && (
            <div className="space-y-4">
              <ArchitectureViewer />
            </div>
          )}

          {/* ================= STUDENT VIEWS ================= */}
          {store.currentUser.role === 'STUDENT' &&
            store.currentStudent &&
            activeView !== 'PUBLIC_VERIFIER' &&
            activeView !== 'ARCHITECTURE' && (
              <StudentDashboard
                user={store.currentUser}
                student={store.currentStudent}
                formation={currentFormation}
                matieres={store.matieres}
                examens={store.examens}
                notes={store.notes}
                ressources={store.ressources}
                documents={store.documents}
                onVerifyDoc={handleVerifyDoc}
                onGenerateDoc={(type) => store.issueDocument(store.currentUser.id, type)}
                activeSubTab={
                  activeView === 'STUDENT_CERTIFICATE'
                    ? 'CERTIFICATE'
                    : activeView === 'STUDENT_TRANSCRIPT'
                    ? 'TRANSCRIPT'
                    : activeView === 'STUDENT_EXAMS'
                    ? 'EXAMS'
                    : activeView === 'STUDENT_COURSES'
                    ? 'COURSES'
                    : 'CARD'
                }
                onSubTabChange={(subTab) => {
                  if (subTab === 'CARD') setActiveView('STUDENT_CARD');
                  else if (subTab === 'CERTIFICATE') setActiveView('STUDENT_CERTIFICATE');
                  else if (subTab === 'TRANSCRIPT') setActiveView('STUDENT_TRANSCRIPT');
                  else if (subTab === 'EXAMS') setActiveView('STUDENT_EXAMS');
                  else if (subTab === 'COURSES') setActiveView('STUDENT_COURSES');
                }}
              />
            )}

          {/* ================= TEACHER VIEWS ================= */}
          {store.currentUser.role === 'TEACHER' &&
            activeView !== 'PUBLIC_VERIFIER' &&
            activeView !== 'ARCHITECTURE' && (
              <TeacherDashboard
                user={store.currentUser}
                teacher={store.currentTeacher}
                matieres={store.matieres}
                examens={store.examens}
                notes={store.notes}
                students={store.students}
                allUsers={store.users}
                ressources={store.ressources}
                onBulkSubmitGrades={store.bulkSubmitGrades}
                onCreateRetakeSession={store.createRetakeSession}
                onAddResource={store.addResource}
                onDeleteResource={store.deleteResource}
                onOpenEmailPreview={handleOpenEmailPreview}
                activeTab={
                  activeView === 'TEACHER_RETAKES'
                    ? 'RETAKES'
                    : activeView === 'TEACHER_RESOURCES'
                    ? 'RESOURCES'
                    : 'GRADES'
                }
                onTabChange={(tab) => {
                  if (tab === 'GRADES') setActiveView('TEACHER_GRADES');
                  else if (tab === 'RETAKES') setActiveView('TEACHER_RETAKES');
                  else if (tab === 'RESOURCES') setActiveView('TEACHER_RESOURCES');
                }}
              />
            )}

          {/* ================= ADMIN VIEWS ================= */}
          {store.currentUser.role === 'ADMIN' &&
            activeView !== 'PUBLIC_VERIFIER' &&
            activeView !== 'ARCHITECTURE' && (
              <AdminDashboard
                user={store.currentUser}
                users={store.users}
                students={store.students}
                teachers={store.teachers}
                formations={store.formations}
                matieres={store.matieres}
                examens={store.examens}
                notes={store.notes}
                ressources={store.ressources}
                documents={store.documents}
                systemSettings={store.systemSettings}
                auditLogs={store.auditLogs}
                onToggleRevocation={store.toggleRevocation}
                onVerifyDoc={handleVerifyDoc}
                onAddUser={store.addUser}
                onUpdateUser={store.updateUser}
                onDeleteUser={store.deleteUser}
                onToggleUserStatus={store.toggleUserStatus}
                onAddFormation={store.addFormation}
                onUpdateFormation={store.updateFormation}
                onDeleteFormation={store.deleteFormation}
                onAddMatiere={store.addMatiere}
                onUpdateMatiere={store.updateMatiere}
                onDeleteMatiere={store.deleteMatiere}
                onAddExamen={store.addExamen}
                onUpdateExamen={store.updateExamen}
                onDeleteExamen={store.deleteExamen}
                onAddNote={store.addNote}
                onUpdateNote={store.updateNote}
                onDeleteNote={store.deleteNote}
                onIssueDocument={store.issueDocument}
                onUpdateSystemSettings={store.updateSystemSettings}
                onExportDatabase={store.exportDatabaseJson}
                onResetToSeed={store.resetToSeed}
                activeTab={
                  activeView === 'ADMIN_USERS'
                    ? 'USERS'
                    : activeView === 'ADMIN_CURRICULUM'
                    ? 'CURRICULUM'
                    : activeView === 'ADMIN_EXAMS'
                    ? 'EXAMS'
                    : activeView === 'ADMIN_GRADES'
                    ? 'GRADES'
                    : activeView === 'ADMIN_SETTINGS'
                    ? 'SETTINGS'
                    : 'AUDIT_DOCS'
                }
                onTabChange={(tab) => {
                  if (tab === 'AUDIT_DOCS') setActiveView('ADMIN_AUDIT');
                  else if (tab === 'USERS') setActiveView('ADMIN_USERS');
                  else if (tab === 'CURRICULUM') setActiveView('ADMIN_CURRICULUM');
                  else if (tab === 'EXAMS') setActiveView('ADMIN_EXAMS');
                  else if (tab === 'GRADES') setActiveView('ADMIN_GRADES');
                  else if (tab === 'SETTINGS') setActiveView('ADMIN_SETTINGS');
                }}
              />
            )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 text-slate-500 py-6 px-4 sm:px-6 lg:px-8 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-slate-900 tracking-wide">USTP PARIS</span>
              <span>• Système Universitaire Numérique Officiel</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <span>Rôle actif : <strong className="text-slate-800">{store.currentUser.role}</strong></span>
              <span>•</span>
              <button
                onClick={handleLogout}
                className="text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Journal des Notifications Email</h3>
              </div>
              <button
                onClick={() => setIsNotificationsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-xs text-slate-500">
                Historique des emails asynchrones générés lors de la publication des notes par les enseignants.
              </p>

              {store.notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() =>
                    handleOpenEmailPreview(
                      notif.etudiantEmail,
                      notif.etudiantNom,
                      notif.matiereNom,
                      notif.valeurNote
                    )
                  }
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-xs cursor-pointer transition space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{notif.etudiantNom}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(notif.dateEnvoi).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Note publiée en <span className="font-semibold">{notif.matiereNom}</span> :{' '}
                    <strong className="text-indigo-600 font-mono">{notif.valeurNote.toFixed(1)}/20</strong>
                  </p>
                  <div className="text-[10px] text-indigo-600 font-medium flex items-center gap-1 pt-1">
                    <Mail className="w-3 h-3" />
                    <span>Cliquez pour inspecter le template HTML</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Email Notification Preview Modal */}
      <EmailNotificationModal
        isOpen={!!emailModalData}
        onClose={() => setEmailModalData(null)}
        emailData={emailModalData}
      />
    </div>
  );
}
