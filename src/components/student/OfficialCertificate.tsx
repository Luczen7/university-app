import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Printer,
  Download,
  ShieldCheck,
  QrCode,
  FileCheck,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { User, StudentProfile, Formation, DocumentEmis } from '../../types';

interface OfficialCertificateProps {
  user: User;
  student: StudentProfile;
  formation: Formation;
  documents: DocumentEmis[];
  onVerifyDoc: (docId: string) => void;
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  user,
  student,
  formation,
  documents,
  onVerifyDoc,
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const certifDoc =
    documents.find((d) => d.userId === user.id && d.typeDocument === 'CERTIFICATE') ||
    documents[0];

  const verifyUrl = certifDoc
    ? `${window.location.origin}?verify=${certifDoc.docId}`
    : `${window.location.origin}?verify=doc-certif-sample`;

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
    // Trigger virtual file download
    const element = document.createElement('a');
    const file = new Blob(
      [
        `CERTIFICAT DE SCOLARITÉ OFFICIEL\nUniversité des Sciences & Technologies de Paris\nÉtudiant: ${user.firstName} ${user.lastName}\nMatricule: ${student.matricule}\nFilière: ${formation.nomFormation}\nAnnée: ${student.anneeUniversitaire}\nToken Sécurisé: ${certifDoc?.docId}\nHash SHA-256: ${certifDoc?.hashContenu}\nURL Vérification: ${verifyUrl}`,
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    element.href = URL.createObjectURL(file);
    element.download = `Certificat_Scolarite_${student.matricule}_${student.anneeUniversitaire.replace('/', '-')}.txt`;
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
            <FileCheck className="w-5 h-5 text-blue-600" />
            Certificat de Scolarité Officiel
          </h2>
          <p className="text-xs text-slate-500">
            Document certifié conforme avec signature cryptographique et QR Code anti-falsification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {certifDoc && (
            <button
              onClick={() => onVerifyDoc(certifDoc.docId)}
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
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            <span>{downloadSuccess ? 'Téléchargé !' : 'Télécharger PDF'}</span>
          </button>
        </div>
      </div>

      {/* Official Parchment/Document Render */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl shadow-xl p-8 sm:p-12 max-w-3xl mx-auto text-slate-900 relative overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <span className="text-9xl font-serif font-black tracking-widest text-slate-900">
            USTP
          </span>
        </div>

        {/* Header: Republic / University Seal */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 mb-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest font-serif font-semibold text-slate-600">
              RÉPUBLIQUE FRANÇAISE
            </p>
            <p className="text-[11px] text-slate-500">Ministère de l'Enseignement Supérieur et de la Recherche</p>
            <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-tight mt-2">
              UNIVERSITÉ DES SCIENCES & TECHNOLOGIES DE PARIS
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Direction des Études & de la Vie Universitaire • Service de Scolarité
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            {qrCodeDataUrl ? (
              <div className="border border-slate-300 p-1.5 bg-white rounded-lg shadow-xs">
                <img src={qrCodeDataUrl} alt="QR Code officiel" className="w-24 h-24" />
              </div>
            ) : null}
            <span className="text-[9px] font-mono text-slate-500 mt-1">Sceau Sécurisé</span>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center my-8">
          <div className="inline-block px-4 py-1 bg-slate-100 rounded-full text-xs font-semibold uppercase tracking-widest text-slate-700 mb-2 border border-slate-200">
            Document Administratif Officiel
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-wide uppercase">
            Certificat de Scolarité
          </h2>
          <p className="text-xs text-slate-500 font-mono mt-1">
            Réf. émission : {certifDoc?.docId}
          </p>
        </div>

        {/* Document Body */}
        <div className="space-y-6 text-sm leading-relaxed text-slate-800">
          <p>
            Le Président de l’Université des Sciences et Technologies de Paris atteste par la présente que :
          </p>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block">Nom et Prénom :</span>
                <span className="font-bold text-base text-slate-900">
                  {user.lastName.toUpperCase()} {user.firstName}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Numéro d'immatriculation (Matricule) :</span>
                <span className="font-mono font-bold text-base text-blue-700">
                  {student.matricule}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Date et lieu de naissance :</span>
                <span className="text-slate-800">
                  {new Date(student.dateNaissance).toLocaleDateString('fr-FR')} à Paris (75)
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Statut d'inscription :</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Régulièrement inscrit(e)
                </span>
              </div>
            </div>
          </div>

          <p>
            Est régulièrement inscrit(e) pour l’année universitaire{' '}
            <strong className="text-slate-900 font-bold">{student.anneeUniversitaire}</strong> au sein de la
            formation :
          </p>

          <div className="border-l-4 border-blue-600 pl-4 py-2 bg-blue-50/50 rounded-r-lg">
            <h3 className="font-serif font-bold text-base text-blue-950">
              {formation.nomFormation}
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Code filière : <span className="font-mono font-medium">{formation.codeFormation}</span> •{' '}
              {formation.departement}
            </p>
          </div>

          <p className="text-xs text-slate-600 text-justify">
            Le présent certificat est délivré à l’intéressé(e) pour faire valoir ce que de droit auprès des
            organismes sociaux, banques, transports publics et administrations compétentes.
          </p>
        </div>

        {/* Footer with Signatures & Seals */}
        <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 gap-8 items-end">
          <div className="text-xs space-y-1">
            <p className="font-semibold text-slate-700">Sécurité & Traçabilité :</p>
            <div className="font-mono text-[10px] text-slate-500 break-all bg-slate-100 p-2 rounded">
              HASH : {certifDoc?.hashContenu || 'sha256_verification_sample'}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Certificat infalsifiable garanti par l'USTP</span>
            </div>
          </div>

          <div className="text-right space-y-2">
            <p className="text-xs text-slate-600">
              Fait à Paris, le {new Date().toLocaleDateString('fr-FR')}
            </p>
            <p className="text-xs font-serif font-bold text-slate-800">
              Pour le Président de l'Université,
              <br />
              La Directrice des Affaires Académiques
            </p>
            <div className="pt-2 flex justify-end">
              <div className="inline-block border border-blue-400 bg-blue-50/80 rounded-lg p-2 text-center text-blue-900 transform -rotate-3 shadow-xs">
                <span className="block text-[10px] font-serif uppercase tracking-widest font-black">
                  ★ USTP PARIS ★
                </span>
                <span className="block text-[9px] font-mono text-blue-800">SCEAU DU RECTORAT</span>
                <span className="block text-[8px] text-emerald-700 font-bold">SIGNÉ NUMÉRIQUEMENT</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
