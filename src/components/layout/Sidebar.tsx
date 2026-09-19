import React from 'react';
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Layers,
  History,
  Settings,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'editor' | 'curriculum' | 'integrations' | 'history' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  hasActivePlan: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, hasActivePlan }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'editor', label: 'Visual Editor', icon: FileText, disabled: !hasActivePlan },
    { id: 'curriculum', label: 'Curriculum SGK', icon: BookOpen },
    { id: 'integrations', label: 'Tích hợp Liên môn', icon: Layers },
    { id: 'history', label: 'Giáo án của tôi', icon: History },
    { id: 'settings', label: 'Cài đặt Hộ thống', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-20 shadow-sm no-print">
      {/* App Branding */}
      <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="p-2 bg-blue-600/40 rounded-xl border border-blue-400/30 flex items-center justify-center text-blue-200">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-sm tracking-wide text-white leading-tight">AI LESSON PLAN</h1>
          <p className="text-[11px] text-blue-200 font-medium tracking-wider">GLOBAL SUCCESS</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 flex-1 space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Menu Quản lý
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isDisabled = item.disabled;

          return (
            <button
              key={item.id}
              onClick={() => !isDisabled && onTabChange(item.id as ActiveTab)}
              disabled={isDisabled}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                  : isDisabled
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : isDisabled ? 'text-slate-300' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {item.id === 'editor' && hasActivePlan && (
                <span className="ml-auto w-2 h-2 rounded-full bg-blue-600"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Teacher Profile Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-200/80">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
            TT
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-800 truncate">Trần Thị Thu Trang</p>
            <p className="text-[10px] text-slate-500 truncate">TH Trần Tấn Khương</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
