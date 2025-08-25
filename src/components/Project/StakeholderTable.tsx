import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Stakeholder } from '../../types';
import Button from '../UI/Button';
import StakeholderFormModal from './StakeholderFormModal';
import { Table } from 'flowbite-react';

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
          color="blue"
          size="sm"
          icon={Plus}
          onClick={handleAdd}
        >
          Ajouter
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <Table.Head>
            <Table.HeadCell rowSpan={2}>Prénom</Table.HeadCell>
            <Table.HeadCell rowSpan={2}>Nom</Table.HeadCell>
            <Table.HeadCell rowSpan={2}>Rôle sur le projet</Table.HeadCell>
            <Table.HeadCell rowSpan={2}>Email</Table.HeadCell>
            <Table.HeadCell rowSpan={2}>Société</Table.HeadCell>
            <Table.HeadCell rowSpan={2} className="text-center">Externe</Table.HeadCell>
            <Table.HeadCell rowSpan={2}>Niveau d'engagement</Table.HeadCell>
            <Table.HeadCell colSpan={3} className="text-center">Doit valider les phases</Table.HeadCell>
            <Table.HeadCell rowSpan={2} className="text-center">Actions</Table.HeadCell>
          </Table.Head>
          <Table.Head>
            <Table.HeadCell className="text-center">Fiche projet initiale</Table.HeadCell>
            <Table.HeadCell className="text-center">Options de périmètre</Table.HeadCell>
            <Table.HeadCell className="text-center">Périmètre final</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {stakeholders.map((stakeholder) => (
              <Table.Row key={stakeholder.id} className="hover:bg-gray-50">
                <Table.Cell>
                  <div className="text-sm font-medium text-gray-900">{stakeholder.firstName}</div>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm font-medium text-gray-900">{stakeholder.lastName}</div>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm text-gray-900 truncate max-w-[150px]" title={stakeholder.role}>
                    {stakeholder.role}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm text-gray-500 truncate max-w-[120px]" title={stakeholder.email}>
                    {stakeholder.email}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm text-gray-900 truncate max-w-[100px]" title={stakeholder.company}>
                    {stakeholder.company}
                  </div>
                </Table.Cell>
                <Table.Cell className="text-center">
                  {stakeholder.isExternal ? (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-orange-100 text-orange-600 rounded-full">✓</span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </Table.Cell>
                <Table.Cell>
                  <div className="text-sm text-gray-500">
                    {stakeholder.engagementLevel && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {stakeholder.engagementLevel}
                      </span>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell className="text-center">
                  {stakeholder.mandatoryInitial && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full">✓</span>
                  )}
                </Table.Cell>
                <Table.Cell className="text-center">
                  {stakeholder.mandatoryOptions && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full">✓</span>
                  )}
                </Table.Cell>
                <Table.Cell className="text-center">
                  {stakeholder.mandatoryFinal && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 text-green-600 rounded-full">✓</span>
                  )}
                </Table.Cell>
                <Table.Cell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button
                      color="light"
                      size="sm"
                      icon={Edit2}
                      onClick={() => handleEdit(stakeholder)}
                    />
                    <Button
                      color="light"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(stakeholder.id)}
                    />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
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