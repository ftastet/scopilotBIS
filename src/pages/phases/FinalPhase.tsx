import React, { useState } from 'react';
import { useRef } from 'react';
import { useProjectStore } from '../../store/useProjectStore';
import { Project, FinalPhaseData } from '../../types';
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

interface FinalPhaseProps {
  project: Project;
}

const FinalPhase: React.FC<FinalPhaseProps> = ({ project }) => {
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

  const updateFinalData = (updates: Partial<FinalPhaseData>) => {
    updateProject(project.id, {
      final: { ...project.data.final, ...updates }
    });
  };

  const updateStakeholders = (stakeholders: any[]) => {
    updateProject(project.id, { stakeholders });
  };

  const updateNotes = (notes: string) => {
    updateProject(project.id, { notes });
  };

  const updateSectionContent = (sectionId: string, content: string) => {
    updateProjectSection(project.id, 'final', sectionId, { content });
  };

  const updateSectionInternalOnly = (sectionId: string, internalOnly: boolean) => {
    updateProjectSection(project.id, 'final', sectionId, { internalOnly });
  };

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    const updatedChecklist = project.data.final.checklist.map(item =>
      item.id === itemId ? { ...item, checked } : item
    );
    updateFinalData({ checklist: updatedChecklist });
  };

  const handleStakeholderApprovalChange = (stakeholderId: string, approved: boolean) => {
    const currentApprovedBy = project.data.final.approvedBy || [];
    const updatedApprovedBy = approved
      ? [...currentApprovedBy, stakeholderId]
      : currentApprovedBy.filter(id => id !== stakeholderId);
    updateFinalData({ approvedBy: updatedApprovedBy });
  };

  // Filtrer les parties prenantes obligatoires pour cette phase
  const mandatoryStakeholders = project.data.stakeholders.filter(s => s.mandatoryFinal);
  const approvedCount = mandatoryStakeholders.filter(s => 
    project.data.final.approvedBy?.includes(s.id)
  ).length;

  const checklistCompleted = project.data.final.checklist.every(item => item.checked);
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
                items={project.data.final.checklist}
                onItemChange={handleChecklistChange}
                isDisabled={project.data.final.validated}
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
                    checked={project.data.final.approvedBy?.includes(stakeholder.id) || false}
                    disabled={project.data.final.validated}
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
            validated={project.data.final.validated}
            validationComment={project.data.final.validationComment}
            onValidationChange={(validated) => {
              // Validation/dévalidation simple de la phase finale uniquement
              updateFinalData({ validated });
            }}
            onCommentChange={(validationComment) => updateFinalData({ validationComment })}
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
            <h3 className="text-lg font-medium text-gray-900">Détails de l'engagement</h3>
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
            {project.data.final.sections
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
        activeTabColorClass="bg-green-100 text-green-800 border-green-500"
      />

      <ChecklistEditorModal
        isOpen={isChecklistEditorOpen}
        onClose={() => setIsChecklistEditorOpen(false)}
        project={project}
        phase="final"
        onAddItem={(text) => addChecklistItem(project.id, 'final', text)}
        onDeleteItem={(itemId) => deleteChecklistItem(project.id, 'final', itemId)}
        onToggleHidden={(itemId, isHidden) => toggleChecklistItemHidden(project.id, 'final', itemId, isHidden)}
        onReorderItems={(sourceIndex, destinationIndex) => reorderChecklistItems(project.id, 'final', sourceIndex, destinationIndex)}
      />

      <SectionEditorModal
        isOpen={isSectionEditorOpen}
        onClose={() => setIsSectionEditorOpen(false)}
        project={project}
        phase="final"
        onAddSection={(newSection) => addProjectSection(project.id, 'final', newSection)}
        onUpdateSection={(sectionId, updates) => updateProjectSection(project.id, 'final', sectionId, updates)}
        onDeleteSection={(sectionId) => deleteProjectSection(project.id, 'final', sectionId)}
        onToggleHidden={(sectionId, isHidden) => toggleProjectSectionHidden(project.id, 'final', sectionId, isHidden)}
        onReorderSections={(sourceIndex, destinationIndex) => reorderProjectSections(project.id, 'final', sourceIndex, destinationIndex)}
      />

      <ExportPreviewModal
        isOpen={isExportPreviewModalOpen}
        onClose={() => setIsExportPreviewModalOpen(false)}
        project={project}
        phase="final"
      />
    </div>
  );
};

export default FinalPhase;