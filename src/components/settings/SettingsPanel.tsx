import React, { useState } from 'react';
import { StorageService, UserSettings } from '../../services/storageService';
import { AIGenerationEngine } from '../../services/aiGenerationEngine';
import { Settings, Save, Key, UserCheck, CheckCircle2 } from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(StorageService.getSettings());
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const handleSave = () => {
    StorageService.saveSettings(settings);
    AIGenerationEngine.setConfig({
      provider: settings.aiProvider,
      apiKey: settings.apiKey,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <span>Cài đặt Hệ thống & Hồ sơ Giáo viên</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Cấu hình thông tin trường, chữ ký duyệt và kết nối AI Service Layer</p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
        >
          <Save className="w-4 h-4" /> Lưu Cài đặt
        </button>
      </div>

      {savedToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Cài đặt đã được lưu thành công!</span>
        </div>
      )}

      {/* 1. Teacher & Administrative Info */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-blue-600" /> Thông tin Hành chính & Chữ ký Dạy
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-700">Tên Giáo viên biên soạn</label>
            <input
              type="text"
              value={settings.teacherName}
              onChange={(e) => setSettings({ ...settings, teacherName: e.target.value })}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Tên Trường Tiểu học</label>
            <input
              type="text"
              value={settings.schoolName}
              onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Cơ quan Quản lý (Ủy ban / Phòng GD)</label>
            <input
              type="text"
              value={settings.governingBody}
              onChange={(e) => setSettings({ ...settings, governingBody: e.target.value })}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Họ tên Ban Giám Hiệu (Chữ ký 1)</label>
            <input
              type="text"
              value={settings.schoolAdminName}
              onChange={(e) => setSettings({ ...settings, schoolAdminName: e.target.value })}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700">Họ tên Tổ trưởng Chuyên môn (Chữ ký 2)</label>
            <input
              type="text"
              value={settings.headTeacherName}
              onChange={(e) => setSettings({ ...settings, headTeacherName: e.target.value })}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* 2. AI Engine Provider Settings */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-600" /> Cấu hình Nhà cung cấp AI (AI Service Layer)
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700">Chọn Engine AI</label>
            <select
              value={settings.aiProvider}
              onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value as any })}
              className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:bg-white"
            >
              <option value="local">Built-in Local AI Engine (Chạy nhanh Offline, 100% Khỏi cần Key)</option>
              <option value="gemini">Google Gemini AI API (Yêu cầu API Key)</option>
              <option value="openai">OpenAI GPT-4o API (Yêu cầu API Key)</option>
            </select>
          </div>

          {settings.aiProvider !== 'local' && (
            <div>
              <label className="text-xs font-semibold text-slate-700">API Key ({settings.aiProvider.toUpperCase()})</label>
              <input
                type="password"
                placeholder="Nhập API Key của bạn (Tuyệt đối không lộ ra bên ngoài)..."
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                className="mt-1 w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-800 focus:bg-white"
              />
              <p className="text-[11px] text-slate-500 mt-1">API Key được lưu bảo mật trong LocalStorage của trình duyệt.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
