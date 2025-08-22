import React, { useState, useEffect } from 'react';
import { Stakeholder } from '../../types';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Checkbox from '../UI/Checkbox';
import Button from '../UI/Button';
import { Save, X } from 'lucide-react';

interface StakeholderFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stakeholder: Omit<Stakeholder, 'id'>) => void;
  stakeholder?: Stakeholder | null;
  title: string;
  initialPhaseValidated: boolean;
  optionsPhaseValidated: boolean;
  finalPhaseValidated: boolean;
}

const StakeholderFormModal: React.FC<StakeholderFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  stakeholder,
  title,
  initialPhaseValidated,
  optionsPhaseValidated,
  finalPhaseValidated
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    role: '',
    email: '',
    isExternal: false,
    engagementLevel: '',
    mandatoryInitial: false,
    mandatoryOptions: false,
    mandatoryFinal: false
  });

  const engagementOptions = [
    '',
    'Informé',
    'Consulté',
    'Responsable',
    'Approbateur'
  ];

  // Reset form when modal opens/closes or stakeholder changes
  useEffect(() => {
    if (isOpen) {
      if (stakeholder) {
        setFormData({
          firstName: stakeholder.firstName,
          lastName: stakeholder.lastName,
          company: stakeholder.company,
          role: stakeholder.role,
          email: stakeholder.email,
          isExternal: stakeholder.isExternal,
          engagementLevel: stakeholder.engagementLevel,
          mandatoryInitial: stakeholder.mandatoryInitial,
          mandatoryOptions: stakeholder.mandatoryOptions,
          mandatoryFinal: stakeholder.mandatoryFinal
        });
      } else {
        setFormData({
          firstName: '',
          lastName: '',
          company: '',
          role: '',
          email: '',
          isExternal: false,
          engagementLevel: '',
          mandatoryInitial: false,
          mandatoryOptions: false,
          mandatoryFinal: false
        });
      }
    }
  }, [isOpen, stakeholder]);

  const handleSave = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.role.trim()) {
      return;
    }
    onSave(formData);
  };

  const handleClose = () => {
    onClose();
  };

  const isFormValid = formData.firstName.trim() && formData.lastName.trim() && formData.role.trim();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title}>
      <div className="space-y-6">
        {/* Informations personnelles */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Informations personnelles</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom *"
              value={formData.firstName}
              onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Prénom"
              required
            />
            <Input
              label="Nom *"
              value={formData.lastName}
              onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Nom"
              required
            />
          </div>
          <div className="mt-4">
            <Input
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="email@exemple.com"
              type="email"
            />
          </div>
          <div className="mt-4">
            <Input
              label="Société"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              placeholder="Nom de la société"
            />
          </div>
          <div className="mt-4">
            <Checkbox
              label="Personne externe"
              checked={formData.isExternal}
              onChange={(e) => setFormData(prev => ({ ...prev, isExternal: e.target.checked }))}
            />
          </div>
        </div>

        {/* Rôle et engagement */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Rôle et engagement</h4>
          <div className="space-y-4">
            <Input
              label="Rôle sur le projet *"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="Chef de projet, Sponsor, Expert métier..."
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau d'engagement
              </label>
              <select
                value={formData.engagementLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, engagementLevel: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {engagementOptions.map(option => (
                  <option key={option} value={option}>
                    {option || 'Sélectionner...'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Participation aux phases */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Doit valider les phases :</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Checkbox
              label="Phase Opportunité"
              checked={formData.mandatoryInitial}
              disabled={initialPhaseValidated}
              onChange={(e) => setFormData(prev => ({ ...prev, mandatoryInitial: e.target.checked }))}
            />
            <Checkbox
              label="Phase Scénarios"
              checked={formData.mandatoryOptions}
              disabled={optionsPhaseValidated}
              onChange={(e) => setFormData(prev => ({ ...prev, mandatoryOptions: e.target.checked }))}
            />
            <Checkbox
              label="Phase Engagement"
              checked={formData.mandatoryFinal}
              disabled={finalPhaseValidated}
              onChange={(e) => setFormData(prev => ({ ...prev, mandatoryFinal: e.target.checked }))}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={handleClose}
            icon={X}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!isFormValid}
            icon={Save}
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StakeholderFormModal;