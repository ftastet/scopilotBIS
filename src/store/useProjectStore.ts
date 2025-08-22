import { create } from 'zustand';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuthStore } from './useAuthStore';
import { Project, ProjectData, ChecklistItem, ProjectSection } from '../types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoadingProjects: boolean;
  fetchProjects: () => Promise<(() => void) | undefined>;
  createProject: (name: string, description: string) => Promise<string>;
  getProject: (id: string) => Project | undefined;
  setCurrentProject: (project: Project | null) => void;
  updateProject: (id: string, updates: Partial<ProjectData>) => Promise<void>;
  updateProjectDetails: (id: string, name: string, description: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addChecklistItem: (projectId: string, phase: 'initial' | 'options' | 'final', text: string) => Promise<void>;
  deleteChecklistItem: (projectId: string, phase: 'initial' | 'options' | 'final', itemId: string) => Promise<void>;
  toggleChecklistItemHidden: (projectId: string, phase: 'initial' | 'options' | 'final', itemId: string, isHidden: boolean) => Promise<void>;
  reorderChecklistItems: (projectId: string, phase: 'initial' | 'options' | 'final', sourceIndex: number, destinationIndex: number) => Promise<void>;
  addProjectSection: (projectId: string, phase: 'initial' | 'options' | 'final', newSection: Omit<ProjectSection, 'id' | 'order'>) => Promise<void>;
  updateProjectSection: (projectId: string, phase: 'initial' | 'options' | 'final', sectionId: string, updates: Partial<ProjectSection>) => Promise<void>;
  deleteProjectSection: (projectId: string, phase: 'initial' | 'options' | 'final', sectionId: string) => Promise<void>;
  toggleProjectSectionHidden: (projectId: string, phase: 'initial' | 'options' | 'final', sectionId: string, isHidden: boolean) => Promise<void>;
  reorderProjectSections: (projectId: string, phase: 'initial' | 'options' | 'final', sourceIndex: number, destinationIndex: number) => Promise<void>;
  updateScenarioSectionContent: (projectId: string, scenarioId: 'A' | 'B', sectionId: string, updates: { content?: string; internalOnly?: boolean }) => Promise<void>;
  updateOptionsSelectedScenario: (projectId: string, scenarioId: string) => Promise<void>;
}

