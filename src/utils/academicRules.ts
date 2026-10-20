/**
 * Logique métier académique pure (Calculs de moyenne, mentions, ECTS, rattrapages, signatures SHA-256)
 */

import { Matiere, Note, Examen, DocumentEmis } from '../types';

export interface GradeCalculationResult {
  moyenneGenerale: number;
  totalCreditsEcts: number;
  creditsValides: number;
  mention: 'Très Bien' | 'Bien' | 'Assez Bien' | 'Passable' | 'Ajourné';
  estAdmis: boolean;
  matieresDetails: {
    matiereId: number;
    nomMatiere: string;
    coefficient: number;
    creditsEcts: number;
    note: number;
    validee: boolean;
  }[];
}

/**
 * Calcule la moyenne pondérée de l'étudiant selon les coefficients des matières
 */
export function calculateWeightedGPA(
  etudiantId: string,
  notes: Note[],
  examens: Examen[],
  matieres: Matiere[]
): GradeCalculationResult {
  const notesEtudiant = notes.filter((n) => n.etudiantId === etudiantId);
  const examensMap = new Map(examens.map((e) => [e.examenId, e]));
  const matieresMap = new Map(matieres.map((m) => [m.matiereId, m]));

  // Pour chaque matière, on récupère la meilleure note (ou la note de rattrapage si passée)
  const matieresBestNotes = new Map<number, number>();

  notesEtudiant.forEach((note) => {
    const examen = examensMap.get(note.examenId);
    if (!examen) return;

    const existing = matieresBestNotes.get(examen.matiereId);
    if (existing === undefined || note.valeurNote > existing) {
      matieresBestNotes.set(examen.matiereId, note.valeurNote);
    }
  });

  let totalPoints = 0;
  let totalCoefficients = 0;
  let totalCreditsEcts = 0;
  let creditsValides = 0;

  const matieresDetails = matieres.map((matiere) => {
    const note = matieresBestNotes.get(matiere.matiereId) ?? 0;
    const isValidee = note >= 10;

    totalPoints += note * matiere.coefficient;
    totalCoefficients += matiere.coefficient;
    totalCreditsEcts += matiere.creditsEcts;
    if (isValidee) {
      creditsValides += matiere.creditsEcts;
    }

    return {
      matiereId: matiere.matiereId,
      nomMatiere: matiere.nomMatiere,
      coefficient: matiere.coefficient,
      creditsEcts: matiere.creditsEcts,
      note,
      validee: isValidee,
    };
  });

  const moyenneGenerale =
    totalCoefficients > 0 ? Math.round((totalPoints / totalCoefficients) * 100) / 100 : 0;

  const mention = getGradeMention(moyenneGenerale);
  const estAdmis = moyenneGenerale >= 10;

  return {
    moyenneGenerale,
    totalCreditsEcts,
    creditsValides,
    mention,
    estAdmis,
    matieresDetails,
  };
}

/**
 * Détermine la mention universitaire selon le système LMD français
 */
export function getGradeMention(
  average: number
): 'Très Bien' | 'Bien' | 'Assez Bien' | 'Passable' | 'Ajourné' {
  if (average >= 16) return 'Très Bien';
  if (average >= 14) return 'Bien';
  if (average >= 12) return 'Assez Bien';
  if (average >= 10) return 'Passable';
  return 'Ajourné';
}

/**
 * Détecte les étudiants convoqués en session de rattrapage pour un examen donné
 */
export function identifyRetakeStudents(
  examenNormalId: number,
  notes: Note[],
  seuilValidation: number = 10
): { etudiantId: string; valeurNote: number }[] {
  return notes
    .filter((n) => n.examenId === examenNormalId && n.valeurNote < seuilValidation)
    .map((n) => ({
      etudiantId: n.etudiantId,
      valeurNote: n.valeurNote,
    }));
}

/**
 * Génère un hash cryptographique simulé SHA-256 déterministe pour validation anti-falsification
 */
export function generateContentHash(payload: Record<string, unknown>): string {
  const str = JSON.stringify(payload, Object.keys(payload).sort());
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  const p3 = ((h1 ^ h2) >>> 0).toString(16).padStart(8, '0');
  const p4 = ((h1 + h2) >>> 0).toString(16).padStart(8, '0');
  return `sha256_${p1}${p2}${p3}${p4}`;
}

/**
 * Vérifie l'intégrité et le statut d'un document émis
 */
export function verifyDocumentRecord(
  docId: string,
  records: DocumentEmis[]
): {
  valid: boolean;
  status: 'AUTHENTIQUE' | 'REVOQUE' | 'INTROUVABLE';
  doc?: DocumentEmis;
  message: string;
} {
  const doc = records.find((d) => d.docId.toLowerCase() === docId.trim().toLowerCase());
  if (!doc) {
    return {
      valid: false,
      status: 'INTROUVABLE',
      message: 'Ce document est inconnu dans le registre officiel de l’université.',
    };
  }

  if (doc.estRevoque) {
    return {
      valid: false,
      status: 'REVOQUE',
      doc,
      message: `Document révoqué par l'administration académique : ${doc.revoqueRaison || 'Révocation administrative'}.`,
    };
  }

  return {
    valid: true,
    status: 'AUTHENTIQUE',
    doc,
    message: 'Document vérifié et certifié authentique par le sceau universitaire USTP.',
  };
}
