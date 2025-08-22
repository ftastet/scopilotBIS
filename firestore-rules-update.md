```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Fonction utilitaire pour vérifier si l'utilisateur est un administrateur
    function isAdmin() {
      return request.auth != null && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
    }

    // Collection des administrateurs
    match /admins/{adminId} {
      // Un utilisateur authentifié peut lire son propre document pour vérifier son statut d'admin.
      allow read: if request.auth != null && request.auth.uid == adminId;
      // Seuls les administrateurs existants peuvent créer, mettre à jour ou supprimer d'autres documents admin.
      allow create, update, delete: if isAdmin();
    }

    // Collection des projets - les utilisateurs peuvent lire/écrire leurs propres projets
    match /projects/{projectId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == resource.data.userId || isAdmin());
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }

    // Règle générale pour toutes les autres collections
    // Seuls les administrateurs peuvent lire et écrire
    match /{path=**} {
      allow read, write: if isAdmin();
    }
  }
}
```