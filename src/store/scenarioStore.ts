import type { StateCreator } from 'zustand';
import type { ProjectState } from './useProjectStore';
import { findProject, updateProjectInFirestore } from './projectHelpers';

export interface ScenarioSlice {
  updateScenarioSectionContent: (
    projectId: string,
    scenarioId: 'A' | 'B',
    sectionId: string,
    updates: { content?: string; internalOnly?: boolean }
  ) => Promise<void>;
  updateOptionsSelectedScenario: (
    projectId: string,
    scenarioId: string
  ) => Promise<void>;
}

export const createScenarioSlice: StateCreator<ProjectState, [], [], ScenarioSlice> = (set, get) => ({
  updateScenarioSectionContent: async (projectId, scenarioId, sectionId, updates) => {
    const project = findProject(get, projectId);
    const currentContent =
      project.data.options.scenarios[scenarioId]?.sectionContents[sectionId] || {
        content: '',
        internalOnly: false,
      };
    const updatedContent = { ...currentContent, ...updates };
    const updatedScenarios = {
      ...project.data.options.scenarios,
      [scenarioId]: {
        ...project.data.options.scenarios[scenarioId],
        sectionContents: {
          ...project.data.options.scenarios[scenarioId]?.sectionContents,
          [sectionId]: updatedContent,
        },
      },
    };
    await updateProjectInFirestore(
      projectId,
      { options: { ...project.data.options, scenarios: updatedScenarios } },
      get,
      set
    );
  },

  updateOptionsSelectedScenario: async (projectId, scenarioId) => {
    const project = findProject(get, projectId);
    await updateProjectInFirestore(
      projectId,
      { options: { ...project.data.options, selectedScenarioId: scenarioId } },
      get,
      set
    );
  },
});
