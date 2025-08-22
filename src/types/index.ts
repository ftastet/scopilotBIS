export interface User {
  id: string;
  username: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: string;
  currentPhase: 'initial' | 'options' | 'final';
  data: ProjectData;
}

export interface ProjectData {
  initial: InitialPhaseData;
  options: OptionsPhaseData;
  final: FinalPhaseData;
  stakeholders: Stakeholder[];
  notes: string;
}

export interface InitialPhaseData {
  checklist: ChecklistItem[];
  validated: boolean;
  validationComment: string;
  approvedBy: string[];
  context: string;
  objectives: string;
  scope: string;
  risks: string;
  budget: string;
  milestones: string;
  contextInternal: boolean;
  objectivesInternal: boolean;
  scopeInternal: boolean;
  risksInternal: boolean;
  budgetInternal: boolean;
  milestonesInternal: boolean;
}

export interface OptionsPhaseData {
  checklist: ChecklistItem[];
  validated: boolean;
  validationComment: string;
  approvedBy: string[];
  sections: ProjectSection[];
  selectedScenarioId: string;
  scenarios: {
    A: ScenarioContentData;
    B: ScenarioContentData;
  };
}

export interface FinalPhaseData {
  checklist: ChecklistItem[];
  validated: boolean;
  validationComment: string;
  approvedBy: string[];
  sections: ProjectSection[];
}

export interface ScenarioContentData {
  sectionContents: Record<string, { content: string; internalOnly: boolean }>;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  isDefault: boolean;
  isHidden: boolean;
}

export interface ProjectSection {
  id: string;
  title: string;
  content: string;
  internalOnly: boolean;
  placeholder: string;
  tooltipContent?: string;
  isDefault: boolean;
  isHidden: boolean;
  order: number;
}

export interface Stakeholder {
  sections: ProjectSection[];
}