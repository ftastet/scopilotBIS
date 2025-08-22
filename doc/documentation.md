# Documentation Fonctionnelle de Scopilot - Gestion de Projets FEL

## 1. Introduction Générale

### 1.1 Qu'est-ce que Scopilot ?

**Scopilot** est une application web intuitive et structurée, conçue pour accompagner les équipes et les chefs de projet dans la formalisation rigoureuse de leurs initiatives, bien avant leur lancement opérationnel. Elle propose un cadre méthodologique inspiré du processus **Front-End Loading (FEL)**, guidant l'utilisateur à travers des étapes clés de cadrage, de comparaison d'options et de validation finale.

L'application s'adresse à toute personne ou équipe impliquée dans la gestion de projet, souhaitant s'assurer d'un alignement clair des objectifs, des périmètres et des attentes de toutes les parties prenantes dès les premières étapes.

Sa philosophie repose sur la progression séquentielle, la collaboration facilitée et la validation formelle des étapes, garantissant ainsi une base solide pour la réussite de tout projet.

### 1.2 Les Bénéfices de l'Utilisation de Scopilot

L'adoption de Scopilot dans votre processus de cadrage de projet offre de multiples avantages :

*   **Minimisation des Risques Projet :** En forçant une réflexion approfondie et une validation progressive, Scopilot aide à identifier et à mitiger les risques en amont, réduisant les incertitudes et les changements coûteux en cours de projet.
*   **Alignement des Parties Prenantes :** Grâce à des sections de contenu claires, des checklists et des mécanismes d'approbation, l'application assure que toutes les parties prenantes clés partagent une compréhension commune du projet et de ses objectifs.
*   **Optimisation du Cadrage et de la Planification :** Le processus guidé permet de définir précisément le besoin, d'explorer les meilleures options et de consolider un plan d'engagement réaliste et réalisable.
*   **Centralisation de l'Information Projet :** Toutes les informations cruciales du cadrage (objectifs, périmètres, risques, budgets, jalons, notes, décisions) sont centralisées et facilement accessibles, évitant la dispersion des données.
*   **Traçabilité des Décisions :** Les validations de phase et les commentaires associés offrent une traçabilité des décisions clés prises à chaque étape du projet.

## 2. Concepts Clés de Scopilot

### 2.1 Les Phases FEL (Front-End Loading)

Au cœur de Scopilot se trouve le concept de **Front-End Loading (FEL)**, une approche structurée qui met l'accent sur la planification et la définition approfondies d'un projet avant l'investissement majeur. Scopilot décompose ce processus en trois phases distinctes et séquentielles :

1.  **Opportunité :** La phase initiale de définition du besoin et de cadrage macro.
2.  **Scénarios :** La phase d'exploration et de comparaison des différentes approches possibles.
3.  **Engagement :** La phase de consolidation et de validation finale du plan retenu.

La progression entre ces phases est séquentielle et conditionnée par la validation de la phase précédente. Cela garantit qu'une étape est pleinement définie et approuvée avant de passer à la suivante, évitant ainsi les retours en arrière coûteux.

### 2.2 Structure des Données d'un Projet

Chaque projet dans Scopilot est composé de plusieurs éléments structurés qui évoluent au fil des phases :

*   **Sections de Contenu :** Ce sont les blocs de texte enrichi où l'utilisateur documente les aspects clés du projet (contexte, objectifs, périmètre, etc.). Chaque phase possède son propre ensemble de sections, certaines étant par défaut et d'autres pouvant être personnalisées.
*   **Checklists :** Des listes d'éléments à cocher pour s'assurer que toutes les tâches ou vérifications nécessaires à une phase sont effectuées. Elles contribuent à la maturité de la phase.
*   **Parties Prenantes :** Les individus ou groupes impliqués dans le projet. Leurs rôles, niveaux d'engagement et, surtout, leurs obligations de validation sont gérés ici.
*   **Notes :** Un espace libre pour des commentaires généraux ou des informations complémentaires sur le projet.

Ces éléments s'articulent pour former une vue complète et progressive du projet, de l'idée initiale à l'engagement final.

### 2.3 Le Processus de Validation des Phases

La validation est un mécanisme central dans Scopilot, marquant la fin d'une phase et le passage à la suivante.

