import React, { useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Project, InitialPhaseData, ProjectSection } from '../../types';
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
import { Download, Edit2 } from 'lucide-react';

interface InitialPhaseProps {
  project: Project;
  phaseColor: string;
}

const InitialPhase: React.FC<InitialPhaseProps> = ({ project, phaseColor }) => {
  const phase = 'initial';
  const {
    updateProject,
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
  const [isChecklistEditorOpen, setIsChecklistEditorOpen] = useState(false);
  const [isSectionEditorOpen, setIsSectionEditorOpen] = useState(false);
  const [isExportPreviewModalOpen, setIsExportPreviewModalOpen] = useState(false);

  const { id: projectId, data } = project;
  const { initial, options, final, stakeholders, notes } = data;

  const updateInitialData = (updates: Partial<InitialPhaseData>) => {
    updateProject(projectId, {
      initial: { ...initial, ...updates }
    });
  };

  const updateStakeholders = (updated: typeof stakeholders) => {
    updateProject(projectId, { stakeholders: updated });
  };

  const updateSection = (sectionId: string, updates: Partial<ProjectSection>) => {
    updateProjectSection(projectId, phase, sectionId, updates);
  };

  const updateNotes = (text: string) => {
    updateProject(projectId, { notes: text });
  };

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    const checklist = initial.checklist.map(item =>
      item.id === itemId ? { ...item, checked } : item
    );
    updateInitialData({ checklist });
  };

  const handleStakeholderApprovalChange = (stakeholderId: string, approved: boolean) => {
    const approvedBy = initial.approvedBy ?? [];
    const updatedApprovedBy = approved
      ? [...approvedBy, stakeholderId]
      : approvedBy.filter(id => id !== stakeholderId);
    updateInitialData({ approvedBy: updatedApprovedBy });
  };

  const mandatoryStakeholders = stakeholders.filter(s => s.mandatoryInitial);
  const approvedCount = mandatoryStakeholders.filter(s => initial.approvedBy?.includes(s.id)).length;
  const approvalRate = mandatoryStakeholders.length
    ? (approvedCount / mandatoryStakeholders.length) * 100
    : 100;

  const checklistCompleted = initial.checklist
    .filter(item => !item.isHidden)
    .every(item => item.checked);
  const stakeholdersApproved =
    mandatoryStakeholders.length === 0 || approvedCount === mandatoryStakeholders.length;

  const tabs = [
    {
      id: 'validation',
      label: 'Validation',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <Checklist
                items={initial.checklist}
                onItemChange={handleChecklistChange}
                isDisabled={initial.validated}
                onOpenEditor={() => setIsChecklistEditorOpen(true)}
              />
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-foreground">Contenu phase approuvé par :</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-muted rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${approvalRate}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium min-w-[3rem]">
                    {approvedCount}/{mandatoryStakeholders.length}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                {mandatoryStakeholders.length ? (
                  mandatoryStakeholders.map(stakeholder => (
                    <Checkbox
                      key={stakeholder.id}
                      label={`${stakeholder.firstName} ${stakeholder.lastName} (${stakeholder.company} - ${stakeholder.role})`}
                      checked={initial.approvedBy?.includes(stakeholder.id) || false}
                      disabled={initial.validated}
                      onChange={e =>
                        handleStakeholderApprovalChange(stakeholder.id, e.target.checked)
                      }
                    />
                  ))
                ) : (
                  <p className="text-sm text-text italic">
                    Aucune partie prenante obligatoire pour cette phase
                  </p>
                )}
              </div>
            </div>
          </div>
          <PhaseValidation
            validated={initial.validated}
            validationComment={initial.validationComment}
            onValidationChange={async (validated) => {
              try {
                if (!validated) {
                  await updateProject(projectId, {
                    initial: { ...initial, validated: false },
                    options: { ...options, validated: false },
                    final: { ...final, validated: false }
                  });
                  showAlert('Phase dévalidée', 'La phase initiale a été dévalidée.');
                } else {
                  await updateProject(projectId, {
                    initial: { ...initial, validated: true }
                  });
                  showAlert('Phase validée', 'La phase initiale a été validée avec succès.');
                }
              } catch (error) {
                console.error('Erreur lors de la mise à jour de la phase initiale:', error);
                showAlert('Erreur', 'Erreur lors de la mise à jour de la phase. Veuillez réessayer.');
              }
            }}
            onCommentChange={(validationComment) =>
              updateInitialData({ validationComment })
            }
            checklistCompleted={checklistCompleted}
            stakeholdersApproved={stakeholdersApproved}
          />
        </div>
      )
    },
    {
      id: 'details',
      label: 'Opportunité',
      content: (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-foreground">Détails de l'opportunité</h3>
            <div className="flex space-x-3">
              <Button
                variant="secondary"
                icon={Edit2}
                onClick={() => setIsSectionEditorOpen(true)}
              >
                Éditer les sections
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
          
          <div className="grid grid-cols-1 gap-8">
            {initial.sections
              .filter(section => !section.isHidden)
              .sort((a, b) => a.order - b.order)
              .map(section => (
                <div key={section.id} className={section.internalOnly ? 'internal-content-block' : ''}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <label className="block text-lg font-medium text-foreground">
                        {section.title}
                      </label>
                      {section.tooltipContent && (
                        <TooltipIcon content={section.tooltipContent} />
                      )}
                    </div>
                    <Checkbox
                      label="Usage interne uniquement"
                      checked={section.internalOnly}
                      onChange={e =>
                        updateSection(section.id, { internalOnly: e.target.checked })
                      }
                    />
                  </div>
                  <RichTextEditor
                    value={section.content}
                    onChange={value => updateSection(section.id, { content: value })}
                    placeholder={section.placeholder}
                  />
                </div>
              ))}
          </div>
        </div>
      )
    },
    {
      id: 'stakeholders',
      label: 'Parties prenantes',
      content: (
        <StakeholderTable
          stakeholders={stakeholders}
          onStakeholdersChange={updateStakeholders}
          initialPhaseValidated={initial.validated}
          optionsPhaseValidated={options.validated}
          finalPhaseValidated={final.validated}
        />
      )
    },
    {
      id: 'notes',
      label: 'Notes',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground">Notes du projet</h3>
          <Textarea
            value={notes}
            onChange={e => updateNotes(e.target.value)}
            placeholder="Ajoutez vos notes et commentaires sur le projet..."
            rows={8}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeTabColorClass={`border-${phaseColor}-600 text-${phaseColor}-800`}
      />

      <ChecklistEditorModal
        isOpen={isChecklistEditorOpen}
        onClose={() => setIsChecklistEditorOpen(false)}
        project={project}
        phase={phase}
        onAddItem={text => addChecklistItem(projectId, phase, text)}
        onDeleteItem={itemId => deleteChecklistItem(projectId, phase, itemId)}
        onToggleHidden={(itemId, isHidden) => toggleChecklistItemHidden(projectId, phase, itemId, isHidden)}
        onReorderItems={(sourceIndex, destinationIndex) =>
          reorderChecklistItems(projectId, phase, sourceIndex, destinationIndex)
        }
      />

      <SectionEditorModal
        isOpen={isSectionEditorOpen}
        onClose={() => setIsSectionEditorOpen(false)}
        project={project}
        phase={phase}
        onAddSection={newSection => addProjectSection(projectId, phase, newSection)}
        onUpdateSection={(sectionId, updates) =>
          updateProjectSection(projectId, phase, sectionId, updates)
        }
        onDeleteSection={sectionId => deleteProjectSection(projectId, phase, sectionId)}
        onToggleHidden={(sectionId, isHidden) =>
          toggleProjectSectionHidden(projectId, phase, sectionId, isHidden)
        }
        onReorderSections={(sourceIndex, destinationIndex) =>
          reorderProjectSections(projectId, phase, sourceIndex, destinationIndex)
        }
      />

      <ExportPreviewModal
        isOpen={isExportPreviewModalOpen}
        onClose={() => setIsExportPreviewModalOpen(false)}
        project={project}
        phase={phase}
      />
    </div>
  );
};

export default InitialPhase;