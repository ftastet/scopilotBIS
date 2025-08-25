import { Tabs as FlowbiteTabs } from 'flowbite-react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => (
  <FlowbiteTabs.Group
    aria-label="Tabs"
    style="underline"
    onActiveTabChange={(index) => onTabChange(tabs[index].id)}
  >
    {tabs.map((tab) => (
      <FlowbiteTabs.Item key={tab.id} active={activeTab === tab.id} title={tab.label}>
        {tab.content}
      </FlowbiteTabs.Item>
    ))}
  </FlowbiteTabs.Group>
);

export default Tabs;