*   **Conditions de Validation :** Pour qu'une phase puisse être validée, plusieurs conditions doivent être remplies :
    *   Tous les éléments de la **checklist** de la phase doivent être cochés.
    *   Toutes les **parties prenantes** désignées comme "obligatoires" pour cette phase doivent avoir donné leur approbation.
    *   Pour la phase "Scénarios", un **scénario** doit impérativement être sélectionné.
*   **L'Impact de la Validation :**
    *   La validation d'une phase **débloque** l'accès à la phase suivante, permettant à l'utilisateur de progresser dans le cadrage.
    *   Pour la phase "Scénarios", la validation entraîne la **réplication automatique** du contenu du scénario sélectionné vers les sections correspondantes de la phase "Engagement", pré-remplissant ainsi la phase finale.
*   **Le Mécanisme de Dévalidation :**
    *   Il est possible de dévalider une phase précédemment validée.
    *   La dévalidation a des **conséquences en cascade** : si la phase "Opportunité" est dévalidée, les phases "Scénarios" et "Engagement" sont également dévalidées. Si la phase "Scénarios" est dévalidée, la phase "Engagement" l'est aussi. Cela garantit la cohérence des données et le respect de la progression séquentielle.

## 3. Guide Détaillé des Phases du Projet

Scopilot structure le cadrage de projet en trois phases distinctes, chacune accessible via des onglets dédiés dans la vue détaillée du projet.

### 3.1 Phase 1 : Opportunité

*   **Objectif :** Posez les bases pour aligner les parties prenantes avant d'explorer les options. Cadrez votre projet : raison d'être, objectifs, périmètre initial, risques majeurs et jalons principaux.

#### 3.1.1 Sections de Contenu (Onglet "Opportunité")

Ces sections sont le cœur de la documentation de votre opportunité. Elles sont éditables via un éditeur de texte enrichi.

*   **Rôle et Importance :** Ces sections permettent de formaliser les idées initiales, de définir le "pourquoi" et le "quoi" du projet à un niveau macro, et de s'assurer que tous les acteurs clés partagent une vision commune.
*   **Sections par Défaut :**
    *   **Contexte & Objectifs**
        *   **Placeholder :** `Donner du sens au projet et expliquer la valeur qu'il doit apporter : - Décrivez pourquoi ce projet est lancé (ex : problème, demande…). - Précisez les objectifs principaux attendus (ex : améliorer un processus, lancer un nouveau service). - Formulez des objectifs mesurables et clairs (ex : réduire délais de 20% en 6 mois).`
        *   **Tooltip :** `Donner du sens au projet et expliquer la valeur qu'il doit apporter : - Décrivez pourquoi ce projet est lancé (ex : problème, demande…). - Précisez les objectifs principaux attendus (ex : améliorer un processus, lancer un nouveau service). - Formulez des objectifs mesurables et clairs (ex : réduire délais de 20% en 6 mois).`
    *   **Périmètre préliminaire**
        *   **Placeholder :** `Eviter les malentendus dès le départ, même si c'est encore approximatif : - Indiquez ce que le projet couvre (inclusions) (ex : mise en place d'un nouveau module CRM). - Et ce qu'il ne couvre pas (exclusions) (ex : migration complète de tous les systèmes historiques).`
        *   **Tooltip :** `Eviter les malentendus dès le départ, même si c'est encore approximatif : - Indiquez ce que le projet couvre (inclusions) (ex : mise en place d'un nouveau module CRM). - Et ce qu'il ne couvre pas (exclusions) (ex : migration complète de tous les systèmes historiques).`
    *   **Risques majeurs**
        *   **Placeholder :** `Identifier les principaux risques qui pourraient avoir un impact négatif sur le projet : - Repérez les zones de fragilité (ex. disponibilité limitée d'une ressource clé). - Identifiez les événements incertains (ex : incertitude sur un budget futur).`
        *   **Tooltip :** `Identifier les principaux risques qui pourraient avoir un impact négatif sur le projet : - Repérez les zones de fragilité (ex. disponibilité limitée d'une ressource clé). - Identifiez les événements incertains (ex : incertitude sur un budget futur).`
    *   **Budget estimatif (±50%)**
        *   **Placeholder :** `Donner un ordre de grandeur du budget, avec une marge d'incertitude importante (±50%). - Indiquez une enveloppe indicative (ex : 'entre 100K et 200K €' ou 'entre 50 et 100 Jours/homme') - Vérifiez la cohérence avec les moyens disponibles.`
        *   **Tooltip :** `Donner un ordre de grandeur du budget, avec une marge d'incertitude importante (±50%). - Indiquez une enveloppe indicative (ex : 'entre 100K et 200K €' ou 'entre 50 et 100 Jours/homme') - Vérifiez la cohérence avec les moyens disponibles.`
    *   **Jalons principaux**
        *   **Placeholder :** `Donner une première vision du calendrier global : - Indiquez les grandes étapes ou dates clés prévues pour le projet, même de façon approximative. - Il n'est pas nécessaire de donner des dates précises au jour près, mais une trajectoire. - Des repères en mois ou trimestres suffisent (ex : 'Prototype en septembre, pilote en décembre…').`
        *   **Tooltip :** `Donner une première vision du calendrier global : - Indiquez les grandes étapes ou dates clés prévues pour le projet, même de façon approximative. - Il n'est pas nécessaire de donner des dates précises au jour près, mais une trajectoire. - Des repères en mois ou trimestres suffisent (ex : 'Prototype en septembre, pilote en décembre…').`
