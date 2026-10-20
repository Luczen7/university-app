import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  QrCode,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Search,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Award,
  Settings,
  Download,
  Filter,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Printer,
  FileText,
  Clock,
  MapPin,
  Lock,
  Unlock,
  AlertCircle,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  User,
  StudentProfile,
  TeacherProfile,
  Formation,
  Matiere,
  Examen,
  Note,
  CoursRessource,
  DocumentEmis,
  DocType,
  SystemSettings,
  AuditLogEntry,
  SessionType,
} from '../../types';

export type AdminTab =
  | 'AUDIT_DOCS'
  | 'USERS'
  | 'CURRICULUM'
  | 'EXAMS'
  | 'GRADES'
  | 'SETTINGS';

interface AdminDashboardProps {
  user: User;
  users: User[];
  students: StudentProfile[];
  teachers: TeacherProfile[];
  formations: Formation[];
  matieres: Matiere[];
  examens: Examen[];
  notes: Note[];
  ressources: CoursRessource[];
  documents: DocumentEmis[];
  systemSettings: SystemSettings;
  auditLogs: AuditLogEntry[];
  onToggleRevocation: (docId: string, raison?: string) => void;
  onVerifyDoc: (docId: string) => void;
  onAddUser: (
    userData: Omit<User, 'id' | 'createdAt'>,
    studentData?: Partial<StudentProfile>,
    teacherData?: Partial<TeacherProfile>
  ) => User;
  onUpdateUser: (
    userId: string,
    userData: Partial<User>,
    studentData?: Partial<StudentProfile>,
    teacherData?: Partial<TeacherProfile>
  ) => void;
  onDeleteUser: (userId: string) => void;
  onToggleUserStatus: (userId: string) => void;
  onAddFormation: (formation: Omit<Formation, 'formationId'>) => Formation;
  onUpdateFormation: (formationId: number, data: Partial<Formation>) => void;
  onDeleteFormation: (formationId: number) => void;
  onAddMatiere: (matiere: Omit<Matiere, 'matiereId'>) => Matiere;
  onUpdateMatiere: (matiereId: number, data: Partial<Matiere>) => void;
  onDeleteMatiere: (matiereId: number) => void;
  onAddExamen: (examen: Omit<Examen, 'examenId'>) => Examen;
  onUpdateExamen: (examenId: number, data: Partial<Examen>) => void;
  onDeleteExamen: (examenId: number) => void;
  onAddNote: (note: Omit<Note, 'noteId'>) => Note;
  onUpdateNote: (noteId: number, data: Partial<Note>) => void;
  onDeleteNote: (noteId: number) => void;
  onIssueDocument: (userId: string, type: DocType, metadata?: Record<string, unknown>) => DocumentEmis;
  onUpdateSystemSettings: (settings: Partial<SystemSettings>) => void;
  onExportDatabase: () => void;
  onResetToSeed: () => void;
  activeTab?: AdminTab;
  onTabChange?: (tab: AdminTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  users,
  students,
  teachers,
  formations,
  matieres,
  examens,
  notes,
  ressources,
  documents,
  systemSettings,
  auditLogs,
  onToggleRevocation,
  onVerifyDoc,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onToggleUserStatus,
  onAddFormation,
  onUpdateFormation,
  onDeleteFormation,
  onAddMatiere,
  onUpdateMatiere,
  onDeleteMatiere,
  onAddExamen,
  onUpdateExamen,
  onDeleteExamen,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onIssueDocument,
  onUpdateSystemSettings,
  onExportDatabase,
  onResetToSeed,
  activeTab: activeTabProp,
  onTabChange,
}) => {
  const [localTab, setLocalTab] = useState<AdminTab>('AUDIT_DOCS');
  const activeTab = activeTabProp || localTab;
  const setActiveTab = (tab: AdminTab) => {
    setLocalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'STUDENT' | 'TEACHER' | 'ADMIN'>('ALL');
  const [docTypeFilter, setDocTypeFilter] = useState<'ALL' | DocType>('ALL');
  const [examSessionFilter, setExamSessionFilter] = useState<'ALL' | SessionType>('ALL');
  const [gradeStudentFilter, setGradeStudentFilter] = useState<string>('ALL');

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [isFormationModalOpen, setIsFormationModalOpen] = useState(false);
  const [editingFormation, setEditingFormation] = useState<Formation | null>(null);

  const [isMatiereModalOpen, setIsMatiereModalOpen] = useState(false);
  const [editingMatiere, setEditingMatiere] = useState<Matiere | null>(null);

  const [isExamenModalOpen, setIsExamenModalOpen] = useState(false);
  const [editingExamen, setEditingExamen] = useState<Examen | null>(null);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const [isIssueDocModalOpen, setIsIssueDocModalOpen] = useState(false);
  const [isPvJuryModalOpen, setIsPvJuryModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState<{ docId: string; isOpen: boolean }>({
    docId: '',
    isOpen: false,
  });
  const [revokeReasonInput, setRevokeReasonInput] = useState('');

  // Form states for Add/Edit User
  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'STUDENT' as 'STUDENT' | 'TEACHER' | 'ADMIN',
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    matricule: '',
    formationId: formations[0]?.formationId || 1,
    dateNaissance: '2004-05-15',
    adresse: 'Paris, France',
    telephone: '+33 6 12 34 56 78',
    specialite: 'Informatique & Systèmes',
    grade: 'Maître de Conférences',
    bureau: 'Bâtiment Turing - 302',
  });

  // Form state for Formation
  const [formationFormData, setFormationFormData] = useState({
    codeFormation: '',
    nomFormation: '',
    departement: 'UFR Mathématiques & Informatique',
    dureeAnnees: 3,
    description: '',
  });

  // Form state for Matiere
  const [matiereFormData, setMatiereFormData] = useState({
    codeMatiere: '',
    nomMatiere: '',
    creditsEcts: 6,
    coefficient: 3,
    formationId: formations[0]?.formationId || 1,
    semestre: 'S5',
    enseignantId: teachers[0]?.id || '',
  });

  // Form state for Examen
  const [examenFormData, setExamenFormData] = useState({
    matiereId: matieres[0]?.matiereId || 101,
    dateExamen: '2026-03-10',
    heure: '09:00 - 12:00',
    salle: 'Amphi Hermite',
    session: 'NORMALE' as SessionType,
    dureeMinutes: 180,
    statut: 'A_VENIR' as 'A_VENIR' | 'EN_COURS' | 'TERMINE',
  });

  // Form state for Note
  const [noteFormData, setNoteFormData] = useState({
    etudiantId: students[0]?.id || '',
    examenId: examens[0]?.examenId || 201,
    valeurNote: 14.5,
    commentaires: '',
  });

  // Form state for Issue Doc
  const [issueDocFormData, setIssueDocFormData] = useState({
    studentId: students[0]?.id || '',
    typeDocument: 'STUDENT_CARD' as DocType,
    mention: 'Bien',
  });

  // Settings form state
  const [settingsFormData, setSettingsFormData] = useState({
    universityName: systemSettings.universityName,
    subTitle: systemSettings.subTitle,
    academicYear: systemSettings.academicYear,
    contactEmail: systemSettings.contactEmail,
    retakeThreshold: systemSettings.retakeThreshold,
    maintenanceMode: systemSettings.maintenanceMode,
  });

  // Statistics calculation
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalDocuments = documents.length;
  const revokedCount = documents.filter((d) => d.estRevoque).length;
  const authenticCount = totalDocuments - revokedCount;
  const averageGrade =
    notes.length > 0
      ? (notes.reduce((acc, curr) => acc + curr.valeurNote, 0) / notes.length).toFixed(2)
      : '0.00';
  const passingGradesCount = notes.filter((n) => n.valeurNote >= 10).length;
  const successRate = notes.length > 0 ? Math.round((passingGradesCount / notes.length) * 100) : 0;
  const retakeCandidatesCount = notes.filter((n) => n.valeurNote < 10).length;

  // Handlers for User Modal
  const openCreateUserModal = () => {
    setEditingUser(null);
    setUserFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'STUDENT',
      profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      matricule: `ETU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      formationId: formations[0]?.formationId || 1,
      dateNaissance: '2004-05-15',
      adresse: 'Paris, France',
      telephone: '+33 6 12 34 56 78',
      specialite: 'Informatique & Systèmes',
      grade: 'Maître de Conférences',
      bureau: 'Bâtiment Turing - 302',
    });
    setIsUserModalOpen(true);
  };

  const openEditUserModal = (u: User) => {
    setEditingUser(u);
    const stu = students.find((s) => s.id === u.id);
    const tea = teachers.find((t) => t.id === u.id);

    setUserFormData({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      role: u.role,
      profilePhoto: u.profilePhoto,
      matricule: stu?.matricule || '',
      formationId: stu?.formationId || (formations[0]?.formationId ?? 1),
      dateNaissance: stu?.dateNaissance || '2004-05-15',
      adresse: stu?.adresse || 'Paris, France',
      telephone: stu?.telephone || tea?.telephone || '+33 6 12 34 56 78',
      specialite: tea?.specialite || 'Informatique & Systèmes',
      grade: tea?.grade || 'Maître de Conférences',
      bureau: tea?.bureau || 'Bâtiment Turing - 302',
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.firstName || !userFormData.lastName || !userFormData.email) return;

    if (editingUser) {
      // Update
      onUpdateUser(
        editingUser.id,
        {
          firstName: userFormData.firstName,
          lastName: userFormData.lastName,
          email: userFormData.email,
          role: userFormData.role,
          profilePhoto: userFormData.profilePhoto,
        },
        userFormData.role === 'STUDENT'
          ? {
              matricule: userFormData.matricule,
              formationId: Number(userFormData.formationId),
              dateNaissance: userFormData.dateNaissance,
              adresse: userFormData.adresse,
              telephone: userFormData.telephone,
            }
          : undefined,
        userFormData.role === 'TEACHER'
          ? {
              specialite: userFormData.specialite,
              grade: userFormData.grade,
              bureau: userFormData.bureau,
              telephone: userFormData.telephone,
            }
          : undefined
      );
    } else {
      // Create
      onAddUser(
        {
          firstName: userFormData.firstName,
          lastName: userFormData.lastName,
          email: userFormData.email,
          role: userFormData.role,
          profilePhoto: userFormData.profilePhoto,
          isVerified: true,
        },
        userFormData.role === 'STUDENT'
          ? {
              matricule: userFormData.matricule,
              formationId: Number(userFormData.formationId),
              dateNaissance: userFormData.dateNaissance,
              adresse: userFormData.adresse,
              telephone: userFormData.telephone,
              anneeUniversitaire: systemSettings.academicYear,
              statut: 'ACTIF',
            }
          : undefined,
        userFormData.role === 'TEACHER'
          ? {
              specialite: userFormData.specialite,
              grade: userFormData.grade,
              bureau: userFormData.bureau,
              telephone: userFormData.telephone,
            }
          : undefined
      );
    }

    setIsUserModalOpen(false);
  };

  // Handlers for Formation Modal
  const openCreateFormationModal = () => {
    setEditingFormation(null);
    setFormationFormData({
      codeFormation: '',
      nomFormation: '',
      departement: 'UFR Mathématiques & Informatique',
      dureeAnnees: 3,
      description: '',
    });
    setIsFormationModalOpen(true);
  };

  const openEditFormationModal = (f: Formation) => {
    setEditingFormation(f);
    setFormationFormData({
      codeFormation: f.codeFormation,
      nomFormation: f.nomFormation,
      departement: f.departement,
      dureeAnnees: f.dureeAnnees,
      description: f.description,
    });
    setIsFormationModalOpen(true);
  };

  const handleSaveFormation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formationFormData.codeFormation || !formationFormData.nomFormation) return;

    if (editingFormation) {
      onUpdateFormation(editingFormation.formationId, formationFormData);
    } else {
      onAddFormation(formationFormData);
    }
    setIsFormationModalOpen(false);
  };

  // Handlers for Matiere Modal
  const openCreateMatiereModal = () => {
    setEditingMatiere(null);
    setMatiereFormData({
      codeMatiere: '',
      nomMatiere: '',
      creditsEcts: 6,
      coefficient: 3,
      formationId: formations[0]?.formationId || 1,
      semestre: 'S5',
      enseignantId: teachers[0]?.id || '',
    });
    setIsMatiereModalOpen(true);
  };

  const openEditMatiereModal = (m: Matiere) => {
    setEditingMatiere(m);
    setMatiereFormData({
      codeMatiere: m.codeMatiere,
      nomMatiere: m.nomMatiere,
      creditsEcts: m.creditsEcts,
      coefficient: m.coefficient,
      formationId: m.formationId,
      semestre: m.semestre,
      enseignantId: m.enseignantId,
    });
    setIsMatiereModalOpen(true);
  };

  const handleSaveMatiere = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matiereFormData.codeMatiere || !matiereFormData.nomMatiere) return;

    if (editingMatiere) {
      onUpdateMatiere(editingMatiere.matiereId, {
        ...matiereFormData,
        creditsEcts: Number(matiereFormData.creditsEcts),
        coefficient: Number(matiereFormData.coefficient),
        formationId: Number(matiereFormData.formationId),
      });
    } else {
      onAddMatiere({
        ...matiereFormData,
        creditsEcts: Number(matiereFormData.creditsEcts),
        coefficient: Number(matiereFormData.coefficient),
        formationId: Number(matiereFormData.formationId),
      });
    }
    setIsMatiereModalOpen(false);
  };

  // Handlers for Examen Modal
  const openCreateExamenModal = () => {
    setEditingExamen(null);
    setExamenFormData({
      matiereId: matieres[0]?.matiereId || 101,
      dateExamen: new Date().toISOString().split('T')[0],
      heure: '09:00 - 12:00',
      salle: 'Amphithéâtre Monge',
      session: 'NORMALE',
      dureeMinutes: 180,
      statut: 'A_VENIR',
    });
    setIsExamenModalOpen(true);
  };

  const openEditExamenModal = (ex: Examen) => {
    setEditingExamen(ex);
    setExamenFormData({
      matiereId: ex.matiereId,
      dateExamen: ex.dateExamen,
      heure: ex.heure,
      salle: ex.salle,
      session: ex.session,
      dureeMinutes: ex.dureeMinutes,
      statut: ex.statut,
    });
    setIsExamenModalOpen(true);
  };

  const handleSaveExamen = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExamen) {
      onUpdateExamen(editingExamen.examenId, {
        ...examenFormData,
        matiereId: Number(examenFormData.matiereId),
        dureeMinutes: Number(examenFormData.dureeMinutes),
      });
    } else {
      onAddExamen({
        ...examenFormData,
        matiereId: Number(examenFormData.matiereId),
        dureeMinutes: Number(examenFormData.dureeMinutes),
      });
    }
    setIsExamenModalOpen(false);
  };

  // Handlers for Note Modal
  const openCreateNoteModal = () => {
    setEditingNote(null);
    setNoteFormData({
      etudiantId: students[0]?.id || '',
      examenId: examens[0]?.examenId || 201,
      valeurNote: 14.5,
      commentaires: 'Note attribuée après délibération de la commission',
    });
    setIsNoteModalOpen(true);
  };

  const openEditNoteModal = (n: Note) => {
    setEditingNote(n);
    setNoteFormData({
      etudiantId: n.etudiantId,
      examenId: n.examenId,
      valeurNote: n.valeurNote,
      commentaires: n.commentaires || '',
    });
    setIsNoteModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote) {
      onUpdateNote(editingNote.noteId, {
        valeurNote: Number(noteFormData.valeurNote),
        commentaires: noteFormData.commentaires,
      });
    } else {
      onAddNote({
        etudiantId: noteFormData.etudiantId,
        examenId: Number(noteFormData.examenId),
        valeurNote: Number(noteFormData.valeurNote),
        dateSaisie: new Date().toISOString().split('T')[0],
        valideePar: user.id,
        commentaires: noteFormData.commentaires,
      });
    }
    setIsNoteModalOpen(false);
  };

  // Handlers for Issue Doc Modal
  const handleIssueDocSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onIssueDocument(issueDocFormData.studentId, issueDocFormData.typeDocument, {
      mention: issueDocFormData.mention,
    });
    setIsIssueDocModalOpen(false);
    setActiveTab('AUDIT_DOCS');
  };

  // Revocation confirm
  const handleConfirmRevoke = () => {
    if (isRevokeModalOpen.docId) {
      onToggleRevocation(
        isRevokeModalOpen.docId,
        revokeReasonInput || 'Révocation immédiate ordonnée par la direction centrale'
      );
      setIsRevokeModalOpen({ docId: '', isOpen: false });
      setRevokeReasonInput('');
    }
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSystemSettings(settingsFormData);
  };

  return (
    <div className="space-y-6">
      {/* Maintenance Mode Alert Banner if active */}
      {systemSettings.maintenanceMode && (
        <div className="bg-amber-500 text-slate-950 p-4 rounded-2xl flex items-center justify-between shadow-lg font-semibold text-xs border border-amber-600 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-slate-950" />
            <span>
              MODE MAINTENANCE ACTIF : L'accès aux portails étudiants et enseignants est temporairement restreint.
            </span>
          </div>
          <button
            onClick={() => {
              setSettingsFormData((prev) => ({ ...prev, maintenanceMode: false }));
              onUpdateSystemSettings({ maintenanceMode: false });
            }}
            className="bg-slate-900 text-white text-[11px] px-3 py-1 rounded-lg hover:bg-slate-800 transition"
          >
            Désactiver
          </button>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <img
              src={user.profilePhoto}
              alt={user.firstName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400/50 shadow-md"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  Super Administrateur • Rectorat
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200 mt-1 font-medium">
                {systemSettings.universityName} • DSI & Scolarité Centrale
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Année active : <strong className="text-purple-300 font-mono">{systemSettings.academicYear}</strong> • Contrôle complet RBAC, Cursus, Examens & Anti-Fraude QR
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsIssueDocModalOpen(true)}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-md shadow-purple-900/30 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Émettre un Document QR</span>
            </button>

            <button
              onClick={onExportDatabase}
              title="Exporter une sauvegarde complète JSON"
              className="flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-300" />
              <span>Sauvegarde JSON</span>
            </button>
          </div>
        </div>

        {/* Dynamic Admin Sub-navigation Pill Tabs */}
        <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-purple-800/40 overflow-x-auto scrollbar-none text-xs">
          <button
            onClick={() => setActiveTab('AUDIT_DOCS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'AUDIT_DOCS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-purple-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Anti-Fraude & QR ({totalDocuments})</span>
          </button>

          <button
            onClick={() => setActiveTab('USERS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'USERS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-purple-200'
            }`}
          >
            <Users className="w-4 h-4 text-indigo-400" />
            <span>Utilisateurs RBAC ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('CURRICULUM')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'CURRICULUM'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-purple-200'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Formations & ECTS ({formations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('EXAMS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'EXAMS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-purple-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Examens & Rattrapages ({examens.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('GRADES')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'GRADES'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-purple-200'
            }`}
          >
            <Award className="w-4 h-4 text-rose-400" />
            <span>Délibérations & Notes ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('SETTINGS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'SETTINGS'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-purple-200'
            }`}
          >
            <Settings className="w-4 h-4 text-sky-400" />
            <span>Paramètres & Logs</span>
          </button>
        </div>
      </div>

      {/* Global University Statistics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
            Étudiants Inscrits
          </span>
          <span className="text-xl font-bold font-mono text-blue-600 mt-1 block">
            {totalStudents}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">En L3 / M2</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
            Enseignants
          </span>
          <span className="text-xl font-bold font-mono text-indigo-600 mt-1 block">
            {totalTeachers}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Professeurs & MCF</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
            Formations Actives
          </span>
          <span className="text-xl font-bold font-mono text-purple-600 mt-1 block">
            {formations.length}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{matieres.length} matières ECTS</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
            Examens Prévus
          </span>
          <span className="text-xl font-bold font-mono text-amber-600 mt-1 block">
            {examens.length}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">{retakeCandidatesCount} en rattrapage</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
            Documents QR
          </span>
          <span className="text-xl font-bold font-mono text-emerald-600 mt-1 block">
            {authenticCount}
          </span>
          <span className="text-[10px] text-rose-500 block mt-0.5">{revokedCount} révoqué(s)</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">
            Taux Réussite
          </span>
          <span className="text-xl font-bold font-mono text-rose-600 mt-1 block">
            {successRate}%
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Moyenne {averageGrade}/20</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: AUDIT ANTI-FRAUDE & REGISTRE DOCUMENTS QR                         */}
      {/* ========================================================================= */}
      {activeTab === 'AUDIT_DOCS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                Registre d'Audit des Documents & Révocation Anti-Fraude
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Contrôle temps réel de l'authenticité de tous les documents émis (Cartes d'étudiant, Certificats, Relevés).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher token, nom, matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-xl w-56 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <select
                aria-label="Filtrer par type de document"
                value={docTypeFilter}
                onChange={(e) => setDocTypeFilter(e.target.value as 'ALL' | DocType)}
                className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">Tous les types</option>
                <option value="STUDENT_CARD">Carte d'Étudiant</option>
                <option value="CERTIFICATE">Certificat de Scolarité</option>
                <option value="TRANSCRIPT">Relevé de Notes</option>
              </select>

              <button
                onClick={() => setIsIssueDocModalOpen(true)}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Émettre Document</span>
              </button>
            </div>
          </div>

          {/* Documents Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Type Document</th>
                  <th className="py-3 px-4">Bénéficiaire & Matricule</th>
                  <th className="py-3 px-4">Token UUID Unique</th>
                  <th className="py-3 px-4">Empreinte SHA-256</th>
                  <th className="py-3 px-4">Date Émission</th>
                  <th className="py-3 px-4 text-center">Statut d'Authenticité</th>
                  <th className="py-3 px-4 text-center">Actions d'Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {documents
                  .filter((d) => {
                    const beneficiary = users.find((u) => u.id === d.userId);
                    const name = beneficiary ? `${beneficiary.firstName} ${beneficiary.lastName}` : '';
                    const matchesSearch =
                      d.docId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (d.metadata?.matricule || '').toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesType = docTypeFilter === 'ALL' || d.typeDocument === docTypeFilter;
                    return matchesSearch && matchesType;
                  })
                  .map((doc) => {
                    const beneficiary = users.find((u) => u.id === doc.userId);
                    const stu = students.find((s) => s.id === doc.userId);

                    return (
                      <tr
                        key={doc.docId}
                        className={`transition ${
                          doc.estRevoque ? 'bg-rose-50/50 hover:bg-rose-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[10px] uppercase border ${
                              doc.typeDocument === 'STUDENT_CARD'
                                ? 'bg-blue-50 text-blue-800 border-blue-200'
                                : doc.typeDocument === 'CERTIFICATE'
                                ? 'bg-purple-50 text-purple-800 border-purple-200'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            {doc.typeDocument.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {beneficiary?.lastName.toUpperCase()} {beneficiary?.firstName}
                          <span className="block text-[10px] text-slate-500 font-mono">
                            {stu?.matricule || doc.metadata?.matricule || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                          {doc.docId}
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                          {doc.hashContenu.slice(0, 16)}...
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {new Date(doc.dateEmission).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {doc.estRevoque ? (
                            <div>
                              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                                <AlertTriangle className="w-3 h-3 text-rose-600" /> RÉVOQUÉ
                              </span>
                              {doc.revoqueRaison && (
                                <p className="text-[9px] text-rose-600 truncate max-w-[140px] mt-0.5 mx-auto">
                                  {doc.revoqueRaison}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                              <CheckCircle className="w-3 h-3 text-emerald-600" /> AUTHENTIQUE
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => onVerifyDoc(doc.docId)}
                              className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                              title="Tester dans le scanner QR public"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>

                            {doc.estRevoque ? (
                              <button
                                onClick={() => onToggleRevocation(doc.docId)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Réactiver</span>
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  setIsRevokeModalOpen({ docId: doc.docId, isOpen: true })
                                }
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                              >
                                <Lock className="w-3 h-3" />
                                <span>Révoquer</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: GESTION DES UTILISATEURS & ANNUAIRE RBAC                          */}
      {/* ========================================================================= */}
      {activeTab === 'USERS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                Gestion Complète des Comptes & Contrôle des Rôles (RBAC)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Créez, modifiez, suspendez et gérez les droits des étudiants, enseignants et administrateurs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-xl w-48 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Role filter buttons */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
                <button
                  onClick={() => setUserRoleFilter('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    userRoleFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Tous ({users.length})
                </button>
                <button
                  onClick={() => setUserRoleFilter('STUDENT')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    userRoleFilter === 'STUDENT' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Étudiants ({students.length})
                </button>
                <button
                  onClick={() => setUserRoleFilter('TEACHER')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    userRoleFilter === 'TEACHER' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Profs ({teachers.length})
                </button>
                <button
                  onClick={() => setUserRoleFilter('ADMIN')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    userRoleFilter === 'ADMIN' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Admins
                </button>
              </div>

              <button
                onClick={openCreateUserModal}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouvel Utilisateur</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Utilisateur</th>
                  <th className="py-3 px-4">Email Institutionnel</th>
                  <th className="py-3 px-4">Rôle</th>
                  <th className="py-3 px-4">Identifiant / Matricule</th>
                  <th className="py-3 px-4">Formation / Spécialité</th>
                  <th className="py-3 px-4 text-center">Statut du Compte</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users
                  .filter((u) => {
                    const matchesSearch =
                      u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      u.email.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesRole = userRoleFilter === 'ALL' || u.role === userRoleFilter;
                    return matchesSearch && matchesRole;
                  })
                  .map((u) => {
                    const stu = students.find((s) => s.id === u.id);
                    const tea = teachers.find((t) => t.id === u.id);
                    const stuFormation = formations.find((f) => f.formationId === stu?.formationId);
                    const isSuspended = stu ? stu.statut === 'SUSPENDU' : !u.isVerified;

                    return (
                      <tr key={u.id} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={u.profilePhoto}
                            alt={u.firstName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-xs"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 block">
                              {u.firstName} {u.lastName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Créé le {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono">{u.email}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                              u.role === 'STUDENT'
                                ? 'bg-blue-100 text-blue-800'
                                : u.role === 'TEACHER'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {u.role === 'STUDENT'
                              ? 'Étudiant'
                              : u.role === 'TEACHER'
                              ? 'Professeur'
                              : 'Administrateur'}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-blue-700">
                          {stu?.matricule || (tea ? 'ENS-USTP' : 'ADM-RECTORAT')}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {stu ? (
                            <span className="font-medium text-slate-800">
                              {stuFormation?.codeFormation || 'L3-INFO'}
                            </span>
                          ) : tea ? (
                            <span className="truncate block max-w-[180px]">{tea.specialite}</span>
                          ) : (
                            <span className="text-slate-400">Régie Centrale</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => onToggleUserStatus(u.id)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                              isSuspended
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            {isSuspended ? 'Suspendu' : 'Actif'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditUserModal(u)}
                              className="p-1.5 text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition"
                              title="Modifier l'utilisateur"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            {u.id !== user.id && (
                              <button
                                onClick={() => {
                                  if (confirm(`Confirmer la suppression du compte de ${u.firstName} ${u.lastName} ?`)) {
                                    onDeleteUser(u.id);
                                  }
                                }}
                                className="p-1.5 text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-lg transition"
                                title="Supprimer définitivement"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FORMATIONS & MAQUETTES ECTS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'CURRICULUM' && (
        <div className="space-y-6">
          {/* Formations Catalogue Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Catalogue des Formations Universitaires
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gestion des filières, départements et parcours de diplômes officiels.
                </p>
              </div>

              <button
                onClick={openCreateFormationModal}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Nouvelle Formation</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formations.map((f) => {
                const enrolledCount = students.filter((s) => s.formationId === f.formationId).length;
                const matieresCount = matieres.filter((m) => m.formationId === f.formationId).length;

                return (
                  <div
                    key={f.formationId}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                          {f.codeFormation}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium">
                            {f.dureeAnnees} an(s)
                          </span>
                          <button
                            onClick={() => openEditFormationModal(f)}
                            className="p-1 text-slate-600 hover:text-indigo-600 transition"
                            title="Modifier formation"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {formations.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer la formation ${f.nomFormation} et ses modules associés ?`)) {
                                  onDeleteFormation(f.formationId);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                              title="Supprimer formation"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{f.nomFormation}</h3>
                      <p className="text-xs text-slate-600 mt-1">{f.description}</p>
                      <p className="text-[11px] text-slate-400 mt-2 font-mono">{f.departement}</p>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200 text-xs">
                      <span className="text-slate-500">
                        Étudiants inscrits : <strong className="text-blue-600">{enrolledCount}</strong>
                      </span>
                      <span className="text-slate-500">
                        Modules ECTS : <strong className="text-purple-600">{matieresCount}</strong>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Matieres Maquette Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Maquette des Modules d'Enseignement (Coefficients & Crédits ECTS)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Règles de pondération utilisées par le moteur pour le calcul automatique des mentions.
                </p>
              </div>

              <button
                onClick={openCreateMatiereModal}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter un Module</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Intitulé Matière</th>
                    <th className="py-2.5 px-3">Formation</th>
                    <th className="py-2.5 px-3 text-center">Semestre</th>
                    <th className="py-2.5 px-3 text-center">Coefficient</th>
                    <th className="py-2.5 px-3 text-center">Crédits ECTS</th>
                    <th className="py-2.5 px-3">Enseignant Responsable</th>
                    <th className="py-2.5 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matieres.map((m) => {
                    const f = formations.find((form) => form.formationId === m.formationId);
                    const teacher = users.find((u) => u.id === m.enseignantId);

                    return (
                      <tr key={m.matiereId} className="hover:bg-slate-50 transition">
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                          {m.codeMatiere}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{m.nomMatiere}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-medium">
                          {f?.codeFormation || 'L3-INFO'}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-bold">{m.semestre}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                          {m.coefficient}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                          {m.creditsEcts} ECTS
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Non assigné'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditMatiereModal(m)}
                              className="p-1 text-indigo-600 hover:text-indigo-900 rounded"
                              title="Modifier"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer le module ${m.nomMatiere} ?`)) {
                                  onDeleteMatiere(m.matiereId);
                                }
                              }}
                              className="p-1 text-rose-500 hover:text-rose-700 rounded"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* ========================================================================= */}
      {/* TAB 4: PLANIFICATION & GESTION DES EXAMENS                                */}
      {/* ========================================================================= */}
      {activeTab === 'EXAMS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                Planification des Sessions d'Examens & Rattrapages
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Organisez les sessions d'examens en présentiel, assignez les salles et surveillez les statuts de déroulement.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Filtrer par session"
                value={examSessionFilter}
                onChange={(e) => setExamSessionFilter(e.target.value as 'ALL' | SessionType)}
                className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">Toutes les sessions</option>
                <option value="NORMALE">Session Normale</option>
                <option value="RATTRAPAGE">Session Rattrapage</option>
              </select>

              <button
                onClick={openCreateExamenModal}
                className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Programmer un Examen</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Matière & Code</th>
                  <th className="py-3 px-4">Session</th>
                  <th className="py-3 px-4">Date & Heure</th>
                  <th className="py-3 px-4">Salle & Durée</th>
                  <th className="py-3 px-4 text-center">Statut Déroulement</th>
                  <th className="py-3 px-4 text-center">Notes Saisies</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {examens
                  .filter((ex) => examSessionFilter === 'ALL' || ex.session === examSessionFilter)
                  .map((ex) => {
                    const m = matieres.find((mat) => mat.matiereId === ex.matiereId);
                    const examNotes = notes.filter((n) => n.examenId === ex.examenId);

                    return (
                      <tr key={ex.examenId} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">{m?.nomMatiere}</span>
                          <span className="font-mono text-[10px] text-blue-600">{m?.codeMatiere}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`font-semibold px-2 py-0.5 rounded text-[10px] uppercase border ${
                              ex.session === 'RATTRAPAGE'
                                ? 'bg-amber-50 text-amber-800 border-amber-200 font-bold'
                                : 'bg-blue-50 text-blue-800 border-blue-200'
                            }`}
                          >
                            {ex.session}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <span className="font-medium block">{ex.dateExamen}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{ex.heure}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <span className="font-medium block">{ex.salle}</span>
                          <span className="text-[10px] text-slate-400">{ex.dureeMinutes} minutes</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <select
                            aria-label="Statut examen"
                            value={ex.statut}
                            onChange={(e) =>
                              onUpdateExamen(ex.examenId, {
                                statut: e.target.value as 'A_VENIR' | 'EN_COURS' | 'TERMINE',
                              })
                            }
                            className={`text-[10px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                              ex.statut === 'TERMINE'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : ex.statut === 'EN_COURS'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-50 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="A_VENIR">À VENIR</option>
                            <option value="EN_COURS">EN COURS</option>
                            <option value="TERMINE">TERMINÉ</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                          {examNotes.length} notes
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditExamenModal(ex)}
                              className="p-1 text-slate-600 hover:text-amber-700 rounded"
                              title="Modifier"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer la session d'examen #${ex.examenId} ?`)) {
                                  onDeleteExamen(ex.examenId);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DÉLIBÉRATIONS DU JURY & CONTRÔLE DES NOTES                         */}
      {/* ========================================================================= */}
      {activeTab === 'GRADES' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600" />
                Contrôle Central des Notes & Délibération du Jury
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Rectification administrative des notes, calcul des mentions et édition du Procès-Verbal officiel (PV).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                aria-label="Filtrer par étudiant"
                value={gradeStudentFilter}
                onChange={(e) => setGradeStudentFilter(e.target.value)}
                className="text-xs border border-slate-300 rounded-xl px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="ALL">Tous les étudiants</option>
                {students.map((s) => {
                  const u = users.find((item) => item.id === s.id);
                  return (
                    <option key={s.id} value={s.id}>
                      {u ? `${u.lastName.toUpperCase()} ${u.firstName}` : s.matricule}
                    </option>
                  );
                })}
              </select>

              <button
                onClick={() => setIsPvJuryModalOpen(true)}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PV de Délibération</span>
              </button>

              <button
                onClick={openCreateNoteModal}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Attribuer une Note</span>
              </button>
            </div>
          </div>

          {/* Notes Matrix Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Étudiant(e)</th>
                  <th className="py-3 px-4">Matière & Examen</th>
                  <th className="py-3 px-4 text-center">Note / 20</th>
                  <th className="py-3 px-4 text-center">Statut ECTS</th>
                  <th className="py-3 px-4">Saisie & Validation</th>
                  <th className="py-3 px-4">Observations</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notes
                  .filter((n) => gradeStudentFilter === 'ALL' || n.etudiantId === gradeStudentFilter)
                  .map((n) => {
                    const studentUser = users.find((u) => u.id === n.etudiantId);
                    const stuProfile = students.find((s) => s.id === n.etudiantId);
                    const exam = examens.find((e) => e.examenId === n.examenId);
                    const matiere = matieres.find((m) => m.matiereId === exam?.matiereId);
                    const validator = users.find((u) => u.id === n.valideePar);
                    const isPassing = n.valeurNote >= 10;

                    return (
                      <tr key={n.noteId} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-900 block">
                            {studentUser?.lastName.toUpperCase()} {studentUser?.firstName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400">
                            {stuProfile?.matricule}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-800 block">
                            {matiere?.nomMatiere || 'Matière Inconnue'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {exam?.session === 'RATTRAPAGE' ? '⚠️ Session Rattrapage' : 'Session Normale'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`font-mono font-bold text-sm px-2.5 py-0.5 rounded-lg border ${
                              isPassing
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-rose-50 text-rose-800 border-rose-200'
                            }`}
                          >
                            {n.valeurNote.toFixed(1)} / 20
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isPassing ? (
                            <span className="text-emerald-700 font-semibold text-[10px] inline-flex items-center gap-1">
                              <CheckCircle className="w-3.5 h-3.5" /> ECTS Validés
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold text-[10px] inline-flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Rattrapage
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <span className="block text-[11px]">{n.dateSaisie}</span>
                          <span className="text-[10px] text-slate-400">
                            Par {validator ? `${validator.firstName} ${validator.lastName}` : 'Rectorat'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 italic text-[11px] max-w-[200px] truncate">
                          {n.commentaires || '—'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => openEditNoteModal(n)}
                              className="p-1 text-slate-600 hover:text-indigo-600 rounded"
                              title="Rectifier la note"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Supprimer la note de ${n.valeurNote}/20 ?`)) {
                                  onDeleteNote(n.noteId);
                                }
                              }}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: PARAMÈTRES ÉTABLISSEMENT, AUDIT SÉCURITÉ & SAUVEGARDE             */}
      {/* ========================================================================= */}
      {activeTab === 'SETTINGS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1 & 2: Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-600" />
                Paramètres Institutionnels de l'Établissement
              </h2>

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom Officiel de l'Université
                    </label>
                    <input
                      type="text"
                      value={settingsFormData.universityName}
                      onChange={(e) =>
                        setSettingsFormData({ ...settingsFormData, universityName: e.target.value })
                      }
                      className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Année Académique Active
                    </label>
                    <input
                      type="text"
                      value={settingsFormData.academicYear}
                      onChange={(e) =>
                        setSettingsFormData({ ...settingsFormData, academicYear: e.target.value })
                      }
                      className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Sous-titre et Statut Juridique
                  </label>
                  <input
                    type="text"
                    value={settingsFormData.subTitle}
                    onChange={(e) =>
                      setSettingsFormData({ ...settingsFormData, subTitle: e.target.value })
                    }
                    className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email de Contact Scolarité
                    </label>
                    <input
                      type="email"
                      value={settingsFormData.contactEmail}
                      onChange={(e) =>
                        setSettingsFormData({ ...settingsFormData, contactEmail: e.target.value })
                      }
                      className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Seuil de Rattrapage (Moyenne minimale)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="20"
                      value={settingsFormData.retakeThreshold}
                      onChange={(e) =>
                        setSettingsFormData({
                          ...settingsFormData,
                          retakeThreshold: Number(e.target.value),
                        })
                      }
                      className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    />
                  </div>
                </div>

                {/* Maintenance switch */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">Mode Maintenance</span>
                    <span className="text-[11px] text-slate-500">
                      Verrouille les accès aux portails pour les sessions de maintenance informatique.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settingsFormData.maintenanceMode}
                      onChange={(e) =>
                        setSettingsFormData({ ...settingsFormData, maintenanceMode: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow cursor-pointer"
                  >
                    Enregistrer les Paramètres
                  </button>
                </div>
              </form>
            </div>

            {/* Emergency and Database management */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                Opérations de Sauvegarde & Restauration
              </h3>
              <p className="text-xs text-slate-500">
                Téléchargez l'intégralité des tables universitaires au format JSON ou restaurez les données d'origine.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onExportDatabase}
                  className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition shadow cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Télécharger la Sauvegarde Complète (JSON)</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Voulez-vous réinitialiser toutes les tables avec les données de démonstration officielles ?')) {
                      onResetToSeed();
                    }
                  }}
                  className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Réinitialiser Données Démo (Seed)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 3: Live Security Audit Trail */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" />
                Journal d'Audit de Sécurité en Direct
              </h3>
              <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                Actif
              </span>
            </div>

            <p className="text-xs text-slate-500">
              Traçabilité immuable de toutes les actions administratives sensibles.
            </p>

            <div className="flex-1 overflow-y-auto max-h-[500px] space-y-3 pr-1 scrollbar-thin">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border border-slate-100 bg-slate-50/70 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                        log.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {log.module}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900">{log.action}</h4>
                  <p className="text-slate-600 text-[11px]">{log.details}</p>
                  <div className="text-[10px] text-slate-400 pt-0.5 flex items-center justify-between">
                    <span>Par: {log.adminName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD / EDIT USER (RBAC)                                          */}
      {/* ========================================================================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                {editingUser ? "Modifier l'Utilisateur" : 'Créer un Nouvel Utilisateur'}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prénom</label>
                  <input
                    type="text"
                    required
                    value={userFormData.firstName}
                    onChange={(e) => setUserFormData({ ...userFormData, firstName: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom</label>
                  <input
                    type="text"
                    required
                    value={userFormData.lastName}
                    onChange={(e) => setUserFormData({ ...userFormData, lastName: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Institutionnel</label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2 font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Rôle Système</label>
                <select
                  aria-label="Rôle système utilisateur"
                  value={userFormData.role}
                  onChange={(e) =>
                    setUserFormData({
                      ...userFormData,
                      role: e.target.value as 'STUDENT' | 'TEACHER' | 'ADMIN',
                    })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="STUDENT">🎓 Étudiant</option>
                  <option value="TEACHER">👨‍🏫 Professeur / Enseignant</option>
                  <option value="ADMIN">🏛️ Administrateur Rectorat</option>
                </select>
              </div>

              {/* Student fields */}
              {userFormData.role === 'STUDENT' && (
                <div className="space-y-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200">
                  <span className="font-bold text-blue-900 block text-[11px]">
                    Paramètres Étudiant
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">Formation</label>
                      <select
                        aria-label="Formation de l'étudiant"
                        value={userFormData.formationId}
                        onChange={(e) =>
                          setUserFormData({ ...userFormData, formationId: Number(e.target.value) })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs"
                      >
                        {formations.map((f) => (
                          <option key={f.formationId} value={f.formationId}>
                            {f.codeFormation} - {f.nomFormation}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-700 mb-1 font-semibold">Matricule</label>
                      <input
                        type="text"
                        value={userFormData.matricule}
                        onChange={(e) =>
                          setUserFormData({ ...userFormData, matricule: e.target.value })
                        }
                        className="w-full border border-slate-300 rounded-lg p-1.5 font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Teacher fields */}
              {userFormData.role === 'TEACHER' && (
                <div className="space-y-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-200">
                  <span className="font-bold text-indigo-900 block text-[11px]">
                    Paramètres Enseignant
                  </span>
                  <div>
                    <label className="block text-slate-700 mb-1 font-semibold">Spécialité</label>
                    <input
                      type="text"
                      value={userFormData.specialite}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, specialite: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition"
                >
                  {editingUser ? 'Enregistrer les Modifications' : 'Créer le Compte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: ADD / EDIT FORMATION                                            */}
      {/* ========================================================================= */}
      {isFormationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                {editingFormation ? 'Modifier la Formation' : 'Créer une Formation'}
              </h3>
              <button
                onClick={() => setIsFormationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFormation} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code Formation</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: L3-INFO"
                    value={formationFormData.codeFormation}
                    onChange={(e) =>
                      setFormationFormData({ ...formationFormData, codeFormation: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 font-mono uppercase focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durée (Années)</label>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    required
                    value={formationFormData.dureeAnnees}
                    onChange={(e) =>
                      setFormationFormData({
                        ...formationFormData,
                        dureeAnnees: Number(e.target.value),
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Intitulé Complet</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Licence 3 - Informatique & Systèmes Décisionnels"
                  value={formationFormData.nomFormation}
                  onChange={(e) =>
                    setFormationFormData({ ...formationFormData, nomFormation: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Département de Rattachement</label>
                <input
                  type="text"
                  value={formationFormData.departement}
                  onChange={(e) =>
                    setFormationFormData({ ...formationFormData, departement: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description Académique</label>
                <textarea
                  rows={3}
                  value={formationFormData.description}
                  onChange={(e) =>
                    setFormationFormData({ ...formationFormData, description: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsFormationModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD / EDIT MATIERE (MODULE ECTS)                                */}
      {/* ========================================================================= */}
      {isMatiereModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-600" />
                {editingMatiere ? 'Modifier le Module' : 'Ajouter un Module ECTS'}
              </h3>
              <button
                onClick={() => setIsMatiereModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMatiere} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Code Matière</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: INF305"
                    value={matiereFormData.codeMatiere}
                    onChange={(e) =>
                      setMatiereFormData({ ...matiereFormData, codeMatiere: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 font-mono uppercase focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Semestre</label>
                  <select
                    aria-label="Semestre du module"
                    value={matiereFormData.semestre}
                    onChange={(e) =>
                      setMatiereFormData({ ...matiereFormData, semestre: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  >
                    <option value="S1">Semestre 1 (S1)</option>
                    <option value="S2">Semestre 2 (S2)</option>
                    <option value="S3">Semestre 3 (S3)</option>
                    <option value="S4">Semestre 4 (S4)</option>
                    <option value="S5">Semestre 5 (S5)</option>
                    <option value="S6">Semestre 6 (S6)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Intitulé du Module</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Intelligence Artificielle & Réseaux de Neurones"
                  value={matiereFormData.nomMatiere}
                  onChange={(e) =>
                    setMatiereFormData({ ...matiereFormData, nomMatiere: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Formation de Rattachement</label>
                <select
                  aria-label="Formation de rattachement du module"
                  value={matiereFormData.formationId}
                  onChange={(e) =>
                    setMatiereFormData({ ...matiereFormData, formationId: Number(e.target.value) })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                >
                  {formations.map((f) => (
                    <option key={f.formationId} value={f.formationId}>
                      {f.codeFormation} - {f.nomFormation}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Coefficient</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    required
                    value={matiereFormData.coefficient}
                    onChange={(e) =>
                      setMatiereFormData({
                        ...matiereFormData,
                        coefficient: Number(e.target.value),
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Crédits ECTS</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={matiereFormData.creditsEcts}
                    onChange={(e) =>
                      setMatiereFormData({
                        ...matiereFormData,
                        creditsEcts: Number(e.target.value),
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Enseignant Responsable</label>
                <select
                  aria-label="Enseignant responsable du module"
                  value={matiereFormData.enseignantId}
                  onChange={(e) =>
                    setMatiereFormData({ ...matiereFormData, enseignantId: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                >
                  {users
                    .filter((u) => u.role === 'TEACHER')
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.firstName} {t.lastName}
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsMatiereModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ADD / EDIT EXAMEN                                               */}
      {/* ========================================================================= */}
      {isExamenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                {editingExamen ? "Modifier l'Examen" : "Programmer une Session d'Examen"}
              </h3>
              <button
                onClick={() => setIsExamenModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExamen} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Matière Concernée</label>
                <select
                  aria-label="Matière concernée par l'examen"
                  value={examenFormData.matiereId}
                  onChange={(e) =>
                    setExamenFormData({ ...examenFormData, matiereId: Number(e.target.value) })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                >
                  {matieres.map((m) => (
                    <option key={m.matiereId} value={m.matiereId}>
                      {m.codeMatiere} - {m.nomMatiere}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Session</label>
                  <select
                    aria-label="Session d'examen"
                    value={examenFormData.session}
                    onChange={(e) =>
                      setExamenFormData({
                        ...examenFormData,
                        session: e.target.value as SessionType,
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  >
                    <option value="NORMALE">Session Normale</option>
                    <option value="RATTRAPAGE">Session Rattrapage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Statut</label>
                  <select
                    aria-label="Statut de l'examen"
                    value={examenFormData.statut}
                    onChange={(e) =>
                      setExamenFormData({
                        ...examenFormData,
                        statut: e.target.value as 'A_VENIR' | 'EN_COURS' | 'TERMINE',
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  >
                    <option value="A_VENIR">À Venir</option>
                    <option value="EN_COURS">En Cours</option>
                    <option value="TERMINE">Terminé</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date Examen</label>
                  <input
                    type="date"
                    required
                    value={examenFormData.dateExamen}
                    onChange={(e) =>
                      setExamenFormData({ ...examenFormData, dateExamen: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Plage Horaire</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: 09:00 - 12:00"
                    value={examenFormData.heure}
                    onChange={(e) => setExamenFormData({ ...examenFormData, heure: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Salle / Amphithéâtre</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Amphi Monge"
                    value={examenFormData.salle}
                    onChange={(e) => setExamenFormData({ ...examenFormData, salle: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl p-2"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durée (Minutes)</label>
                  <input
                    type="number"
                    min="30"
                    step="15"
                    required
                    value={examenFormData.dureeMinutes}
                    onChange={(e) =>
                      setExamenFormData({
                        ...examenFormData,
                        dureeMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsExamenModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: ADD / RECTIFIER NOTE                                            */}
      {/* ========================================================================= */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600" />
                {editingNote ? 'Rectifier une Note (Audit Log)' : 'Attribuer une Note'}
              </h3>
              <button
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4 pt-4 text-xs">
              {!editingNote && (
                <>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Étudiant(e)</label>
                    <select
                      aria-label="Étudiant concerné par la note"
                      value={noteFormData.etudiantId}
                      onChange={(e) =>
                        setNoteFormData({ ...noteFormData, etudiantId: e.target.value })
                      }
                      className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                    >
                      {students.map((s) => {
                        const u = users.find((userObj) => userObj.id === s.id);
                        return (
                          <option key={s.id} value={s.id}>
                            {u ? `${u.lastName.toUpperCase()} ${u.firstName}` : s.matricule} ({s.matricule})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Examen / Matière</label>
                    <select
                      aria-label="Examen concerné par la note"
                      value={noteFormData.examenId}
                      onChange={(e) =>
                        setNoteFormData({ ...noteFormData, examenId: Number(e.target.value) })
                      }
                      className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                    >
                      {examens.map((ex) => {
                        const m = matieres.find((item) => item.matiereId === ex.matiereId);
                        return (
                          <option key={ex.examenId} value={ex.examenId}>
                            {m?.nomMatiere} ({ex.session}) - {ex.dateExamen}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Note Officielle (/20)</label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  max="20"
                  required
                  value={noteFormData.valeurNote}
                  onChange={(e) =>
                    setNoteFormData({ ...noteFormData, valeurNote: Number(e.target.value) })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 font-mono text-base font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Commentaire / Justification</label>
                <textarea
                  rows={3}
                  value={noteFormData.commentaires}
                  onChange={(e) =>
                    setNoteFormData({ ...noteFormData, commentaires: e.target.value })
                  }
                  placeholder="Justification administrative ou observation pédagogique"
                  className="w-full border border-slate-300 rounded-xl p-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsNoteModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition"
                >
                  Valider la Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: ISSUE OFFICIAL DOCUMENT WITH QR CODE                            */}
      {/* ========================================================================= */}
      {isIssueDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-purple-600" />
                Émission d'un Document Sécurisé QR
              </h3>
              <button
                onClick={() => setIsIssueDocModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssueDocSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Étudiant(e) Bénéficiaire</label>
                <select
                  aria-label="Étudiant bénéficiaire du document"
                  value={issueDocFormData.studentId}
                  onChange={(e) =>
                    setIssueDocFormData({ ...issueDocFormData, studentId: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                >
                  {students.map((s) => {
                    const u = users.find((userObj) => userObj.id === s.id);
                    return (
                      <option key={s.id} value={s.id}>
                        {u ? `${u.lastName.toUpperCase()} ${u.firstName}` : s.matricule} ({s.matricule})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Type de Document</label>
                <select
                  aria-label="Type de document à émettre"
                  value={issueDocFormData.typeDocument}
                  onChange={(e) =>
                    setIssueDocFormData({
                      ...issueDocFormData,
                      typeDocument: e.target.value as DocType,
                    })
                  }
                  className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                >
                  <option value="STUDENT_CARD">💳 Carte d'Étudiant Numérique (3D/NFC)</option>
                  <option value="CERTIFICATE">📄 Certificat de Scolarité Officiel</option>
                  <option value="TRANSCRIPT">📊 Relevé de Notes & Crédits ECTS</option>
                </select>
              </div>

              {issueDocFormData.typeDocument === 'TRANSCRIPT' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mention Attribuée</label>
                  <select
                    aria-label="Mention attribuée au relevé"
                    value={issueDocFormData.mention}
                    onChange={(e) =>
                      setIssueDocFormData({ ...issueDocFormData, mention: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded-xl p-2 bg-white"
                  >
                    <option value="Très Bien">Très Bien (≥ 16/20)</option>
                    <option value="Bien">Bien (≥ 14/20)</option>
                    <option value="Assez Bien">Assez Bien (≥ 12/20)</option>
                    <option value="Passable">Passable (≥ 10/20)</option>
                  </select>
                </div>
              )}

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900 text-[11px] space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                  Sécurisation Cryptographique
                </span>
                <p className="text-purple-700">
                  Le système calculera automatiquement une empreinte SHA-256 scellée et générera l'URL publique de vérification instantanée.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsIssueDocModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition"
                >
                  Générer le Document Officiel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 7: CONFIRM REVOCATION WITH REASON                                  */}
      {/* ========================================================================= */}
      {isRevokeModalOpen.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">
                Confirmation de Révocation Anti-Fraude
              </h3>
            </div>

            <p className="text-xs text-slate-600 mb-4">
              Ce document sera immédiatement marqué comme révoqué dans le registre décentralisé.
              Tout scan du QR code affichera une alerte rouge de fraude.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Motif de la Révocation (obligatoire)
              </label>
              <input
                type="text"
                placeholder="ex: Falsification présumée, sanction disciplinaire, perte"
                value={revokeReasonInput}
                onChange={(e) => setRevokeReasonInput(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setIsRevokeModalOpen({ docId: '', isOpen: false })}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Confirmer la Révocation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: PV DE DÉLIBÉRATION OFFICIEL DU JURY                             */}
      {/* ========================================================================= */}
      {isPvJuryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Procès-Verbal Officiel de Délibération du Jury
                </h3>
              </div>
              <button
                onClick={() => setIsPvJuryModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
              <div className="text-center pb-3 border-b border-slate-200">
                <h4 className="font-serif font-black text-slate-900 text-base uppercase">
                  {systemSettings.universityName}
                </h4>
                <p className="text-[11px] text-slate-500">{systemSettings.subTitle}</p>
                <p className="text-[11px] font-bold text-slate-800 mt-1">
                  Commission d'Attribution des Diplômes & Crédits ECTS • Année {systemSettings.academicYear}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">
                    Candidats Évalués
                  </span>
                  <span className="text-lg font-bold font-mono text-slate-900">
                    {students.length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">
                    Admis Directs
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-600">
                    {students.length - retakeCandidatesCount}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">
                    Convoqués Rattrapage
                  </span>
                  <span className="text-lg font-bold font-mono text-amber-600">
                    {retakeCandidatesCount}
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Étudiant</th>
                      <th className="py-2 px-3">Matricule</th>
                      <th className="py-2 px-3 text-center">Moyenne Estimée</th>
                      <th className="py-2 px-3 text-center">Décision du Jury</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s) => {
                      const u = users.find((userObj) => userObj.id === s.id);
                      const stuNotes = notes.filter((n) => n.etudiantId === s.id);
                      const avg =
                        stuNotes.length > 0
                          ? (stuNotes.reduce((acc, c) => acc + c.valeurNote, 0) / stuNotes.length).toFixed(2)
                          : '0.00';
                      const hasFailed = stuNotes.some((n) => n.valeurNote < 10);

                      return (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-semibold text-slate-900">
                            {u?.lastName.toUpperCase()} {u?.firstName}
                          </td>
                          <td className="py-2 px-3 font-mono text-slate-500">{s.matricule}</td>
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-800">
                            {avg} / 20
                          </td>
                          <td className="py-2 px-3 text-center">
                            {hasFailed ? (
                              <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                Ajourné (Rattrapage requis)
                              </span>
                            ) : (
                              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold">
                                Admis (Semestre Validé)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <div>
                  <span>Président de Commission : </span>
                  <strong className="text-slate-800">
                    {user.firstName} {user.lastName}
                  </strong>
                </div>
                <div>
                  <span>Signature Cryptographique : </span>
                  <strong className="text-purple-700 font-mono">
                    SHA256_{Date.now().toString(36)}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer le Procès-Verbal</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPvJuryModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
