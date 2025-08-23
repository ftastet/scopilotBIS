import { create } from 'zustand';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDoc,
  type Unsubscribe,
  type Query,
  type DocumentData
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from './useAuthStore';
import { Project, ProjectData, ChecklistItem, ProjectSection, ScenarioContentData } from '../types';
import { calculateCurrentPhase, updateProjectInFirestore } from './projectHelpers';
import { createChecklistSlice, type ChecklistSlice } from './checklistStore';
import { createSectionSlice, type SectionSlice } from './sectionStore';
import { createScenarioSlice, type ScenarioSlice } from './scenarioStore';

type Phase = 'initial' | 'options' | 'final';

interface ProjectBaseState {
  projects: Project[];
  currentProject: Project | null;
  isLoadingProjects: boolean;
  fetchProjects: () => Promise<Unsubscribe | void>;
  createProject: (name: string, description: string) => Promise<string>;
  getProject: (id: string) => Project | undefined;
  setCurrentProject: (project: Project | null) => void;
  updateProject: (id: string, updates: Partial<ProjectData>) => Promise<void>;
  updateProjectDetails: (id: string, name: string, description: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export type ProjectState = ProjectBaseState & ChecklistSlice & SectionSlice & ScenarioSlice;

const createDefaultChecklist = (phase: Phase): ChecklistItem[] => {
  const checklists: Record<Phase, string[]> = {
    initial: [
      'Désignation du porteur de projet',
      'Définition des objectifs généraux',
      'Critères de succès initiaux établis',
      'Identification des parties prenantes clés',
      'Alignement avec la stratégie confirmé',
      'Analyse préliminaire des risques',
      'Validation de la faisabilité technique',
      'Estimation budgétaire ±50%',
      'Ressources préliminaires identifiées',
      'Planning macro défini'
    ],
    options: [
      'Comparaison des scénarios effectuée',
      'Budget estimé ±30%',
      'Scénario retenu défini',
      'Analyse coûts/bénéfices réalisée',
      'Contraintes techniques identifiées',
      'Plan de gestion des risques établi',
      'Ressources détaillées planifiées',
      'Jalons intermédiaires définis',
      'Critères d\'acceptation validés'
    ],
    final: [
      'Périmètre final validé',
      'Budget définitif approuvé',
      'Équipe projet constituée',
      'Planning détaillé établi',
      'Contrats et accords signés',
      'Gouvernance projet définie',
      'Plan de communication validé',
      'Critères de réussite finalisés',
      'Plan de gestion des risques approuvé',
      'Autorisation de lancement obtenue'
    ]
  };

  return checklists[phase].map((text, index) => ({
    id: `${phase}-${index}`,
    text,
    checked: false,
    isDefault: true,
    isHidden: false
  }));
};

const createDefaultSections = (phase: Phase): ProjectSection[] => {
  const sections: Record<
    Phase,
    Array<{ title: string; placeholder: string; tooltipContent: string }>
  > = {
    initial: [
      {
        title: 'Contexte & Objectifs',
        placeholder: `Donner du sens au projet et expliquer la valeur qu'il doit apporter :
- Décrivez pourquoi ce projet est lancé (ex : problème, demande…).
- Précisez les objectifs principaux attendus (ex : améliorer un processus, lancer un nouveau service).
- Formulez des objectifs mesurables et clairs (ex : réduire délais de 20% en 6 mois).`,
        tooltipContent: `Donner du sens au projet et expliquer la valeur qu'il doit apporter :
- Décrivez pourquoi ce projet est lancé (ex : problème, demande…).
- Précisez les objectifs principaux attendus (ex : améliorer un processus, lancer un nouveau service).
- Formulez des objectifs mesurables et clairs (ex : réduire délais de 20% en 6 mois).`
      },
      {
        title: 'Périmètre préliminaire',
        placeholder: `Eviter les malentendus dès le départ, même si c'est encore approximatif :
- Indiquez ce que le projet couvre (inclusions) (ex : mise en place d'un nouveau module CRM).
- Et ce qu'il ne couvre pas (exclusions) (ex : migration complète de tous les systèmes historiques).`,
        tooltipContent: `Eviter les malentendus dès le départ, même si c'est encore approximatif :
- Indiquez ce que le projet couvre (inclusions) (ex : mise en place d'un nouveau module CRM).
- Et ce qu'il ne couvre pas (exclusions) (ex : migration complète de tous les systèmes historiques).`
      },
      {
        title: 'Risques majeurs',
        placeholder: `Identifier les principaux risques qui pourraient avoir un impact négatif sur le projet :
- Repérez les zones de fragilité (ex. disponibilité limitée d'une ressource clé).
- Identifiez les événements incertains (ex : incertitude sur un budget futur).`,
        tooltipContent: `Identifier les principaux risques qui pourraient avoir un impact négatif sur le projet :
- Repérez les zones de fragilité (ex. disponibilité limitée d'une ressource clé).
- Identifiez les événements incertains (ex : incertitude sur un budget futur).`
      },
      {
        title: 'Budget estimatif (±50%)',
        placeholder: `Donner un ordre de grandeur du budget, avec une marge d'incertitude importante (±50%). 
- Indiquez une enveloppe indicative (ex : 'entre 100K et 200K €' ou 'entre 50 et 100 Jours/homme')
- Vérifiez la cohérence avec les moyens disponibles.`,
        tooltipContent: `Donner un ordre de grandeur du budget, avec une marge d'incertitude importante (±50%). 
- Indiquez une enveloppe indicative (ex : 'entre 100K et 200K €' ou 'entre 50 et 100 Jours/homme')
- Vérifiez la cohérence avec les moyens disponibles.`
      },
      {
        title: 'Jalons principaux',
        placeholder: `Donner une première vision du calendrier global :
- Indiquez les grandes étapes ou dates clés prévues pour le projet, même de façon approximative.
- Il n'est pas nécessaire de donner des dates précises au jour près, mais une trajectoire.
- Des repères en mois ou trimestres suffisent (ex : 'Prototype en septembre, pilote en décembre…').`,
        tooltipContent: `Donner une première vision du calendrier global :
- Indiquez les grandes étapes ou dates clés prévues pour le projet, même de façon approximative.
- Il n'est pas nécessaire de donner des dates précises au jour près, mais une trajectoire.
- Des repères en mois ou trimestres suffisent (ex : 'Prototype en septembre, pilote en décembre…').`
      }
    ],
    final: [
      {
        title: 'Description & Périmètre définitif',
        placeholder: `Formaliser le scénario retenu et ses limites :
- Décrivez en détail le périmètre choisi, ses inclusions et exclusions.
- Ex : inclus = portail web avec 3 modules ; exclu = développement d'applications mobiles natives.`,
        tooltipContent: `Formaliser le scénario retenu et ses limites :
- Décrivez en détail le périmètre choisi, ses inclusions et exclusions.
- Ex : inclus = portail web avec 3 modules ; exclu = développement d'applications mobiles natives.`
      },
      {
        title: 'Hypothèses & Contraintes validées',
        placeholder: `Confirmer les conditions retenues pour la mise en œuvre :
- Listez les hypothèses confirmées (ex : disponibilité des ressources).
- Notez les contraintes incontournables (ex : normes de sécurité, délais légaux).`,
        tooltipContent: `Confirmer les conditions retenues pour la mise en œuvre :
- Listez les hypothèses confirmées (ex : disponibilité des ressources).
- Notez les contraintes incontournables (ex : normes de sécurité, délais légaux).`
      },
      {
        title: 'Livrables définitifs',
        placeholder: `Lister sans ambiguïté ce qui doit être livré :
- Énumérez les livrables finaux (ex : appli en prod, manuel utilisateur, formation).
- Sert de référence officielle et engageante pour le projet.`,
        tooltipContent: `Lister sans ambiguïté ce qui doit être livré :
- Énumérez les livrables finaux (ex : appli en prod, manuel utilisateur, formation).
- Sert de référence officielle et engageante pour le projet.`
      },
      {
        title: 'Budget validé (±15%)',
        placeholder: `Donner le budget final avec une incertitude réduite :
- Indiquez l'enveloppe validée avec une marge de ±15%.
- Ce budget devient engageant et toute variation devra être validée par une demande de changement.`,
        tooltipContent: `Donner le budget final avec une incertitude réduite :
- Indiquez l'enveloppe validée avec une marge de ±15%.
- Ce budget devient engageant et toute variation devra être validée par une demande de changement.`
      },
      {
        title: 'Planning détaillé',
        placeholder: `Figurer le calendrier précis avec des jalons datés :
- Un jalon doit être un événement vérifiable (ex : prototype validé).
- Ex : phase de test du 1er au 15 février, déploiement prévu le 1er mars.`,
        tooltipContent: `Figurer le calendrier précis avec des jalons datés :
- Un jalon doit être un événement vérifiable (ex : prototype validé).
- Ex : phase de test du 1er au 15 février, déploiement prévu le 1er mars.`
      }
    ],
    options: [
      {
        title: 'Description & Périmètre du scénario',
        placeholder: `Présenter clairement chaque scénario proposé et son périmètre :
- Décrivez l'approche et les caractéristiques (ex : intégration légère ou refonte complète).
- Indiquez ce qui est inclus et ce qui est exclu pour éviter toute ambiguïté.`,
        tooltipContent: `Présenter clairement chaque scénario proposé et son périmètre :
- Décrivez l'approche et les caractéristiques (ex : intégration légère ou refonte complète).
- Indiquez ce qui est inclus et ce qui est exclu pour éviter toute ambiguïté.`
      },
      {
        title: 'Hypothèses & Contraintes',
        placeholder: `Clarifier les conditions de validité du scénario :
- Les hypothèses sont supposées vraies mais non vérifiées (ex : API livrée à temps).
- Les contraintes sont des limites à respecter (ex : budget maximal, compatibilité technique).`,
        tooltipContent: `Clarifier les conditions de validité du scénario :
- Les hypothèses sont supposées vraies mais non vérifiées (ex : API livrée à temps).
- Les contraintes sont des limites à respecter (ex : budget maximal, compatibilité technique).`
      },
      {
        title: 'Livrables attendus',
        placeholder: `Identifier ce que le scénario doit concrètement produire :
- Listez les résultats tangibles attendus (ex : rapport, application web, base consolidée).
- Cela permet de comparer la valeur créée par chaque scénario.`,
        tooltipContent: `Identifier ce que le scénario doit concrètement produire :
- Listez les résultats tangibles attendus (ex : rapport, application web, base consolidée).
- Cela permet de comparer la valeur créée par chaque scénario.`
      },
      {
        title: 'Budget estimatif (±30%)',
        placeholder: `Préciser les coûts de chaque scénario avec une meilleure précision :
- Fournissez une estimation affinée avec une marge ±30%.
- Ex : "120K–160K €" ou "40–50 Jours/homme" selon la charge prévue.`,
        tooltipContent: `Préciser les coûts de chaque scénario avec une meilleure précision :
- Fournissez une estimation affinée avec une marge ±30%.
- Ex : "120K–160K €" ou "40–50 Jours/homme" selon la charge prévue.`
      },
      {
        title: 'Jalons du scénario',
        placeholder: `Donner une trajectoire temporelle pour chaque scénario :
- Définissez les principales étapes avec un niveau intermédiaire de détail.
- Ex : atelier en septembre, prototype en novembre, test en décembre, mise en production en mars.`,
        tooltipContent: `Donner une trajectoire temporelle pour chaque scénario :
- Définissez les principales étapes avec un niveau intermédiaire de détail.
- Ex : atelier en septembre, prototype en novembre, test en décembre, mise en production en mars.`
      }
    ]
  };

  return sections[phase].map((section, index) => ({
    id: `${phase}-section-${index}`,
    title: section.title,
    content: '',
    internalOnly: false,
    placeholder: section.placeholder,
    tooltipContent: section.tooltipContent,
    isDefault: true,
    isHidden: false,
    order: index
  }));
};

const createDefaultScenarioContent = (
  sections: ProjectSection[]
): ScenarioContentData => ({
  sectionContents: sections.reduce<Record<string, { content: string; internalOnly: boolean }>>(
    (acc, section) => {
      acc[section.id] = { content: '', internalOnly: false };
      return acc;
    },
    {}
  )
});

const createDefaultProject = (
  name: string,
  description: string,
  userId: string
): Omit<Project, 'id'> => {
  const optionsSections = createDefaultSections('options');

  return {
    name,
    description,
    userId,
    createdAt: new Date().toISOString(),
    currentPhase: 'initial',
    data: {
      initial: {
        checklist: createDefaultChecklist('initial'),
        validated: false,
        validationComment: '',
        approvedBy: [],
        sections: createDefaultSections('initial')
      } as any,
      options: {
        checklist: createDefaultChecklist('options'),
        validated: false,
        validationComment: '',
        approvedBy: [],
        sections: optionsSections,
        selectedScenarioId: '',
        scenarios: {
          A: createDefaultScenarioContent(optionsSections),
          B: createDefaultScenarioContent(optionsSections)
        }
      },
      final: {
        checklist: createDefaultChecklist('final'),
        validated: false,
        validationComment: '',
        approvedBy: [],
        sections: createDefaultSections('final')
      } as any,
      stakeholders: [],
      notes: ''
    }
  };
};

export const useProjectStore = create<ProjectState>((set, get, store) => {
  const syncCurrentProject = (
    id: string,
    updater: (project: Project) => Project | null
  ) => {
    const { currentProject } = get();
    if (currentProject?.id === id) {
      set({ currentProject: updater(currentProject) });
    }
  };

  return {
    projects: [],
    currentProject: null,
    isLoadingProjects: false,

    fetchProjects: async (): Promise<Unsubscribe | void> => {
      const { user } = useAuthStore.getState();
      if (!user) return;

      set({ isLoadingProjects: true });

      try {
        // Vérifier si l'utilisateur est admin
        const adminDoc = await getDoc(doc(db, 'admins', user.id));
        const isAdmin = adminDoc.exists();

        // Construire la requête
        const projectsRef = collection(db, 'projects');
        let q: Query<DocumentData>;

        if (isAdmin) {
          // Admin peut voir tous les projets
          q = query(projectsRef, orderBy('createdAt', 'desc'));
        } else {
          // Utilisateur normal ne voit que ses projets
          q = query(projectsRef, where('userId', '==', user.id));
        }

        // Écouter les changements en temps réel
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const projects: Project[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            const project: Project = {
              id: doc.id,
              name: data.name,
              description: data.description,
              userId: data.userId,
              createdAt: data.createdAt,
              currentPhase: calculateCurrentPhase(data.data),
              data: data.data
            };
            projects.push(project);
          });

          set({ projects, isLoadingProjects: false });
        });

        // Stocker la fonction de désabonnement (optionnel pour un nettoyage ultérieur)
        return unsubscribe;
      } catch (error) {
        console.error('Erreur lors de la récupération des projets:', error);
        set({ isLoadingProjects: false });
      }
    },

    createProject: async (name: string, description: string): Promise<string> => {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error('Utilisateur non authentifié');

      try {
        const projectData = createDefaultProject(name, description, user.id);
        const docRef = await addDoc(collection(db, 'projects'), projectData);

        const newProject: Project = {
          id: docRef.id,
          ...projectData
        };

        set({ currentProject: newProject });

        return docRef.id;
      } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        throw error;
      }
    },