*   **Sections Personnalisées :** Vous pouvez ajouter vos propres sections via le bouton "Éditer les sections".
*   **Propriétés des Sections :**
    *   `Titre` : Le nom de la section.
    *   `Contenu` : Le texte que vous saisissez dans l'éditeur.
    *   `Placeholder` : Un texte d'aide qui apparaît dans l'éditeur lorsque la section est vide.
    *   `Tooltip` : Une icône d'information (`?`) à côté du titre, affichant un texte d'aide contextuel au survol.
    *   `Usage interne uniquement` : Une case à cocher qui, si activée, marque la section comme étant pour un usage interne. Ces sections ne seront pas incluses lors d'un export PDF en mode "Externe".

#### 3.1.2 Checklist de Maturité (Onglet "Validation")

*   **Rôle et Importance :** La checklist permet de s'assurer que tous les aspects fondamentaux de la phase "Opportunité" ont été considérés et validés. Elle est un indicateur de la maturité du cadrage initial.
*   **Éléments par Défaut :**
    *   Désignation du porteur de projet
    *   Définition des objectifs généraux
    *   Critères de succès initiaux établis
    *   Identification des parties prenantes clés
    *   Alignement avec la stratégie confirmé
    *   Analyse préliminaire des risques
    *   Validation de la faisabilité technique
    *   Estimation budgétaire ±50%
    *   Ressources préliminaires identifiées
    *   Planning macro défini
*   **Gestion de la Checklist :** Via le bouton "Éditer la checklist", vous pouvez :
    *   Ajouter de nouveaux éléments personnalisés.
    *   Supprimer des éléments personnalisés (les éléments par défaut ne peuvent pas être supprimés).
    *   Masquer/Afficher des éléments (les éléments masqués ne sont pas pris en compte dans la progression).
    *   Réordonner les éléments par glisser-déposer.

#### 3.1.3 Approbation des Parties Prenantes (Onglet "Validation")

*   **Rôle et Importance :** Cette section liste les parties prenantes qui ont été désignées comme "obligatoires" pour la validation de la phase "Opportunité". Leur approbation est essentielle pour progresser.
*   **Processus d'Approbation :** Chaque partie prenante obligatoire est représentée par une case à cocher. Cochez la case pour indiquer que cette partie prenante a approuvé le contenu de la phase.
*   **Suivi des Approbations :** Une barre de progression et un compteur (`X/Y`) indiquent le nombre d'approbations obtenues par rapport au total requis.

#### 3.1.4 Validation de la Phase (Onglet "Validation")

*   **Conditions de Validation :** La phase "Opportunité" peut être validée lorsque :
    *   Tous les éléments visibles de la checklist sont cochés.
    *   Toutes les parties prenantes obligatoires pour cette phase ont approuvé le contenu.
