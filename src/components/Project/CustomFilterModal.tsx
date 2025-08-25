import React, { useState, useEffect } from 'react';
import { ProjectSection } from '../../types';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import Checkbox from '../UI/Checkbox';
import { Save, X } from 'lucide-react';

interface PreviewSection extends ProjectSection {
  isVisibleInPreview: boolean;
}

interface CustomFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: PreviewSection[];
  onSave: (updatedSections: PreviewSection[]) => void;
}

const CustomFilterModal: React.FC<CustomFilterModalProps> = ({
  isOpen,
  onClose,
  sections,
  onSave
}) => {
  const [localSections, setLocalSections] = useState<PreviewSection[]>([]);

  // Initialiser les sections locales quand la modale s'ouvre
  useEffect(() => {
    if (isOpen) {
      setLocalSections([...sections]);
    }
  }, [isOpen, sections]);

  const handleToggleSection = (sectionId: string, isVisible: boolean) => {
    setLocalSections(prev => 
      prev.map(section => 
        section.id === sectionId 
          ? { ...section, isVisibleInPreview: isVisible }
          : section
      )
    );
  };

  const handleSave = () => {
    onSave(localSections);
  };

  const handleCancel = () => {
    onClose();
  };

  const selectedCount = localSections.filter(s => s.isVisibleInPreview).length;
  const totalCount = localSections.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Sélection personnalisée des sections"
      modalClassName="sm:max-w-2xl sm:max-h-[90vh]"
    >
      <div className="space-y-4">

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {localSections.map((section) => (
              <div key={section.id} className="flex items-center space-x-2 p-2 bg-white border border-gray-200 rounded">
                <Checkbox
                  checked={section.isVisibleInPreview}
                  onChange={(e) => handleToggleSection(section.id, e.target.checked)}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium truncate block">{section.title}</span>
                  {section.internalOnly && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                      Usage interne
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            color="light"
            onClick={handleCancel}
            icon={X}
          >
            Annuler
          </Button>
          <Button
            color="blue"
            onClick={handleSave}
            icon={Save}
            disabled={selectedCount === 0}
          >
            Valider ({selectedCount}/{totalCount})
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CustomFilterModal;