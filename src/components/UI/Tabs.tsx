import React from 'react';

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

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange, activeTabColorClass = 'border-blue-500 text-blue-600', className = '' }) => {
  return (
    <div className={className}>
      <div className="border-b border-border dark:border-border-dark">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                py-1.5 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                ${activeTab === tab.id
                  ? `${activeTabColorClass} px-3 py-2 rounded-md`
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-border dark:hover:border-border-dark'
                }
              `}
            >
              {tab.label}
            </button>
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