*   **Comment Valider/Dévalider :** Utilisez le bouton "Valider la phase" / "Annuler la validation".
*   **Impact de la Validation :** La validation de la phase "Opportunité" débloque l'accès à la phase "Scénarios".
*   **Impact de la Dévalidation :** Si la phase "Opportunité" est dévalidée, les phases "Scénarios" et "Engagement" sont automatiquement dévalidées pour maintenir la cohérence du processus.
*   **Commentaire de Validation :** Un champ de texte est disponible pour ajouter un commentaire sur la validation ou la dévalidation de la phase.

### 3.2 Phase 2 : Scénarios

*   **Objectif :** Comparez les alternatives pour retenir un périmètre réaliste et cohérent. Pour chaque option, précisez les hypothèses, livrables, contraintes, jalons et budget estimatif.

#### 3.2.1 Sections de Contenu (Onglet "Scénarios")

Cette phase est unique car elle vous permet de détailler deux scénarios distincts (A et B) pour une comparaison approfondie. Les sections de contenu sont les mêmes pour les deux scénarios.

*   **Rôle et Importance :** Cette phase est cruciale pour explorer différentes approches possibles pour le projet, évaluer leurs implications et choisir la voie la plus appropriée avant de s'engager.
*   **Sections par Défaut :**
    *   **Description & Périmètre du scénario**
        *   **Placeholder :** `Présenter clairement chaque scénario proposé et son périmètre : - Décrivez l'approche et les caractéristiques (ex : intégration légère ou refonte complète). - Indiquez ce qui est inclus et ce qui est exclu pour éviter toute ambiguïté.`
        *   **Tooltip :** `Présenter clairement chaque scénario proposé et son périmètre : - Décrivez l'approche et les caractéristiques (ex : intégration légère ou refonte complète). - Indiquez ce qui est inclus et ce qui est exclu pour éviter toute ambiguïté.`
    *   **Hypothèses & Contraintes**
        *   **Placeholder :** `Clarifier les conditions de validité du scénario : - Les hypothèses sont supposées vraies mais non vérifiées (ex : API livrée à temps). - Les contraintes sont des limites à respecter (ex : budget maximal, compatibilité technique).`
        *   **Tooltip :** `Clarifier les conditions de validité du scénario : - Les hypothèses sont supposées vraies mais non vérifiées (ex : API livrée à temps). - Les contraintes sont des limites à respecter (ex : budget maximal, compatibilité technique).`
    *   **Livrables attendus**
        *   **Placeholder :** `Identifier ce que le scénario doit concrètement produire : - Listez les résultats tangibles attendus (ex : rapport, application web, base consolidée). - Cela permet de comparer la valeur créée par chaque scénario.`
        *   **Tooltip :** `Identifier ce que le scénario doit concrètement produire : - Listez les résultats tangibles attendus (ex : rapport, application web, base consolidée). - Cela permet de comparer la valeur créée par chaque scénario.`
    *   **Budget estimatif (±30%)**
        *   **Placeholder :** `Préciser les coûts de chaque scénario avec une meilleure précision : - Fournissez une estimation affinée avec une marge ±30%. - Ex : "120K–160K €" ou "40–50 Jours/homme" selon la charge prévue.`
        *   **Tooltip :** `Préciser les coûts de chaque scénario avec une meilleure précision : - Fournissez une estimation affinée avec une marge ±30%. - Ex : "120K–160K €" ou "40–50 Jours/homme" selon la charge prévue.`
    *   **Jalons du scénario**
        *   **Placeholder :** `Donner une trajectoire temporelle pour chaque scénario : - Définissez les principales étapes avec un niveau intermédiaire de détail. - Ex : atelier en septembre, prototype en novembre, test en décembre, mise en production en mars.`
        *   **Tooltip :** `Donner une trajectoire temporelle pour chaque scénario : - Définissez les principales étapes avec un niveau intermédiaire de détail. - Ex : atelier en septembre, prototype en novembre, test en décembre, mise en production en mars.`
*   **Sections Personnalisées :** Vous pouvez ajouter vos propres sections via le bouton "Éditer les sections".
*   **Propriétés des Sections :** Identiques à la phase "Opportunité".

#### 3.2.2 Développement de Scénarios (Onglet "Scénarios")