const createDefaultChecklist = (phase: 'initial' | 'options' | 'final'): ChecklistItem[] => {
  const checklists = {
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

const createDefaultSections = (phase: 'initial' | 'options' | 'final'): ProjectSection[] => {
  const sections = {
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

const createDefaultProject = (name: string, description: string, userId: string): Omit<Project, 'id'> => {
  const optionsSections = createDefaultSections('options');
  
  // Créer les contenus par défaut pour chaque scénario
  const createDefaultScenarioContent = (): ScenarioContentData => ({
    sectionContents: optionsSections.reduce((acc, section) => ({
      ...acc,
      [section.id]: { content: '', internalOnly: false }
    }), {})
  });

  return ({
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
    },
    options: {
      checklist: createDefaultChecklist('options'),
      validated: false,
      validationComment: '',
      approvedBy: [],
      sections: optionsSections,
      selectedScenarioId: '',
      scenarios: {
        A: createDefaultScenarioContent(),
        B: createDefaultScenarioContent()
      }
    },
    final: {
      checklist: createDefaultChecklist('final'),
      validated: false,
      validationComment: '',
      approvedBy: [],
      sections: createDefaultSections('final')
    },
    stakeholders: [],
    notes: ''
  }
  });
};

// Fonction utilitaire pour calculer la phase courante basée sur les validations
const calculateCurrentPhase = (data: ProjectData): 'initial' | 'options' | 'final' => {
  if (!data.initial.validated) return 'initial';
  if (!data.options.validated) return 'options';
  return 'final';
};

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  currentProject: null,
  isLoadingProjects: false,

  fetchProjects: async () => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    set({ isLoadingProjects: true });

    try {
      // Vérifier si l'utilisateur est admin
      const adminDoc = await getDoc(doc(db, 'admins', user.id));
      const isAdmin = adminDoc.exists();

      // Construire la requête
      const projectsRef = collection(db, 'projects');
      let q;
      
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
          console.log('fetchProjects snapshot - project:', project.id, 'selectedScenario:', project.data.options.selectedScenario);
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

  createProject: async (name: string, description: string) => {
    const { user } = useAuthStore.getState();
    if (!user) throw new Error('Utilisateur non authentifié');

    try {
      const projectData = createDefaultProject(name, description, user.id);
      const docRef = await addDoc(collection(db, 'projects'), projectData);
      
      const newProject: Project = {
        id: docRef.id,
        ...projectData
      };
      
      set(state => ({
        currentProject: newProject
      }));
      
      return docRef.id;
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      throw error;
    }
  },

  getProject: (id: string) => {
    return get().projects.find(p => p.id === id);
  },

  setCurrentProject: (project: Project | null) => {
    set({ currentProject: project });
  },

  updateProject: async (id: string, updates: Partial<ProjectData>) => {
    try {
      const projectRef = doc(db, 'projects', id);
      const currentProject = get().projects.find(p => p.id === id);
      
      if (!currentProject) throw new Error('Projet non trouvé');
      
      const updatedData = { ...currentProject.data, ...updates };
      const currentPhase = calculateCurrentPhase(updatedData);
      
      await updateDoc(projectRef, {
        data: updatedData,
        currentPhase
      });

      // Mettre à jour le projet courant si c'est celui qui est modifié
      const { currentProject: current } = get();
      if (current?.id === id) {
        console.log('updateProject - updating currentProject selectedScenario:', updatedData.options?.selectedScenarioId);
        set({
          currentProject: {
            ...current,
            data: updatedData,
            currentPhase
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      throw error;
    }
  },

  updateProjectDetails: async (id: string, name: string, description: string) => {
    try {
      const projectRef = doc(db, 'projects', id);
      await updateDoc(projectRef, { name, description });

      // Mettre à jour le projet courant si c'est celui qui est modifié
      const { currentProject } = get();
      if (currentProject?.id === id) {
        set({
          currentProject: {
            ...currentProject,
            name,
            description
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des détails du projet:', error);
      throw error;
    }
  },

  deleteProject: async (id: string) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      
      const { currentProject } = get();
      if (currentProject?.id === id) {
        set({ currentProject: null });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      throw error;
    }
  },

  addChecklistItem: async (projectId: string, phase: 'initial' | 'options' | 'final', text: string) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');

      const newItem: ChecklistItem = {
        id: `${phase}-${Date.now()}`,
        text,
        checked: false,
        isDefault: false,
        isHidden: false
      };

      const updatedChecklist = [...project.data[phase].checklist, newItem];
      const updatedPhaseData = {
        ...project.data[phase],
        checklist: updatedChecklist
      };

      await get().updateProject(projectId, {
        [phase]: updatedPhaseData
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'élément de checklist:', error);
      throw error;
    }
  },

  deleteChecklistItem: async (projectId: string, phase: 'initial' | 'options' | 'final', itemId: string) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');

      const updatedChecklist = project.data[phase].checklist.filter(item => 
        !(item.id === itemId && !item.isDefault)
      );
      
      const updatedPhaseData = {
        ...project.data[phase],
        checklist: updatedChecklist
      };

      await get().updateProject(projectId, {
        [phase]: updatedPhaseData
      });
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'élément de checklist:', error);
      throw error;
    }
  },

  toggleChecklistItemHidden: async (projectId: string, phase: 'initial' | 'options' | 'final', itemId: string, isHidden: boolean) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');

      const updatedChecklist = project.data[phase].checklist.map(item =>
        item.id === itemId ? { ...item, isHidden } : item
      );
      
      const updatedPhaseData = {
        ...project.data[phase],
        checklist: updatedChecklist
      };

      await get().updateProject(projectId, {
        [phase]: updatedPhaseData
      });
    } catch (error) {
      console.error('Erreur lors du basculement de la visibilité de l\'élément de checklist:', error);
      throw error;
    }
  },

  reorderChecklistItems: async (projectId: string, phase: 'initial' | 'options' | 'final', sourceIndex: number, destinationIndex: number) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');

      const checklist = [...project.data[phase].checklist];
      const [reorderedItem] = checklist.splice(sourceIndex, 1);
      checklist.splice(destinationIndex, 0, reorderedItem);
      
      const updatedPhaseData = {
        ...project.data[phase],
        checklist
      };

      await get().updateProject(projectId, {
        [phase]: updatedPhaseData
      });
    } catch (error) {
      console.error('Erreur lors de la réorganisation des éléments de checklist:', error);
      throw error;
    }
  },

  addProjectSection: async (projectId: string, phase: 'initial' | 'options' | 'final', newSection: Omit<ProjectSection, 'id' | 'order'>) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');

      const sections = project.data[phase].sections;
      const maxOrder = sections.length > 0 ? Math.max(...sections.map(s => s.order)) : -1;

      
      const newProjectSection: ProjectSection = {
        id: `${phase}-section-${Date.now()}`,
        order: maxOrder + 1,
        ...newSection
      };
      
      const updatedSections = [...sections, newProjectSection];
      
      if (phase === 'options') {
        // Pour la phase options, ajouter aussi les contenus par défaut pour chaque scénario
        const updatedScenarios = {
          A: {
            ...project.data.options.scenarios.A,
            sectionContents: {
              ...project.data.options.scenarios.A.sectionContents,
              [newProjectSection.id]: { content: '', internalOnly: false }
            }
          },
          B: {
            ...project.data.options.scenarios.B,
            sectionContents: {
              ...project.data.options.scenarios.B.sectionContents,
              [newProjectSection.id]: { content: '', internalOnly: false }
            }
          }
        };
        
        const updatedPhaseData = {
          ...project.data[phase],
          sections: updatedSections,
          scenarios: updatedScenarios
        };
        
        await get().updateProject(projectId, {
          [phase]: updatedPhaseData
        });
      } else {
        const updatedPhaseData = {
        ...project.data[phase],
        sections: updatedSections
      };

      await get().updateProject(projectId, {
        [phase]: updatedPhaseData
      });
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la section:', error);
      throw error;
    }
  },
      
  updateProjectSection: async (projectId: string, phase: 'initial' | 'options' | 'final', sectionId: string, updates: Partial<ProjectSection>) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');
      
      const updatedSections = project.data[phase].sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      );
      
      const updatedPhaseData = {
        ...project.data[phase],
        sections: updatedSections
      };
      
      await get().updateProject(projectId, {
        [phase]: updatedPhaseData
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la section:', error);
      throw error;
    }
  },

  deleteProjectSection: async (projectId: string, phase: 'initial' | 'options' | 'final', sectionId: string) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');
      
      const updatedSections = project.data[phase].sections.filter(section => 
        !(section.id === sectionId && !section.isDefault)
      );
      
      if (phase === 'options') {
        // Pour la phase options, supprimer aussi les contenus de chaque scénario
        const updatedScenarios = {
          A: {
            ...project.data.options.scenarios.A,
            sectionContents: Object.fromEntries(
              Object.entries(project.data.options.scenarios.A.sectionContents)
                .filter(([id]) => id !== sectionId)
            )
          },
          B: {
            ...project.data.options.scenarios.B,
            sectionContents: Object.fromEntries(
              Object.entries(project.data.options.scenarios.B.sectionContents)
                .filter(([id]) => id !== sectionId)
            )
          }
        };
        
        const updatedPhaseData = {
          ...project.data[phase],
          sections: updatedSections,
          scenarios: updatedScenarios
        };
        
        await get().updateProject(projectId, {
          [phase]: updatedPhaseData
        });
      } else {
        const updatedPhaseData = {
        ...project.data[phase],
        sections: updatedSections
      };
      
      await get().updateProject(projectId, {
        [phase]: updatedPhaseData
      });
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la section:', error);
      throw error;
    }
  },

  toggleProjectSectionHidden: async (projectId: string, phase: 'initial' | 'options' | 'final', sectionId: string, isHidden: boolean) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');
      
      const updatedSections = project.data[phase].sections.map(section =>
        section.id === sectionId ? { ...section, isHidden } : section
      );
      
      const updatedPhaseData = {
        ...project.data[phase],
        sections: updatedSections
      };
      
      await get().updateProject(projectId, {
        [phase]: updatedPhaseData
      });
    } catch (error) {
      console.error('Erreur lors du basculement de la visibilité de la section:', error);
      throw error;
    }
  },

  reorderProjectSections: async (projectId: string, phase: 'initial' | 'options' | 'final', sourceIndex: number, destinationIndex: number) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');
      
      const sections = [...project.data[phase].sections];
      const [reorderedSection] = sections.splice(sourceIndex, 1);
      sections.splice(destinationIndex, 0, reorderedSection);
      
      // Mettre à jour les ordres
      const updatedSections = sections.map((section, index) => ({
        ...section,
        order: index
      }));
      
      const updatedPhaseData = {
        ...project.data[phase],
        sections: updatedSections
      };
      
      await get().updateProject(projectId, {
        [phase]: updatedPhaseData
      });
    } catch (error) {
      console.error('Erreur lors de la réorganisation des sections:', error);
      throw error;
    }
  },

  updateScenarioSectionContent: async (projectId: string, scenarioId: 'A' | 'B', sectionId: string, updates: { content?: string; internalOnly?: boolean }) => {
    try {
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');
      
      const currentContent = project.data.options.scenarios[scenarioId]?.sectionContents[sectionId] || { content: '', internalOnly: false };
      const updatedContent = { ...currentContent, ...updates };
      
      const updatedScenarios = {
        ...project.data.options.scenarios,
        [scenarioId]: {
          ...project.data.options.scenarios[scenarioId],
          sectionContents: {
            ...project.data.options.scenarios[scenarioId]?.sectionContents,
            [sectionId]: updatedContent
          }
        }
      };
      
      const updatedPhaseData = {
        ...project.data.options,
        scenarios: updatedScenarios
      };
      
      await get().updateProject(projectId, {
        options: updatedPhaseData
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du contenu de section du scénario:', error);
      throw error;
    }
  },

  updateOptionsSelectedScenario: async (projectId: string, scenarioId: string) => {
    try {
      console.log('updateOptionsSelectedScenario called - projectId:', projectId, 'scenarioId:', scenarioId);
      const project = get().projects.find(p => p.id === projectId);
      if (!project) throw new Error('Projet non trouvé');
      
      const updatedPhaseData = {
        ...project.data.options,
        selectedScenarioId: scenarioId
      };
      
      await get().updateProject(projectId, {
        options: updatedPhaseData
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du scénario sélectionné:', error);
      throw error;
    }
  }
}));