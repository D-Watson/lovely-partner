import { Settings } from 'lucide-react';

export function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">设置</h1>
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <Settings className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <button className="w-full p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
            清除所有数据
          </button>
        </div>
      </div>
    </div>
  );
}