*   **Saisie du Contenu :** Remplissez les sections pour le Scénario A et le Scénario B. Chaque scénario est indépendant.
*   **Sélection du Scénario :** Une fois les scénarios détaillés, vous devez choisir le scénario retenu en cliquant sur le bouton "Sélectionner" sous le scénario désiré. Le bouton se transformera en "Sélectionné" et le cadre du scénario deviendra bleu. Vous pouvez désélectionner un scénario en cliquant à nouveau sur le bouton "Sélectionné".
*   **Accès à la Fiche Projet Initiale :** Un bouton "Fiche projet" vous permet de consulter en lecture seule le contenu de la phase "Opportunité" sans quitter la phase "Scénarios".

#### 3.2.3 Checklist de Maturité (Onglet "Validation")

*   **Rôle et Importance :** La checklist de cette phase assure que l'analyse des scénarios a été complète et que les éléments clés pour la prise de décision sont en place.
*   **Éléments par Défaut :**
    *   Comparaison des scénarios effectuée
    *   Budget estimé ±30%
    *   Scénario retenu défini
    *   Analyse coûts/bénéfices réalisée
    *   Contraintes techniques identifiées
    *   Plan de gestion des risques établi
    *   Ressources détaillées planifiées
    *   Jalons intermédiaires définis
    *   Critères d'acceptation validés
*   **Gestion de la Checklist :** Identique à la phase "Opportunité".

#### 3.2.4 Approbation des Parties Prenantes (Onglet "Validation")

*   **Rôle et Importance :** Les parties prenantes obligatoires pour cette phase doivent approuver le choix du scénario et le contenu associé.
*   **Processus d'Approbation :** Identique à la phase "Opportunité".

#### 3.2.5 Validation de la Phase (Onglet "Validation")

*   **Conditions de Validation :** La phase "Scénarios" peut être validée lorsque :
    *   Tous les éléments visibles de la checklist sont cochés.
    *   Toutes les parties prenantes obligatoires pour cette phase ont approuvé le contenu.
    *   **Un scénario (A ou B) a été sélectionné.**
*   **Comment Valider/Dévalider :** Utilisez le bouton "Valider la phase" / "Annuler la validation".
*   **Impact de la Validation :** La validation de la phase "Scénarios" débloque l'accès à la phase "Engagement". Plus important encore, le contenu du scénario sélectionné est automatiquement répliqué dans les sections correspondantes de la phase "Engagement".
*   **Impact de la Dévalidation :** Si la phase "Scénarios" est dévalidée, la phase "Engagement" est automatiquement dévalidée.
*   **Commentaire de Validation :** Un champ de texte est disponible pour ajouter un commentaire.

### 3.3 Phase 3 : Engagement

*   **Objectif :** Établissez le socle officiel de la réalisation. Consolidez et validez le scénario retenu : périmètre final, budget, planning détaillé et accord des parties prenantes.

#### 3.3.1 Sections de Contenu (Onglet "Engagement")

Ces sections sont pré-remplies avec le contenu du scénario sélectionné de la phase "Scénarios". Elles peuvent être affinées et complétées pour constituer le document d'engagement final.

