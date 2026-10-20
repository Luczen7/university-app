import React, { useState } from 'react';
import {
  Upload,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  Trash2,
  FileText,
  Mail,
  UserCheck,
  Check,
} from 'lucide-react';
import {
  User,
  TeacherProfile,
  Matiere,
  Examen,
  Note,
  CoursRessource,
  StudentProfile,
} from '../../types';

interface TeacherDashboardProps {
  user: User;
  teacher?: TeacherProfile;
  matieres: Matiere[];
  examens: Examen[];
  notes: Note[];
  students: StudentProfile[];
  allUsers: User[];
  ressources: CoursRessource[];
  onBulkSubmitGrades: (
    examenId: number,
    teacherId: string,
    grades: { etudiantId: string; valeur: number; commentaire?: string }[]
  ) => { count: number; notifications: any[] };
  onCreateRetakeSession: (
    matiereId: number,
    normalExamenId: number,
    dateExamen: string,
    salle: string,
    heure: string
  ) => { examen: Examen; failedStudents: any[] };
  onAddResource: (
    matiereId: number,
    teacherId: string,
    titre: string,
    typeFichier: 'PDF' | 'DOCX' | 'PPTX' | 'ZIP' | 'LINK',
    description?: string,
    fileSize?: string
  ) => void;
  onDeleteResource: (ressourceId: number) => void;
  onOpenEmailPreview: (etudiantEmail: string, studentName: string, matiereNom: string, note: number) => void;
  activeTab?: 'GRADES' | 'RETAKES' | 'RESOURCES';
  onTabChange?: (tab: 'GRADES' | 'RETAKES' | 'RESOURCES') => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  user,
  teacher,
  matieres,
  examens,
  notes,
  students,
  allUsers,
  ressources,
  onBulkSubmitGrades,
  onCreateRetakeSession,
  onAddResource,
  onDeleteResource,
  onOpenEmailPreview,
  activeTab: activeTabProp,
  onTabChange,
}) => {
  const [localTab, setLocalTab] = useState<'GRADES' | 'RETAKES' | 'RESOURCES'>('GRADES');
  const activeTab = activeTabProp || localTab;
  const setActiveTab = (tab: 'GRADES' | 'RETAKES' | 'RESOURCES') => {
    setLocalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Teacher subjects
  const teacherMatieres = matieres.filter((m) => m.enseignantId === user.id);
  const currentMatiere = teacherMatieres[0] || matieres[0];

  // Grade Entry State
  const [selectedExamenId, setSelectedExamenId] = useState<number>(() => {
    const defaultExam = examens.find((e) => e.matiereId === currentMatiere.matiereId);
    return defaultExam ? defaultExam.examenId : examens[0]?.examenId;
  });

  // Local draft grades for students
  const studentUsers = allUsers.filter((u) => u.role === 'STUDENT');
  const [gradeDrafts, setGradeDrafts] = useState<Record<string, { valeur: string; commentaire: string }>>(() => {
    const initial: Record<string, { valeur: string; commentaire: string }> = {};
    studentUsers.forEach((stu) => {
      const existingNote = notes.find(
        (n) => n.examenId === selectedExamenId && n.etudiantId === stu.id
      );
      initial[stu.id] = {
        valeur: existingNote ? existingNote.valeurNote.toString() : '12.0',
        commentaire: existingNote?.commentaires || '',
      };
    });
    return initial;
  });

  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Retake creation modal/state
  const [retakeMatiereId, setRetakeMatiereId] = useState<number>(currentMatiere.matiereId);
  const [retakeDate, setRetakeDate] = useState('2026-03-02');
  const [retakeSalle, setRetakeSalle] = useState('Salle 208 - Amphithéâtre Galois');
  const [retakeHeure, setRetakeHeure] = useState('14:00 - 16:30');
  const [retakeSuccess, setRetakeSuccess] = useState<string | null>(null);

  // Upload Resource form
  const [resTitle, setResTitle] = useState('');
  const [resMatiereId, setResMatiereId] = useState<number>(currentMatiere.matiereId);
  const [resType, setResType] = useState<'PDF' | 'DOCX' | 'PPTX'>('PDF');
  const [resDesc, setResDesc] = useState('');
  const [resUploadSuccess, setResUploadSuccess] = useState(false);

  // When changing exam selector in grades tab, load existing grades
  const handleExamChange = (examId: number) => {
    setSelectedExamenId(examId);
    const updatedDrafts: Record<string, { valeur: string; commentaire: string }> = {};
    studentUsers.forEach((stu) => {
      const existing = notes.find((n) => n.examenId === examId && n.etudiantId === stu.id);
      updatedDrafts[stu.id] = {
        valeur: existing ? existing.valeurNote.toString() : '10.0',
        commentaire: existing?.commentaires || '',
      };
    });
    setGradeDrafts(updatedDrafts);
  };

  const handleSaveAllGrades = () => {
    const gradeEntries = studentUsers.map((stu) => ({
      etudiantId: stu.id,
      valeur: parseFloat(gradeDrafts[stu.id]?.valeur || '0'),
      commentaire: gradeDrafts[stu.id]?.commentaire,
    }));

    const result = onBulkSubmitGrades(selectedExamenId, user.id, gradeEntries);
    const selectedExam = examens.find((e) => e.examenId === selectedExamenId);
    const matiere = matieres.find((m) => m.matiereId === selectedExam?.matiereId);

    setSaveSuccessMessage(
      `✓ Saisie validée avec succès ! ${result.count} notes enregistrées en base de données. Les notifications par email ont été envoyées aux étudiants.`
    );

    // If notifications were produced, open email preview for the first student to demonstrate
    if (result.notifications.length > 0) {
      const firstNotif = result.notifications[0];
      setTimeout(() => {
        onOpenEmailPreview(
          firstNotif.etudiantEmail,
          firstNotif.etudiantNom,
          firstNotif.matiereNom,
          firstNotif.valeurNote
        );
      }, 700);
    }

    setTimeout(() => setSaveSuccessMessage(null), 6000);
  };

  const handleCreateRetake = () => {
    const normalExam = examens.find((e) => e.matiereId === retakeMatiereId && e.session === 'NORMALE');
    if (!normalExam) return;

    const res = onCreateRetakeSession(
      retakeMatiereId,
      normalExam.examenId,
      retakeDate,
      retakeSalle,
      retakeHeure
    );

    setRetakeSuccess(
      `Session de rattrapage créée avec succès ! ${res.failedStudents.length} étudiant(s) avec note < 10/20 ont été convoqués d'office.`
    );
    setTimeout(() => setRetakeSuccess(null), 5000);
  };

  const handleResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resTitle.trim()) return;

    onAddResource(resMatiereId, user.id, resTitle, resType, resDesc, '4.2 Mo');
    setResTitle('');
    setResDesc('');
    setResUploadSuccess(true);
    setTimeout(() => setResUploadSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Teacher Profile Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-950 rounded-2xl p-6 text-white shadow-lg border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profilePhoto}
              alt={user.firstName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Pr. {user.firstName} {user.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Enseignant-Chercheur
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200 mt-1">
                {teacher?.grade || 'Professeur des Universités'} • {teacher?.specialite}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {teacher?.bureau || 'Bâtiment Alan Turing'} • Tél : {teacher?.telephone || '+33 1 40 77 88 00'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Matières Assignées
              </span>
              <span className="font-bold text-indigo-300 text-sm">
                {teacherMatieres.length} modules en charge
              </span>
            </div>
          </div>
        </div>

        {/* Active Module Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-3 border-t border-indigo-800/40 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-indigo-300 font-medium">Outil actif :</span>
            <span className="bg-white/10 text-white font-bold px-3 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
              {activeTab === 'GRADES' && <BookOpen className="w-3.5 h-3.5 text-indigo-300" />}
              {activeTab === 'RETAKES' && <Calendar className="w-3.5 h-3.5 text-amber-300" />}
              {activeTab === 'RESOURCES' && <Upload className="w-3.5 h-3.5 text-blue-300" />}
              <span>
                {activeTab === 'GRADES'
                  ? 'Grille de Saisie des Notes & Publication Asynchrone'
                  : activeTab === 'RETAKES'
                  ? 'Planificateur Automatique de Rattrapages'
                  : 'Dépôt de Supports Pédagogiques (PDF / Slides)'}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-indigo-200">
            <span>Département Informatique & Systèmes</span>
            <span>•</span>
            <span className="text-emerald-300 font-semibold">Droits de Notation Actifs</span>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: GRADES ENTRY MATRIX ================= */}
      {activeTab === 'GRADES' && (
        <div className="space-y-6">
          {/* Success Banner */}
          {saveSuccessMessage && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl text-emerald-900 shadow-sm flex items-start justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>{saveSuccessMessage}</span>
              </div>
            </div>
          )}

          {/* Exam Selector Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Grille d'Évaluation Académique & Publication
              </h2>
              <p className="text-xs text-slate-500">
                Saisie groupée des notes avec calcul instantané et envoi de notifications asynchrones par email aux étudiants.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-600 font-semibold">Sélectionner l'examen :</span>
                <select
                  aria-label="Sélectionner l'examen pour la saisie des notes"
                  value={selectedExamenId}
                  onChange={(e) => handleExamChange(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500"
                >
                  {examens.map((ex) => {
                    const mat = matieres.find((m) => m.matiereId === ex.matiereId);
                    return (
                      <option key={ex.examenId} value={ex.examenId}>
                        {mat?.nomMatiere} - Session {ex.session} ({ex.salle})
                      </option>
                    );
                  })}
                </select>
              </div>

              <button
                onClick={handleSaveAllGrades}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md transition"
              >
                <Send className="w-4 h-4" />
                <span>Valider & Publier les Notes</span>
              </button>
            </div>
          </div>

          {/* Students Grading Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Photo</th>
                    <th className="py-3 px-4">Étudiant(e)</th>
                    <th className="py-3 px-4">Matricule</th>
                    <th className="py-3 px-4 w-32">Note / 20</th>
                    <th className="py-3 px-4">Statut Validation</th>
                    <th className="py-3 px-4">Commentaire Pédagogique</th>
                    <th className="py-3 px-4 text-center">Notification Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentUsers.map((stu) => {
                    const studentProfile = students.find((s) => s.id === stu.id);
                    const draft = gradeDrafts[stu.id] || { valeur: '12.0', commentaire: '' };
                    const numVal = parseFloat(draft.valeur);
                    const isPassing = !isNaN(numVal) && numVal >= 10;
                    const selectedExam = examens.find((e) => e.examenId === selectedExamenId);
                    const matiere = matieres.find((m) => m.matiereId === selectedExam?.matiereId);

                    return (
                      <tr key={stu.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <img
                            src={stu.profilePhoto}
                            alt={stu.firstName}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          />
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {stu.lastName.toUpperCase()} {stu.firstName}
                          <span className="block text-[10px] text-slate-400 font-normal">{stu.email}</span>
                        </td>
                        <td className="py-3 px-4 font-mono text-blue-700 font-bold">
                          {studentProfile?.matricule}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              max="20"
                              step="0.5"
                              value={draft.valeur}
                              onChange={(e) =>
                                setGradeDrafts({
                                  ...gradeDrafts,
                                  [stu.id]: { ...draft, valeur: e.target.value },
                                })
                              }
                              className="w-20 px-2 py-1.5 border border-slate-300 rounded-lg text-sm font-bold font-mono text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <span className="text-slate-500 text-xs font-semibold">/ 20</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {isPassing ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                              <Check className="w-3 h-3 text-emerald-600" /> Admis (UE Validée)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-rose-200">
                              <AlertTriangle className="w-3 h-3 text-rose-600" /> Ajourné (Rattrapage)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            placeholder="Observation pour l'étudiant..."
                            value={draft.commentaire}
                            onChange={(e) =>
                              setGradeDrafts({
                                ...gradeDrafts,
                                [stu.id]: { ...draft, commentaire: e.target.value },
                              })
                            }
                            className="w-full px-2 py-1 text-xs border border-slate-200 rounded-lg text-slate-700 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() =>
                              onOpenEmailPreview(
                                stu.email,
                                `${stu.firstName} ${stu.lastName}`,
                                matiere?.nomMatiere || 'Architecture Logicielle',
                                numVal || 12
                              )
                            }
                            className="p-1.5 text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition inline-flex items-center gap-1"
                            title="Prévisualiser l'email HTML qui sera envoyé à cet étudiant"
                          >
                            <Mail className="w-4 h-4" />
                            <span className="text-[10px] font-medium hidden sm:inline">Voir email</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: AUTOMATIC RETAKES ================= */}
      {activeTab === 'RETAKES' && (
        <div className="space-y-6">
          {retakeSuccess && (
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-xl text-emerald-900 shadow-sm flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{retakeSuccess}</span>
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Planificateur Automatique de Session de Rattrapage
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Le système analyse automatiquement les notes &lt; 10/20 lors de la session normale et génère une convocation officielle avec salle et horaire.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matière concernée :
                </label>
                <select
                  value={retakeMatiereId}
                  onChange={(e) => setRetakeMatiereId(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                >
                  {teacherMatieres.map((m) => (
                    <option key={m.matiereId} value={m.matiereId}>
                      {m.nomMatiere} ({m.codeMatiere})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date de l'épreuve de rattrapage :
                </label>
                <input
                  type="date"
                  value={retakeDate}
                  onChange={(e) => setRetakeDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Salle d'examen attribuée :
                </label>
                <input
                  type="text"
                  value={retakeSalle}
                  onChange={(e) => setRetakeSalle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Créneau horaire :
                </label>
                <input
                  type="text"
                  value={retakeHeure}
                  onChange={(e) => setRetakeHeure(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-medium text-slate-800"
                />
              </div>
            </div>

            <button
              onClick={handleCreateRetake}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
            >
              <Calendar className="w-4 h-4" />
              <span>Générer la Session de Rattrapage & Convoquer les Étudiants</span>
            </button>
          </div>

          {/* Active Retake Exams List */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Sessions de Rattrapage Programmées pour l'UFR
            </h3>
            <div className="divide-y divide-slate-100">
              {examens
                .filter((e) => e.session === 'RATTRAPAGE')
                .map((ex) => {
                  const matiere = matieres.find((m) => m.matiereId === ex.matiereId);
                  return (
                    <div key={ex.examenId} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 text-xs">
                          {matiere?.nomMatiere}
                        </span>
                        <p className="text-[11px] text-slate-500">
                          {ex.salle} • {new Date(ex.dateExamen).toLocaleDateString('fr-FR')} à {ex.heure}
                        </p>
                      </div>
                      <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-full border border-amber-300">
                        Rattrapage Actif
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: COURSE RESOURCES ================= */}
      {activeTab === 'RESOURCES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Uploader Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-indigo-600" />
              Publier une Ressource
            </h2>
            <p className="text-xs text-slate-500">
              Mise à disposition immédiate pour tous les étudiants inscrits à ce module.
            </p>

            {resUploadSuccess && (
              <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-lg border border-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Support de cours publié avec succès !</span>
              </div>
            )}

            <form onSubmit={handleResourceSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Matière :
                </label>
                <select
                  value={resMatiereId}
                  onChange={(e) => setResMatiereId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-medium"
                >
                  {teacherMatieres.map((m) => (
                    <option key={m.matiereId} value={m.matiereId}>
                      {m.nomMatiere}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Titre du support :
                </label>
                <input
                  type="text"
                  placeholder="ex: TD 03 - Indexation & Jointures Hash"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Format de fichier :
                </label>
                <select
                  value={resType}
                  onChange={(e) => setResType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                >
                  <option value="PDF">Document PDF (.pdf)</option>
                  <option value="DOCX">Document Word (.docx)</option>
                  <option value="PPTX">Présentation Diaporama (.pptx)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description / Consignes :
                </label>
                <textarea
                  rows={3}
                  placeholder="Objectifs pédagogiques, rappels pour l'examen..."
                  value={resDesc}
                  onChange={(e) => setResDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow transition"
              >
                Mettre en Ligne le Document
              </button>
            </form>
          </div>

          {/* Teacher's Uploaded Resources */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              Mes Documents Pédagogiques Actifs ({ressources.length})
            </h3>

            <div className="space-y-3">
              {ressources.map((res) => {
                const matiere = matieres.find((m) => m.matiereId === res.matiereId);

                return (
                  <div
                    key={res.ressourceId}
                    className="p-4 rounded-xl border border-slate-200 flex items-start justify-between bg-slate-50/50 hover:bg-slate-50 transition"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          {matiere?.nomMatiere}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {res.typeFichier} • {res.tailleFichier}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {res.titre}
                      </h4>
                      {res.description && (
                        <p className="text-xs text-slate-600">{res.description}</p>
                      )}
                    </div>

                    <button
                      onClick={() => onDeleteResource(res.ressourceId)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Supprimer ce support"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
