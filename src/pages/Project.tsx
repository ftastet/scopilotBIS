import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '../store/useProjectStore';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Button from '../components/UI/Button';
import InitialPhase from './phases/InitialPhase';
import OptionsPhase from './phases/OptionsPhase';
import FinalPhase from './phases/FinalPhase';

const Project: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCurrentProject } = useProjectStore();
  
  // S'abonner aux changements du projet spécifique
  const project = useProjectStore(state => 
    id ? state.projects.find(p => p.id === id) : null
  );

  // État local pour gérer l'onglet actif dans la vue projet
  const [activeProjectTab, setActiveProjectTab] = useState<'initial' | 'options' | 'final'>(
    project?.currentPhase || 'initial'
  );

  // Mettre à jour le projet courant dans le store pour l'affichage dans le header
  React.useEffect(() => {
    if (project) {
      setCurrentProject(project);
      // Mettre à jour l'onglet actif si le projet change
      setActiveProjectTab(project.currentPhase);
    }
    return () => {
      setCurrentProject(null);
    };
  }, [project?.id, project?.currentPhase, setCurrentProject]);

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Projet non trouvé</h1>
          <Button
            variant="primary"
            icon={ArrowLeft}
            onClick={() => navigate('/dashboard')}
          >
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  const phases = [
    { id: 'initial', label: 'Opportunité', color: 'blue' },
    { id: 'options', label: 'Scénarios', color: 'orange' },
    { id: 'final', label: 'Engagement', color: 'green' }
  ];

  const getPhaseStatus = (phaseId: string) => {
    const phaseData = project.data[phaseId as keyof typeof project.data];
    if (typeof phaseData === 'object' && 'validated' in phaseData) {
      return phaseData.validated ? 'completed' : 'current';
    }
    return 'pending';
  };

  const canAccessPhase = (phaseId: string) => {
    if (phaseId === 'initial') return true;
    if (phaseId === 'options') return project.data.initial.validated;
    if (phaseId === 'final') return project.data.options.validated;
    return false;
  };

  const handlePhaseChange = (phaseId: 'initial' | 'options' | 'final') => {
    if (canAccessPhase(phaseId)) {
      setActiveProjectTab(phaseId);
    }
  };

  const renderPhaseContent = () => {
    switch (activeProjectTab) {
      case 'initial':
        return <InitialPhase project={project} />;
      case 'options':
        return <OptionsPhase project={project} />;
      case 'final':
        return <FinalPhase project={project} />;
      default:
        return <InitialPhase project={project} />;
    }
  };

  const getPhaseDescription = () => {
    const descriptions = {
      initial: {
        title: 'Opportunité',
        boldText: 'Posez les bases pour aligner les parties prenantes avant d\'explorer les options.',
        regularText: 'Cadrez votre projet : raison d\'être, objectifs, périmètre initial, risques majeurs et jalons principaux.',
        colorClass: 'bg-blue-50 border-blue-200 text-blue-900'
      },
      options: {
        title: 'Scénarios',
        boldText: 'Comparez les alternatives pour retenir un périmètre réaliste et cohérent.',
        regularText: 'Pour chaque option, précisez les hypothèses, livrables, contraintes, jalons et budget estimatif.',
        colorClass: 'bg-orange-50 border-orange-200 text-orange-900'
      },
      final: {
        title: 'Engagement',
        boldText: 'Établissez le socle officiel de la réalisation.',
        regularText: 'Consolidez et validez le scénario retenu : périmètre final, budget, planning détaillé et accord des parties prenantes.',
        colorClass: 'bg-green-50 border-green-200 text-green-900'
      }
    };
    return descriptions[activeProjectTab];
  };

  const phaseInfo = getPhaseDescription();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Navigation des phases */}
      <div className="mb-4 card border border-primary/20 py-3 px-8 rounded-xl">
        <nav className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center justify-center gap-x-8">
          {phases.map((phase, index) => {
            const isActive = activeProjectTab === phase.id;
            const status = getPhaseStatus(phase.id);
            const canAccess = canAccessPhase(phase.id);
            
            return (
              <React.Fragment key={phase.id}>
                <Button
                  onClick={() => handlePhaseChange(phase.id as 'initial' | 'options' | 'final')}
                  disabled={!canAccess}
                  variant="secondary"
                  className={`
                    flex items-center justify-center px-5 py-2 rounded-xl text-base font-semibold transition-all duration-300 transform hover:scale-105 w-full
                    ${isActive
                      ? `bg-${phase.color}-100 text-${phase.color}-800 shadow-md`
                      : canAccess
                        ? `bg-surface text-gray-700 border-2 border-border hover:bg-muted hover:border-border-dark shadow-sm dark:bg-surface-dark dark:text-text-dark dark:border-border-dark dark:hover:bg-muted-dark`
                        : `bg-muted text-gray-400 border-2 border-border cursor-not-allowed opacity-60 dark:bg-muted-dark dark:border-border-dark`
                    }
                    ${status === 'completed' ? `ring-3 ring-green-500 ring-opacity-60 shadow-lg` : ''}
                  `}
                >
                  <span className={`
                    relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3
                    ${status === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : isActive 
                        ? `bg-${phase.color}-100 border-2 border-${phase.color}-800 text-${phase.color}-800`
                        : 'bg-gray-300 text-gray-600'
                    }
                  `}>
                    {status === 'completed' ? '✓' : index + 1}
                  </span>
                  <span className="whitespace-nowrap">{phase.label}</span>
                </Button>
                {index < phases.length - 1 && (
                  <ChevronRight className="h-6 w-6 text-gray-400 mx-2" />
                )}
              </React.Fragment>
            );
          })}
        </nav>
        
        {/* Description de la phase active */}
        <div className={`mt-4 w-full border rounded-lg p-3 ${phaseInfo.colorClass}`}>
          <p className="text-sm">
            <strong>{phaseInfo.boldText}</strong>
            <br />
            {phaseInfo.regularText}
          </p>
        </div>
      </div>

      {/* Contenu de la phase */}
      <div className="card p-4">
        {renderPhaseContent()}
      </div>
    </div>
  );
};

export default Project;