*   **Rôle et Importance :** Cette phase représente le document contractuel interne du projet. Elle formalise toutes les décisions prises et les engagements pour le lancement et l'exécution du projet.
*   **Sections par Défaut :**
    *   **Description & Périmètre définitif**
        *   **Placeholder :** `Formaliser le scénario retenu et ses limites : - Décrivez en détail le périmètre choisi, ses inclusions et exclusions. - Ex : inclus = portail web avec 3 modules ; exclu = développement d'applications mobiles natives.`
        *   **Tooltip :** `Formaliser le scénario retenu et ses limites : - Décrivez en détail le périmètre choisi, ses inclusions et exclusions. - Ex : inclus = portail web avec 3 modules ; exclu = développement d'applications mobiles natives.`
    *   **Hypothèses & Contraintes validées**
        *   **Placeholder :** `Confirmer les conditions retenues pour la mise en œuvre : - Listez les hypothèses confirmées (ex : disponibilité des ressources). - Notez les contraintes incontournables (ex : normes de sécurité, délais légaux).`
        *   **Tooltip :** `Confirmer les conditions retenues pour la mise en œuvre : - Listez les hypothèses confirmées (ex : disponibilité des ressources). - Notez les contraintes incontournables (ex : normes de sécurité, délais légaux).`
    *   **Livrables définitifs**
        *   **Placeholder :** `Lister sans ambiguïté ce qui doit être livré : - Énumérez les livrables finaux (ex : appli en prod, manuel utilisateur, formation). - Sert de référence officielle et engageante pour le projet.`
        *   **Tooltip :** `Lister sans ambiguïté ce qui doit être livré : - Énumérez les livrables finaux (ex : appli en prod, manuel utilisateur, formation). - Sert de référence officielle et engageante pour le projet.`
    *   **Budget validé (±15%)**
        *   **Placeholder :** `Donner le budget final avec une incertitude réduite : - Indiquez l'enveloppe validée avec une marge de ±15%. - Ce budget devient engageant et toute variation devra être validée par une demande de changement.`
        *   **Tooltip :** `Donner le budget final avec une incertitude réduite : - Indiquez l'enveloppe validée avec une marge de ±15%. - Ce budget devient engageant et toute variation devra être validée par une demande de changement.`
    *   **Planning détaillé**
        *   **Placeholder :** `Figurer le calendrier précis avec des jalons datés : - Un jalon doit être un événement vérifiable (ex : prototype validé). - Ex : phase de test du 1er au 15 février, déploiement prévu le 1er mars.`
        *   **Tooltip :** `Figurer le calendrier précis avec des jalons datés : - Un jalon doit être un événement vérifiable (ex : prototype validé). - Ex : phase de test du 1er au 15 février, déploiement prévu le 1er mars.`
*   **Sections Personnalisées :** Vous pouvez ajouter vos propres sections via le bouton "Éditer les sections".
*   **Propriétés des Sections :** Identiques aux phases précédentes.

#### 3.3.2 Checklist de Maturité (Onglet "Validation")

*   **Rôle et Importance :** La checklist finale garantit que toutes les vérifications nécessaires avant le lancement du projet ont été effectuées.
*   **Éléments par Défaut :**
    *   Périmètre final validé
    *   Budget définitif approuvé
    *   Équipe projet constituée
    *   Planning détaillé établi
    *   Contrats et accords signés
    *   Gouvernance projet définie
    *   Plan de communication validé
    *   Critères de réussite finalisés
    *   Plan de gestion des risques approuvé
    *   Autorisation de lancement obtenue
*   **Gestion de la Checklist :** Identique aux phases précédentes.

#### 3.3.3 Approbation des Parties Prenantes (Onglet "Validation")

*   **Rôle et Importance :** Les parties prenantes obligatoires pour cette phase doivent donner leur approbation finale au document d'engagement.
*   **Processus d'Approbation :** Identique aux phases précédentes.

#### 3.3.4 Validation de la Phase (Onglet "Validation")

*   **Conditions de Validation :** La phase "Engagement" peut être validée lorsque :
    *   Tous les éléments visibles de la checklist sont cochés.
    *   Toutes les parties prenantes obligatoires pour cette phase ont approuvé le contenu.
*   **Comment Valider/Dévalider :** Utilisez le bouton "Valider la phase" / "Annuler la validation".
*   **Impact de la Validation :** La validation de cette phase marque la fin du processus de cadrage FEL dans Scopilot. Le projet est alors prêt pour son exécution.
*   **Commentaire de Validation :** Un champ de texte est disponible pour ajouter un commentaire.

## 4. Fonctionnalités Transversales

Ces fonctionnalités sont accessibles et pertinentes à travers toutes les phases du projet.

### 4.1 Gestion des Parties Prenantes (Onglet "Parties prenantes" dans chaque phase)

Cette section permet de gérer les acteurs clés de votre projet.

*   **Ajout et Modification :**
    *   **Prénom, Nom, Email, Société :** Informations d'identification.
    *   **Rôle sur le projet :** Décrivez la fonction de la personne dans le cadre du projet (ex: Chef de projet, Sponsor, Expert métier).
    *   **Personne externe :** Indique si la partie prenante est interne ou externe à l'organisation.
    *   **Niveau d'engagement :** Choisissez parmi une liste prédéfinie (Informé, Consulté, Responsable, Approbateur) pour qualifier son implication.
    *   **Doit valider les phases :** Pour chaque phase (Opportunité, Scénarios, Engagement), vous pouvez cocher si cette partie prenante est un approbateur obligatoire. Si une phase est déjà validée, cette option est désactivée pour cette phase afin de préserver l'intégrité des validations passées.
