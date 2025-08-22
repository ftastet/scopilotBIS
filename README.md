# Scopilot

## Objectif
Scopilot est une application web qui aide à cadrer un projet étape par étape. Elle gère les phases (initiale, options, finale), les parties prenantes et les checklists, avec la possibilité d'exporter les résultats en PDF. Le projet est développé en React et TypeScript, utilise Vite pour le build, Tailwind CSS pour le style et Firebase pour l'authentification et le stockage des données.

## Installation
1. Cloner ce dépôt.
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Créer un fichier `.env` à la racine du projet avec les variables Firebase suivantes :
   ```env
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=...
   VITE_FIREBASE_PROJECT_ID=...
   VITE_FIREBASE_STORAGE_BUCKET=...
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```

## Lancement
Lancer le serveur de développement :
```bash
npm run dev
```
Par défaut, l'application est accessible sur [http://localhost:5173](http://localhost:5173).

## Structure du code
```
scopilotBIS/
├── src/
│   ├── pages/             # Pages de l'application (Dashboard, Login, Project, Phases)
│   ├── components/        # Composants UI et spécifiques au projet
│   ├── store/             # Stores Zustand pour l'authentification et les projets
│   ├── utils/             # Fonctions utilitaires (export PDF...)
│   └── types/             # Types TypeScript communs
├── public/                # Fichiers statiques
├── doc/                   # Documentation interne
├── package.json           # Scripts et dépendances
└── ...                    # Fichiers de configuration (tsconfig, vite.config, etc.)
```
