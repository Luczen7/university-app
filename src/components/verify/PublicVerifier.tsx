import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  QrCode,
  Calendar,
  User,
  GraduationCap,
  Fingerprint,
  ExternalLink,
} from 'lucide-react';
import { DocumentEmis, User as UserType, StudentProfile, Formation } from '../../types';
import { verifyDocumentRecord } from '../../utils/academicRules';

interface PublicVerifierProps {
  initialToken?: string;
  documents: DocumentEmis[];
  users: UserType[];
  students: StudentProfile[];
  formations: Formation[];
}

export const PublicVerifier: React.FC<PublicVerifierProps> = ({
  initialToken = 'doc-card-sarah-8819',
  documents,
  users,
  students,
  formations,
}) => {
  const [tokenInput, setTokenInput] = useState<string>(initialToken);
  const [activeToken, setActiveToken] = useState<string>(initialToken);

  const verification = verifyDocumentRecord(activeToken, documents);
  const matchedDoc = verification.doc;
  const beneficiaryUser = matchedDoc ? users.find((u) => u.id === matchedDoc.userId) : undefined;
  const studentProfile = matchedDoc ? students.find((s) => s.id === matchedDoc.userId) : undefined;
  const formation = studentProfile
    ? formations.find((f) => f.formationId === studentProfile.formationId)
    : undefined;

  const handleVerify = (token: string) => {
    setActiveToken(token);
    setTokenInput(token);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Verification Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Portail Public de Vérification Sécurisée USTP</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-black text-slate-900">
          Contrôle d'Authenticité Anti-Falsification
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          Scannez le QR Code officiel présent sur une carte d'étudiant, un certificat ou un relevé de notes pour vérifier son authenticité en temps réel.
        </p>
      </div>

      {/* Quick Test Bar & Token Input */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <label className="block text-xs font-bold text-slate-700">
          Entrez ou collez le Token unique du document (UUID / ID) :
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="ex: doc-card-sarah-8819..."
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <button
            onClick={() => handleVerify(tokenInput)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2 rounded-xl shadow transition"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Vérifier</span>
          </button>
        </div>

        {/* Preset Test Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">Tests rapides :</span>
          <button
            onClick={() => handleVerify('doc-card-sarah-8819')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium transition"
          >
            ✓ Carte Valide (Sarah)
          </button>
          <button
            onClick={() => handleVerify('doc-certif-sarah-2026')}
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-medium transition"
          >
            ✓ Certificat Scolarité
          </button>
          <button
            onClick={() => handleVerify('doc-revoked-sample-999')}
            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-medium transition"
          >
            ✗ Document Révoqué (Test Fraude)
          </button>
          <button
            onClick={() => handleVerify('fake-counterfeit-uuid-000')}
            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 font-medium transition"
          >
            ✗ Faux Document (Inconnu)
          </button>
        </div>
      </div>

      {/* Verification Result Card */}
      <div
        className={`bg-white rounded-2xl border-2 shadow-xl p-6 sm:p-8 overflow-hidden transition-all ${
          verification.status === 'AUTHENTIQUE'
            ? 'border-emerald-500 shadow-emerald-500/10'
            : verification.status === 'REVOQUE'
            ? 'border-rose-500 shadow-rose-500/10'
            : 'border-slate-400'
        }`}
      >
        {/* ================= CASE 1: AUTHENTIQUE ================= */}
        {verification.status === 'AUTHENTIQUE' && matchedDoc && beneficiaryUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                <CheckCircle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                  DOCUMENT CERTIFIÉ CONFORME
                </span>
                <h2 className="text-xl font-bold text-emerald-950">
                  Document Authentique & Valide
                </h2>
                <p className="text-xs text-emerald-800">
                  L'enregistrement correspond exactement à l'état de la base centrale USTP Paris.
                </p>
              </div>
            </div>

            {/* Student Snapshot details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div className="flex flex-col items-center sm:items-start">
                <img
                  src={beneficiaryUser.profilePhoto}
                  alt={beneficiaryUser.firstName}
                  className="w-24 h-28 object-cover rounded-xl border-2 border-emerald-500 shadow-md"
                />
                <span className="mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Identité Vérifiée
                </span>
              </div>

              <div className="sm:col-span-2 space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                    Titulaire Officiel
                  </span>
                  <span className="text-base font-bold text-slate-900">
                    {beneficiaryUser.lastName.toUpperCase()} {beneficiaryUser.firstName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Matricule
                    </span>
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      {studentProfile?.matricule || matchedDoc.metadata?.matricule}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Type de Document
                    </span>
                    <span className="font-bold text-slate-800">
                      {matchedDoc.typeDocument.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                    Filière d'Études
                  </span>
                  <span className="text-slate-800 font-medium">
                    {formation?.nomFormation || matchedDoc.metadata?.formation}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Date d'Émission
                    </span>
                    <span className="text-slate-700">
                      {new Date(matchedDoc.dateEmission).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase text-[10px] font-semibold block">
                      Validité
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      Jusqu'au {new Date(matchedDoc.dateExpiration).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Proof */}
            <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2 text-xs border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Fingerprint className="w-4 h-4" />
                <span>Empreinte Cryptographique SHA-256 Validée</span>
              </div>
              <div className="font-mono text-[11px] text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                {matchedDoc.hashContenu}
              </div>
              <p className="text-[10px] text-slate-400">
                La signature garantit que les informations du document imprimé ou scanné n'ont subi aucune modification frauduleuse.
              </p>
            </div>
          </div>
        )}

        {/* ================= CASE 2: REVOQUE ================= */}
        {verification.status === 'REVOQUE' && matchedDoc && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 bg-rose-50 border border-rose-300 p-4 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-700">
                  ALERTE SÉCURITÉ - DOCUMENT RÉVOQUÉ
                </span>
                <h2 className="text-xl font-bold text-rose-950">
                  Ce document a été annulé par l'université
                </h2>
                <p className="text-xs text-rose-800">
                  {matchedDoc.revoqueRaison || 'Révocation académique administrative.'}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-2">
              <p className="text-slate-700 font-semibold">Détails de la révocation :</p>
              <p className="text-slate-600">
                Token ID : <span className="font-mono font-bold text-slate-900">{matchedDoc.docId}</span>
              </p>
              <p className="text-slate-600">
                Type : <span className="font-bold">{matchedDoc.typeDocument}</span>
              </p>
              <p className="text-slate-600">
                Motif officiel : <span className="text-rose-700 font-semibold">{matchedDoc.revoqueRaison}</span>
              </p>
              <p className="text-slate-500 text-[11px] italic pt-2 border-t border-slate-200">
                Toute présentation physique ou numérique de ce document est caduque et non reconnue par les autorités.
              </p>
            </div>
          </div>
        )}

        {/* ================= CASE 3: INTROUVABLE / FALSIFIE ================= */}
        {verification.status === 'INTROUVABLE' && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <XCircle className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Document Inconnu ou Falsifié
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Le token <span className="font-mono font-bold text-rose-600">« {activeToken} »</span> ne correspond à aucun document certifié dans les registres académiques de l'Université USTP.
            </p>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 max-w-md mx-auto text-left">
              <strong>Avertissement :</strong> Si vous tentez de vérifier un document papier portant ce QR Code, il s'agit probablement d'une contrefaçon.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