*   **Suppression d'une Partie Prenante :** Une icône de poubelle permet de supprimer une partie prenante.

### 4.2 Notes de Projet (Onglet "Notes" dans chaque phase)

*   **Rôle et Utilité :** Cet espace est dédié à la saisie de notes libres, de commentaires, de décisions informelles ou de toute information complémentaire pertinente pour le projet dans son ensemble.
*   **Accessibilité :** Les notes sont partagées et accessibles depuis les onglets "Notes" de toutes les phases (Opportunité, Scénarios, Engagement).

### 4.3 Exportation PDF (Bouton "Exporter PDF" dans les onglets de contenu de chaque phase)

Scopilot permet de générer des rapports PDF du contenu de chaque phase, avec différentes options de filtrage.

*   **Objectif :** Faciliter le partage du document de cadrage avec des audiences variées.
*   **Modes d'Exportation :**
    *   **Interne :** Inclut toutes les sections visibles de la phase, y compris celles qui sont marquées "Usage interne uniquement". Idéal pour un partage au sein de l'équipe projet ou avec des décideurs internes.
    *   **Externe :** N'inclut que les sections visibles qui ne sont *pas* marquées "Usage interne uniquement". Parfait pour un partage avec des parties prenantes externes ou des clients, en masquant les informations sensibles.
    *   **Personnalisé :** Ouvre une modale où vous pouvez sélectionner manuellement les sections spécifiques que vous souhaitez inclure dans l'export. Cela offre une flexibilité maximale pour adapter le contenu à votre audience.
*   **Processus d'Exportation :**
    1.  Cliquez sur "Exporter PDF".
    2.  Choisissez le mode d'exportation souhaité (Interne, Externe, Personnalisé).
    3.  Un aperçu du document est affiché.
    4.  Cliquez sur "Générer PDF" pour télécharger le fichier.
    *   Le nom du fichier PDF est généré automatiquement et inclut le nom du projet, la phase, un indicateur "Externe" si applicable, et la date.

### 4.4 Tableau de Bord des Projets (Page "Dashboard")

Le tableau de bord est la page d'accueil après connexion, offrant une vue d'ensemble de tous vos projets.

*   **Vue d'ensemble des Projets :** Chaque projet est affiché avec :
    *   Son nom et sa description.
    *   Sa date de création.
    *   Sa phase actuelle (Opportunité, Scénarios, Engagement).
    *   Une barre de progression combinée qui reflète l'avancement de la checklist et des approbations des parties prenantes pour la phase en cours.
*   **Actions Possibles :**
    *   Cliquer sur un projet pour accéder à sa vue détaillée.
    *   Boutons "Modifier" et "Supprimer" pour gérer le projet directement depuis le tableau de bord.
    *   Bouton "Nouveau projet" pour créer un nouveau projet.

### 4.5 Gestion des Projets (Création, Modification, Suppression)

*   **Création de Projet :** Via le bouton "Nouveau projet" sur le tableau de bord. Un formulaire simple vous demande le nom et la description du projet. Lors de la création, le projet est initialisé avec les checklists et sections par défaut pour toutes les phases.
*   **Modification des Détails du Projet :** Via le bouton "Modifier" sur le tableau de bord ou dans la vue détaillée du projet. Permet de changer le nom et la description du projet.
*   **Suppression de Projet :** Via le bouton "Supprimer" sur le tableau de bord. Une confirmation est demandée avant la suppression définitive.

### 4.6 Authentification Utilisateur

*   **Processus de Connexion :** Les utilisateurs se connectent via une page dédiée en utilisant leur adresse email et un mot de passe.
*   **Gestion des Erreurs :** L'application fournit des messages d'erreur clairs en cas d'identifiants incorrects, de compte désactivé, de tentatives excessives, etc.
*   **Déconnexion :** Un bouton "Déconnexion" est disponible dans l'en-tête de l'application une fois l'utilisateur connecté.

