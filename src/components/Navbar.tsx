import React from 'react';
import { Download, RefreshCw, Terminal } from 'lucide-react';

export type NavTab = 'overview' | 'shipments' | 'mis-reports' | 'data-pipeline' | 'vscode-studio' | 'viva-guide';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onRefreshData?: () => void;
  isSimulatingLive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onRefreshData,
  isSimulatingLive = true
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-3.5 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onTabChange('overview')}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
            Raftaar Logistics
          </span>
        </button>
        <span className="text-xs text-neutral-500 font-mono hidden sm:inline-block border-l border-neutral-800 pl-3">
          MIS & Analytics System
        </span>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
        <button
          onClick={() => onTabChange('overview')}
          className={`cursor-pointer transition-colors whitespace-nowrap pb-1 ${
            activeTab === 'overview'
              ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => onTabChange('shipments')}
          className={`cursor-pointer transition-colors whitespace-nowrap pb-1 ${
            activeTab === 'shipments'
              ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Shipments
        </button>

        <button
          onClick={() => onTabChange('mis-reports')}
          className={`cursor-pointer transition-colors whitespace-nowrap pb-1 ${
            activeTab === 'mis-reports'
              ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          MIS Reports
        </button>

        <button
          onClick={() => onTabChange('data-pipeline')}
          className={`cursor-pointer transition-colors whitespace-nowrap pb-1 ${
            activeTab === 'data-pipeline'
              ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Data Pipeline
        </button>

        <button
          onClick={() => onTabChange('vscode-studio')}
          className={`cursor-pointer transition-colors whitespace-nowrap pb-1 flex items-center gap-1.5 ${
            activeTab === 'vscode-studio'
              ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          VS Code & Notebooks
        </button>

        <button
          onClick={() => onTabChange('viva-guide')}
          className={`cursor-pointer transition-colors whitespace-nowrap pb-1 ${
            activeTab === 'viva-guide'
              ? 'text-amber-400 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Viva & Pitch
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onTabChange('mis-reports')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 border border-neutral-700/80 rounded-md hover:bg-neutral-800 hover:text-white transition-colors whitespace-nowrap cursor-pointer"
          title="Download latest MIS summary report"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>Export MIS</span>
        </button>

        {onRefreshData && (
          <button
            onClick={onRefreshData}
            className="p-1.5 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Refresh operational telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
