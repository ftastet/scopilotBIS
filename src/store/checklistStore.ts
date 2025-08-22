import type { StateCreator } from 'zustand';
import { ChecklistItem } from '../types';
import type { ProjectState } from './useProjectStore';
import { findProject, updateProjectInFirestore } from './projectHelpers';

export interface ChecklistSlice {
  addChecklistItem: (
    projectId: string,
    phase: 'initial' | 'options' | 'final',
    text: string
  ) => Promise<void>;
  deleteChecklistItem: (
    projectId: string,
    phase: 'initial' | 'options' | 'final',
    itemId: string
  ) => Promise<void>;
  toggleChecklistItemHidden: (
    projectId: string,
    phase: 'initial' | 'options' | 'final',
    itemId: string,
    isHidden: boolean
  ) => Promise<void>;
  reorderChecklistItems: (
    projectId: string,
    phase: 'initial' | 'options' | 'final',
    sourceIndex: number,
    destinationIndex: number
  ) => Promise<void>;
}

export const createChecklistSlice: StateCreator<ProjectState, [], [], ChecklistSlice> = (set, get) => ({
  addChecklistItem: async (projectId, phase, text) => {
    const project = findProject(get, projectId);
    const newItem: ChecklistItem = {
      id: `${phase}-${Date.now()}`,
      text,
      checked: false,
      isDefault: false,
      isHidden: false,
    };
    const updatedChecklist = [...project.data[phase].checklist, newItem];
    await updateProjectInFirestore(
      projectId,
      { [phase]: { ...project.data[phase], checklist: updatedChecklist } },
      get,
      set
    );
  },

  deleteChecklistItem: async (projectId, phase, itemId) => {
    const project = findProject(get, projectId);
    const updatedChecklist = project.data[phase].checklist.filter(
      (item) => !(item.id === itemId && !item.isDefault)
    );
    await updateProjectInFirestore(
      projectId,
      { [phase]: { ...project.data[phase], checklist: updatedChecklist } },
      get,
      set
    );
  },

  toggleChecklistItemHidden: async (projectId, phase, itemId, isHidden) => {
    const project = findProject(get, projectId);
    const updatedChecklist = project.data[phase].checklist.map((item) =>
      item.id === itemId ? { ...item, isHidden } : item
    );
    await updateProjectInFirestore(
      projectId,
      { [phase]: { ...project.data[phase], checklist: updatedChecklist } },
      get,
      set
    );
  },

  reorderChecklistItems: async (projectId, phase, sourceIndex, destinationIndex) => {
    const project = findProject(get, projectId);
    const checklist = [...project.data[phase].checklist];
    const [reorderedItem] = checklist.splice(sourceIndex, 1);
    checklist.splice(destinationIndex, 0, reorderedItem);
    await updateProjectInFirestore(
      projectId,
      { [phase]: { ...project.data[phase], checklist } },
      get,
      set
    );
  },
});
