import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Stakeholder } from '../../types';
import Button from '../UI/Button';
import StakeholderFormModal from './StakeholderFormModal';

interface StakeholderTableProps {
  stakeholders: Stakeholder[];
  onStakeholdersChange: (stakeholders: Stakeholder[]) => void;
  initialPhaseValidated: boolean;
  optionsPhaseValidated: boolean;
  finalPhaseValidated: boolean;
}

const StakeholderTable: React.FC<StakeholderTableProps> = ({
  stakeholders,
  onStakeholdersChange,
  initialPhaseValidated,
  optionsPhaseValidated,
  finalPhaseValidated
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState<Stakeholder | null>(null);

  const handleAdd = () => {
    setEditingStakeholder(null);
    setIsModalOpen(true);
  };

  const handleEdit = (stakeholder: Stakeholder) => {
    setEditingStakeholder(stakeholder);
    setIsModalOpen(true);
  };

  const handleSave = (formData: Omit<Stakeholder, 'id'>) => {
    const stakeholder: Stakeholder = {
      id: editingStakeholder?.id || Date.now().toString(),
      ...formData
    };

    if (editingStakeholder) {
      onStakeholdersChange(
        stakeholders.map(s => s.id === editingStakeholder.id ? stakeholder : s)
      );
    } else {
      onStakeholdersChange([...stakeholders, stakeholder]);
    }

    setIsModalOpen(false);
    setEditingStakeholder(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStakeholder(null);
  };

  const handleDelete = (id: string) => {
    onStakeholdersChange(stakeholders.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Parties prenantes</h3>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={handleAdd}
        >
          Ajouter
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border dark:divide-border-dark">
          <thead className="bg-muted dark:bg-muted-dark">
            <tr>
              <th rowSpan={2} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prénom
              </th>
              <th rowSpan={2} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nom
              </th>
              <th rowSpan={2} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rôle sur le projet
              </th>
              <th rowSpan={2} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th rowSpan={2} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Société
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Externe
              </th>
              <th rowSpan={2} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Niveau d'engagement
              </th>
              <th colSpan={3} className="px-4 py-2 text-center text-xs font-medium text-gray-900 uppercase tracking-wider border-b border-border dark:border-border-dark">
                Doit valider les phases
              </th>
              <th rowSpan={2} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
            <tr>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fiche projet initiale
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Options de périmètre
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Périmètre final
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border dark:bg-surface-dark dark:divide-border-dark">
            {stakeholders.map((stakeholder) => (
              <tr key={stakeholder.id} className="hover:bg-muted dark:hover:bg-muted-dark">
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {stakeholder.firstName}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {stakeholder.lastName}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 truncate max-w-[150px]" title={stakeholder.role}>
                    {stakeholder.role}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-500 truncate max-w-[120px]" title={stakeholder.email}>
                    {stakeholder.email}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 truncate max-w-[100px]" title={stakeholder.company}>
                    {stakeholder.company}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  {stakeholder.isExternal ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 text-orange-600 rounded-full">
                      ✓
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-500">
                    {stakeholder.engagementLevel && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {stakeholder.engagementLevel}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-center">
                  {stakeholder.mandatoryInitial && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full">
                      ✓
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  {stakeholder.mandatoryOptions && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full">
                      ✓
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  {stakeholder.mandatoryFinal && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full">
                      ✓
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Edit2}
                      onClick={() => handleEdit(stakeholder)}
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(stakeholder.id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <StakeholderFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        stakeholder={editingStakeholder}
        title={editingStakeholder ? 'Modifier la partie prenante' : 'Ajouter une partie prenante'}
        initialPhaseValidated={initialPhaseValidated}
        optionsPhaseValidated={optionsPhaseValidated}
        finalPhaseValidated={finalPhaseValidated}
      />
    </div>
  );
};

export default StakeholderTable;