import React from 'react';
import { ChecklistItem } from '../../types';
import Checkbox from '../UI/Checkbox';
import Button from '../UI/Button';
import { Edit2 } from 'lucide-react';

interface ChecklistProps {
  items: ChecklistItem[];
  onItemChange: (itemId: string, checked: boolean) => void;
  isDisabled?: boolean;
  onOpenEditor?: () => void;
}

const Checklist: React.FC<ChecklistProps> = ({ items, onItemChange, isDisabled = false, onOpenEditor }) => {
  // Filtrer les éléments visibles uniquement
  const visibleItems = items.filter(item => !item.isHidden);
  const completedCount = visibleItems.filter(item => item.checked).length;
  const totalCount = visibleItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-3">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onOpenEditor && !isDisabled && (
              <Button
                variant="secondary"
                size="sm"
                icon={Edit2}
                onClick={onOpenEditor}
                title="Éditer la checklist"
              />
            )}
            <h3 className="text-lg font-medium text-gray-900">Checklist de maturité</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-32 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm text-gray-600 font-medium min-w-[3rem]">
              {completedCount}/{totalCount}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        {visibleItems.map((item) => (
          <Checkbox
            key={item.id}
            label={item.text}
            checked={item.checked}
            disabled={isDisabled}
            onChange={(e) => onItemChange(item.id, e.target.checked)}
          />
        ))}
      </div>
    </div>
  );
};

export default Checklist;