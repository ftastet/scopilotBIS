import React, { useState, useEffect, useCallback } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Project, OptionsPhaseData, ScenarioContentData, ProjectSection } from '../../types';
import { useAlertStore } from '../../store/useAlertStore';
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
import TooltipIcon from '../../components/UI/TooltipIcon';
import InitialPhaseViewModal from '../../components/Project/InitialPhaseViewModal';
import { Download, Edit2, Folder } from 'lucide-react';

interface OptionsPhaseProps {
  project: Project;
}

interface ScenarioFormProps {
  scenarioId: string;
  scenarioTitle: string;
  scenarioContent: ScenarioContentData;
  optionsSections: ProjectSection[];
  selectedScenario: string | null;
  onUpdateContent: (sectionId: string, content: string) => void;
  onSelect: () => void;
}

const ScenarioForm: React.FC<ScenarioFormProps> = React.memo(
  ({
    scenarioId,
    scenarioTitle,
    scenarioContent,
    optionsSections,
    selectedScenario,
    onUpdateContent,
    onSelect
  }) => {
    const isSelected = selectedScenario === scenarioId;

    return (
      <div className={`border rounded-lg p-6 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-border dark:border-border-dark'}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{scenarioTitle}</h3>
          <Button onClick={onSelect} variant={isSelected ? 'primary' : 'secondary'} size="sm">
            {isSelected ? 'Sélectionné' : 'Sélectionner'}
          </Button>
        </div>

        {optionsSections
          .filter(({ isHidden }) => !isHidden)
          .map(({ id, title, placeholder, tooltipContent }) => (
            <div key={id} className="mb-6">
              <div className="flex items-center mb-2">
                <h4 className="text-md font-medium">{title}</h4>
                {tooltipContent && <TooltipIcon content={tooltipContent} />}
              </div>
              <RichTextEditor
                value={scenarioContent.sectionContents?.[id]?.content || ''}
                onChange={(content) => onUpdateContent(id, content)}
                placeholder={placeholder}
              />
            </div>
          ))}
      </div>
    );
  }
);

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
  
  const showAlert = useAlertStore(state => state.show);

  const [activeTab, setActiveTab] = useState('validation');
  const [isSectionEditorOpen, setIsSectionEditorOpen] = useState(false);
  const [isInitialPhaseModalOpen, setIsInitialPhaseModalOpen] = useState(false);
  const [isChecklistEditorOpen, setIsChecklistEditorOpen] = useState(false);
  const [isExportPreviewModalOpen, setIsExportPreviewModalOpen] = useState(false);
  
  // État local pour le contenu des sections
  const [localScenariosData, setLocalScenariosData] = useState<Record<string, ScenarioContentData>>({});

  // Synchroniser l'état local avec les données du projet
  useEffect(() => {
    if (project.data.options.scenarios) {
      setLocalScenariosData(project.data.options.scenarios);
    }
  }, [project.data.options.scenarios]);

  const updateOptionsData = useCallback(
    (updates: Partial<OptionsPhaseData>) => {
      updateProject(project.id, {
        options: { ...project.data.options, ...updates }
      });
    },
    [project.id, project.data.options, updateProject]
  );

  const updateStakeholders = useCallback(
    (stakeholders: any[]) => {
      updateProject(project.id, { stakeholders });
    },
    [project.id, updateProject]
  );

  const updateNotes = useCallback(
    (notes: string) => {
      updateProject(project.id, { notes });
    },
    [project.id, updateProject]
  );

  const handleChecklistChange = useCallback(
    (itemId: string, checked: boolean) => {
      const updatedChecklist = project.data.options.checklist.map(item =>
        item.id === itemId ? { ...item, checked } : item
      );
      updateOptionsData({ checklist: updatedChecklist });
    },
    [project.data.options.checklist, updateOptionsData]
  );

  const handleStakeholderApprovalChange = useCallback(
    (stakeholderId: string, approved: boolean) => {
      const currentApprovedBy = project.data.options.approvedBy || [];
      const updatedApprovedBy = approved
        ? [...currentApprovedBy, stakeholderId]
        : currentApprovedBy.filter(id => id !== stakeholderId);
      updateOptionsData({ approvedBy: updatedApprovedBy });
    },
    [project.data.options.approvedBy, updateOptionsData]
  );

  const handleUpdateLocalContent = useCallback(
    (scenarioId: 'A' | 'B', sectionId: string, content: string) => {
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

      updateScenarioSectionContent(project.id, scenarioId, sectionId, { content });
    },
    [project.id, updateScenarioSectionContent]
  );

  const handleUpdateSelectedScenario = useCallback(
    (scenarioId: string) => {
      updateOptionsSelectedScenario(
        project.id,
        project.data.options.selectedScenarioId === scenarioId ? '' : scenarioId
      );
    },
    [project.id, project.data.options.selectedScenarioId, updateOptionsSelectedScenario]
  );

  // Filtrer les parties prenantes obligatoires pour cette phase
  const mandatoryStakeholders = project.data.stakeholders.filter(s => s.mandatoryOptions);
  const approvedCount = mandatoryStakeholders.filter(s =>
    project.data.options.approvedBy?.includes(s.id)
  ).length;
  const approvalProgress =
    mandatoryStakeholders.length > 0
      ? (approvedCount / mandatoryStakeholders.length) * 100
      : 100;

  const checklistCompleted = project.data.options.checklist
    .filter(item => !item.isHidden)
    .every(item => item.checked);
  const stakeholdersApproved = mandatoryStakeholders.length === 0 || approvedCount === mandatoryStakeholders.length;
  const scenarioSelected = project.data.options.selectedScenarioId !== '';

  const scenarios = Object.entries(localScenariosData);
  const selectedScenario = project.data.options.selectedScenarioId;
  const scenarioStatusClass = scenarioSelected
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800';

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
            <div className="border-l border-border pl-6 dark:border-border-dark">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-text dark:text-background">Contenu phase approuvé par :</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-secondary dark:bg-text rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${approvalProgress}%` }}
                    />
                  </div>
                  <span className="text-sm text-text/80 dark:text-background/80 font-medium min-w-[3rem]">
                    {approvedCount}/{mandatoryStakeholders.length}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {mandatoryStakeholders.map((stakeholder) => (
                  <Checkbox
                    key={stakeholder.id}
                    id={`stakeholder-${stakeholder.id}`}
                    label={`${stakeholder.firstName} ${stakeholder.lastName} (${stakeholder.company} - ${stakeholder.role})`}
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
            onValidationChange={async (validated) => {
              try {
                if (!validated) {
                  await updateProject(project.id, {
                    options: { ...project.data.options, validated: false },
                    final: { ...project.data.final, validated: false }
                  });
                  showAlert('Phase dévalidée', 'La phase scénarios a été dévalidée.');
                } else {
                  const selectedScenarioId = project.data.options.selectedScenarioId;
                  if (selectedScenarioId && project.data.options.scenarios[selectedScenarioId]) {
                    const selectedScenario = project.data.options.scenarios[selectedScenarioId];

                    const sectionMapping = {
                      'options-section-0': 'final-section-0',
                      'options-section-1': 'final-section-1',
                      'options-section-2': 'final-section-2',
                      'options-section-3': 'final-section-3',
                      'options-section-4': 'final-section-4'
                    };

                    const existingFinalSectionsById = {} as Record<string, any>;
                    const existingFinalSectionsByTitle = {} as Record<string, any>;

                    project.data.final.sections.forEach(section => {
                      if (section.isDefault) {
                        existingFinalSectionsById[section.id] = section;
                      } else {
                        existingFinalSectionsByTitle[section.title] = section;
                      }
                    });

                    const newFinalSections: any[] = [];
                    let orderCounter = 0;
                    const sortedOptionsSection = [...project.data.options.sections].sort((a, b) => a.order - b.order);

                    sortedOptionsSection.forEach(optionsSection => {
                      if (optionsSection.isHidden) return;

                      const scenarioContent = selectedScenario.sectionContents[optionsSection.id];

                      if (optionsSection.isDefault && sectionMapping[optionsSection.id]) {
                        const finalSectionId = sectionMapping[optionsSection.id];
                        const existingFinalSection = existingFinalSectionsById[finalSectionId];

                        if (existingFinalSection) {
                          newFinalSections.push({
                            ...existingFinalSection,
                            content: scenarioContent?.content || '',
                            internalOnly: scenarioContent?.internalOnly || false,
                            isHidden: false,
                            order: orderCounter++
                          });
                        }
                      } else if (!optionsSection.isDefault) {
                        const existingCustomSection = existingFinalSectionsByTitle[optionsSection.title];

                        if (existingCustomSection) {
                          newFinalSections.push({
                            ...existingCustomSection,
                            content: scenarioContent?.content || '',
                            internalOnly: scenarioContent?.internalOnly || false,
                            isHidden: false,
                            order: orderCounter++
                          });
                        } else {
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

                    await updateProject(project.id, {
                      options: { ...project.data.options, validated: true },
                      final: {
                        ...project.data.final,
                        sections: newFinalSections
                      }
                    });
                  } else {
                    await updateProject(project.id, {
                      options: { ...project.data.options, validated: true }
                    });
                  }
                  showAlert('Phase validée', 'La phase scénarios a été validée avec succès.');
                }
              } catch (error) {
                console.error('Erreur lors de la mise à jour de la phase options:', error);
                showAlert('Erreur', 'Erreur lors de la mise à jour de la phase. Veuillez réessayer.');
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
            <h3 className="text-lg font-medium text-text dark:text-background">Développement des scénarios</h3>
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
                  handleUpdateLocalContent(scenarioId as 'A' | 'B', sectionId, content)
                }
                onSelect={() => handleUpdateSelectedScenario(scenarioId)}
              />
            ))}
          </div>

          <div className="mt-8 p-4 bg-muted rounded-lg dark:bg-muted-dark">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Sélection du scénario</h3>
                <p className="text-sm text-text/60 dark:text-background/60">
                  {scenarioSelected
                    ? `Scénario ${selectedScenario} sélectionné. Vous pouvez continuer vers la validation.`
                    : "Veuillez sélectionner un scénario pour continuer."
                  }
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm ${scenarioStatusClass}`}>
                {scenarioSelected ? 'Scénario sélectionné' : 'En attente de sélection'}
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
          <h3 className="text-lg font-medium text-text dark:text-background">Notes du projet</h3>
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
      <ChecklistEditorModal
        isOpen={isChecklistEditorOpen}
        onClose={() => setIsChecklistEditorOpen(false)}
        project={project}
        phase="options"
        onAddItem={(text) => addChecklistItem(project.id, 'options', text)}
        onDeleteItem={(itemId) => deleteChecklistItem(project.id, 'options', itemId)}
        onToggleHidden={(itemId, isHidden) => toggleChecklistItemHidden(project.id, 'options', itemId, isHidden)}
        onReorderItems={(sourceIndex, destinationIndex) => reorderChecklistItems(project.id, 'options', sourceIndex, destinationIndex)}
      />

      {isSectionEditorOpen && (
        <SectionEditorModal
          isOpen={isSectionEditorOpen}
          onClose={() => setIsSectionEditorOpen(false)}
          project={project}
          phase="options"
          onAddSection={(newSection) => addProjectSection(project.id, 'options', newSection)}
          onUpdateSection={(sectionId, updates) => updateProjectSection(project.id, 'options', sectionId, updates)}
          onDeleteSection={(sectionId) => deleteProjectSection(project.id, 'options', sectionId)}
          onToggleHidden={(sectionId, isHidden) => toggleProjectSectionHidden(project.id, 'options', sectionId, isHidden)}
          onReorderSections={(sourceIndex, destinationIndex) => reorderProjectSections(project.id, 'options', sourceIndex, destinationIndex)}
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
