import React, { useState } from 'react';
import { useProjectStore } from '../store/useProjectStore';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Folder, ChevronRight, Edit2, Trash2, BarChart3, CheckCircle } from 'lucide-react';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import Textarea from '../components/UI/Textarea';
import { Project } from '../types';

const Dashboard: React.FC = () => {
  const { projects, isLoadingProjects, createProject, updateProjectDetails, deleteProject } = useProjectStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState('');
  const [editingProjectName, setEditingProjectName] = useState('');
  const [editingProjectDescription, setEditingProjectDescription] = useState('');

  const handleCreateProject = async () => {
    if (projectName.trim() && projectDescription.trim()) {
      try {
        const projectId = await createProject(projectName.trim(), projectDescription.trim());
        setProjectName('');
        setProjectDescription('');
        setIsModalOpen(false);
        navigate(`/project/${projectId}`);
      } catch (error) {
        console.error('Erreur lors de la création du projet:', error);
        alert('Erreur lors de la création du projet. Veuillez réessayer.');
      }
    }
  };

  const handleEditProject = (project: any) => {
    setEditingProjectId(project.id);
    setEditingProjectName(project.name);
    setEditingProjectDescription(project.description || '');
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingProjectName.trim() && editingProjectDescription.trim()) {
      updateProjectDetails(editingProjectId, editingProjectName.trim(), editingProjectDescription.trim())
        .then(() => {
          setIsEditModalOpen(false);
          setEditingProjectId('');
          setEditingProjectName('');
          setEditingProjectDescription('');
        })
        .catch((error) => {
          console.error('Erreur lors de la modification du projet:', error);
          alert('Erreur lors de la modification du projet. Veuillez réessayer.');
        });
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(projectId).catch((error) => {
        console.error('Erreur lors de la suppression du projet:', error);
        alert('Erreur lors de la suppression du projet. Veuillez réessayer.');
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getPhaseLabel = (phase: string) => {
    // Vérifier si le projet est complètement validé (phase finale validée)
    const project = projects.find(p => p.currentPhase === phase);
    if (phase === 'final' && project?.data.final.validated) {
      return 'Projet cadré et validé';
    }
    
    const labels = {
      initial: 'Opportunité',
      options: 'Scénarios',
      final: 'Engagement'
    };
    return labels[phase as keyof typeof labels] || phase;
  };

  const getPhaseColor = (phase: string) => {
    // Utiliser la couleur verte pour les projets validés
    const project = projects.find(p => p.currentPhase === phase);
    if (phase === 'final' && project?.data.final.validated) {
      return 'bg-green-100 text-green-800';
    }
    
    const colors = {
      initial: 'bg-blue-100 text-blue-800',
      options: 'bg-orange-100 text-orange-800',
      final: 'bg-green-100 text-green-800'
    };
    return colors[phase as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const calculateCombinedProgress = (project: Project) => {
    const currentPhase = project.currentPhase;
    const phaseData = project.data[currentPhase];
    
    // Calculer la progression de la checklist
    const visibleChecklistItems = phaseData.checklist.filter(item => !item.isHidden);
    const checklistCompleted = visibleChecklistItems.filter(item => item.checked).length;
    const checklistTotal = visibleChecklistItems.length;
    
    // Déterminer les parties prenantes obligatoires pour cette phase
    const mandatoryStakeholders = project.data.stakeholders.filter(s => {
      if (currentPhase === 'initial') return s.mandatoryInitial;
      if (currentPhase === 'options') return s.mandatoryOptions;
      if (currentPhase === 'final') return s.mandatoryFinal;
      return false;
    });
    
    // Calculer la progression des approbations
    const approvedCount = mandatoryStakeholders.filter(s => 
      phaseData.approvedBy?.includes(s.id)
    ).length;
    const stakeholdersTotal = mandatoryStakeholders.length;
    
    // Totaux combinés
    const totalCompleted = checklistCompleted + approvedCount;
    const totalItems = checklistTotal + stakeholdersTotal;
    const progressPercentage = totalItems > 0 ? (totalCompleted / totalItems) * 100 : 100;
    
    return {
      completed: totalCompleted,
      total: totalItems,
      percentage: progressPercentage
    };
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des projets...</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun projet</h3>
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
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {projects.map((project) => {
              const progress = calculateCombinedProgress(project);
              
              return (
                <li key={project.id}>
                <div
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
                  onClick={() => navigate(`/project/${project.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate">
                          {project.name}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(project.createdAt)}
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPhaseColor(project.currentPhase)}`}>
                              {project.currentPhase === 'final' && project.data.final.validated && (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              {getPhaseLabel(project.currentPhase)}
                            </span>
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="h-4 w-4 text-gray-400" />
                              <div className="flex items-center space-x-2">
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
                        <p className="mt-1 text-sm text-gray-500 truncate">
                          {project.description}
                        </p>
                      </div>
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
                          variant="danger"
                          size="sm"
                          icon={Trash2}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteProject(project.id);
                          }}
                        />
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              );
            })}
          </ul>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setProjectName('');
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
          setEditingProjectId('');
          setEditingProjectName('');
          setEditingProjectDescription('');
        }}
        title="Modifier le projet"
      >
        <div className="space-y-4">
          <Input
            label="Nom du projet"
            value={editingProjectName}
            onChange={(e) => setEditingProjectName(e.target.value)}
            placeholder="Entrez le nom du projet"
            required
          />
          <Textarea
            label="Description du projet"
            value={editingProjectDescription}
            onChange={(e) => setEditingProjectDescription(e.target.value)}
            placeholder="Décrivez brièvement le projet..."
            rows={3}
            required
          />
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setEditingProjectId('');
                setEditingProjectName('');
                setEditingProjectDescription('');
              }}
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveEdit}
              disabled={!editingProjectName.trim() || !editingProjectDescription.trim()}
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