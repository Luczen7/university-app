import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  GraduationCap,
  BookOpen,
  QrCode,
  FileCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Search,
} from 'lucide-react';
import {
  User,
  StudentProfile,
  TeacherProfile,
  Formation,
  Matiere,
  DocumentEmis,
  Note,
} from '../../types';

interface AdminDashboardProps {
  user: User;
  users: User[];
  students: StudentProfile[];
  teachers: TeacherProfile[];
  formations: Formation[];
  matieres: Matiere[];
  documents: DocumentEmis[];
  notes: Note[];
  onToggleRevocation: (docId: string, raison?: string) => void;
  onVerifyDoc: (docId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  users,
  students,
  teachers,
  formations,
  matieres,
  documents,
  notes,
  onToggleRevocation,
  onVerifyDoc,
}) => {
  const [activeTab, setActiveTab] = useState<'AUDIT_DOCS' | 'USERS' | 'CURRICULUM'>('AUDIT_DOCS');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate statistics
  const totalStudents = students.length;
  const totalTeachers = teachers.length;
  const totalDocuments = documents.length;
  const revokedCount = documents.filter((d) => d.estRevoque).length;
  const averageGrade =
    notes.length > 0
      ? (notes.reduce((acc, curr) => acc + curr.valeurNote, 0) / notes.length).toFixed(2)
      : '0.00';

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg border border-purple-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profilePhoto}
              alt={user.firstName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-400/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                  Super Administrateur • Rectorat
                </span>
              </div>
              <p className="text-xs sm:text-sm text-purple-200 mt-1">
                Direction des Systèmes d'Information & Registre Anti-Fraude
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Accès Privilégié RBAC • Gestion des Identités & Validation des Diplômes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700 text-xs">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                Documents Sécurisés
              </span>
              <span className="font-bold text-purple-300 text-sm">
                {totalDocuments} émis ({revokedCount} révoqués)
              </span>
            </div>
          </div>
        </div>

        {/* Sub-tabs */}
        <div className="flex overflow-x-auto gap-2 mt-6 pt-4 border-t border-purple-800/50">
          <button
            onClick={() => setActiveTab('AUDIT_DOCS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'AUDIT_DOCS'
                ? 'bg-white text-purple-950 shadow-md'
                : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Registre des Documents & Anti-Fraude QR</span>
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'USERS'
                ? 'bg-white text-purple-950 shadow-md'
                : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Annuaire Utilisateurs (RBAC)</span>
          </button>
          <button
            onClick={() => setActiveTab('CURRICULUM')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
              activeTab === 'CURRICULUM'
                ? 'bg-white text-purple-950 shadow-md'
                : 'text-purple-100 hover:bg-white/10'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Formations & Maquette ECTS</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs uppercase font-semibold block">Étudiants Actifs</span>
          <span className="text-2xl font-bold font-mono text-blue-600">{totalStudents}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Inscrits en L3 / M2</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs uppercase font-semibold block">Corps Enseignant</span>
          <span className="text-2xl font-bold font-mono text-indigo-600">{totalTeachers}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Professeurs & MCF</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs uppercase font-semibold block">Documents Certifiés</span>
          <span className="text-2xl font-bold font-mono text-emerald-600">{totalDocuments}</span>
          <span className="text-[11px] text-slate-500 block mt-1">Avec empreinte SHA-256</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-slate-400 text-xs uppercase font-semibold block">Moyenne Promotion</span>
          <span className="text-2xl font-bold font-mono text-purple-600">{averageGrade} / 20</span>
          <span className="text-[11px] text-slate-500 block mt-1">Taux réussite 88%</span>
        </div>
      </div>

      {/* ================= TAB 1: AUDIT & ANTI-FRAUD ================= */}
      {activeTab === 'AUDIT_DOCS' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-purple-600" />
                  Registre d'Audit des Documents & Contrôle Anti-Fraude
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gérez l’authenticité des cartes, certificats et relevés. Cliquez sur « Révoquer » pour tester la détection de fraude en direct via le scanner QR.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher token, nom, matricule..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs border border-slate-300 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Type Document</th>
                    <th className="py-3 px-4">Bénéficiaire</th>
                    <th className="py-3 px-4">Token ID Unique (UUID)</th>
                    <th className="py-3 px-4">Empreinte SHA-256</th>
                    <th className="py-3 px-4">Date Émission</th>
                    <th className="py-3 px-4 text-center">Statut d'Authenticité</th>
                    <th className="py-3 px-4 text-center">Actions d'Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents
                    .filter((d) => {
                      const u = users.find((userObj) => userObj.id === d.userId);
                      const name = u ? `${u.firstName} ${u.lastName}` : '';
                      return (
                        d.docId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (d.metadata?.matricule || '').toLowerCase().includes(searchTerm.toLowerCase())
                      );
                    })
                    .map((doc) => {
                      const beneficiary = users.find((u) => u.id === doc.userId);
                      const stu = students.find((s) => s.id === doc.userId);

                      return (
                        <tr
                          key={doc.docId}
                          className={`transition ${
                            doc.estRevoque ? 'bg-rose-50/50 hover:bg-rose-50' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-3 px-4">
                            <span
                              className={`font-semibold px-2 py-0.5 rounded text-[10px] uppercase border ${
                                doc.typeDocument === 'STUDENT_CARD'
                                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                                  : doc.typeDocument === 'CERTIFICATE'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              }`}
                            >
                              {doc.typeDocument.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {beneficiary?.lastName.toUpperCase()} {beneficiary?.firstName}
                            <span className="block text-[10px] text-slate-500 font-mono">
                              {stu?.matricule || doc.metadata?.matricule}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600 text-[11px]">
                            {doc.docId}
                          </td>
                          <td className="py-3 px-4 font-mono text-[10px] text-slate-500">
                            {doc.hashContenu.slice(0, 18)}...
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {new Date(doc.dateEmission).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {doc.estRevoque ? (
                              <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                                <AlertTriangle className="w-3 h-3 text-rose-600" /> RÉVOQUÉ
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                <CheckCircle className="w-3 h-3 text-emerald-600" /> AUTHENTIQUE
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => onVerifyDoc(doc.docId)}
                                className="p-1.5 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
                                title="Tester la vérification dans la page publique QR"
                              >
                                <QrCode className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() =>
                                  onToggleRevocation(
                                    doc.docId,
                                    doc.estRevoque
                                      ? undefined
                                      : 'Révocation immédiate ordonnée par la scolarité'
                                  )
                                }
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1 ${
                                  doc.estRevoque
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-rose-600 hover:bg-rose-700 text-white'
                                }`}
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>{doc.estRevoque ? 'Réactiver' : 'Révoquer'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: USER DIRECTORY ================= */}
      {activeTab === 'USERS' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Contrôle des Accès & Rôles (RBAC)
          </h2>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Utilisateur</th>
                  <th className="py-3 px-4">Email Institutionnel</th>
                  <th className="py-3 px-4">Rôle Système</th>
                  <th className="py-3 px-4">Identifiant / Matricule</th>
                  <th className="py-3 px-4">Statut Compte</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const s = students.find((item) => item.id === u.id);
                  const t = teachers.find((item) => item.id === u.id);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={u.profilePhoto}
                          alt={u.firstName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200"
                        />
                        <span className="font-semibold text-slate-900">
                          {u.firstName} {u.lastName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{u.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                            u.role === 'STUDENT'
                              ? 'bg-blue-100 text-blue-800'
                              : u.role === 'TEACHER'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {u.role === 'STUDENT'
                            ? 'Étudiant'
                            : u.role === 'TEACHER'
                            ? 'Professeur'
                            : 'Administrateur'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">
                        {s?.matricule || (t ? 'ENS-PARIS-TECH' : 'ADM-RECTORAT')}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5" /> Compte Validé
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= TAB 3: CURRICULUM ================= */}
      {activeTab === 'CURRICULUM' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              Catalogue des Formations Universitaires
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formations.map((f) => (
                <div key={f.formationId} className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                      {f.codeFormation}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Durée : {f.dureeAnnees} an(s)
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{f.nomFormation}</h3>
                  <p className="text-xs text-slate-600 mt-1">{f.description}</p>
                  <p className="text-[11px] text-slate-400 mt-2 font-mono">{f.departement}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Maquette des Modules d'Enseignement (Coefficients & Crédits ECTS)
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Intitulé Matière</th>
                    <th className="py-2.5 px-3 text-center">Semestre</th>
                    <th className="py-2.5 px-3 text-center">Coefficient</th>
                    <th className="py-2.5 px-3 text-center">Crédits ECTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matieres.map((m) => (
                    <tr key={m.matiereId} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                        {m.codeMatiere}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{m.nomMatiere}</td>
                      <td className="py-2.5 px-3 text-center font-mono">{m.semestre}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                        {m.coefficient}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700">
                        {m.creditsEcts} ECTS
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
