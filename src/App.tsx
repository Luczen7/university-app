/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useUniversityStore } from './services/universityStore';
import { Header } from './components/common/Header';
import { StudentDashboard } from './components/student/StudentDashboard';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PublicVerifier } from './components/verify/PublicVerifier';
import { ArchitectureViewer } from './components/docs/ArchitectureViewer';
import { EmailNotificationModal } from './components/common/EmailNotificationModal';
import { Bell, Mail, CheckCircle2, X } from 'lucide-react';

export default function App() {
  const store = useUniversityStore();

  const [activeTab, setActiveTab] = useState<
    'STUDENT' | 'TEACHER' | 'ADMIN' | 'VERIFIER' | 'ARCHITECTURE'
  >('STUDENT');

  const [verifierInitialToken, setVerifierInitialToken] = useState<string>('doc-card-sarah-8819');

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
      setActiveTab('VERIFIER');
    }
  }, []);

  const handleVerifyDoc = (docId: string) => {
    setVerifierInitialToken(docId);
    setActiveTab('VERIFIER');
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

  return (
    <div className="min-h-screen bg-slate-100/80 text-slate-900 flex flex-col font-sans antialiased">
      {/* Top Header & Navigation */}
      <Header
        currentUser={store.currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        users={store.users}
        onSwitchUser={store.switchUser}
        notifications={store.notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onResetData={store.resetToSeed}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'STUDENT' && store.currentStudent && (
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
          />
        )}

        {activeTab === 'TEACHER' && (
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
          />
        )}

        {activeTab === 'ADMIN' && (
          <AdminDashboard
            user={store.currentUser}
            users={store.users}
            students={store.students}
            teachers={store.teachers}
            formations={store.formations}
            matieres={store.matieres}
            documents={store.documents}
            notes={store.notes}
            onToggleRevocation={store.toggleRevocation}
            onVerifyDoc={handleVerifyDoc}
          />
        )}

        {activeTab === 'VERIFIER' && (
          <PublicVerifier
            initialToken={verifierInitialToken}
            documents={store.documents}
            users={store.users}
            students={store.students}
            formations={store.formations}
          />
        )}

        {activeTab === 'ARCHITECTURE' && <ArchitectureViewer />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 mt-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-white tracking-wide">USTP PARIS</span>
            <span>• Système de Gestion Universitaire & Anti-Fraude QR</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Clean Architecture (Node.js / React)</span>
            <span>PostgreSQL MLD</span>
            <span>SHA-256 Empreinte</span>
          </div>
        </div>
      </footer>

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
