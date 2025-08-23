import React, { useState } from 'react';
import { Project, ProjectSection } from '../../types';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Textarea from '../UI/Textarea';
import Button from '../UI/Button';
import Checkbox from '../UI/Checkbox';
import { Plus, Trash2, GripVertical, Eye, EyeOff, Edit2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAlertStore } from '../../store/useAlertStore';

interface SectionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  phase: 'initial' | 'options' | 'final';
  onAddSection: (newSection: Omit<ProjectSection, 'id' | 'order'>) => void;
  onUpdateSection: (sectionId: string, updates: Partial<ProjectSection>) => void;
  onDeleteSection: (sectionId: string) => void;
  onToggleHidden: (sectionId: string, isHidden: boolean) => void;
  onReorderSections: (sourceIndex: number, destinationIndex: number) => void;
}

interface SortableItemProps {
  section: ProjectSection;
  index: number;
  isDisabled: boolean;
  onToggleHidden: (sectionId: string, isHidden: boolean) => void;
  onDeleteSection: (sectionId: string) => void;
  onEditSection: (section: ProjectSection) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  section,
  index,
  isDisabled,
  onToggleHidden,
  onDeleteSection,
  onEditSection
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center space-x-3 p-3 bg-surface border border-border rounded-lg dark:bg-surface-dark dark:border-border-dark
        ${section.isHidden ? 'opacity-60 bg-muted dark:bg-muted-dark' : ''}
        ${isDragging ? 'shadow-lg' : 'shadow-sm'}
      `}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <span className={`text-sm font-medium ${section.isHidden ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
          {section.title}
        </span>
        {section.isDefault && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Par défaut
          </span>
        )}
        {section.placeholder && (
          <p className="text-xs text-gray-500 mt-1 truncate">
            {section.placeholder.substring(0, 100)}...
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {!section.isDefault && (
          <Button
            variant="secondary"
            size="sm"
            icon={Edit2}
            onClick={() => onEditSection(section)}
            disabled={isDisabled}
            title="Éditer"
          />
        )}
        
        <Button
          variant="secondary"
          size="sm"
          icon={section.isHidden ? EyeOff : Eye}
          onClick={() => onToggleHidden(section.id, !section.isHidden)}
          disabled={isDisabled}
          title={section.isHidden ? 'Afficher' : 'Masquer'}
        />
        
        {!section.isDefault && (
          <Button
            variant="secondary"
            size="sm"
            icon={Trash2}
            onClick={() => onDeleteSection(section.id)}
            disabled={isDisabled}
            title="Supprimer"
          />
        )}
      </div>
    </div>
  );
};

const SectionEditorModal: React.FC<SectionEditorModalProps> = ({
  isOpen,
  onClose,
  project,
  phase,
  onAddSection,
  onUpdateSection,
  onDeleteSection,
  onToggleHidden,
  onReorderSections
}) => {
  // Defensive check to prevent crashes when project is undefined
  if (!project || !project.data || !project.data[phase]) {
    return null;
  }

  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionPlaceholder, setNewSectionPlaceholder] = useState('');
  const [newSectionTooltip, setNewSectionTooltip] = useState('');
  const [newSectionError, setNewSectionError] = useState('');
  const [editingSection, setEditingSection] = useState<ProjectSection | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPlaceholder, setEditPlaceholder] = useState('');
  const [editTooltip, setEditTooltip] = useState('');
  const [editError, setEditError] = useState('');

  const sections = project.data[phase].sections;
  const isDisabled = project.data[phase].validated;
  const showAlert = useAlertStore(state => state.show);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getPhaseLabel = () => {
    const labels = {
      initial: 'Opportunité',
      options: 'Scénarios',
      final: 'Engagement'
    };
    return labels[phase];
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over?.id);
      
      onReorderSections(oldIndex, newIndex);
    }
  };

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) {
      setNewSectionError('Le titre est requis');
      return;
    }
    onAddSection({
      title: newSectionTitle.trim(),
      content: '',
      internalOnly: false,
      placeholder: newSectionPlaceholder.trim() || 'Saisissez le contenu de cette section...',
      tooltipContent: newSectionTooltip.trim() || null,
      isDefault: false,
      isHidden: false
    });
    setNewSectionTitle('');
    setNewSectionPlaceholder('');
    setNewSectionTooltip('');
    setNewSectionError('');
    showAlert('Section ajoutée', 'La section a été ajoutée.');
  };

  const handleEditSection = (section: ProjectSection) => {
    setEditingSection(section);
    setEditTitle(section.title);
    setEditPlaceholder(section.placeholder);
    setEditTooltip(section.tooltipContent || '');
  };

  const handleSaveEdit = () => {
    if (editingSection && !editTitle.trim()) {
      setEditError('Le titre est requis');
      return;
    }
    if (editingSection) {
      onUpdateSection(editingSection.id, {
        title: editTitle.trim(),
        placeholder: editPlaceholder.trim() || 'Saisissez le contenu de cette section...',
        tooltipContent: editTooltip.trim() || null
      });
      setEditingSection(null);
      setEditTitle('');
      setEditPlaceholder('');
      setEditTooltip('');
      setEditError('');
      showAlert('Section mise à jour', 'La section a été mise à jour.');
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditTitle('');
    setEditPlaceholder('');
    setEditTooltip('');
    setEditError('');
  };

  const visibleCount = sections.filter(section => !section.isHidden).length;
  const totalCount = sections.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Édition des sections - ${getPhaseLabel()}`}
    >
      <div className="space-y-6">
        {isDisabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Cette phase est validée. L'édition des sections n'est plus possible.
            </p>
          </div>
        )}

        <div className="bg-muted p-3 rounded-lg dark:bg-muted-dark">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Sections visibles: <strong>{visibleCount}</strong> sur <strong>{totalCount}</strong>
            </span>
            <span className="text-gray-600">
              Sections par défaut: <strong>{sections.filter(section => section.isDefault).length}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Sections de la fiche projet</h4>
          
          {sections.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-4">
              Aucune section dans cette fiche projet
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map(section => section.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {sections.map((section, index) => (
                    <SortableItem
                      key={section.id}
                      section={section}
                      index={index}
                      isDisabled={isDisabled}
                      onToggleHidden={onToggleHidden}
                      onDeleteSection={onDeleteSection}
                      onEditSection={handleEditSection}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {editingSection && (
          <div className="border-t border-border pt-4 dark:border-border-dark">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Éditer la section</h4>
            <div className="space-y-3">
              <Input
                label="Titre de la section"
                value={editTitle}
                onChange={(e) => {
                  setEditTitle(e.target.value);
                  if (editError) {
                    setEditError('');
                  }
                }}
                placeholder="Titre de la section"
                error={editError}
              />
              <Textarea
                label="Texte d'aide (placeholder)"
                value={editPlaceholder}
                onChange={(e) => setEditPlaceholder(e.target.value)}
                placeholder="Texte d'aide qui apparaîtra dans l'éditeur..."
                rows={3}
              />
              <Textarea
                label="Contenu du tooltip (optionnel)"
                value={editTooltip}
                onChange={(e) => setEditTooltip(e.target.value)}
                placeholder="Texte d'aide qui apparaîtra dans le tooltip..."
                rows={2}
              />
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  onClick={handleSaveEdit}
                  disabled={!editTitle.trim()}
                >
                  Enregistrer
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleCancelEdit}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        )}

        {!isDisabled && !editingSection && (
          <div className="border-t border-border pt-4 dark:border-border-dark">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Ajouter une nouvelle section</h4>
            <div className="space-y-3">
              <Input
                label="Titre de la section"
                value={newSectionTitle}
                onChange={(e) => {
                  setNewSectionTitle(e.target.value);
                  if (newSectionError) {
                    setNewSectionError('');
                  }
                }}
                placeholder="Titre de la nouvelle section"
                error={newSectionError}
              />
              <Textarea
                label="Texte d'aide (placeholder)"
                value={newSectionPlaceholder}
                onChange={(e) => setNewSectionPlaceholder(e.target.value)}
                placeholder="Texte d'aide qui apparaîtra dans l'éditeur..."
                rows={3}
              />
              <Textarea
                label="Contenu du tooltip (optionnel)"
                value={newSectionTooltip}
                onChange={(e) => setNewSectionTooltip(e.target.value)}
                placeholder="Texte d'aide qui apparaîtra dans le tooltip..."
                rows={2}
              />
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleAddSection}
                disabled={!newSectionTitle.trim()}
              >
                Ajouter la section
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-border dark:border-border-dark">
          <Button
            variant="secondary"
            onClick={onClose}
          >
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default SectionEditorModal;