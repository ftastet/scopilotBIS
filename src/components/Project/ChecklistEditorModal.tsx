import React, { useState } from 'react';
import { Project, ChecklistItem } from '../../types';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';
import Checkbox from '../UI/Checkbox';
import { Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
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

interface ChecklistEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  phase: 'initial' | 'options' | 'final';
  onAddItem: (text: string) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleHidden: (itemId: string, isHidden: boolean) => void;
  onReorderItems: (sourceIndex: number, destinationIndex: number) => void;
}

interface SortableItemProps {
  item: ChecklistItem;
  index: number;
  isDisabled: boolean;
  onToggleHidden: (itemId: string, isHidden: boolean) => void;
  onDeleteItem: (itemId: string) => void;
}

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  index,
  isDisabled,
  onToggleHidden,
  onDeleteItem
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

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
        flex items-center space-x-3 p-3 bg-white border border-gray-200 rounded-lg
        ${item.isHidden ? 'opacity-60 bg-gray-50' : ''}
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
        <span className={`text-sm ${item.isHidden ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
          {item.text}
        </span>
        {item.isDefault && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Par défaut
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          icon={item.isHidden ? EyeOff : Eye}
          onClick={() => onToggleHidden(item.id, !item.isHidden)}
          disabled={isDisabled}
          title={item.isHidden ? 'Afficher' : 'Masquer'}
        />
        
        {!item.isDefault && (
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => onDeleteItem(item.id)}
            disabled={isDisabled}
            title="Supprimer"
          />
        )}
      </div>
    </div>
  );
};

const ChecklistEditorModal: React.FC<ChecklistEditorModalProps> = ({
  isOpen,
  onClose,
  project,
  phase,
  onAddItem,
  onDeleteItem,
  onToggleHidden,
  onReorderItems
}) => {
  const [newItemText, setNewItemText] = useState('');
  const checklist = project.data[phase].checklist;
  const isDisabled = project.data[phase].validated;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = checklist.findIndex(item => item.id === active.id);
      const newIndex = checklist.findIndex(item => item.id === over?.id);
      
      onReorderItems(oldIndex, newIndex);
    }
  };

  const handleAddItem = () => {
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText('');
    }
  };

  const getPhaseLabel = () => {
    const labels = {
      initial: 'Opportunité',
      options: 'Scénarios',
      final: 'Engagement'
    };
    return labels[phase];
  };

  const visibleCount = checklist.filter(item => !item.isHidden).length;
  const totalCount = checklist.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Édition de la checklist - ${getPhaseLabel()}`}
    >
      <div className="space-y-6">
        {isDisabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              Cette phase est validée. L'édition de la checklist n'est plus possible.
            </p>
          </div>
        )}

        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Éléments visibles: <strong>{visibleCount}</strong> sur <strong>{totalCount}</strong>
            </span>
            <span className="text-gray-600">
              Éléments par défaut: <strong>{checklist.filter(item => item.isDefault).length}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Éléments de la checklist</h4>
          
          {checklist.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-4">
              Aucun élément dans cette checklist
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={checklist.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {checklist.map((item, index) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      index={index}
                      isDisabled={isDisabled}
                      onToggleHidden={onToggleHidden}
                      onDeleteItem={onDeleteItem}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>

        {!isDisabled && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Ajouter un nouvel élément</h4>
            <div className="flex space-x-3">
              <div className="flex-1">
                <Input
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  placeholder="Texte du nouvel élément..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem();
                    }
                  }}
                />
              </div>
              <Button
                variant="primary"
                icon={Plus}
                onClick={handleAddItem}
                disabled={!newItemText.trim()}
              >
                Ajouter
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
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

export default ChecklistEditorModal;