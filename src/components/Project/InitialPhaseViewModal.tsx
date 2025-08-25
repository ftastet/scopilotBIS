import React from 'react';
import { InitialPhaseData } from '../../types';
import Modal from '../UI/Modal';
import RichTextEditor from '../UI/RichTextEditor';
import { FileText, AlertCircle } from 'lucide-react';
import { Alert } from 'flowbite-react';

interface InitialPhaseViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

const InitialPhaseViewModal: React.FC<InitialPhaseViewModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const initialPhaseData = project.data.initial;
  const projectName = project.name;

  const visibleSections = initialPhaseData.sections
    .filter(section => !section.isHidden)
    .sort((a, b) => a.order - b.order);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Opportunité - ${projectName}`}
      modalClassName="sm:max-w-6xl"
    >
      <div className="space-y-6 max-h-[30rem] overflow-y-auto">
        {!initialPhaseData.validated ? (
          <Alert color="warning" icon={AlertCircle}>
            <span className="font-medium">Phase Opportunité non validée</span>
            <div>
              L'opportunité n'a pas encore été validée. Le contenu affiché peut être incomplet ou en cours de modification.
            </div>
          </Alert>
        ) : (
          <Alert color="success" icon={FileText}>
            Opportunité validée
          </Alert>
        )}

        {visibleSections.length === 0 ? (
          <p className="text-sm text-gray-500 italic text-center py-8">
            Aucune section visible dans l'opportunité
          </p>
        ) : (
          <div className="space-y-6">
            {visibleSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  {section.title}
                  {section.internalOnly && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                      Usage interne
                    </span>
                  )}
                </h3>
                <div className="read-only">
                  <RichTextEditor
                    value={section.content || ''}
                    placeholder={section.content ? undefined : "Aucun contenu saisi"}
                    readOnly={true}
                    className="read-only"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InitialPhaseViewModal;