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
} from '../data/mockDatabase';
import { generateContentHash, identifyRetakeStudents } from '../utils/academicRules';

const STORAGE_KEYS = {
  USERS: 'ustp_users_v1',
  STUDENTS: 'ustp_students_v1',
  TEACHERS: 'ustp_teachers_v1',
  FORMATIONS: 'ustp_formations_v1',
  MATIERES: 'ustp_matieres_v1',
  EXAMENS: 'ustp_examens_v1',
  NOTES: 'ustp_notes_v1',
  RESSOURCES: 'ustp_ressources_v1',
  DOCUMENTS: 'ustp_documents_v1',
  NOTIFICATIONS: 'ustp_notifications_v1',
  CURRENT_USER_ID: 'ustp_current_user_id_v1',
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
  const [currentUserId, setCurrentUserId] = useState<string>(() =>
    getStored(STORAGE_KEYS.CURRENT_USER_ID, 'user-etu-1')
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
  useEffect(() => setStored(STORAGE_KEYS.CURRENT_USER_ID, currentUserId), [currentUserId]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const currentStudent = students.find((s) => s.id === currentUserId);
  const currentTeacher = teachers.find((t) => t.id === currentUserId);

  // Switch role / profile
  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
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
        anneeUniversitaire: student?.anneeUniversitaire || '2025-2026',
        formation: formation?.nomFormation,
        ...metadata,
      },
    };

    setDocuments((prev) => [newDoc, ...prev]);
    return newDoc;
  };

  // Toggle document revocation (Admin anti-fraud test)
  const toggleRevocation = (docId: string, raison?: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.docId === docId) {
          const willBeRevoked = !d.estRevoque;
          return {
            ...d,
            estRevoque: willBeRevoked,
            revoqueRaison: willBeRevoked
              ? raison || 'Révocation manuelle par le service des affaires académiques'
              : undefined,
          };
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
    setCurrentUserId('user-etu-1');
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
    currentUser,
    currentStudent,
    currentTeacher,
    currentUserId,
    switchUser,
    bulkSubmitGrades,
    createRetakeSession,
    addResource,
    deleteResource,
    issueDocument,
    toggleRevocation,
    resetToSeed,
  };
}