    getProject: (id: string) => {
      if (!id) return undefined;
      return get().projects.find((p) => p.id === id);
    },

    setCurrentProject: (project: Project | null) => {
      set({ currentProject: project });
    },

    updateProject: async (id: string, updates: Partial<ProjectData>) => {
      if (!id) throw new Error('Project ID is required');
      if (!updates) return;
      try {
        await updateProjectInFirestore(id, updates, get, set);
      } catch (error) {
        console.error('Erreur lors de la mise à jour du projet:', error);
        throw error;
      }
    },

    updateProjectDetails: async (
      id: string,
      name: string,
      description: string
    ) => {
      if (!id) throw new Error('Project ID is required');
      try {
        const projectRef = doc(db, 'projects', id);
        await updateDoc(projectRef, { name, description });

        // Mettre à jour le projet courant si c'est celui qui est modifié
        syncCurrentProject(id, (project) => ({ ...project, name, description }));
      } catch (error) {
        console.error('Erreur lors de la mise à jour des détails du projet:', error);
        throw error;
      }
    },

    deleteProject: async (id: string) => {
      if (!id) throw new Error('Project ID is required');
      try {
        await deleteDoc(doc(db, 'projects', id));

        syncCurrentProject(id, () => null);
      } catch (error) {
        console.error('Erreur lors de la suppression du projet:', error);
        throw error;
      }
    },
    ...createChecklistSlice(set, get, store),
    ...createSectionSlice(set, get, store),
    ...createScenarioSlice(set, get, store),
  };
});
