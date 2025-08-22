import React, { useState } from 'react';
import { useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Project, InitialPhaseData, ProjectSection } from '../../types';
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
import { Download, Edit2 } from 'lucide-react';

interface InitialPhaseProps {
  project: Project;
}

const InitialPhase: React.FC<InitialPhaseProps> = ({ project }) => {
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
  const [activeTab, setActiveTab] = useState('validation');
  const [isChecklistEditorOpen, setIsChecklistEditorOpen] = useState(false);
  const [isSectionEditorOpen, setIsSectionEditorOpen] = useState(false);
  const [isExportPreviewModalOpen, setIsExportPreviewModalOpen] = useState(false);

  const updateInitialData = (updates: Partial<InitialPhaseData>) => {
    updateProject(project.id, {
      initial: { ...project.data.initial, ...updates }
    });
  };

  const updateStakeholders = (stakeholders: any[]) => {
    updateProject(project.id, {
      stakeholders
    });
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    updateProjectSection(project.id, 'initial', sectionId, { content });
  };

  const updateSectionInternalOnly = (sectionId: string, internalOnly: boolean) => {
    updateProjectSection(project.id, 'initial', sectionId, { internalOnly });
  };

  const updateNotes = (notes: string) => {
    updateProject(project.id, { notes });
  };

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    const updatedChecklist = project.data.initial.checklist.map(item =>
      item.id === itemId ? { ...item, checked } : item
    );
    updateInitialData({ checklist: updatedChecklist });
  };

  const handleStakeholderApprovalChange = (stakeholderId: string, approved: boolean) => {
    const currentApprovedBy = project.data.initial.approvedBy || [];
    const updatedApprovedBy = approved
      ? [...currentApprovedBy, stakeholderId]
      : currentApprovedBy.filter(id => id !== stakeholderId);
    updateInitialData({ approvedBy: updatedApprovedBy });
  };

  // Filtrer les parties prenantes obligatoires pour cette phase
  const mandatoryStakeholders = project.data.stakeholders.filter(s => s.mandatoryInitial);
  const approvedCount = mandatoryStakeholders.filter(s => 
    project.data.initial.approvedBy?.includes(s.id)
  ).length;

  const checklistCompleted = project.data.initial.checklist.every(item => item.checked);
  const stakeholdersApproved = mandatoryStakeholders.length === 0 || approvedCount === mandatoryStakeholders.length;

  const tabs = [
    {
      id: 'validation',
      label: 'Validation',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Checklist
                items={project.data.initial.checklist}
                onItemChange={handleChecklistChange}
                isDisabled={project.data.initial.validated}
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
                    label={`${stakeholder.firstName} ${stakeholder.lastName} (${stakeholder.company} - ${stakeholder.role})`}
                    checked={project.data.initial.approvedBy?.includes(stakeholder.id) || false}
                    disabled={project.data.initial.validated}
                    onChange={(e) => handleStakeholderApprovalChange(stakeholder.id, e.target.checked)}
                  />
                ))}
                {mandatoryStakeholders.length === 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Aucune partie prenante obligatoire pour cette phase
                  </p>
                )}
              </div>
            </div>
          </div>
          <PhaseValidation
            validated={project.data.initial.validated}
            validationComment={project.data.initial.validationComment}
            onValidationChange={(validated) => {
              if (!validated) {
                // Dévalidation en cascade : annule toutes les phases suivantes
                updateProject(project.id, {
                  initial: { ...project.data.initial, validated: false },
                  options: { ...project.data.options, validated: false },
                  final: { ...project.data.final, validated: false }
                });
              } else {
                // Validation simple de la phase initiale
                updateInitialData({ validated: true });
              }
            }}
            onCommentChange={(validationComment) => updateInitialData({ validationComment })}
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
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Détails de l'opportunité</h3>
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
            {project.data.initial.sections
              .filter(section => !section.isHidden)
              .sort((a, b) => a.order - b.order)
              .map((section) => (
                <div key={section.id} className={section.internalOnly ? 'internal-content-block' : ''}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <label className="block text-lg font-medium text-gray-700">
                        {section.title}
                      </label>
                      {section.tooltipContent && (
                        <TooltipIcon content={section.tooltipContent} />
                      )}
                    </div>
                    <Checkbox
                      label="Usage interne uniquement"
                      checked={section.internalOnly}
                      onChange={(e) => updateSectionInternalOnly(section.id, e.target.checked)}
                    />
                  </div>
                  <RichTextEditor
                    value={section.content}
                    onChange={(value) => updateSectionContent(section.id, value)}
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
            value={project.data.notes}
            onChange={(e) => updateNotes(e.target.value)}
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
        activeTabColorClass="bg-blue-100 text-blue-800 border-blue-500"
      />

      <ChecklistEditorModal
        isOpen={isChecklistEditorOpen}
        onClose={() => setIsChecklistEditorOpen(false)}
        project={project}
        phase="initial"
        onAddItem={(text) => addChecklistItem(project.id, 'initial', text)}
        onDeleteItem={(itemId) => deleteChecklistItem(project.id, 'initial', itemId)}
        onToggleHidden={(itemId, isHidden) => toggleChecklistItemHidden(project.id, 'initial', itemId, isHidden)}
        onReorderItems={(sourceIndex, destinationIndex) => reorderChecklistItems(project.id, 'initial', sourceIndex, destinationIndex)}
      />

      <SectionEditorModal
        isOpen={isSectionEditorOpen}
        onClose={() => setIsSectionEditorOpen(false)}
        project={project}
        phase="initial"
        onAddSection={(newSection) => addProjectSection(project.id, 'initial', newSection)}
        onUpdateSection={(sectionId, updates) => updateProjectSection(project.id, 'initial', sectionId, updates)}
        onDeleteSection={(sectionId) => deleteProjectSection(project.id, 'initial', sectionId)}
        onToggleHidden={(sectionId, isHidden) => toggleProjectSectionHidden(project.id, 'initial', sectionId, isHidden)}
        onReorderSections={(sourceIndex, destinationIndex) => reorderProjectSections(project.id, 'initial', sourceIndex, destinationIndex)}
      />

      <ExportPreviewModal
        isOpen={isExportPreviewModalOpen}
        onClose={() => setIsExportPreviewModalOpen(false)}
        project={project}
        phase="initial"
      />
    </div>
  );
};

export default InitialPhase;