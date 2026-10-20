import { useState, useEffect } from 'react';
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
  NotificationRecord,
  DocType,
  SystemSettings,
  AuditLogEntry,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_FORMATIONS,
  INITIAL_MATIERES,
  INITIAL_EXAMENS,
  INITIAL_NOTES,
  INITIAL_RESSOURCES,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SYSTEM_SETTINGS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockDatabase';
import { generateContentHash, identifyRetakeStudents } from '../utils/academicRules';

const STORAGE_KEYS = {
  USERS: 'ustp_users_v2',
  STUDENTS: 'ustp_students_v2',
  TEACHERS: 'ustp_teachers_v2',
  FORMATIONS: 'ustp_formations_v2',
  MATIERES: 'ustp_matieres_v2',
  EXAMENS: 'ustp_examens_v2',
  NOTES: 'ustp_notes_v2',
  RESSOURCES: 'ustp_ressources_v2',
  DOCUMENTS: 'ustp_documents_v2',
  NOTIFICATIONS: 'ustp_notifications_v2',
  SETTINGS: 'ustp_settings_v2',
  LOGS: 'ustp_audit_logs_v2',
  CURRENT_USER_ID: 'ustp_current_user_id_v2',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Erreur écriture localStorage:', e);
  }
}

export function useUniversityStore() {
  const [users, setUsers] = useState<User[]>(() => getStored(STORAGE_KEYS.USERS, INITIAL_USERS));
  const [students, setStudents] = useState<StudentProfile[]>(() =>
    getStored(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS)
  );
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() =>
    getStored(STORAGE_KEYS.TEACHERS, INITIAL_TEACHERS)
  );
  const [formations, setFormations] = useState<Formation[]>(() =>
    getStored(STORAGE_KEYS.FORMATIONS, INITIAL_FORMATIONS)
  );
  const [matieres, setMatieres] = useState<Matiere[]>(() =>
    getStored(STORAGE_KEYS.MATIERES, INITIAL_MATIERES)
  );
  const [examens, setExamens] = useState<Examen[]>(() =>
    getStored(STORAGE_KEYS.EXAMENS, INITIAL_EXAMENS)
  );
  const [notes, setNotes] = useState<Note[]>(() => getStored(STORAGE_KEYS.NOTES, INITIAL_NOTES));
  const [ressources, setRessources] = useState<CoursRessource[]>(() =>
    getStored(STORAGE_KEYS.RESSOURCES, INITIAL_RESSOURCES)
  );
  const [documents, setDocuments] = useState<DocumentEmis[]>(() =>
    getStored(STORAGE_KEYS.DOCUMENTS, INITIAL_DOCUMENTS)
  );
  const [notifications, setNotifications] = useState<NotificationRecord[]>(() =>
    getStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() =>
    getStored(STORAGE_KEYS.SETTINGS, INITIAL_SYSTEM_SETTINGS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    getStored(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS)
  );
  const [currentUserId, setCurrentUserId] = useState<string>(() =>
    getStored(STORAGE_KEYS.CURRENT_USER_ID, 'user-admin-1')
  );

  // Sync to localStorage
  useEffect(() => setStored(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => setStored(STORAGE_KEYS.STUDENTS, students), [students]);
  useEffect(() => setStored(STORAGE_KEYS.TEACHERS, teachers), [teachers]);
  useEffect(() => setStored(STORAGE_KEYS.FORMATIONS, formations), [formations]);
  useEffect(() => setStored(STORAGE_KEYS.MATIERES, matieres), [matieres]);
  useEffect(() => setStored(STORAGE_KEYS.EXAMENS, examens), [examens]);
  useEffect(() => setStored(STORAGE_KEYS.NOTES, notes), [notes]);
  useEffect(() => setStored(STORAGE_KEYS.RESSOURCES, ressources), [ressources]);
  useEffect(() => setStored(STORAGE_KEYS.DOCUMENTS, documents), [documents]);
  useEffect(() => setStored(STORAGE_KEYS.NOTIFICATIONS, notifications), [notifications]);
  useEffect(() => setStored(STORAGE_KEYS.SETTINGS, systemSettings), [systemSettings]);
  useEffect(() => setStored(STORAGE_KEYS.LOGS, auditLogs), [auditLogs]);
  useEffect(() => setStored(STORAGE_KEYS.CURRENT_USER_ID, currentUserId), [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const currentStudent = students.find((s) => s.id === currentUserId);
  const currentTeacher = teachers.find((t) => t.id === currentUserId);

  // Helper to add audit logs
  const logAdminAction = (
    action: string,
    module: AuditLogEntry['module'],
    details: string,
    severity: AuditLogEntry['severity'] = 'INFO'
  ) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      adminId: currentUser.id,
      adminName: `${currentUser.firstName} ${currentUser.lastName}`,
      action,
      module,
      severity,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Switch role / profile
  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
  };

  // ==========================================
  // USER & RBAC MANAGEMENT (CRUD)
  // ==========================================
  const addUser = (
    userData: Omit<User, 'id' | 'createdAt'>,
    studentData?: Partial<StudentProfile>,
    teacherData?: Partial<TeacherProfile>
  ) => {
    const newId = `user-${userData.role.toLowerCase()}-${Date.now().toString(36)}`;
    const newUser: User = {
      ...userData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);

    if (userData.role === 'STUDENT') {
      const newStudent: StudentProfile = {
        id: newId,
        matricule: studentData?.matricule || `ETU-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        dateNaissance: studentData?.dateNaissance || '2004-01-01',
        adresse: studentData?.adresse || 'Paris, France',
        telephone: studentData?.telephone || '+33 6 00 00 00 00',
        formationId: studentData?.formationId || (formations[0]?.formationId ?? 1),
        anneeUniversitaire: studentData?.anneeUniversitaire || systemSettings.academicYear,
        statut: studentData?.statut || 'ACTIF',
      };
      setStudents((prev) => [newStudent, ...prev]);
    } else if (userData.role === 'TEACHER') {
      const newTeacher: TeacherProfile = {
        id: newId,
        specialite: teacherData?.specialite || 'Informatique Générale',
        grade: teacherData?.grade || 'Maître de Conférences',
        telephone: teacherData?.telephone || '+33 1 40 00 00 00',
        bureau: teacherData?.bureau || 'Bâtiment Principal',
      };
      setTeachers((prev) => [newTeacher, ...prev]);
    }

    logAdminAction(
      'Création Utilisateur',
      'USERS',
      `Création de ${newUser.firstName} ${newUser.lastName} (${newUser.email}) avec le rôle ${newUser.role}`
    );

    return newUser;
  };

  const updateUser = (
    userId: string,
    userData: Partial<User>,
    studentData?: Partial<StudentProfile>,
    teacherData?: Partial<TeacherProfile>
  ) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...userData } : u))
    );

    if (studentData) {
      setStudents((prev) =>
        prev.map((s) => (s.id === userId ? { ...s, ...studentData } : s))
      );
    }

    if (teacherData) {
      setTeachers((prev) =>
        prev.map((t) => (t.id === userId ? { ...t, ...teacherData } : t))
      );
    }

    const u = users.find((x) => x.id === userId);
    logAdminAction(
      'Mise à jour Utilisateur',
      'USERS',
      `Modification du profil de ${u?.firstName || userId} ${u?.lastName || ''}`
    );
  };

  const deleteUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setStudents((prev) => prev.filter((s) => s.id !== userId));
    setTeachers((prev) => prev.filter((t) => t.id !== userId));
    setDocuments((prev) => prev.filter((d) => d.userId !== userId));
    setNotes((prev) => prev.filter((n) => n.etudiantId !== userId));

    logAdminAction(
      'Suppression Utilisateur',
      'USERS',
      `Suppression définitive du compte ${target?.firstName || ''} ${target?.lastName || userId}`,
      'WARNING'
    );
  };

  const toggleUserStatus = (userId: string) => {
    const target = students.find((s) => s.id === userId);
    if (target) {
      const newStatus = target.statut === 'ACTIF' ? 'SUSPENDU' : 'ACTIF';
      setStudents((prev) =>
        prev.map((s) => (s.id === userId ? { ...s, statut: newStatus } : s))
      );
      logAdminAction(
        'Modification Statut Étudiant',
        'USERS',
        `Changement de statut pour l'étudiant (${target.matricule}): ${newStatus}`
      );
      return;
    }

    // Toggle isVerified for non-students
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, isVerified: !u.isVerified };
          logAdminAction(
            'Validation Compte',
            'AUTH',
            `Compte ${u.email} marqué comme ${updated.isVerified ? 'Vérifié' : 'Non-Vérifié'}`
          );
          return updated;
        }
        return u;
      })
    );
  };

  // ==========================================
  // CURRICULUM MANAGEMENT: FORMATIONS (CRUD)
  // ==========================================
  const addFormation = (formationData: Omit<Formation, 'formationId'>) => {
    const newId = Math.max(0, ...formations.map((f) => f.formationId)) + 1;
    const newFormation: Formation = {
      ...formationData,
      formationId: newId,
    };
    setFormations((prev) => [...prev, newFormation]);
    logAdminAction(
      'Création Formation',
      'CURRICULUM',
      `Ajout du cursus ${newFormation.nomFormation} (${newFormation.codeFormation})`
    );
    return newFormation;
  };

  const updateFormation = (formationId: number, data: Partial<Formation>) => {
    setFormations((prev) =>
      prev.map((f) => (f.formationId === formationId ? { ...f, ...data } : f))
    );
    logAdminAction(
      'Mise à jour Formation',
      'CURRICULUM',
      `Modification de la maquette de la formation ID #${formationId}`
    );
  };

  const deleteFormation = (formationId: number) => {
    const f = formations.find((item) => item.formationId === formationId);
    setFormations((prev) => prev.filter((item) => item.formationId !== formationId));
    // Also remove or unlink matieres
    setMatieres((prev) => prev.filter((m) => m.formationId !== formationId));
    logAdminAction(
      'Suppression Formation',
      'CURRICULUM',
      `Suppression du cursus ${f?.nomFormation || formationId}`,
      'WARNING'
    );
  };

  // ==========================================
  // CURRICULUM MANAGEMENT: MATIERES (CRUD)
  // ==========================================
  const addMatiere = (matiereData: Omit<Matiere, 'matiereId'>) => {
    const newId = Math.max(100, ...matieres.map((m) => m.matiereId)) + 1;
    const newMatiere: Matiere = {
      ...matiereData,
      matiereId: newId,
    };
    setMatieres((prev) => [...prev, newMatiere]);
    logAdminAction(
      'Création Matière',
      'CURRICULUM',
      `Ajout du module ${newMatiere.nomMatiere} (${newMatiere.codeMatiere}, ${newMatiere.creditsEcts} ECTS)`
    );
    return newMatiere;
  };

  const updateMatiere = (matiereId: number, data: Partial<Matiere>) => {
    setMatieres((prev) =>
      prev.map((m) => (m.matiereId === matiereId ? { ...m, ...data } : m))
    );
    logAdminAction(
      'Mise à jour Matière',
      'CURRICULUM',
      `Modification du module ID #${matiereId}`
    );
  };

  const deleteMatiere = (matiereId: number) => {
    const m = matieres.find((item) => item.matiereId === matiereId);
    setMatieres((prev) => prev.filter((item) => item.matiereId !== matiereId));
    // Remove related exams and notes
    const relatedExamIds = examens.filter((e) => e.matiereId === matiereId).map((e) => e.examenId);
    setExamens((prev) => prev.filter((e) => e.matiereId !== matiereId));
    setNotes((prev) => prev.filter((n) => !relatedExamIds.includes(n.examenId)));
    logAdminAction(
      'Suppression Matière',
      'CURRICULUM',
      `Suppression du module ${m?.nomMatiere || matiereId}`,
      'WARNING'
    );
  };

  // ==========================================
  // EXAMEN MANAGEMENT (CRUD)
  // ==========================================
  const addExamen = (examenData: Omit<Examen, 'examenId'>) => {
    const newId = Math.max(200, ...examens.map((e) => e.examenId)) + 1;
    const newExamen: Examen = {
      ...examenData,
      examenId: newId,
    };
    setExamens((prev) => [...prev, newExamen]);
    const m = matieres.find((mat) => mat.matiereId === newExamen.matiereId);
    logAdminAction(
      'Programmation Examen',
      'EXAMS',
      `Planification session ${newExamen.session} en ${m?.nomMatiere || ''} pour le ${newExamen.dateExamen}`
    );
    return newExamen;
  };

  const updateExamen = (examenId: number, data: Partial<Examen>) => {
    setExamens((prev) =>
      prev.map((e) => (e.examenId === examenId ? { ...e, ...data } : e))
    );
    logAdminAction(
      'Mise à jour Examen',
      'EXAMS',
      `Mise à jour de la session d'examen ID #${examenId}`
    );
  };

  const deleteExamen = (examenId: number) => {
    setExamens((prev) => prev.filter((e) => e.examenId !== examenId));
    setNotes((prev) => prev.filter((n) => n.examenId !== examenId));
    logAdminAction(
      'Annulation Examen',
      'EXAMS',
      `Suppression de la session d'examen ID #${examenId}`,
      'WARNING'
    );
  };

  // ==========================================
  // NOTE MODERATION & GRADES MANAGEMENT (CRUD)
  // ==========================================
  const addNote = (noteData: Omit<Note, 'noteId'>) => {
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    const newNote: Note = {
      ...noteData,
      noteId: newId,
    };
    setNotes((prev) => [...prev, newNote]);
    logAdminAction(
      'Ajout Manuel Note',
      'GRADES',
      `Attribution de la note ${newNote.valeurNote}/20 par l'administration`
    );
    return newNote;
  };

  const updateNote = (noteId: number, data: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) => (n.noteId === noteId ? { ...n, ...data } : n))
    );
    logAdminAction(
      'Rectification Note',
      'GRADES',
      `Rectification administrative de la note ID #${noteId} (nouvelle note: ${data.valeurNote !== undefined ? data.valeurNote : 'modifiée'})`
    );
  };

  const deleteNote = (noteId: number) => {
    setNotes((prev) => prev.filter((n) => n.noteId !== noteId));
    logAdminAction(
      'Suppression Note',
      'GRADES',
      `Annulation de la note ID #${noteId}`,
      'WARNING'
    );
  };

  // ==========================================
  // SYSTEM SETTINGS & AUDIT TRAIL
  // ==========================================
  const updateSystemSettings = (newSettings: Partial<SystemSettings>) => {
    setSystemSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      logAdminAction(
        'Modification Paramètres Système',
        'SYSTEM',
        `Mise à jour des paramètres globaux de l'établissement (${updated.universityName})`
      );
      return updated;
    });
  };

  // Export full JSON database for backup
  const exportDatabaseJson = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      systemSettings,
      users,
      students,
      teachers,
      formations,
      matieres,
      examens,
      notes,
      ressources,
      documents,
      auditLogs,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `ustp_backup_database_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    logAdminAction(
      'Export Sauvegarde Base',
      'SYSTEM',
      'Exportation complète de la base de données relationnelle au format JSON'
    );
  };

  // Submit grades in bulk (Teacher role)
  const bulkSubmitGrades = (
    examenId: number,
    teacherId: string,
    gradeEntries: { etudiantId: string; valeur: number; commentaire?: string }[]
  ) => {
    const updatedNotes = [...notes];
    const newNotifications: NotificationRecord[] = [];
    const examen = examens.find((e) => e.examenId === examenId);
    const matiere = matieres.find((m) => m.matiereId === examen?.matiereId);

    gradeEntries.forEach((entry) => {
      const existingIdx = updatedNotes.findIndex(
        (n) => n.examenId === examenId && n.etudiantId === entry.etudiantId
      );
      const studentUser = users.find((u) => u.id === entry.etudiantId);

      const noteObj: Note = {
        noteId: existingIdx >= 0 ? updatedNotes[existingIdx].noteId : Date.now() + Math.floor(Math.random() * 1000),
        etudiantId: entry.etudiantId,
        examenId,
        valeurNote: entry.valeur,
        dateSaisie: new Date().toISOString().split('T')[0],
        valideePar: teacherId,
        commentaires: entry.commentaire,
      };

      if (existingIdx >= 0) {
        updatedNotes[existingIdx] = noteObj;
      } else {
        updatedNotes.push(noteObj);
      }

      if (studentUser && matiere) {
        newNotifications.push({
          id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          etudiantEmail: studentUser.email,
          etudiantNom: `${studentUser.firstName} ${studentUser.lastName}`,
          matiereNom: matiere.nomMatiere,
          valeurNote: entry.valeur,
          dateEnvoi: new Date().toISOString(),
          lu: false,
        });
      }
    });

    setNotes(updatedNotes);
    if (newNotifications.length > 0) {
      setNotifications((prev) => [...newNotifications, ...prev]);
    }

    logAdminAction(
      'Saisie Groupée Notes',
      'GRADES',
      `Saisie et publication de ${gradeEntries.length} notes pour l'examen #${examenId}`
    );

    return { count: gradeEntries.length, notifications: newNotifications };
  };

  // Auto-create retake session for failed students (grade < 10)
  const createRetakeSession = (
    matiereId: number,
    normalExamenId: number,
    dateExamen: string,
    salle: string,
    heure: string
  ) => {
    const failed = identifyRetakeStudents(normalExamenId, notes);
    const newExamenId = 200 + examens.length + 1;

    const newExamen: Examen = {
      examenId: newExamenId,
      matiereId,
      dateExamen,
      heure,
      salle,
      session: 'RATTRAPAGE',
      dureeMinutes: 120,
      statut: 'A_VENIR',
    };

    setExamens((prev) => [...prev, newExamen]);
    logAdminAction(
      'Session Rattrapage Générée',
      'EXAMS',
      `Génération automatique de la session de rattrapage #${newExamenId} (${failed.length} étudiants convoqués)`
    );
    return { examen: newExamen, failedStudents: failed };
  };

  // Upload course resource (Teacher)
  const addResource = (
    matiereId: number,
    teacherId: string,
    titre: string,
    typeFichier: 'PDF' | 'DOCX' | 'PPTX' | 'ZIP' | 'LINK',
    description?: string,
    fileSize?: string
  ) => {
    const newRes: CoursRessource = {
      ressourceId: Date.now(),
      matiereId,
      enseignantId: teacherId,
      titre,
      typeFichier,
      fileUrl: `#support-${titre.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${typeFichier.toLowerCase()}`,
      tailleFichier: fileSize || '3.5 Mo',
      uploadedAt: new Date().toISOString(),
      description,
    };
    setRessources((prev) => [newRes, ...prev]);
    return newRes;
  };

  // Delete course resource
  const deleteResource = (ressourceId: number) => {
    setRessources((prev) => prev.filter((r) => r.ressourceId !== ressourceId));
  };

  // Issue official secured document with QR signature
  const issueDocument = (
    userId: string,
    typeDocument: DocType,
    metadata?: Record<string, unknown>
  ) => {
    const user = users.find((u) => u.id === userId);
    const student = students.find((s) => s.id === userId);
    const formation = formations.find((f) => f.formationId === student?.formationId);

    const docId = `ustp-${typeDocument.toLowerCase().replace('_', '-')}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const hashPayload = {
      docId,
      userId,
      matricule: student?.matricule,
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      formation: formation?.nomFormation,
      issuedAt: new Date().toISOString(),
      typeDocument,
    };

    const hashContenu = generateContentHash(hashPayload);

    const newDoc: DocumentEmis = {
      docId,
      userId,
      typeDocument,
      hashContenu,
      dateEmission: new Date().toISOString(),
      dateExpiration: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
      estRevoque: false,
      metadata: {
        matricule: student?.matricule,
        anneeUniversitaire: student?.anneeUniversitaire || systemSettings.academicYear,
        formation: formation?.nomFormation,
        ...metadata,
      },
    };

    setDocuments((prev) => [newDoc, ...prev]);
    logAdminAction(
      'Émission Document Sécurisé',
      'DOCUMENTS',
      `Émission du document ${typeDocument} [${docId}] pour ${user?.firstName} ${user?.lastName}`
    );
    return newDoc;
  };

  // Toggle document revocation (Admin anti-fraud test)
  const toggleRevocation = (docId: string, raison?: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.docId === docId) {
          const willBeRevoked = !d.estRevoque;
          const updatedDoc = {
            ...d,
            estRevoque: willBeRevoked,
            revoqueRaison: willBeRevoked
              ? raison || 'Révocation manuelle ordonnée par la scolarité centrale'
              : undefined,
          };
          logAdminAction(
            willBeRevoked ? 'Révocation Document' : 'Réactivation Document',
            'DOCUMENTS',
            `${willBeRevoked ? 'Révocation' : 'Réactivation'} du document ${docId} (Raison: ${updatedDoc.revoqueRaison || 'N/A'})`,
            willBeRevoked ? 'WARNING' : 'INFO'
          );
          return updatedDoc;
        }
        return d;
      })
    );
  };

  // Reset database to initial seed
  const resetToSeed = () => {
    setUsers(INITIAL_USERS);
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setFormations(INITIAL_FORMATIONS);
    setMatieres(INITIAL_MATIERES);
    setExamens(INITIAL_EXAMENS);
    setNotes(INITIAL_NOTES);
    setRessources(INITIAL_RESSOURCES);
    setDocuments(INITIAL_DOCUMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSystemSettings(INITIAL_SYSTEM_SETTINGS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUserId('user-admin-1');

    logAdminAction(
      'Réinitialisation Système',
      'SYSTEM',
      'Remise à zéro de la base de données aux données de semence (Seed data)',
      'CRITICAL'
    );
  };

  return {
    users,
    students,
    teachers,
    formations,
    matieres,
    examens,
    notes,
    ressources,
    documents,
    notifications,
    systemSettings,
    auditLogs,
    currentUser,
    currentStudent,
    currentTeacher,
    currentUserId,
    switchUser,
    addUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    addFormation,
    updateFormation,
    deleteFormation,
    addMatiere,
    updateMatiere,
    deleteMatiere,
    addExamen,
    updateExamen,
    deleteExamen,
    addNote,
    updateNote,
    deleteNote,
    updateSystemSettings,
    exportDatabaseJson,
    bulkSubmitGrades,
    createRetakeSession,
    addResource,
    deleteResource,
    issueDocument,
    toggleRevocation,
    resetToSeed,
  };
}
