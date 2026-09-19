import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveTab } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { TeacherDashboard } from './components/dashboard/TeacherDashboard';
import { LessonPlanEditor } from './components/editor/LessonPlanEditor';
import { DocumentPreview } from './components/preview/DocumentPreview';
import { HistoryPanel } from './components/history/HistoryPanel';
import { CurriculumView } from './components/curriculum/CurriculumView';
import { IntegrationPanel } from './components/editor/IntegrationPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { StorageService } from './services/storageService';
import { ExportService } from './services/exportService';
import { LessonPlanDocument } from './types/lessonPlan';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentPlan, setCurrentPlan] = useState<LessonPlanDocument | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);

  // Load latest plan from storage on initial mount if available
  useEffect(() => {
    const plans = StorageService.getAllPlans();
    if (plans.length > 0) {
      setCurrentPlan(plans[0]);
    }
  }, []);

  const handlePlanCreated = (plan: LessonPlanDocument) => {
    setCurrentPlan(plan);
    setSaveStatus('saved');
    setActiveTab('editor');
  };

  const handlePlanChange = (updatedPlan: LessonPlanDocument) => {
    setCurrentPlan(updatedPlan);
    setSaveStatus('saving');

    // Debounced auto-save
    setTimeout(() => {
      StorageService.savePlan(updatedPlan);
      setSaveStatus('saved');
    }, 600);
  };

  const handleManualSave = () => {
    if (!currentPlan) return;
    setSaveStatus('saving');
    StorageService.savePlan(currentPlan);
    setTimeout(() => setSaveStatus('saved'), 300);
  };

  const handleExportWord = () => {
    if (currentPlan) {
      ExportService.exportToWord(currentPlan);
    }
  };

  const handleExportPDF = () => {
    ExportService.exportToPDF();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenPlanFromHistory = (plan: LessonPlanDocument) => {
    setCurrentPlan(plan);
    setActiveTab('editor');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      {/* Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasActivePlan={currentPlan !== null}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          currentPlan={currentPlan}
          saveStatus={saveStatus}
          onExportWord={handleExportWord}
          onExportPDF={handleExportPDF}
          onPrint={handlePrint}
          onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
          isPreviewMode={isPreviewMode}
        />

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto">
          {isPreviewMode && currentPlan ? (
            <DocumentPreview plan={currentPlan} />
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <TeacherDashboard
                  onPlanCreated={handlePlanCreated}
                  onNavigateEditor={() => setActiveTab('editor')}
                  onNavigatePreview={() => {
                    setIsPreviewMode(true);
                  }}
                  currentPlan={currentPlan}
                />
              )}

              {activeTab === 'editor' && currentPlan && (
                <LessonPlanEditor
                  plan={currentPlan}
                  onChange={handlePlanChange}
                  onSave={handleManualSave}
                  onPreview={() => setIsPreviewMode(true)}
                />
              )}

              {activeTab === 'curriculum' && <CurriculumView />}

              {activeTab === 'integrations' && currentPlan && (
                <div className="p-6 max-w-4xl mx-auto">
                  <IntegrationPanel plan={currentPlan} onChange={handlePlanChange} />
                </div>
              )}

              {activeTab === 'history' && (
                <HistoryPanel onOpenPlan={handleOpenPlanFromHistory} />
              )}

              {activeTab === 'settings' && <SettingsPanel />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
export default App;
