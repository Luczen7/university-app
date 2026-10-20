import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateWeightedGPA,
  getGradeMention,
  identifyRetakeStudents,
  generateContentHash,
  verifyDocumentRecord,
} from './academicRules.ts';
import { Matiere, Note, Examen, DocumentEmis } from '../types/index.ts';

test('calculateWeightedGPA calculates correct weighted average and ECTS credits', () => {
  const matieres: Matiere[] = [
    {
      matiereId: 1,
      codeMatiere: 'INFO101',
      nomMatiere: 'Algorithmique & C',
      creditsEcts: 6,
      coefficient: 3,
      formationId: 1,
      semestre: 'S1',
      enseignantId: 'teacher-1',
    },
    {
      matiereId: 2,
      codeMatiere: 'INFO102',
      nomMatiere: 'Bases de Données SQL',
      creditsEcts: 4,
      coefficient: 2,
      formationId: 1,
      semestre: 'S1',
      enseignantId: 'teacher-1',
    },
  ];

  const examens: Examen[] = [
    {
      examenId: 101,
      matiereId: 1,
      dateExamen: '2026-01-15',
      heure: '09:00',
      salle: 'Amphi A',
      session: 'NORMALE',
      dureeMinutes: 120,
      statut: 'TERMINE',
    },
    {
      examenId: 102,
      matiereId: 2,
      dateExamen: '2026-01-18',
      heure: '14:00',
      salle: 'Salle 204',
      session: 'NORMALE',
      dureeMinutes: 90,
      statut: 'TERMINE',
    },
  ];

  const notes: Note[] = [
    {
      noteId: 1,
      etudiantId: 'student-1',
      examenId: 101,
      valeurNote: 14, // 14 * 3 = 42
      dateSaisie: '2026-01-20',
      valideePar: 'teacher-1',
    },
    {
      noteId: 2,
      etudiantId: 'student-1',
      examenId: 102,
      valeurNote: 16, // 16 * 2 = 32
      dateSaisie: '2026-01-20',
      valideePar: 'teacher-1',
    },
  ];

  const result = calculateWeightedGPA('student-1', notes, examens, matieres);
  // Total points = 42 + 32 = 74; total coefficients = 5 => 74 / 5 = 14.8
  assert.equal(result.moyenneGenerale, 14.8);
  assert.equal(result.totalCreditsEcts, 10);
  assert.equal(result.creditsValides, 10);
  assert.equal(result.mention, 'Bien');
  assert.equal(result.estAdmis, true);
});

test('getGradeMention assigns correct French university honours', () => {
  assert.equal(getGradeMention(17.5), 'Très Bien');
  assert.equal(getGradeMention(14.2), 'Bien');
  assert.equal(getGradeMention(12.0), 'Assez Bien');
  assert.equal(getGradeMention(10.5), 'Passable');
  assert.equal(getGradeMention(9.8), 'Ajourné');
});

test('identifyRetakeStudents filters students scoring below 10/20', () => {
  const notes: Note[] = [
    {
      noteId: 1,
      etudiantId: 'student-pass',
      examenId: 201,
      valeurNote: 13.5,
      dateSaisie: '2026-02-01',
      valideePar: 't-1',
    },
    {
      noteId: 2,
      etudiantId: 'student-fail-1',
      examenId: 201,
      valeurNote: 7.5,
      dateSaisie: '2026-02-01',
      valideePar: 't-1',
    },
    {
      noteId: 3,
      etudiantId: 'student-fail-2',
      examenId: 201,
      valeurNote: 9.0,
      dateSaisie: '2026-02-01',
      valideePar: 't-1',
    },
  ];

  const retakes = identifyRetakeStudents(201, notes);
  assert.equal(retakes.length, 2);
  assert.equal(retakes[0].etudiantId, 'student-fail-1');
  assert.equal(retakes[1].etudiantId, 'student-fail-2');
});

test('generateContentHash produces deterministic hash signature', () => {
  const payload1 = { id: 'doc-123', matricule: 'ETU-2026-001', note: 15 };
  const payload2 = { id: 'doc-123', matricule: 'ETU-2026-001', note: 15 };
  const payload3 = { id: 'doc-123', matricule: 'ETU-2026-001', note: 16 };

  const hash1 = generateContentHash(payload1);
  const hash2 = generateContentHash(payload2);
  const hash3 = generateContentHash(payload3);

  assert.equal(hash1, hash2);
  assert.notEqual(hash1, hash3);
  assert.match(hash1, /^sha256_[0-9a-f]{32}$/);
});

test('verifyDocumentRecord accurately detects authentic, revoked and unknown documents', () => {
  const docs: DocumentEmis[] = [
    {
      docId: 'DOC-VALID-001',
      userId: 'u1',
      typeDocument: 'CERTIFICATE',
      hashContenu: 'sha256_abcdef123456',
      dateEmission: '2026-09-01',
      dateExpiration: '2027-08-31',
      estRevoque: false,
    },
    {
      docId: 'DOC-REVOKED-002',
      userId: 'u2',
      typeDocument: 'STUDENT_CARD',
      hashContenu: 'sha256_deadbeef0000',
      dateEmission: '2026-09-01',
      dateExpiration: '2027-08-31',
      estRevoque: true,
      revoqueRaison: 'Exclusion disciplinaire',
    },
  ];

  const validRes = verifyDocumentRecord('DOC-VALID-001', docs);
  assert.equal(validRes.valid, true);
  assert.equal(validRes.status, 'AUTHENTIQUE');

  const revokedRes = verifyDocumentRecord('DOC-REVOKED-002', docs);
  assert.equal(revokedRes.valid, false);
  assert.equal(revokedRes.status, 'REVOQUE');

  const unknownRes = verifyDocumentRecord('DOC-UNKNOWN-999', docs);
  assert.equal(unknownRes.valid, false);
  assert.equal(unknownRes.status, 'INTROUVABLE');
});
