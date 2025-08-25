import React, { useState, useEffect } from 'react';
import { Stakeholder } from '../../types';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Checkbox from '../UI/Checkbox';
import Button from '../UI/Button';
import Select from '../UI/Select';
import { Save, X } from 'lucide-react';
import { useAlertStore } from '../../store/useAlertStore';

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

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    role: ''
  });

  const showAlert = useAlertStore(state => state.show);

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
        setErrors({ firstName: '', lastName: '', role: '' });
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
        setErrors({ firstName: '', lastName: '', role: '' });
      }
    }
  }, [isOpen, stakeholder]);

  const handleSave = () => {
    const newErrors = {
      firstName: formData.firstName.trim() ? '' : 'Le prénom est requis',
      lastName: formData.lastName.trim() ? '' : 'Le nom est requis',
      role: formData.role.trim() ? '' : 'Le rôle est requis'
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    onSave(formData);
    showAlert('Partie prenante enregistrée', 'Les informations ont été sauvegardées.');
  };

  const handleClose = () => {
    setErrors({ firstName: '', lastName: '', role: '' });
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
              onChange={(e) => {
                setFormData(prev => ({ ...prev, firstName: e.target.value }));
                if (errors.firstName) {
                  setErrors(prev => ({ ...prev, firstName: '' }));
                }
              }}
              placeholder="Prénom"
              error={errors.firstName}
              required
            />
            <Input
              label="Nom *"
              value={formData.lastName}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, lastName: e.target.value }));
                if (errors.lastName) {
                  setErrors(prev => ({ ...prev, lastName: '' }));
                }
              }}
              placeholder="Nom"
              error={errors.lastName}
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
              onChange={(e) => {
                setFormData(prev => ({ ...prev, role: e.target.value }));
                if (errors.role) {
                  setErrors(prev => ({ ...prev, role: '' }));
                }
              }}
              placeholder="Chef de projet, Sponsor, Expert métier..."
              error={errors.role}
              required
            />
            <div>
              <Select
                label="Niveau d'engagement"
                value={formData.engagementLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, engagementLevel: e.target.value }))}
              >
                {engagementOptions.map(option => (
                  <option key={option} value={option}>
                    {option || 'Sélectionner...'}
                  </option>
                ))}
              </Select>
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
            color="light"
            onClick={handleClose}
            icon={X}
          >
            Annuler
          </Button>
          <Button
            color="blue"
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