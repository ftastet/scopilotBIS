import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Project, ProjectData } from '../types';

export type GetState = () => { projects: Project[]; currentProject: Project | null };
export type SetState = (state: Partial<{ projects: Project[]; currentProject: Project | null }>) => void;

export const findProject = (get: GetState, id: string): Project => {
  const project = get().projects.find(p => p.id === id);
  if (!project) {
    throw new Error('Projet non trouvé');
  }
  return project;
};

export const calculateCurrentPhase = (data: ProjectData): 'initial' | 'options' | 'final' => {
  if (!data.initial.validated) return 'initial';
  if (!data.options.validated) return 'options';
  return 'final';
};

export const updateProjectInFirestore = async (
  id: string,
  updates: Partial<ProjectData>,
  get: GetState,
  set: SetState
): Promise<void> => {
  const projectRef = doc(db, 'projects', id);
  const currentProject = findProject(get, id);
  const updatedData = { ...currentProject.data, ...updates };
  const currentPhase = calculateCurrentPhase(updatedData);

  await updateDoc(projectRef, { data: updatedData, currentPhase });

  if (get().currentProject?.id === id) {
    set({ currentProject: { ...get().currentProject!, data: updatedData, currentPhase } });
  }
};
