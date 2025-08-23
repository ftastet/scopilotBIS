import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from '../UI/Button';
import Textarea from '../UI/Textarea';

interface PhaseValidationProps {
  validated: boolean;
  validationComment: string;
  onValidationChange: (validated: boolean) => void;
  onCommentChange: (comment: string) => void;
  checklistCompleted: boolean;
  stakeholdersApproved: boolean;
  statusTextIncomplete?: string;
  additionalRequirementMessage?: string;
}

const PhaseValidation: React.FC<PhaseValidationProps> = ({
  validated,
  validationComment,
  onValidationChange,
  onCommentChange,
  checklistCompleted,
  stakeholdersApproved,
  statusTextIncomplete,
  additionalRequirementMessage
}) => {
  const getStatusIcon = () => {
    if (validated) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (checklistCompleted && stakeholdersApproved) return <Clock className="h-5 w-5 text-orange-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (validated) return 'Phase validée';
    if (checklistCompleted && stakeholdersApproved) return 'En attente de validation';
    return statusTextIncomplete || 'Checklist et/ou approbations incomplètes';
  };

  const getStatusColor = () => {
    if (validated) return 'text-green-700 bg-green-50';
    if (checklistCompleted && stakeholdersApproved) return 'text-orange-700 bg-orange-50';
    return 'text-red-700 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
        <div className="flex items-center space-x-2 mb-2">
          {getStatusIcon()}
          <span className="font-medium">{getStatusText()}</span>
        </div>
        {(!checklistCompleted || !stakeholdersApproved) && (
          <p className="text-sm">
            {additionalRequirementMessage || 'Complétez tous les éléments de la checklist et obtenez l\'approbation de toutes les parties prenantes obligatoires avant de pouvoir valider cette phase.'}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Textarea
          label="Commentaire de validation"
          value={validationComment}
          onChange={(e) => onCommentChange(e.target.value)}
          placeholder="Ajoutez un commentaire sur cette phase..."
          rows={3}
        />

        <div className="flex space-x-3">
          <Button
            variant={validated ? 'secondary' : 'primary'}
            onClick={() => onValidationChange(!validated)}
            disabled={!checklistCompleted || !stakeholdersApproved}
            icon={validated ? XCircle : CheckCircle}
          >
            {validated ? 'Annuler la validation' : 'Valider la phase'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhaseValidation;