import React, { useCallback, useMemo, useState } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Project, FinalPhaseData, Stakeholder } from '../../types';
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

interface FinalPhaseProps {
  project: Project;
}

const FinalPhase: React.FC<FinalPhaseProps> = ({ project }) => {
  const phase = 'final';
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

  const {
    id: projectId,
    data: { initial, options, final, stakeholders, notes }
  } = project;

  const updateFinalData = useCallback(
    (updates: Partial<FinalPhaseData>) => {
      updateProject(projectId, {
        final: { ...final, ...updates }
      });
    },
    [projectId, final, updateProject]
  );

  const updateStakeholders = useCallback(
    (updated: Stakeholder[]) => {
      updateProject(projectId, { stakeholders: updated });
    },
    [projectId, updateProject]
  );

  const updateNotes = useCallback(
    (text: string) => {
      updateProject(projectId, { notes: text });
    },
    [projectId, updateProject]
  );

  const updateSectionContent = useCallback(
    (sectionId: string, content: string) => {
      updateProjectSection(projectId, phase, sectionId, { content });
    },
    [projectId, phase, updateProjectSection]
  );

  const updateSectionInternalOnly = useCallback(
    (sectionId: string, internalOnly: boolean) => {
      updateProjectSection(projectId, phase, sectionId, { internalOnly });
    },
    [projectId, phase, updateProjectSection]
  );

  const handleChecklistChange = useCallback(
    (itemId: string, checked: boolean) => {
      const checklist = final.checklist.map(item =>
        item.id === itemId ? { ...item, checked } : item
      );
      updateFinalData({ checklist });
    },
    [final.checklist, updateFinalData]
  );

  const handleStakeholderApprovalChange = useCallback(
    (stakeholderId: string, approved: boolean) => {
      const approvedBy = final.approvedBy ?? [];
      const updatedApprovedBy = approved
        ? [...approvedBy, stakeholderId]
        : approvedBy.filter(id => id !== stakeholderId);
      updateFinalData({ approvedBy: updatedApprovedBy });
    },
    [final.approvedBy, updateFinalData]
  );

  const mandatoryStakeholders = useMemo(
    () => stakeholders.filter(s => s.mandatoryFinal),
    [stakeholders]
  );

  const approvedCount = useMemo(
    () => mandatoryStakeholders.filter(s => final.approvedBy?.includes(s.id)).length,
    [mandatoryStakeholders, final.approvedBy]
  );

  const approvalRate = mandatoryStakeholders.length
    ? (approvedCount / mandatoryStakeholders.length) * 100
    : 100;

  const checklistCompleted = useMemo(
    () => final.checklist.filter(item => !item.isHidden).every(item => item.checked),
    [final.checklist]
  );

  const stakeholdersApproved = mandatoryStakeholders.length === 0 || approvedCount === mandatoryStakeholders.length;

  const visibleSections = useMemo(
    () =>
      final.sections
        .filter(section => !section.isHidden)
        .sort((a, b) => a.order - b.order),
    [final.sections]
  );

  const tabs = [
    {
      id: 'validation',
      label: 'Validation',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Checklist
                items={final.checklist}
                onItemChange={handleChecklistChange}
                isDisabled={final.validated}
                onOpenEditor={() => setIsChecklistEditorOpen(true)}
              />
            </div>
            <div className="border-l border-secondary dark:border-background pl-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-text dark:text-background">Contenu phase approuvé par :</h3>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-secondary dark:bg-text rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${approvalRate}%` }}
                    />
                  </div>
                  <span className="text-sm text-text/80 dark:text-background/80 font-medium min-w-[3rem]">
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
                      checked={final.approvedBy?.includes(stakeholder.id) || false}
                      disabled={final.validated}
                      onChange={e => handleStakeholderApprovalChange(stakeholder.id, e.target.checked)}
                    />
                  ))
                ) : (
                  <p className="text-sm text-text/60 dark:text-background/60 italic">
                    Aucune partie prenante obligatoire pour cette phase
                  </p>
                )}
              </div>
            </div>
          </div>
          <PhaseValidation
            validated={final.validated}
            validationComment={final.validationComment}
            onValidationChange={async (validated) => {
              try {
                await updateProject(project.id, {
                  final: { ...final, validated }
                });
               showAlert(
                 validated ? 'Phase validée' : 'Phase dévalidée',
                 validated ? 'La phase engagement a été validée avec succès.' : 'La phase engagement a été dévalidée.'
               );
              } catch (error) {
                console.error('Erreur lors de la mise à jour de la phase finale:', error);
               showAlert('Erreur', 'Erreur lors de la mise à jour de la phase. Veuillez réessayer.');
              }
            }}
            onCommentChange={validationComment => updateFinalData({ validationComment })}
            checklistCompleted={checklistCompleted}
            stakeholdersApproved={stakeholdersApproved}
          />
        </div>
      )
    },
    {
      id: 'details',
      label: 'Engagement',
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-text dark:text-background">Détails de l'engagement</h3>
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

          <div className="grid grid-cols-1 gap-6">
            {visibleSections.map(section => (
              <div key={section.id} className={section.internalOnly ? 'internal-content-block' : ''}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <label className="block text-lg font-medium text-text dark:text-background">
                      {section.title}
                    </label>
                    {section.tooltipContent && (
                      <TooltipIcon content={section.tooltipContent} />
                    )}
                  </div>
                  <Checkbox
                    label="Usage interne uniquement"
                    checked={section.internalOnly}
                    onChange={e => updateSectionInternalOnly(section.id, e.target.checked)}
                  />
                </div>
                <RichTextEditor
                  value={section.content}
                  onChange={value => updateSectionContent(section.id, value)}
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
          <h3 className="text-lg font-medium text-text dark:text-background">Notes du projet</h3>
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
    <div className="space-y-6">
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeTabColorClass="bg-green-100 text-green-800 border-green-500"
      />

      <ChecklistEditorModal
        isOpen={isChecklistEditorOpen}
        onClose={() => setIsChecklistEditorOpen(false)}
        project={project}
        phase={phase}
        onAddItem={text => addChecklistItem(projectId, phase, text)}
        onDeleteItem={itemId => deleteChecklistItem(projectId, phase, itemId)}
        onToggleHidden={(itemId, isHidden) => toggleChecklistItemHidden(projectId, phase, itemId, isHidden)}
        onReorderItems={(sourceIndex, destinationIndex) => reorderChecklistItems(projectId, phase, sourceIndex, destinationIndex)}
      />

      <SectionEditorModal
        isOpen={isSectionEditorOpen}
        onClose={() => setIsSectionEditorOpen(false)}
        project={project}
        phase={phase}
        onAddSection={newSection => addProjectSection(projectId, phase, newSection)}
        onUpdateSection={(sectionId, updates) => updateProjectSection(projectId, phase, sectionId, updates)}
        onDeleteSection={sectionId => deleteProjectSection(projectId, phase, sectionId)}
        onToggleHidden={(sectionId, isHidden) => toggleProjectSectionHidden(projectId, phase, sectionId, isHidden)}
        onReorderSections={(sourceIndex, destinationIndex) => reorderProjectSections(projectId, phase, sourceIndex, destinationIndex)}
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

export default FinalPhase;