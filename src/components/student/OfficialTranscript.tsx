import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  Download,
  Award,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  QrCode,
  FileSpreadsheet,
} from 'lucide-react';
import {
  User,
  StudentProfile,
  Formation,
  Matiere,
  Examen,
  Note,
  DocumentEmis,
} from '../../types';
import { calculateWeightedGPA } from '../../utils/academicRules';

interface OfficialTranscriptProps {
  user: User;
  student: StudentProfile;
  formation: Formation;
  matieres: Matiere[];
  examens: Examen[];
  notes: Note[];
  documents: DocumentEmis[];
  onVerifyDoc: (docId: string) => void;
}

export const OfficialTranscript: React.FC<OfficialTranscriptProps> = ({
  user,
  student,
  formation,
  matieres,
  examens,
  notes,
  documents,
  onVerifyDoc,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const transcriptDoc =
    documents.find((d) => d.userId === user.id && d.typeDocument === 'TRANSCRIPT') ||
    documents.find((d) => d.userId === user.id) ||
    documents[0];

  const verifyUrl = transcriptDoc
    ? `${window.location.origin}?verify=${transcriptDoc.docId}`
    : `${window.location.origin}?verify=doc-releve-sample`;

  const calculation = calculateWeightedGPA(user.id, notes, examens, matieres);

  useEffect(() => {
    QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: '#1e293b', light: '#ffffff' },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error(err));
  }, [verifyUrl]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    const element = document.createElement('a');
    const content = `RELEVÉ DE NOTES OFFICIEL - USTP PARIS\nÉtudiant: ${user.firstName} ${user.lastName} (${student.matricule})\nFilière: ${formation.nomFormation}\nMoyenne Générale: ${calculation.moyenneGenerale}/20\nMention: ${calculation.mention}\nCrédits ECTS validés: ${calculation.creditsValides}/${calculation.totalCreditsEcts}\nToken Vérification: ${transcriptDoc?.docId}\nHash SHA-256: ${transcriptDoc?.hashContenu}\nURL Vérification: ${verifyUrl}`;
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Releve_Notes_${student.matricule}_${student.anneeUniversitaire.replace('/', '-')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
            Relevé de Notes Officiel & Crédits ECTS
          </h2>
          <p className="text-xs text-slate-500">
            Calcul en temps réel des moyennes pondérées par coefficient et attribution des crédits européens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {transcriptDoc && (
            <button
              onClick={() => onVerifyDoc(transcriptDoc.docId)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition"
            >
              <QrCode className="w-4 h-4" />
              <span>Tester la vérification</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'Téléchargé !' : 'Exporter Relevé'}</span>
          </button>
        </div>
      </div>

      {/* Official Parchment/Document Render */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-xl p-8 sm:p-10 max-w-4xl mx-auto text-slate-900 print:border-none print:shadow-none print:p-0">
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5 mb-5">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest font-serif font-semibold text-slate-600">
              RÉPUBLIQUE FRANÇAISE
            </p>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight">
              UNIVERSITÉ DES SCIENCES & TECHNOLOGIES DE PARIS
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Commission d’Examen & Jury d'Attribution des Crédits Universitaires
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            {qrCodeDataUrl && (
              <div className="border border-slate-300 p-1 bg-white rounded-lg shadow-xs">
                <img src={qrCodeDataUrl} alt="QR Code Relevé" className="w-20 h-20" />
              </div>
            )}
            <span className="text-[9px] font-mono text-slate-500 mt-1">Sceau Validateur</span>
          </div>
        </div>

        {/* Title & Student Meta */}
        <div className="text-center my-4">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Relevé de Notes & Résultats Académiques
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Session d'Hiver 2025-2026 • Semestre 5
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
          <div>
            <span className="text-slate-500 block">Étudiant(e) :</span>
            <span className="font-bold text-slate-900">
              {user.lastName.toUpperCase()} {user.firstName}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Matricule :</span>
            <span className="font-mono font-bold text-blue-700">{student.matricule}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Filière :</span>
            <span className="font-semibold text-slate-800 line-clamp-1">{formation.nomFormation}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Année :</span>
            <span className="font-mono text-slate-800">{student.anneeUniversitaire}</span>
          </div>
        </div>

        {/* Grades Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl mb-6">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Intitulé de l'Unité d'Enseignement</th>
                <th className="py-2.5 px-3 text-center">Coeff.</th>
                <th className="py-2.5 px-3 text-center">ECTS</th>
                <th className="py-2.5 px-3 text-center">Note / 20</th>
                <th className="py-2.5 px-3 text-center">Résultat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {calculation.matieresDetails.map((mat) => (
                <tr key={mat.matiereId} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3 font-mono font-semibold text-slate-600">
                    {matieres.find((m) => m.matiereId === mat.matiereId)?.codeMatiere}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900">{mat.nomMatiere}</td>
                  <td className="py-2.5 px-3 text-center text-slate-600">{mat.coefficient}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{mat.creditsEcts}</td>
                  <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                    {mat.note > 0 ? mat.note.toFixed(2) : '-'}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {mat.validee ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle className="w-3 h-3" /> Validé
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <AlertCircle className="w-3 h-3" /> Rattrapage
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary & Deliberation Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-xl border border-indigo-900 shadow-md mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
              <span className="text-lg font-black font-mono text-blue-300">
                {calculation.moyenneGenerale.toFixed(2)}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-blue-300 uppercase tracking-wider font-semibold">
                Moyenne Pondérée
              </p>
              <h4 className="text-base font-bold text-white">
                {calculation.moyenneGenerale >= 10 ? 'Semestre Validé' : 'Semestre Non Validé'}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <Award className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <p className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
                Mention du Jury
              </p>
              <h4 className="text-base font-bold text-emerald-200">{calculation.mention}</h4>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-800 sm:pl-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center">
              <span className="text-sm font-bold font-mono text-purple-300">
                {calculation.creditsValides}/{calculation.totalCreditsEcts}
              </span>
            </div>
            <div>
              <p className="text-[10px] text-purple-300 uppercase tracking-wider font-semibold">
                Crédits ECTS Obtenus
              </p>
              <h4 className="text-base font-bold text-purple-200">
                {calculation.creditsValides === calculation.totalCreditsEcts
                  ? 'Totalité acquise'
                  : 'Partiellement validé'}
              </h4>
            </div>
          </div>
        </div>

        {/* Legal Signatures */}
        <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6 text-xs text-slate-600">
          <div>
            <p className="font-semibold text-slate-800">Empreinte Cryptographique :</p>
            <p className="font-mono text-[10px] text-slate-500 break-all bg-slate-50 p-1.5 rounded border border-slate-200 mt-1">
              {transcriptDoc?.hashContenu || 'sha256_transcript_verified_sample'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-slate-500">Paris, le {new Date().toLocaleDateString('fr-FR')}</p>
            <p className="font-serif font-bold text-slate-900 mt-1">
              Le Président du Jury d’Examen
            </p>
            <p className="italic text-slate-500 text-[11px]">Validé électroniquement</p>
          </div>
        </div>
      </div>
    </div>
  );
};
