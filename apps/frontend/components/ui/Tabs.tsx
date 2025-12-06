'use client';

import { ReactNode, useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
  count?: number;
  disabled?: boolean;
}

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('useTabs must be used within a Tabs component');
  }
  return context;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'line' | 'pill' | 'card';
  children: ReactNode;
  className?: string;
}

export function Tabs({
  tabs,
  defaultTab,
  onChange,
  variant = 'line',
  children,
  className = ''
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleTabChange }}>
      <div className={`space-y-4 ${className}`}>
        <TabsList tabs={tabs} variant={variant} />
        <div className="relative">{children}</div>
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  tabs: Tab[];
  variant: 'line' | 'pill' | 'card';
}

function TabsList({ tabs, variant }: TabsListProps) {
  const { activeTab, setActiveTab } = useTabs();

  if (variant === 'line') {
    return (
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                className={`
                  group relative flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }
                  ${tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {tab.icon && <span className="h-5 w-5">{tab.icon}</span>}
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`
                    ml-1 rounded-full px-2 py-0.5 text-xs
                    ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                    }
                  `}
                  >
                    {tab.count}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTabIndicator"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className="inline-flex items-center rounded-lg bg-gray-100 p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={`
                relative flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all
                ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}
                ${tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-md bg-white shadow-sm"
                  layoutId="activePillTab"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {tab.icon && <span className="h-5 w-5">{tab.icon}</span>}
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`
                    rounded-full px-2 py-0.5 text-xs
                    ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-200 text-gray-600'}
                  `}
                  >
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // Card variant
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && setActiveTab(tab.id)}
            disabled={tab.disabled}
            className={`
              flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all
              ${
                isActive
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-gray-200 hover:border-primary/40 hover:bg-gray-50'
              }
              ${tab.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            `}
          >
            {tab.icon && (
              <div
                className={`
                flex h-10 w-10 items-center justify-center rounded-lg
                ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}
              `}
              >
                {tab.icon}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-700'}`}>
                  {tab.label}
                </span>
                {tab.count !== undefined && (
                  <span
                    className={`
                    rounded-full px-2 py-0.5 text-xs font-medium
                    ${isActive ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-600'}
                  `}
                  >
                    {tab.count}
                  </span>
                )}
              </div>
              {isActive && (
                <div className="mt-1 flex items-center text-xs text-primary">
                  <svg className="mr-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Active
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className = '' }: TabPanelProps) {
  const { activeTab } = useTabs();

  if (activeTab !== id) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
