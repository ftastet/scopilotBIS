import type { StateCreator } from 'zustand';
import { ProjectSection } from '../types';
import type { ProjectState } from './useProjectStore';
import { findProject, updateProjectInFirestore } from './projectHelpers';

export interface SectionSlice {
  addProjectSection: (
    projectId: string,
    phase: 'initial' | 'options' | 'final',
    newSection: Omit<ProjectSection, 'id' | 'order'>
  ) => Promise<void>;
  updateProjectSection: (
    projectId: string,
    phase: 'initial' | 'options' | 'final',
    sectionId: string,
    updates: Partial<ProjectSection>
  ) => Promise<void>;
  deleteProjectSection: (
    projectId: string,
    phase: 'initial' | 'options' | 'final',
    sectionId: string
  ) => Promise<void>;
  toggleProjectSectionHidden: (
    projectId: string,
    phase: 'initial' | 'options' | 'final',
    sectionId: string,
    isHidden: boolean
  ) => Promise<void>;
  reorderProjectSections: (
    projectId: string,
    phase: 'initial' | 'options' | 'final',
    sourceIndex: number,
    destinationIndex: number
  ) => Promise<void>;
}

export const createSectionSlice: StateCreator<ProjectState, [], [], SectionSlice> = (set, get) => ({
  addProjectSection: async (projectId, phase, newSection) => {
    const project = findProject(get, projectId);
    const phaseData = project.data[phase] as any;
    const sections = phaseData.sections as ProjectSection[];
    const maxOrder = sections.length > 0 ? Math.max(...sections.map((s) => s.order)) : -1;
    const newProjectSection: ProjectSection = {
      id: `${phase}-section-${Date.now()}`,
      order: maxOrder + 1,
      ...newSection,
    };
    const updatedSections = [...sections, newProjectSection];
    await updateProjectInFirestore(
      projectId,
      { [phase]: { ...phaseData, sections: updatedSections } },
      get,
      set
    );
  },

  updateProjectSection: async (projectId, phase, sectionId, updates) => {
    const project = findProject(get, projectId);
    const phaseData = project.data[phase] as any;
    const updatedSections = phaseData.sections.map((section: ProjectSection) =>
      section.id === sectionId ? { ...section, ...updates } : section
    );
    await updateProjectInFirestore(
      projectId,
      { [phase]: { ...phaseData, sections: updatedSections } },
      get,
      set
    );
  },

  deleteProjectSection: async (projectId, phase, sectionId) => {
    const project = findProject(get, projectId);
    const phaseData = project.data[phase] as any;
    const updatedSections = phaseData.sections.filter(
      (section: ProjectSection) => !(section.id === sectionId && !section.isDefault)
    );
    if (phase === 'options') {
      const scenarios = project.data.options.scenarios;
      const updatedScenarios = {
        A: {
          ...scenarios.A,
          sectionContents: Object.fromEntries(
            Object.entries(scenarios.A.sectionContents).filter(([id]) => id !== sectionId)
          ),
        },
        B: {
          ...scenarios.B,
          sectionContents: Object.fromEntries(
            Object.entries(scenarios.B.sectionContents).filter(([id]) => id !== sectionId)
          ),
        },
      };
      await updateProjectInFirestore(
        projectId,
        { [phase]: { ...phaseData, sections: updatedSections, scenarios: updatedScenarios } },
        get,
        set
      );
    } else {
      await updateProjectInFirestore(
        projectId,
        { [phase]: { ...phaseData, sections: updatedSections } },
        get,
        set
      );
    }
  },

  toggleProjectSectionHidden: async (projectId, phase, sectionId, isHidden) => {
    const project = findProject(get, projectId);
    const phaseData = project.data[phase] as any;
    const updatedSections = phaseData.sections.map((section: ProjectSection) =>
      section.id === sectionId ? { ...section, isHidden } : section
    );
    await updateProjectInFirestore(
      projectId,
      { [phase]: { ...phaseData, sections: updatedSections } },
      get,
      set
    );
  },

  reorderProjectSections: async (projectId, phase, sourceIndex, destinationIndex) => {
    const project = findProject(get, projectId);
    const phaseData = project.data[phase] as any;
    const sections = [...(phaseData.sections as ProjectSection[])];
    const [reorderedSection] = sections.splice(sourceIndex, 1);
    sections.splice(destinationIndex, 0, reorderedSection);
    const updatedSections = sections.map((section, index) => ({ ...section, order: index }));
    await updateProjectInFirestore(
      projectId,
      { [phase]: { ...phaseData, sections: updatedSections } },
      get,
      set
    );
  },
});
