import React, { useState } from 'react';
import {
  CreditCard,
  FileCheck,
  FileSpreadsheet,
  Calendar,
  BookOpen,
  Download,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  FileText,
  ExternalLink,
} from 'lucide-react';
import {
  User,
  StudentProfile,
  Formation,
  Matiere,
  Examen,
  Note,
  CoursRessource,
  DocumentEmis,
} from '../../types';
import { StudentCard } from './StudentCard';
import { OfficialCertificate } from './OfficialCertificate';
import { OfficialTranscript } from './OfficialTranscript';

interface StudentDashboardProps {
  user: User;
  student: StudentProfile;
  formation: Formation;
  matieres: Matiere[];
  examens: Examen[];
  notes: Note[];
  ressources: CoursRessource[];
  documents: DocumentEmis[];
  onVerifyDoc: (docId: string) => void;
  onGenerateDoc: (type: 'STUDENT_CARD') => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  student,
  formation,
  matieres,
  examens,
  notes,
  ressources,
  documents,
  onVerifyDoc,
  onGenerateDoc,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'CARD' | 'CERTIFICATE' | 'TRANSCRIPT' | 'EXAMS' | 'COURSES'
  >('CARD');
  const [selectedMatiereFilter, setSelectedMatiereFilter] = useState<number | 'ALL'>('ALL');

  // Filter exams and retakes for student
  const studentNotes = notes.filter((n) => n.etudiantId === user.id);
  const failedExamIds = studentNotes
    .filter((n) => n.valeurNote < 10)
    .map((n) => n.examenId);

  const retakeExams = examens.filter(
    (e) =>
      e.session === 'RATTRAPAGE' &&
      (failedExamIds.includes(e.examenId - 2) || e.matiereId === 103) // demo link
  );

  return (
    <div className="space-y-6">
      {/* Student Profile Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-blue-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profilePhoto}
              alt={user.firstName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  {student.statut === 'ACTIF' ? 'Inscrit(e)' : student.statut}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-200 mt-1">
                {formation.nomFormation} • <span className="font-mono text-amber-300">{student.matricule}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Année Académique {student.anneeUniversitaire} • {formation.departement}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/80 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Matricule Officiel
              </span>
              <span className="font-mono font-bold text-amber-300 text-sm">
                {student.matricule}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs navigation */}
        <div className="flex overflow-x-auto gap-2 mt-6 pt-4 border-t border-blue-800/50 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('CARD')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'CARD'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Carte d'Étudiant</span>
          </button>
          <button
            onClick={() => setActiveSubTab('CERTIFICATE')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'CERTIFICATE'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Certificat de Scolarité</span>
          </button>
          <button
            onClick={() => setActiveSubTab('TRANSCRIPT')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'TRANSCRIPT'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Relevé de Notes</span>
          </button>
          <button
            onClick={() => setActiveSubTab('EXAMS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'EXAMS'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Examens & Rattrapages</span>
            {failedExamIds.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full">
                {failedExamIds.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab('COURSES')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeSubTab === 'COURSES'
                ? 'bg-white text-blue-900 shadow-md'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Cours & Ressources</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeSubTab === 'CARD' && (
        <StudentCard
          user={user}
          student={student}
          formation={formation}
          documents={documents}
          onVerifyDoc={onVerifyDoc}
          onGenerateDoc={onGenerateDoc}
        />
      )}

      {activeSubTab === 'CERTIFICATE' && (
        <OfficialCertificate
          user={user}
          student={student}
          formation={formation}
          documents={documents}
          onVerifyDoc={onVerifyDoc}
        />
      )}

      {activeSubTab === 'TRANSCRIPT' && (
        <OfficialTranscript
          user={user}
          student={student}
          formation={formation}
          matieres={matieres}
          examens={examens}
          notes={notes}
          documents={documents}
          onVerifyDoc={onVerifyDoc}
        />
      )}

      {activeSubTab === 'EXAMS' && (
        <div className="space-y-6">
          {/* Rattrapages Warning if applicable */}
          {failedExamIds.length > 0 && (
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-xl text-amber-900 shadow-sm">
              <div className="flex items-center gap-2 font-bold text-sm mb-1">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Convocation en Session de Rattrapage Détectée</span>
              </div>
              <p className="text-xs text-amber-800">
                Vous avez une note inférieure à 10/20 lors de la session normale. Vous êtes convoqué(e) d'office à
                l'épreuve de rattrapage ci-dessous.
              </p>
            </div>
          )}

          {/* Exam Timetable Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examens.map((exam) => {
              const matiere = matieres.find((m) => m.matiereId === exam.matiereId);
              const note = studentNotes.find((n) => n.examenId === exam.examenId);
              const isRetake = exam.session === 'RATTRAPAGE';

              return (
                <div
                  key={exam.examenId}
                  className={`bg-white rounded-xl p-5 border shadow-sm transition hover:shadow-md ${
                    isRetake ? 'border-amber-300 bg-amber-50/30' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isRetake
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-blue-100 text-blue-800 border-blue-300'
                        }`}
                      >
                        Session {exam.session}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-1">
                        {matiere?.nomMatiere || 'Matière'}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono">
                        Code: {matiere?.codeMatiere} • {matiere?.creditsEcts} ECTS • Coeff. {matiere?.coefficient}
                      </p>
                    </div>

                    {note !== undefined && (
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block uppercase">Note Obtenue</span>
                        <span
                          className={`text-lg font-bold font-mono ${
                            note.valeurNote >= 10 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {note.valeurNote.toFixed(1)} / 20
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Date : {new Date(exam.dateExamen).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Horaire : {exam.heure} ({exam.dureeMinutes} min)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">Salle : {exam.salle}</span>
                    </div>
                  </div>

                  {note?.commentaires && (
                    <p className="text-xs italic text-slate-500 mt-3 pt-2 border-t border-slate-100">
                      « {note.commentaires} »
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeSubTab === 'COURSES' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Espace Pédagogique & Supports de Cours
              </h2>
              <p className="text-xs text-slate-500">
                Téléchargez les polycopiés, corrigés de TD et diaporamas mis à disposition par les enseignants.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Filtrer par matière :</span>
              <select
                aria-label="Filtrer les supports de cours par matière"
                value={selectedMatiereFilter}
                onChange={(e) =>
                  setSelectedMatiereFilter(
                    e.target.value === 'ALL' ? 'ALL' : Number(e.target.value)
                  )
                }
                className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700"
              >
                <option value="ALL">Toutes les matières ({matieres.length})</option>
                {matieres.map((m) => (
                  <option key={m.matiereId} value={m.matiereId}>
                    {m.nomMatiere}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Resources List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ressources
              .filter(
                (r) =>
                  selectedMatiereFilter === 'ALL' || r.matiereId === selectedMatiereFilter
              )
              .map((res) => {
                const matiere = matieres.find((m) => m.matiereId === res.matiereId);

                return (
                  <div
                    key={res.ressourceId}
                    className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {matiere?.nomMatiere || 'Matière'}
                        </span>
                        <span>{new Date(res.uploadedAt).toLocaleDateString('fr-FR')}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug">
                        {res.titre}
                      </h3>

                      {res.description && (
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {res.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500">
                        <FileText className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {res.typeFichier} • {res.tailleFichier || '3 Mo'}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const element = document.createElement('a');
                          element.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(`SUPPORT DE COURS : ${res.titre}\nMatière : ${matiere?.nomMatiere}\nUSTP Paris`);
                          element.download = `${res.titre.slice(0, 30)}.txt`;
                          element.click();
                        }}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Télécharger</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
