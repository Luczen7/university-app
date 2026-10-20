import React from 'react';
import { X, Mail, CheckCircle2, Send, ExternalLink } from 'lucide-react';

interface EmailNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  emailData: {
    studentEmail: string;
    studentName: string;
    matiereNom: string;
    note: number;
  } | null;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  isOpen,
  onClose,
  emailData,
}) => {
  if (!isOpen || !emailData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
              Simulation d'Email Automatisé (Service Nodemailer)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Meta details */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 text-xs space-y-1 font-mono text-slate-600">
          <div>
            <strong className="text-slate-800 font-sans">De :</strong> "Université des Sciences & Technologies" &lt;no-reply@univ-tech.edu&gt;
          </div>
          <div>
            <strong className="text-slate-800 font-sans">À :</strong> {emailData.studentName} &lt;{emailData.studentEmail}&gt;
          </div>
          <div>
            <strong className="text-slate-800 font-sans">Objet :</strong> 🔔 Nouvelle note publiée : {emailData.matiereNom}
          </div>
        </div>

        {/* Rendered HTML Email Body (matching step 6 implementation) */}
        <div className="p-6 bg-slate-100 flex justify-center">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm max-w-md w-full space-y-4 text-slate-800 text-xs leading-relaxed font-sans">
            <div className="border-b border-slate-100 pb-3 text-center">
              <span className="text-sm font-black font-serif tracking-tight text-blue-900">
                UNIVERSITÉ DE TECHNOLOGIE - USTP
              </span>
              <p className="text-[10px] text-slate-400">Portail Académique Numérique</p>
            </div>

            <h3 className="text-base font-bold text-indigo-600">
              Bonjour {emailData.studentName},
            </h3>

            <p>
              Une nouvelle note officielle vient d'être enregistrée et validée par votre enseignant pour le module suivant :
            </p>

            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-xl text-center space-y-1">
              <span className="text-xs font-bold text-slate-800 block">
                {emailData.matiereNom}
              </span>
              <div className="text-2xl font-black font-mono text-indigo-700">
                {emailData.note.toFixed(1)} / 20
              </div>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  emailData.note >= 10
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {emailData.note >= 10 ? 'Unité Validée' : 'Convocation Rattrapage'}
              </span>
            </div>

            <p className="text-slate-600">
              Vous pouvez consulter le détail de vos résultats et télécharger votre relevé de notes certifié sur votre espace étudiant.
            </p>

            <div className="text-center pt-2">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-sm transition"
              >
                <span>Accéder à mon Dashboard</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 text-center">
              Ceci est un message automatique généré par le serveur académique. Merci de ne pas y répondre directement.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white px-5 py-3 flex items-center justify-between border-t border-slate-200">
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Job asynchrone exécuté avec succès en arrière-plan</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
