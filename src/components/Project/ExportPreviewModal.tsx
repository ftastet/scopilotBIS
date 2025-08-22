import React, { useRef, useState, useEffect } from 'react';
import { Project, ProjectSection } from '../../types';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import RichTextEditor from '../UI/RichTextEditor';
import TooltipIcon from '../UI/TooltipIcon';
import CustomFilterModal from './CustomFilterModal';
import { Download } from 'lucide-react';
import { exportContentToPdf, generatePhaseFilename } from '../../utils/pdfExport';

interface PreviewSection extends ProjectSection {
  isVisibleInPreview: boolean;
}

interface ExportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  phase: 'initial' | 'options' | 'final';
}

const ExportPreviewModal: React.FC<ExportPreviewModalProps> = ({
  isOpen,
  onClose,
  project,
  phase
}) => {
  const pdfContentRef = useRef<HTMLDivElement>(null);
  const [previewSections, setPreviewSections] = useState<PreviewSection[]>([]);
  const [filterMode, setFilterMode] = useState<'internal' | 'external' | 'custom'>('internal');
  const [isCustomFilterModalOpen, setIsCustomFilterModalOpen] = useState(false);

  // Initialiser les sections de prévisualisation
  useEffect(() => {
    if (!isOpen) return;

    let sections: ProjectSection[] = [];
    
    // Récupérer les sections selon la phase
    if (phase === 'options') {
      // Pour la phase options, récupérer le contenu du scénario sélectionné
      const selectedScenarioId = project.data.options.selectedScenarioId;
      if (selectedScenarioId && project.data.options.scenarios[selectedScenarioId]) {
        const scenarioContent = project.data.options.scenarios[selectedScenarioId];
        sections = project.data.options.sections
          .filter(section => !section.isHidden)
          .map(section => ({
            ...section,
            content: scenarioContent.sectionContents?.[section.id]?.content || '',
            internalOnly: scenarioContent.sectionContents?.[section.id]?.internalOnly || false
          }));
      } else {
        sections = project.data.options.sections.filter(section => !section.isHidden);
      }
    } else {
      sections = project.data[phase].sections.filter(section => !section.isHidden);
    }

    // Créer les sections de prévisualisation avec visibilité initiale
    const previewSections: PreviewSection[] = sections
      .sort((a, b) => a.order - b.order)
      .map(section => ({
        ...section,
        isVisibleInPreview: true
      }));

    setPreviewSections(previewSections);
    setFilterMode('internal');
  }, [isOpen, project, phase]);

  const getPhaseLabel = () => {
    const labels = {
      initial: 'Opportunité',
      options: 'Scénarios',
      final: 'Engagement'
    };
    return labels[phase];
  };

  const getFilterModeLabel = () => {
    const labels = {
      internal: 'Interne (toutes sections)',
      external: 'Externe (sections publiques uniquement)',
      custom: 'Personnalisé'
    };
    return labels[filterMode];
  };

  const handleApplyFilter = (mode: 'internal' | 'external' | 'custom') => {
    setFilterMode(mode);
    
    if (mode === 'internal') {
      // Toutes les sections visibles
      setPreviewSections(prev => 
        prev.map(section => ({ ...section, isVisibleInPreview: true }))
      );
    } else if (mode === 'external') {
      // Masquer les sections "Usage interne uniquement"
      setPreviewSections(prev => 
        prev.map(section => ({ 
          ...section, 
          isVisibleInPreview: !section.internalOnly 
        }))
      );
    }
  };

  const handleSaveCustomFilter = (updatedSections: PreviewSection[]) => {
    setPreviewSections(updatedSections);
    setFilterMode('custom');
    setIsCustomFilterModalOpen(false);
  };

  const handleGeneratePDF = async () => {
    if (!pdfContentRef.current) return;
    
    try {
      const filename = generatePhaseFilename(project.name, phase, filterMode === 'external');
      await exportContentToPdf(pdfContentRef.current, { filename });
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'exportation PDF:', error);
      alert('Erreur lors de l\'exportation PDF. Veuillez réessayer.');
    }
  };

  const visibleSectionsCount = previewSections.filter(s => s.isVisibleInPreview).length;
  const totalSectionsCount = previewSections.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Prévisualisation PDF - ${getPhaseLabel()}`}
      modalClassName="sm:max-w-6xl max-h-[80vh]"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-900">Mode d'exportation :</h4>
          <div className="flex items-center space-x-3">
            <Button
              variant={filterMode === 'internal' ? 'primary' : 'secondary'}
              onClick={() => handleApplyFilter('internal')}
              size="sm"
            >
              Interne
            </Button>
            <Button
              variant={filterMode === 'external' ? 'primary' : 'secondary'}
              onClick={() => handleApplyFilter('external')}
              size="sm"
            >
              Externe
            </Button>
            <Button
              variant={filterMode === 'custom' ? 'primary' : 'secondary'}
              onClick={() => setIsCustomFilterModalOpen(true)}
              size="sm"
            >
              Custom
            </Button>
            
            {/* Séparateur */}
            <div className="h-6 border-l border-gray-300 mx-2"></div>
            
            {/* Bouton Générer PDF */}
            <Button
              variant="primary"
              icon={Download}
              onClick={handleGeneratePDF}
              disabled={visibleSectionsCount === 0}
              size="sm"
            >
              Générer PDF ({visibleSectionsCount} section{visibleSectionsCount !== 1 ? 's' : ''})
            </Button>
          </div>
        </div>

        <div ref={pdfContentRef} className="space-y-6 max-h-[50vh] overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
            <h2 className="text-lg font-semibold text-gray-700">{getPhaseLabel()}</h2>
            <div className="mt-2 text-sm text-gray-500">
              Généré le {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
          
          <div className="space-y-6">
            {previewSections
              .filter(section => section.isVisibleInPreview)
              .map((section) => (
                <div key={section.id} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">{section.title}</h3>
                    {section.internalOnly && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                        Usage interne
                      </span>
                    )}
                  </div>
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

            {project.data.notes && (
              <div className="space-y-2 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900">Notes du projet</h3>
                <div className="read-only">
                  <RichTextEditor
                    value={project.data.notes}
                    placeholder="Aucune note"
                    readOnly={true}
                    className="read-only"
                  />
                </div>
              </div>
            )}

            {visibleSectionsCount === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 italic">
                  Aucune section sélectionnée pour l'export
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomFilterModal
        isOpen={isCustomFilterModalOpen}
        onClose={() => setIsCustomFilterModalOpen(false)}
        sections={previewSections}
        onSave={handleSaveCustomFilter}
      />
    </Modal>
  );
};

export default ExportPreviewModal;