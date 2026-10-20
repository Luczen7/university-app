export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN';

export type SessionType = 'NORMALE' | 'RATTRAPAGE';

export type DocType = 'STUDENT_CARD' | 'CERTIFICATE' | 'TRANSCRIPT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  profilePhoto: string;
  isVerified: boolean;
  createdAt: string;
}

export interface StudentProfile {
  id: string; // references User.id
  matricule: string;
  dateNaissance: string;
  adresse: string;
  telephone: string;
  formationId: number;
  anneeUniversitaire: string;
  statut: 'ACTIF' | 'SUSPENDU' | 'DIPLOME';
}

export interface TeacherProfile {
  id: string; // references User.id
  specialite: string;
  grade: string;
  telephone: string;
  bureau: string;
}

export interface Formation {
  formationId: number;
  codeFormation: string;
  nomFormation: string;
  description: string;
  dureeAnnees: number;
  departement: string;
}

export interface Matiere {
  matiereId: number;
  codeMatiere: string;
  nomMatiere: string;
  creditsEcts: number;
  coefficient: number;
  formationId: number;
  semestre: string; // 'S1' | 'S2' | 'S3' | 'S4' | 'S5' | 'S6'
  enseignantId: string;
}

export interface Examen {
  examenId: number;
  matiereId: number;
  dateExamen: string;
  heure: string;
  salle: string;
  session: SessionType;
  dureeMinutes: number;
  statut: 'A_VENIR' | 'EN_COURS' | 'TERMINE';
}

export interface Note {
  noteId: number;
  etudiantId: string;
  examenId: number;
  valeurNote: number; // 0 to 20
  dateSaisie: string;
  valideePar: string;
  commentaires?: string;
}

export interface CoursRessource {
  ressourceId: number;
  matiereId: number;
  enseignantId: string;
  titre: string;
  typeFichier: 'PDF' | 'DOCX' | 'PPTX' | 'ZIP' | 'LINK';
  fileUrl: string;
  tailleFichier?: string;
  uploadedAt: string;
  description?: string;
}

export interface DocumentEmis {
  docId: string;
  userId: string;
  typeDocument: DocType;
  hashContenu: string;
  dateEmission: string;
  dateExpiration: string;
  estRevoque: boolean;
  revoqueRaison?: string;
  metadata?: {
    matricule?: string;
    anneeUniversitaire?: string;
    formation?: string;
    mention?: string;
    moyenne?: number;
  };
}

export interface VerificationResult {
  valid: boolean;
  status: 'AUTHENTIQUE' | 'REVOQUE' | 'INTROUVABLE' | 'CORROMPU';
  message: string;
  doc?: DocumentEmis;
  user?: User;
  student?: StudentProfile;
  formation?: Formation;
}

export interface NotificationRecord {
  id: string;
  etudiantEmail: string;
  etudiantNom: string;
  matiereNom: string;
  valeurNote: number;
  dateEnvoi: string;
  lu: boolean;
}
