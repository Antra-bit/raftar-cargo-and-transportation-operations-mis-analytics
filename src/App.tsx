import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { ShipmentExplorer } from './components/ShipmentExplorer';
import { MisReportsView } from './components/MisReportsView';
import { DataPipelineView } from './components/DataPipelineView';
import { VsCodeRepoStudio } from './components/VsCodeRepoStudio';
import { VivaPresentationGuide } from './components/VivaPresentationGuide';
import { ShipmentDetailModal } from './components/ShipmentDetailModal';
import { INITIAL_SHIPMENTS } from './data/mockLogisticsData';
import { Shipment } from './types/logistics';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [shipments, setShipments] = useState<Shipment[]>(INITIAL_SHIPMENTS);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(true);

  // Simulated live telemetry movement: every 5 seconds, slightly update in-transit progress
  useEffect(() => {
    if (!isSimulatingLive) return;

    const interval = setInterval(() => {
      setShipments((prev) =>
        prev.map((s) => {
          if (s.status === 'In Transit') {
            const nextProgress = s.progressPct >= 95 ? 40 : s.progressPct + 2;
            return {
              ...s,
              progressPct: nextProgress,
            };
          }
          return s;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isSimulatingLive]);

  const handleRefreshData = () => {
    setShipments([...INITIAL_SHIPMENTS]);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onRefreshData={handleRefreshData}
        isSimulatingLive={isSimulatingLive}
      />

      {/* Main Content Viewport (Desktop 1440px Baseline) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'overview' && (
          <ExecutiveDashboard
            shipments={shipments}
            onSelectShipment={(s) => setSelectedShipment(s)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'shipments' && (
          <ShipmentExplorer
            shipments={shipments}
            onSelectShipment={(s) => setSelectedShipment(s)}
          />
        )}

        {activeTab === 'mis-reports' && <MisReportsView />}

        {activeTab === 'data-pipeline' && <DataPipelineView />}

        {activeTab === 'vscode-studio' && <VsCodeRepoStudio />}

        {activeTab === 'viva-guide' && <VivaPresentationGuide />}
      </main>

      {/* Detailed Shipment Modal */}
      <ShipmentDetailModal
        shipment={selectedShipment}
        onClose={() => setSelectedShipment(null)}
      />

      {/* Quiet Industrial Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950 px-6 py-4 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-neutral-300">Raftaar Cargo & Transport Services Pvt. Ltd.</span>
            <span aria-hidden="true">·</span>
            <span>Operations MIS & Performance Analytics System</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>Data Analytics Architecture</span>
            <span aria-hidden="true">·</span>
            <span>VS Code + Jupyter + SQL + React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
