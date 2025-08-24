import React from 'react';
import { InitialPhaseData } from '../../types';
import Modal from '../UI/Modal';
import RichTextEditor from '../UI/RichTextEditor';
import { FileText, AlertCircle } from 'lucide-react';

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
          <div className="flex items-center space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Phase Opportunité non validée
              </p>
              <p className="text-sm text-yellow-700">
                L'opportunité n'a pas encore été validée. Le contenu affiché peut être incomplet ou en cours de modification.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <FileText className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Opportunité validée
            </span>
          </div>
        )}

        {visibleSections.length === 0 ? (
          <p className="text-sm text-foreground/70 italic text-center py-8">
            Aucune section visible dans l'opportunité
          </p>
        ) : (
          <div className="space-y-6">
            {visibleSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <h3 className="text-lg font-medium text-foreground flex items-center">
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