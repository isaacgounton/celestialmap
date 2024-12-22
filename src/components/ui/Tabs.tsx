import React from 'react';

interface TabPanelProps {
  id: string;
  label: string;
  icon?: React.ReactElement;
}

interface TabsProps {
  activeTab: string;
  onChange: (tabId: string) => void;
  children: React.ReactElement<TabPanelProps>[];
}

export function Tabs({ activeTab, onChange, children }: TabsProps) {
  return (
    <div className="flex flex-col space-y-2">
      {React.Children.map(children, (child) => {
        const isActive = child.props.id === activeTab;
        return (
          <button
            onClick={() => onChange(child.props.id)}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? 'bg-blue-50 text-blue-600'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            {child.props.icon && (
              <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
                {child.props.icon}
              </span>
            )}
            <span className="font-medium">{child.props.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Since TabPanel is just for configuration, we don't need to destructure props
export function TabPanel(_props: TabPanelProps) {
  return null; // This is just a configuration component
}