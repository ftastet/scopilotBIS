import React from 'react';
import Button from './Button';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  activeTabColorClass?: string;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, activeTabColorClass = 'border-primary text-primary', className = '' }) => {
  return (
    <div className={className}>
      <div className="border-b border-muted">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              variant="secondary"
              size="sm"
              className={`
                border-0 border-b-2 rounded-none bg-transparent whitespace-nowrap
                ${activeTab === tab.id
                  ? `${activeTabColorClass}`
                  : 'border-transparent text-foreground/70 hover:text-foreground hover:border-muted'
                }
              `}
            >
              {tab.label}
            </Button>
          ))}
        </nav>
      </div>
      <div className="mt-3">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;