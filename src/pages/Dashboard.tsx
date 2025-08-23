import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Folder,
  Edit2,
  Trash2,
  BarChart3,
  CheckCircle
} from 'lucide-react';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Textarea from '../components/UI/Textarea';
import { useProjectStore } from '../store/useProjectStore';
import { useAlertStore } from '../store/useAlertStore';
import { Project } from '../types';

interface EditingProject {
  id: string;
  name: string;
  description: string;
}

interface Progress {
  completed: number;
  total: number;
  percentage: number;
}

const Dashboard: React.FC = () => {
  const {
    projects,
    isLoadingProjects,
    createProject,
    updateProjectDetails,
    deleteProject
  } = useProjectStore();

  const showAlert = useAlertStore(state => state.show);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<EditingProject | null>(
    null
  );

  const handleCreateProject = async (): Promise<void> => {
    if (!projectName.trim() || !projectDescription.trim()) return;

    try {
      const projectId = await createProject(
        projectName.trim(),
        projectDescription.trim()
      );
      setProjectName('');
      setProjectDescription('');
      setIsModalOpen(false);
      showAlert('Projet créé', 'Le projet a été créé avec succès.', () => {
        navigate(`/project/${projectId}`);
      });
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      showAlert('Erreur', 'Erreur lors de la création du projet. Veuillez réessayer.');
    }
  };

  const handleEditProject = (project: Project): void => {
    setEditingProject({
      id: project.id,
      name: project.name,
      description: project.description || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (): Promise<void> => {
    if (
      !editingProject ||
      !editingProject.name.trim() ||
      !editingProject.description.trim()
    )
      return;

    try {
      await updateProjectDetails(
        editingProject.id,
        editingProject.name.trim(),
        editingProject.description.trim()
      );
      setIsEditModalOpen(false);
      setEditingProject(null);
    } catch (error) {
      console.error('Erreur lors de la modification du projet:', error);
      showAlert('Erreur', 'Erreur lors de la modification du projet. Veuillez réessayer.');
    }
  };

  const handleDeleteProject = (projectId: string): void => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(projectId)
        .then(() => {
          showAlert('Projet supprimé', 'Le projet a été supprimé avec succès.');
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression du projet:', error);
          showAlert('Erreur', 'Erreur lors de la suppression du projet. Veuillez réessayer.');
        });
    }
  };

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleDateString('fr-FR');

  const getPhaseLabel = (project: Project): string => {
    if (project.currentPhase === 'final' && project.data.final.validated) {
      return 'Cadré et validé';
    }

    const labels: Record<Project['currentPhase'], string> = {
      initial: 'Opportunité',
      options: 'Scénarios',
      final: 'Engagement'
    };

    return labels[project.currentPhase] || project.currentPhase;
  };

  const getPhaseColor = (project: Project): string => {
    if (project.currentPhase === 'final' && project.data.final.validated) {
      return 'bg-green-100 text-green-800';
    }

    const colors: Record<Project['currentPhase'], string> = {
      initial: 'bg-blue-100 text-blue-800',
      options: 'bg-orange-100 text-orange-800',
      final: 'bg-green-100 text-green-800'
    };

    return colors[project.currentPhase] || 'bg-gray-100 text-gray-800';
  };

  interface StakeholderInfo {
    id: string;
    mandatoryInitial?: boolean;
    mandatoryOptions?: boolean;
    mandatoryFinal?: boolean;
  }

  const calculateCombinedProgress = (project: Project): Progress => {
    const currentPhase = project.currentPhase;
    const phaseData = project.data[currentPhase];

    const visibleChecklistItems = phaseData.checklist.filter(
      (item) => !item.isHidden
    );
    const checklistCompleted = visibleChecklistItems.filter(
      (item) => item.checked
    ).length;
    const checklistTotal = visibleChecklistItems.length;

    const mandatoryStakeholders = project.data.stakeholders.filter((s) => {
      const stakeholder = s as unknown as StakeholderInfo;
      if (currentPhase === 'initial') return stakeholder.mandatoryInitial;
      if (currentPhase === 'options') return stakeholder.mandatoryOptions;
      if (currentPhase === 'final') return stakeholder.mandatoryFinal;
      return false;
    });

    const approvedCount = mandatoryStakeholders.filter((s) =>
      phaseData.approvedBy?.includes((s as StakeholderInfo).id)
    ).length;
    const stakeholdersTotal = mandatoryStakeholders.length;

    const totalCompleted = checklistCompleted + approvedCount;
    const totalItems = checklistTotal + stakeholdersTotal;
    const percentage = totalItems > 0 ? (totalCompleted / totalItems) * 100 : 100;

    return { completed: totalCompleted, total: totalItems, percentage };
  };

  const ProjectItem: React.FC<{ project: Project }> = ({ project }) => {
    const progress = calculateCombinedProgress(project);

    return (
      <li
        key={project.id}
        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
      >
        <div
          className="p-6 cursor-pointer flex flex-col h-full"
          onClick={() => navigate(`/project/${project.id}`)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <p className="text-lg font-semibold text-gray-900 truncate">
                {project.name}
              </p>
              <p className="mt-1 text-sm text-gray-500 truncate">
                {project.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="flex items-center space-x-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Edit2}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProject(project);
                  }}
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Trash2}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(project.createdAt)}
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPhaseColor(
                  project
                )}`}
              >
                {project.currentPhase === 'final' &&
                  project.data.final.validated && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                {getPhaseLabel(project)}
              </span>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-gray-400" />
                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 font-medium min-w-[2rem]">
                  {progress.completed}/{progress.total}
                </span>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
      <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes projets</h1>
          <p className="mt-2 text-gray-600">
            Formalisez vos projets pas à pas, avant démarrage
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
        >
          Nouveau projet
        </Button>
      </div>

      {isLoadingProjects ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Chargement des projets...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Aucun projet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par créer votre premier projet FEL.
          </p>
          <div className="mt-6">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => setIsModalOpen(true)}
            >
              Nouveau projet
            </Button>
          </div>
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </ul>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProjectName('');
          setProjectDescription('');
        }}
        title="Nouveau projet"
      >
        <div className="space-y-4">
          <Input
            label="Nom du projet"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Entrez le nom du projet"
            required
          />
          <Textarea
            label="Description du projet"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Décrivez brièvement le projet..."
            rows={3}
            required
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setProjectName('');
                setProjectDescription('');
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateProject}
              disabled={!projectName.trim() || !projectDescription.trim()}
            >
              Créer
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProject(null);
        }}
        title="Modifier le projet"
      >
        <div className="space-y-4">
          <Input
            label="Nom du projet"
            value={editingProject?.name ?? ''}
            onChange={(e) =>
              setEditingProject((prev) =>
                prev ? { ...prev, name: e.target.value } : prev
              )
            }
            placeholder="Entrez le nom du projet"
            required
          />
          <Textarea
            label="Description du projet"
            value={editingProject?.description ?? ''}
            onChange={(e) =>
              setEditingProject((prev) =>
                prev ? { ...prev, description: e.target.value } : prev
              )
            }
            placeholder="Décrivez brièvement le projet..."
            rows={3}
            required
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingProject(null);
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              disabled={
                !editingProject?.name.trim() ||
                !editingProject?.description.trim()
              }
            >
              Enregistrer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;

