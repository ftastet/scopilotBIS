import React, { useState, useEffect } from 'react';
import { useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Project, OptionsPhaseData, ScenarioContentData } from '../../types';
import Tabs from '../../components/UI/Tabs';
import Checklist from '../../components/Project/Checklist';
import ChecklistEditorModal from '../../components/Project/ChecklistEditorModal';
import SectionEditorModal from '../../components/Project/SectionEditorModal';
import PhaseValidation from '../../components/Project/PhaseValidation';
import StakeholderTable from '../../components/Project/StakeholderTable';
import ExportPreviewModal from '../../components/Project/ExportPreviewModal';
import Textarea from '../../components/UI/Textarea';
import RichTextEditor from '../../components/UI/RichTextEditor';
import Checkbox from '../../components/UI/Checkbox';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import TooltipIcon from '../../components/UI/TooltipIcon';
import InitialPhaseViewModal from '../../components/Project/InitialPhaseViewModal';
import { Download, Edit2, Folder } from 'lucide-react';

interface OptionsPhaseProps {
  project: Project;
}

const ScenarioForm = React.memo(({ 
  scenarioId,
  scenarioTitle,
  scenarioContent,
  optionsSections,
  selectedScenario, 
  onUpdateContent, 
  onSelect 
}: {
  scenarioId: string;
  scenarioTitle: string;
  scenarioContent: ScenarioContentData;
  optionsSections: any[];
  selectedScenario: string | null;
  onUpdateContent: (sectionId: string, content: string) => void;
  onSelect: () => void;
}) => {
  const isSelected = selectedScenario === scenarioId;

  return (
    <div className={`border rounded-lg p-6 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{scenarioTitle}</h3>
        <Button
          onClick={onSelect}
          variant={isSelected ? "primary" : "secondary"}
          size="sm"
        >
          {isSelected ? "Sélectionné" : "Sélectionner"}
        </Button>
      </div>
      
      {optionsSections?.filter(section => !section.isHidden).map((section) => (
        <div key={section.id} className="mb-6">
          <div className="flex items-center mb-2">
            <h4 className="text-md font-medium">{section.title}</h4>
            {section.tooltipContent && (
              <TooltipIcon content={section.tooltipContent} />
            )}
          </div>
          <RichTextEditor
            value={scenarioContent.sectionContents?.[section.id]?.content || ''}
            onChange={(content) => onUpdateContent(section.id, content)}
            placeholder={section.placeholder}
          />
        </div>
      ))}
    </div>
  );
});

const OptionsPhase: React.FC<OptionsPhaseProps> = ({ project }) => {
  const { 
    updateProject, 
    updateScenarioSectionContent, 
    updateOptionsSelectedScenario,
    addChecklistItem, 
    deleteChecklistItem, 
    toggleChecklistItemHidden, 
    reorderChecklistItems,
    addProjectSection,
    updateProjectSection,
    deleteProjectSection,
    toggleProjectSectionHidden,
    reorderProjectSections
  } = useProjectStore();
  
  const [activeTab, setActiveTab] = useState('validation');
  const [isSectionEditorOpen, setIsSectionEditorOpen] = useState(false);
  const [isInitialPhaseModalOpen, setIsInitialPhaseModalOpen] = useState(false);
  const [isChecklistEditorOpen, setIsChecklistEditorOpen] = useState(false);
  const [isExportPreviewModalOpen, setIsExportPreviewModalOpen] = useState(false);
  
  // État local pour le contenu des sections
  const [localScenariosData, setLocalScenariosData] = useState<{
    [scenarioId: string]: ScenarioContentData;
  }>({});

  // Synchroniser l'état local avec les données du projet
  useEffect(() => {
    if (project.data.options.scenarios) {
      setLocalScenariosData(project.data.options.scenarios);
    }
  }, [project.data.options.scenarios]);

  const updateOptionsData = (updates: Partial<OptionsPhaseData>) => {
    updateProject(project.id, {
      options: { ...project.data.options, ...updates }
    });
  };

  const updateStakeholders = (stakeholders: any[]) => {
    updateProject(project.id, { stakeholders });
  };

  const updateNotes = (notes: string) => {
    updateProject(project.id, { notes });
  };

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    const updatedChecklist = project.data.options.checklist.map(item =>
      item.id === itemId ? { ...item, checked } : item
    );
    updateOptionsData({ checklist: updatedChecklist });
  };

  const handleStakeholderApprovalChange = (stakeholderId: string, approved: boolean) => {
    const currentApprovedBy = project.data.options.approvedBy || [];
    const updatedApprovedBy = approved
      ? [...currentApprovedBy, stakeholderId]
      : currentApprovedBy.filter(id => id !== stakeholderId);
    updateOptionsData({ approvedBy: updatedApprovedBy });
  };

  const handleUpdateLocalContent = (scenarioId: string, sectionId: string, content: string) => {
    // Mise à jour immédiate de l'état local
    setLocalScenariosData(prev => ({
      ...prev,
      [scenarioId]: {
        ...prev[scenarioId],
        sectionContents: {
          ...prev[scenarioId]?.sectionContents,
          [sectionId]: { content, internalOnly: false }
        }
      }
    }));

    // Sauvegarde asynchrone
    updateScenarioSectionContent(project.id, scenarioId as 'A' | 'B', sectionId, { content });
  };

  const handleUpdateSelectedScenario = (scenarioId: string) => {
    const currentSelected = project.data.options.selectedScenarioId;
    const newScenarioId = currentSelected === scenarioId ? '' : scenarioId;
    
    updateOptionsSelectedScenario(project.id, newScenarioId);
  };

  // Filtrer les parties prenantes obligatoires pour cette phase
  const mandatoryStakeholders = project.data.stakeholders.filter(s => s.mandatoryOptions);
  const approvedCount = mandatoryStakeholders.filter(s => 
    project.data.options.approvedBy?.includes(s.id)
  ).length;

  const checklistCompleted = project.data.options.checklist.every(item => item.checked);
  const stakeholdersApproved = mandatoryStakeholders.length === 0 || approvedCount === mandatoryStakeholders.length;
  const scenarioSelected = project.data.options.selectedScenarioId !== '';

  const scenarios = Object.entries(localScenariosData);
  const selectedScenario = project.data.options.selectedScenarioId;

  const tabs = [
    {
      id: 'validation',
      label: 'Validation',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Checklist
                items={project.data.options.checklist}
                onItemChange={handleChecklistChange}
                isDisabled={project.data.options.validated}
                onOpenEditor={() => setIsChecklistEditorOpen(true)}
              />
            </div>
            <div className="border-l border-gray-200 pl-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">Contenu phase approuvé par :</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${mandatoryStakeholders.length > 0 ? (approvedCount / mandatoryStakeholders.length) * 100 : 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium min-w-[3rem]">
                    {approvedCount}/{mandatoryStakeholders.length}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {mandatoryStakeholders.map((stakeholder) => (
                  <Checkbox
                    key={stakeholder.id}
                    id={`stakeholder-${stakeholder.id}`}
                    label={stakeholder.name}
                    checked={project.data.options.approvedBy?.includes(stakeholder.id) || false}
                    onChange={(checked) => handleStakeholderApprovalChange(stakeholder.id, checked)}
                    disabled={project.data.options.validated}
                  />
                ))}
              </div>
            </div>
          </div>
          <PhaseValidation
            validated={project.data.options.validated}
            validationComment={project.data.options.validationComment}
            onValidationChange={(validated) => {
              if (!validated) {
                // Dévalidation en cascade : annule la phase finale
                updateProject(project.id, {
                  options: { ...project.data.options, validated: false },
                  final: { ...project.data.final, validated: false }
                });
              } else {
                // Validation de la phase options avec réplication vers la phase finale
                const selectedScenarioId = project.data.options.selectedScenarioId;
                if (selectedScenarioId && project.data.options.scenarios[selectedScenarioId]) {
                  const selectedScenario = project.data.options.scenarios[selectedScenarioId];
                  
                  // Mapping des sections par défaut entre Options et Final
                  const sectionMapping = {
                    'options-section-0': 'final-section-0', // Description & Périmètre du scénario -> Description & Périmètre définitif
                    'options-section-1': 'final-section-1', // Hypothèses & Contraintes -> Hypothèses & Contraintes validées
                    'options-section-2': 'final-section-2', // Livrables attendus -> Livrables définitifs
                    'options-section-3': 'final-section-3', // Budget estimatif (±30%) -> Budget validé (±15%)
                    'options-section-4': 'final-section-4'  // Jalons du scénario -> Planning détaillé
                  };
                  
                  // Créer des maps pour retrouver les sections existantes de la phase finale
                  const existingFinalSectionsById = {};
                  const existingFinalSectionsByTitle = {};
                  
                  project.data.final.sections.forEach(section => {
                    if (section.isDefault) {
                      existingFinalSectionsById[section.id] = section;
                    } else {
                      existingFinalSectionsByTitle[section.title] = section;
                    }
                  });
                  
                  // Construire le nouveau tableau de sections finales en respectant l'ordre des sections options
                  const newFinalSections = [];
                  let orderCounter = 0;
                  
                  // Parcourir les sections options dans leur ordre actuel (triées par order)
                  const sortedOptionsSection = [...project.data.options.sections].sort((a, b) => a.order - b.order);
                  
                  sortedOptionsSection.forEach(optionsSection => {
                    // Ignorer les sections masquées - seules les sections visibles sont répliquées
                    if (optionsSection.isHidden) return;
                    
                    const scenarioContent = selectedScenario.sectionContents[optionsSection.id];
                    
                    if (optionsSection.isDefault && sectionMapping[optionsSection.id]) {
                      // Section par défaut : mapper vers la section correspondante dans Final
                      const finalSectionId = sectionMapping[optionsSection.id];
                      const existingFinalSection = existingFinalSectionsById[finalSectionId];
                      
                      if (existingFinalSection) {
                        newFinalSections.push({
                          ...existingFinalSection,
                          content: scenarioContent?.content || '',
                          internalOnly: scenarioContent?.internalOnly || false,
                          isHidden: false, // La section est visible puisqu'on l'ajoute
                          order: orderCounter++
                        });
                      }
                    } else if (!optionsSection.isDefault) {
                      // Section personnalisée : créer ou mettre à jour
                      const existingCustomSection = existingFinalSectionsByTitle[optionsSection.title];
                      
                      if (existingCustomSection) {
                        // Réutiliser la section personnalisée existante
                        newFinalSections.push({
                          ...existingCustomSection,
                          content: scenarioContent?.content || '',
                          internalOnly: scenarioContent?.internalOnly || false,
                          isHidden: false, // La section est visible puisqu'on l'ajoute
                          order: orderCounter++
                        });
                      } else {
                        // Créer une nouvelle section personnalisée
                        newFinalSections.push({
                          id: `final-section-custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                          title: optionsSection.title,
                          content: scenarioContent?.content || '',
                          internalOnly: scenarioContent?.internalOnly || false,
                          placeholder: optionsSection.placeholder,
                          tooltipContent: optionsSection.tooltipContent,
                          isDefault: false,
                          isHidden: false,
                          order: orderCounter++
                        });
                      }
                    }
                  });
                  
                  // Mettre à jour le projet avec les nouvelles sections finales ordonnées
                  updateProject(project.id, {
                    options: { ...project.data.options, validated: true },
                    final: { 
                      ...project.data.final, 
                      sections: newFinalSections
                    }
                  });
                } else {
                  // Pas de scénario sélectionné, validation simple
                  updateOptionsData({ validated: true });
                }
              }
            }}
            onCommentChange={(validationComment) => updateOptionsData({ validationComment })}
            checklistCompleted={checklistCompleted && scenarioSelected}
            stakeholdersApproved={stakeholdersApproved}
            statusTextIncomplete="Checklist et/ou approbations incomplètes ou scénario non sélectionné"
            additionalRequirementMessage="Complétez tous les éléments de la checklist, obtenez l'approbation de toutes les parties prenantes obligatoires et sélectionnez un scénario avant de pouvoir valider cette phase."
          />
        </div>
      )
    },
    {
      id: 'scenarios',
      label: 'Scénarios',
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Développement des scénarios</h3>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                icon={Edit2}
                onClick={() => setIsSectionEditorOpen(true)}
              >
                Éditer les sections
              </Button>
              <Button
                variant="secondary"
                icon={Folder}
                onClick={() => setIsInitialPhaseModalOpen(true)}
              >
                Opportunité
              </Button>
              <Button
                variant="primary"
                icon={Download}
                onClick={() => setIsExportPreviewModalOpen(true)}
              >
                Exporter PDF
              </Button>
            </div>
          </div>

          <div className="pdf-scenarios-layout">
            {scenarios.map(([scenarioId, scenarioContent]) => (
              <ScenarioForm
                key={scenarioId}
                scenarioId={scenarioId}
                scenarioTitle={`Scénario ${scenarioId}`}
                scenarioContent={scenarioContent}
                optionsSections={project.data.options.sections}
                selectedScenario={selectedScenario}
                onUpdateContent={(sectionId, content) => 
                  handleUpdateLocalContent(scenarioId, sectionId, content)
                }
                onSelect={() => handleUpdateSelectedScenario(scenarioId)}
              />
            ))}
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Sélection du scénario</h3>
                <p className="text-sm text-gray-600">
                  {scenarioSelected 
                    ? `Scénario ${selectedScenario} sélectionné. Vous pouvez continuer vers la validation.`
                    : "Veuillez sélectionner un scénario pour continuer."
                  }
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${
                scenarioSelected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {scenarioSelected ? "Scénario sélectionné" : "En attente de sélection"}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'stakeholders',
      label: 'Parties prenantes',
      content: (
        <StakeholderTable
          stakeholders={project.data.stakeholders}
          onStakeholdersChange={updateStakeholders}
          initialPhaseValidated={project.data.initial.validated}
          optionsPhaseValidated={project.data.options.validated}
          finalPhaseValidated={project.data.final.validated}
        />
      )
    },
    {
      id: 'notes',
      label: 'Notes',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Notes du projet</h3>
          <Textarea
            value={project.data.notes || ''}
            onChange={(e) => updateNotes(e.target.value)}
            placeholder="Ajoutez vos notes ici..."
            rows={10}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeTabColorClass="bg-orange-100 text-orange-800 border-orange-500"
      />

      {/* Modals */}
      {isChecklistEditorOpen && (
        <ChecklistEditorModal
          isOpen={isChecklistEditorOpen}
          onClose={() => setIsChecklistEditorOpen(false)}
          checklist={project.data.options.checklist}
          onAddItem={(item) => addChecklistItem(project.id, 'options', item)}
          onDeleteItem={(itemId) => deleteChecklistItem(project.id, 'options', itemId)}
          onToggleHidden={(itemId) => toggleChecklistItemHidden(project.id, 'options', itemId)}
          onReorderItems={(items) => reorderChecklistItems(project.id, 'options', items)}
        />
      )}

      {isSectionEditorOpen && (
        <SectionEditorModal
          isOpen={isSectionEditorOpen}
          onClose={() => setIsSectionEditorOpen(false)}
          sections={project.data.options.sections}
          onAddSection={(section) => addProjectSection(project.id, 'options', section)}
          onUpdateSection={(sectionId, updates) => updateProjectSection(project.id, 'options', sectionId, updates)}
          onDeleteSection={(sectionId) => deleteProjectSection(project.id, 'options', sectionId)}
          onToggleHidden={(sectionId) => toggleProjectSectionHidden(project.id, 'options', sectionId)}
          onReorderSections={(sections) => reorderProjectSections(project.id, 'options', sections)}
        />
      )}

      {isInitialPhaseModalOpen && (
        <InitialPhaseViewModal
          isOpen={isInitialPhaseModalOpen}
          onClose={() => setIsInitialPhaseModalOpen(false)}
          project={project}
        />
      )}

      {isExportPreviewModalOpen && (
        <ExportPreviewModal
          isOpen={isExportPreviewModalOpen}
          onClose={() => setIsExportPreviewModalOpen(false)}
          project={project}
          phase="options"
        />
      )}
    </div>
  );
};

export default OptionsPhase;