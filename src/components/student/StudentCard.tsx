import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  GraduationCap,
  Wifi,
  Sparkles,
  QrCode,
  RotateCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Copy,
} from 'lucide-react';
import { User, StudentProfile, Formation, DocumentEmis } from '../../types';

interface StudentCardProps {
  user: User;
  student: StudentProfile;
  formation: Formation;
  documents: DocumentEmis[];
  onVerifyDoc: (docId: string) => void;
  onGenerateDoc: (type: 'STUDENT_CARD') => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  user,
  student,
  formation,
  documents,
  onVerifyDoc,
  onGenerateDoc,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [nfcBeep, setNfcBeep] = useState(false);

  // Find or determine the active student card document
  const cardDoc = documents.find(
    (d) => d.userId === user.id && d.typeDocument === 'STUDENT_CARD'
  );

  const verificationUrl = cardDoc
    ? `${window.location.origin}?verify=${cardDoc.docId}`
    : `${window.location.origin}?verify=doc-card-${student.matricule}`;

  useEffect(() => {
    QRCode.toDataURL(verificationUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Erreur QR:', err));
  }, [verificationUrl]);

  const handleSimulateNfc = () => {
    setNfcBeep(true);
    setTimeout(() => setNfcBeep(false), 1200);
  };

  const handleCopyLink = () => {
    if (cardDoc) {
      navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Action Bar */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Carte d'Étudiant Sécurisée
          </span>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Valide 2025 - 2026
          </span>
        </div>
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isFlipped ? 'Voir Recto' : 'Retourner (Verso QR)'}</span>
        </button>
      </div>

      {/* 3D Flip Card Container */}
      <div
        className="w-full max-w-md h-[270px] sm:h-[280px] perspective-1000 cursor-pointer select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* ================= RECTO ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl p-5 shadow-2xl backface-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white border-2 border-blue-500/40 overflow-hidden flex flex-col justify-between">
            {/* Holographic accent & NFC waves */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>

            {/* Card Header */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/90 border border-blue-400/50 flex items-center justify-center shadow">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-sm tracking-wider text-white uppercase">
                    Université Paris-Tech
                  </h3>
                  <p className="text-[10px] text-blue-200/90 font-medium">
                    Carte Européenne d'Étudiant • ESC
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-5 rounded bg-amber-400/90 border border-amber-300 flex items-center justify-center p-0.5 shadow-inner">
                  <div className="w-full h-full border border-amber-600/40 rounded-xs grid grid-cols-2 gap-0.5">
                    <span className="bg-amber-600/30"></span>
                    <span className="bg-amber-600/30"></span>
                  </div>
                </div>
                <Wifi className="w-4 h-4 text-blue-300" />
              </div>
            </div>

            {/* Card Body */}
            <div className="relative z-10 flex gap-4 items-center my-2">
              <div className="relative">
                <img
                  src={user.profilePhoto}
                  alt={user.firstName}
                  className="w-20 h-24 sm:w-22 sm:h-26 object-cover rounded-xl border-2 border-white/80 shadow-md"
                />
                <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
              </div>
              <div className="flex-1 space-y-1">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-blue-300 font-semibold">
                    Étudiant(e)
                  </span>
                  <h2 className="text-lg font-bold text-white leading-tight">
                    {user.lastName.toUpperCase()} {user.firstName}
                  </h2>
                </div>
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-blue-300 font-semibold">
                    Filière
                  </span>
                  <p className="text-xs text-blue-100 font-medium line-clamp-1">
                    {formation.nomFormation}
                  </p>
                </div>
                <div className="flex justify-between items-end pt-1">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-300 font-semibold">
                      Matricule
                    </span>
                    <p className="text-xs font-mono font-bold text-amber-300 tracking-wider">
                      {student.matricule}
                    </p>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-blue-300 font-semibold">
                      Né(e) le
                    </span>
                    <p className="text-[11px] text-slate-200">
                      {new Date(student.dateNaissance).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="relative z-10 flex items-center justify-between border-t border-blue-800/60 pt-2 text-[10px] text-blue-200/80">
              <span className="font-mono">Année {student.anneeUniversitaire}</span>
              <div className="flex items-center gap-1 font-semibold text-emerald-300">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Puce Cryptographique Active</span>
              </div>
            </div>
          </div>

          {/* ================= VERSO (QR CODE & AUTH) ================= */}
          <div className="absolute inset-0 w-full h-full rounded-2xl p-4 shadow-2xl backface-hidden rotate-y-180 bg-white text-slate-900 border-2 border-blue-600 flex flex-col justify-between">
            {/* Magnetic Stripe representation */}
            <div className="-mx-4 -mt-4 h-9 bg-slate-900 flex items-center justify-between px-4">
              <span className="text-[10px] text-slate-400 font-mono">
                ISO-7810 ID-1 • AUTH TOKEN : {cardDoc?.docId.slice(0, 14)}...
              </span>
              <span className="text-[9px] text-emerald-400 font-mono">VALID</span>
            </div>

            {/* Verso Content */}
            <div className="flex items-center gap-4 py-2">
              {/* QR Code Container */}
              <div className="relative bg-slate-50 p-2 rounded-xl border border-slate-300 shadow-sm flex flex-col items-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="QR Code d'authentification" className="w-28 h-28" />
                ) : (
                  <div className="w-28 h-28 bg-slate-200 animate-pulse rounded-lg"></div>
                )}
                <span className="text-[9px] font-mono text-slate-600 font-semibold mt-1">
                  SCAN ANTI-FRAUDE
                </span>
              </div>

              {/* Security Details */}
              <div className="flex-1 space-y-1.5 text-xs">
                <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Sceau Officiel d'Authenticité</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Ce QR Code certifie la validité de l’inscription académique auprès de l'USTP Paris.
                </p>
                <div className="bg-slate-100 p-2 rounded text-[10px] font-mono text-slate-700 break-all border border-slate-200">
                  <span className="text-slate-400 block text-[9px] uppercase">Empreinte SHA-256</span>
                  {cardDoc?.hashContenu.slice(0, 24)}...
                </div>
                <div className="text-[10px] text-slate-500">
                  Émis le : {cardDoc ? new Date(cardDoc.dateEmission).toLocaleDateString('fr-FR') : '01/09/2025'}
                </div>
              </div>
            </div>

            {/* Signature & Barcode representation */}
            <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between text-[10px] text-slate-500">
              <span className="italic">Signature de l'autorité académique</span>
              <span className="font-mono tracking-widest text-slate-800 font-bold">|||| | |||||| || |</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls & Verification Links */}
      <div className="w-full max-w-md mt-4 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => cardDoc && onVerifyDoc(cardDoc.docId)}
            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2 px-3 rounded-xl shadow-sm transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Tester Vérification QR</span>
          </button>

          <button
            onClick={handleSimulateNfc}
            className={`flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border transition ${
              nfcBeep
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400 scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
          >
            <Wifi className={`w-4 h-4 ${nfcBeep ? 'text-emerald-600 animate-spin' : 'text-blue-600'}`} />
            <span>{nfcBeep ? 'Bip NFC Validé !' : 'Simuler Bip NFC'}</span>
          </button>
        </div>

        <div className="flex items-center justify-between bg-slate-100 px-3 py-2 rounded-xl text-xs text-slate-600 border border-slate-200">
          <span className="truncate max-w-[280px] font-mono text-[11px] text-slate-500">
            {verificationUrl}
          </span>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium ml-2"
          >
            {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copié' : 'Copier'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