## 5. Architecture Technique (Vue d'ensemble pour information)

Cette section fournit un aperçu des technologies utilisées pour construire Scopilot.

### 5.1 Technologies Utilisées :

*   **Frontend :**
    *   **React :** Bibliothèque JavaScript pour la construction de l'interface utilisateur.
    *   **TypeScript :** Sur-ensemble de JavaScript qui ajoute le typage statique, améliorant la robustesse du code.
    *   **Zustand :** Solution légère pour la gestion de l'état global de l'application.
    *   **Vite :** Outil de build rapide pour le développement web.
    *   **Tailwind CSS :** Framework CSS utilitaire pour un stylisme rapide et réactif.
    *   **Lucide React :** Bibliothèque d'icônes.
    *   **React Quill :** Composant d'éditeur de texte enrichi.
    *   **Dnd-kit :** Bibliothèque pour les fonctionnalités de glisser-déposer (réorganisation des checklists et sections).
*   **Backend :**
    *   **Firebase :** Plateforme de développement d'applications de Google.
        *   **Firebase Authentication :** Pour la gestion des utilisateurs (connexion, déconnexion).
        *   **Cloud Firestore :** Base de données NoSQL pour le stockage des données des projets et des utilisateurs.
*   **Génération PDF :**
    *   **html2canvas :** Bibliothèque JavaScript qui permet de prendre des captures d'écran de pages web.
    *   **jspdf :** Bibliothèque JavaScript pour générer des fichiers PDF côté client.

### 5.2 Flux de Données Simplifié :

L'application fonctionne en mode "temps réel" grâce à Firestore. Lorsque l'utilisateur modifie des données (contenu de section, état de checklist, etc.), ces changements sont directement envoyés à Firestore. Firestore notifie ensuite l'application de ces changements, qui met à jour l'interface utilisateur en conséquence. Cela assure une synchronisation constante des données entre les utilisateurs et les différentes sessions.

## 6. Premiers Pas et Bonnes Pratiques

### 6.1 Se Connecter à Scopilot

1.  Accédez à l'URL de l'application.
2.  Sur la page de connexion, entrez votre adresse email et votre mot de passe.
3.  Cliquez sur "Se connecter".

### 6.2 Créer votre Premier Projet

1.  Une fois connecté, vous serez sur le tableau de bord.
2.  Cliquez sur le bouton "Nouveau projet".
3.  Remplissez le nom et la description de votre projet dans la modale.
4.  Cliquez sur "Créer". Vous serez redirigé vers la vue détaillée de votre nouveau projet, en phase "Opportunité".

### 6.3 Naviguer entre les Phases

*   Utilisez la barre de navigation des phases en haut de la page du projet pour passer d'une phase à l'autre (Opportunité, Scénarios, Engagement).
*   Les phases sont débloquées séquentiellement après validation de la phase précédente.

### 6.4 Conseils pour un Cadrage Efficace

*   **L'Importance de la Complétude :** Prenez le temps de remplir toutes les sections et de cocher tous les éléments de la checklist. Un cadrage complet est la clé d'un projet réussi.
*   **Utiliser les Tooltips et Placeholders :** Les textes d'aide intégrés sont là pour vous guider. N'hésitez pas à les consulter pour comprendre l'objectif de chaque champ.
*   **Tirer Parti des Options d'Exportation :** Utilisez les différents modes d'export PDF pour adapter le document à votre audience et partager uniquement les informations pertinentes.
*   **Impliquer les Bonnes Parties Prenantes au Bon Moment :** La gestion des parties prenantes est cruciale. Assurez-vous que les bonnes personnes sont désignées comme approbateurs pour chaque phase afin de garantir l'alignement.
*   **La Sélection du Scénario est Clé :** Dans la phase "Scénarios", la décision de sélectionner un scénario est fondamentale car elle impacte directement le contenu de la phase "Engagement". Prenez le temps de bien comparer les options.
*   **Utilisez les Notes :** La section "Notes" est un espace précieux pour consigner des informations contextuelles, des décisions informelles ou des points de discussion qui ne rentrent pas directement dans les sections structurées.

---

*Cette documentation a été générée le {{ date }} pour la version actuelle de Scopilot.*