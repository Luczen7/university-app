import React, { useState } from 'react';
import {
  FileCode,
  Database,
  Layers,
  Copy,
  CheckCircle,
  FolderTree,
  Shield,
  Server,
  Globe,
  Code2,
} from 'lucide-react';

export const ArchitectureViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'TREE' | 'SQL' | 'ARCHITECTURE'>('TREE');
  const [copiedSql, setCopiedSql] = useState(false);

  const fullSqlScript = `-- =============================================================================
-- SYSTEME DE GESTION UNIVERSITAIRE (SGU) - SCHEMA OFFICIEL COMPLET
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Types ENUM
CREATE TYPE user_role AS ENUM ('STUDENT', 'TEACHER', 'ADMIN');
CREATE TYPE session_type AS ENUM ('NORMALE', 'RATTRAPAGE');
CREATE TYPE doc_type AS ENUM ('STUDENT_CARD', 'CERTIFICATE', 'TRANSCRIPT');

-- 2. Table Utilisateurs (Auth & Profils)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    profile_photo TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Structure Académique
CREATE TABLE formations (
    formation_id SERIAL PRIMARY KEY,
    code_formation VARCHAR(20) UNIQUE NOT NULL,
    nom_formation VARCHAR(255) NOT NULL,
    description TEXT,
    duree_annees INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE matieres (
    matiere_id SERIAL PRIMARY KEY,
    code_matiere VARCHAR(20) UNIQUE NOT NULL,
    nom_matiere VARCHAR(255) NOT NULL,
    credits_ects INT NOT NULL,
    coefficient DECIMAL(3,2) NOT NULL,
    formation_id INT REFERENCES formations(formation_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Acteurs Spécifiques
CREATE TABLE etudiants (
    etudiant_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    matricule VARCHAR(50) UNIQUE NOT NULL,
    date_naissance DATE NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20),
    date_inscription DATE DEFAULT CURRENT_DATE
);

CREATE TABLE enseignants (
    enseignant_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    specialite VARCHAR(255),
    grade VARCHAR(100),
    telephone VARCHAR(20)
);

-- 5. Inscriptions
CREATE TABLE inscriptions (
    inscription_id SERIAL PRIMARY KEY,
    etudiant_id UUID REFERENCES etudiants(etudiant_id) ON DELETE CASCADE,
    formation_id INT REFERENCES formations(formation_id),
    annee_universitaire VARCHAR(10) NOT NULL,
    statut VARCHAR(20) DEFAULT 'ACTIF',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(etudiant_id, formation_id, annee_universitaire)
);

-- 6. Cours et Ressources Pédagogiques
CREATE TABLE cours_ressources (
    ressource_id SERIAL PRIMARY KEY,
    matiere_id INT REFERENCES matieres(matiere_id) ON DELETE CASCADE,
    enseignant_id UUID REFERENCES enseignants(enseignant_id),
    titre VARCHAR(255) NOT NULL,
    type_fichier VARCHAR(50),
    file_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Examens et Notes
CREATE TABLE examens (
    examen_id SERIAL PRIMARY KEY,
    matiere_id INT REFERENCES matieres(matiere_id) ON DELETE CASCADE,
    date_examen TIMESTAMP WITH TIME ZONE NOT NULL,
    salle VARCHAR(50),
    session session_type DEFAULT 'NORMALE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    etudiant_id UUID REFERENCES etudiants(etudiant_id) ON DELETE CASCADE,
    examen_id INT REFERENCES examens(examen_id) ON DELETE CASCADE,
    valeur_note DECIMAL(4,2) CHECK (valeur_note >= 0 AND valeur_note <= 20),
    date_saisie TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    validee_par UUID REFERENCES enseignants(enseignant_id),
    commentaires TEXT,
    UNIQUE(etudiant_id, examen_id)
);

-- 8. Sécurisation & Anti-Fraude (Documents Émis & QR Code)
CREATE TABLE documents_emis (
    doc_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    type_document doc_type NOT NULL,
    hash_contenu TEXT NOT NULL,
    date_emission TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    date_expiration TIMESTAMP WITH TIME ZONE,
    est_revoque BOOLEAN DEFAULT FALSE,
    revoque_raison TEXT
);

-- Index pour haute performance
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_etudiant_matricule ON etudiants(matricule);
CREATE INDEX idx_notes_etudiant ON notes(etudiant_id);
CREATE INDEX idx_documents_hash ON documents_emis(hash_contenu);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(fullSqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Spécification Technique & Schéma SQL
              </span>
              <span className="text-xs text-slate-400">Architecture Propre & Scalable</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Arborescence Complète du Projet & Base de Données
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Structure modulaire Clean Architecture pour le déploiement Web, Mobile et Microservices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('TREE')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'TREE'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <FolderTree className="w-4 h-4 inline mr-1.5" />
              Arborescence Fichiers
            </button>
            <button
              onClick={() => setActiveTab('SQL')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'SQL'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4 inline mr-1.5" />
              Schéma SQL (MLD)
            </button>
            <button
              onClick={() => setActiveTab('ARCHITECTURE')}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'ARCHITECTURE'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4 inline mr-1.5" />
              Principes & Sécurité QR
            </button>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: FILE TREE ================= */}
      {activeTab === 'TREE' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-amber-600" />
                Arborescence Structurée du Projet (Backend & Frontend)
              </h2>
              <p className="text-xs text-slate-500">
                Chaque fichier répond au principe de responsabilité unique (Single Responsibility Principle).
              </p>
            </div>
          </div>

          {/* Directory Visualizer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Backend Tree */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-5 font-mono text-xs border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-indigo-400 font-bold">
                  <Server className="w-4 h-4" />
                  <span>backend/ (Node.js + TypeScript + Prisma)</span>
                </div>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800">
                  API REST
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <div>├── <span className="text-emerald-400 font-bold">prisma/</span></div>
                <div>│   ├── <span className="text-amber-300">schema.prisma</span> <span className="text-slate-500"># Modèle ORM, types & contraintes SQL</span></div>
                <div>│   └── <span className="text-slate-400">migrations/</span> <span className="text-slate-500"># Historique de versionnage de la base</span></div>
                <div>├── <span className="text-emerald-400 font-bold">src/</span></div>
                <div>│   ├── <span className="text-sky-300">config/</span></div>
                <div>│   │   ├── <span className="text-slate-300">db.ts</span> <span className="text-slate-500"># Instance Singleton PrismaClient</span></div>
                <div>│   │   ├── <span className="text-slate-300">multer.ts</span> <span className="text-slate-500"># Filtrage MIME & taille des fichiers (10 Mo)</span></div>
                <div>│   │   └── <span className="text-slate-300">nodemailer.ts</span> <span className="text-slate-500"># Connexion SMTP pour notifications</span></div>
                <div>│   ├── <span className="text-sky-300">controllers/</span></div>
                <div>│   │   ├── <span className="text-slate-300">authController.ts</span> <span className="text-slate-500"># Inscription, Login, vérification</span></div>
                <div>│   │   ├── <span className="text-slate-300">gradeController.ts</span> <span className="text-slate-500"># Saisie groupée & moyennes</span></div>
                <div>│   │   ├── <span className="text-slate-300">docController.ts</span> <span className="text-slate-500"># Génération PDF & QR Code</span></div>
                <div>│   │   └── <span className="text-slate-300">resourceController.ts</span> <span className="text-slate-500"># Téléversement de cours</span></div>
                <div>│   ├── <span className="text-sky-300">services/</span> <span className="text-amber-400 font-semibold">[Cœur Métier]</span></div>
                <div>│   │   ├── <span className="text-slate-300">authService.ts</span> <span className="text-slate-500"># Hachage bcrypt, création JWT</span></div>
                <div>│   │   ├── <span className="text-slate-300">gradeService.ts</span> <span className="text-slate-500"># Pondération, détection rattrapages</span></div>
                <div>│   │   ├── <span className="text-slate-300">documentService.ts</span> <span className="text-slate-500"># Moteur PDFKit + QR Code</span></div>
                <div>│   │   ├── <span className="text-slate-300">resourceService.ts</span> <span className="text-slate-500"># Stockage Cloud S3 / Cloudinary</span></div>
                <div>│   │   └── <span className="text-slate-300">notificationService.ts</span> <span className="text-slate-500"># Emails HTML asynchrones</span></div>
                <div>│   ├── <span className="text-sky-300">middlewares/</span></div>
                <div>│   │   ├── <span className="text-slate-300">authMiddleware.ts</span> <span className="text-slate-500"># Contrôle du token Bearer JWT</span></div>
                <div>│   │   └── <span className="text-slate-300">roleMiddleware.ts</span> <span className="text-slate-500"># RBAC (STUDENT / TEACHER / ADMIN)</span></div>
                <div>│   ├── <span className="text-sky-300">routes/</span></div>
                <div>│   │   ├── <span className="text-slate-300">authRoutes.ts</span> <span className="text-slate-500"># /api/auth/*</span></div>
                <div>│   │   ├── <span className="text-slate-300">academicRoutes.ts</span> <span className="text-slate-500"># /api/grades/*, /api/exams/*</span></div>
                <div>│   │   ├── <span className="text-slate-300">documentRoutes.ts</span> <span className="text-slate-500"># /api/docs/*, /verify/:docId</span></div>
                <div>│   │   └── <span className="text-slate-300">resourceRoutes.ts</span> <span className="text-slate-500"># /api/resources/*</span></div>
                <div>│   └── <span className="text-amber-300">app.ts</span> <span className="text-slate-500"># Serveur Express & middlewares globaux</span></div>
                <div>├── <span className="text-slate-400">uploads/</span> <span className="text-slate-500"># Stockage temporaire sécurisé</span></div>
                <div>├── <span className="text-slate-400">.env</span> <span className="text-slate-500"># DATABASE_URL, JWT_SECRET, SMTP_KEY</span></div>
                <div>└── <span className="text-slate-400">package.json</span></div>
              </div>
            </div>

            {/* Frontend Tree */}
            <div className="bg-slate-950 text-slate-200 rounded-xl p-5 font-mono text-xs border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-blue-400 font-bold">
                  <Globe className="w-4 h-4" />
                  <span>frontend/ (Next.js / React + TailwindCSS)</span>
                </div>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                  SPA & PWA
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <div>├── <span className="text-emerald-400 font-bold">src/app/</span> <span className="text-slate-500"># Next.js App Router</span></div>
                <div>│   ├── <span className="text-slate-300">layout.tsx</span> <span className="text-slate-500"># Navbar générale, AuthProvider</span></div>
                <div>│   ├── <span className="text-slate-300">page.tsx</span> <span className="text-slate-500"># Portail d'accueil universitaire</span></div>
                <div>│   ├── <span className="text-sky-300">(auth)/login/</span> <span className="text-slate-500"># Connexion différenciée par rôle</span></div>
                <div>│   ├── <span className="text-sky-300">(dashboard)/student/</span></div>
                <div>│   │   ├── <span className="text-slate-300">grades/page.tsx</span> <span className="text-slate-500"># Suivi des notes & relevé</span></div>
                <div>│   │   └── <span className="text-slate-300">documents/page.tsx</span> <span className="text-slate-500"># Carte & certificat PDF</span></div>
                <div>│   ├── <span className="text-sky-300">(dashboard)/teacher/</span></div>
                <div>│   │   ├── <span className="text-slate-300">grades/page.tsx</span> <span className="text-slate-500"># Grille de saisie & rattrapages</span></div>
                <div>│   │   └── <span className="text-slate-300">resources/page.tsx</span> <span className="text-slate-500"># Upload de supports de cours</span></div>
                <div>│   ├── <span className="text-sky-300">(dashboard)/admin/</span> <span className="text-slate-500"># Audit documents & gestion users</span></div>
                <div>│   └── <span className="text-sky-300">verify/[docId]/</span> <span className="text-slate-500"># Page publique validation QR</span></div>
                <div>├── <span className="text-emerald-400 font-bold">src/components/</span></div>
                <div>│   ├── <span className="text-slate-300">StudentCard.tsx</span> <span className="text-slate-500"># Carte d'étudiant 3D + puce NFC</span></div>
                <div>│   ├── <span className="text-slate-300">OfficialCertificate.tsx</span> <span className="text-slate-500"># Certificat officiel avec sceau</span></div>
                <div>│   ├── <span className="text-slate-300">OfficialTranscript.tsx</span> <span className="text-slate-500"># Relevé de notes ECTS officiel</span></div>
                <div>│   └── <span className="text-slate-300">ProtectedRoute.tsx</span> <span className="text-slate-500"># Guard RBAC côté client</span></div>
                <div>├── <span className="text-emerald-400 font-bold">src/store/</span></div>
                <div>│   └── <span className="text-amber-300">authStore.ts</span> <span className="text-slate-500"># Zustand persistant (JWT, rôle, user)</span></div>
                <div>├── <span className="text-emerald-400 font-bold">src/services/</span></div>
                <div>│   └── <span className="text-slate-300">api.ts</span> <span className="text-slate-500"># Axios avec intercepteur Bearer token</span></div>
                <div>├── <span className="text-slate-400">tailwind.config.js</span></div>
                <div>└── <span className="text-slate-400">package.json</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: SQL SCHEMA ================= */}
      {activeTab === 'SQL' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Script SQL Complet PostgreSQL (DDL & Contraintes)
              </h2>
              <p className="text-xs text-slate-500">
                Prêt à être exécuté dans pgAdmin, Supabase, Neon ou Railway.
              </p>
            </div>

            <button
              onClick={handleCopySql}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow transition"
            >
              {copiedSql ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Copié dans le presse-papier !</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copier le Script SQL</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto max-h-[500px] border border-slate-800">
            <pre>{fullSqlScript}</pre>
          </div>
        </div>
      )}

      {/* ================= TAB 3: ARCHITECTURE & QR SECURITY ================= */}
      {activeTab === 'ARCHITECTURE' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            Stratégie Anti-Falsification & Cycle de Vie du QR Code
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-sm text-blue-950">Génération Sécurisée</h3>
              <p className="text-xs text-slate-600">
                On ne stocke pas les données brutes dans le QR Code. Le QR contient un <strong>pointeur d'authentification</strong> : <code className="text-[10px] bg-white p-1 rounded font-mono">https://univ.edu/verify/:token</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <h3 className="font-bold text-sm text-indigo-950">Empreinte SHA-256</h3>
              <p className="text-xs text-slate-600">
                Le document émis est signé par un hash cryptographique SHA-256 calculé à partir de l'identité, du matricule et de la date d'émission, empêchant toute altération physique.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <h3 className="font-bold text-sm text-purple-950">Révocation en 1 Clic</h3>
              <p className="text-xs text-slate-600">
                Si un étudiant est exclu ou en cas d'erreur de diplôme, l'administrateur passe <code className="text-[10px] bg-white p-1 rounded font-mono">est_revoque = true</code>. Le document devient instantanément invalide au scan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
