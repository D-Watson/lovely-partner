import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Users, Heart, Settings, Plus } from 'lucide-react';

export function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/lovers' && (location.pathname === '/lovers' || location.pathname === '/')) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* 内容区域 */}
      <div className="outlet-container border-t">
        <Outlet />
      </div>

      {/* 底部导航栏 */}
      <div className="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="tab-container mx-auto px-4 py-2 flex justify-around items-center">
          {/* 恋人列表 Tab */}
          <button
            onClick={() => navigate('/lovers')}
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all ${
              isActive('/lovers')
                ? 'text-purple-500'
                : 'text-gray-500 hover:text-purple-400'
            }`}
            title="恋人"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1">恋人</span>
          </button>

          {/* 消息 Tab */}
          <button
            onClick={() => navigate('/chat')}
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all ${
              isActive('/chat')
                ? 'text-pink-500'
                : 'text-gray-500 hover:text-pink-400'
            }`}
            title="消息"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1">消息</span>
          </button>

          {/* 日常关怀 Tab */}
          <button
            onClick={() => navigate('/daily')}
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all ${
              isActive('/daily')
                ? 'text-red-500'
                : 'text-gray-500 hover:text-red-400'
            }`}
            title="日常"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs mt-1">日常</span>
          </button>

          {/* 设置 Tab */}
          <button
            onClick={() => navigate('/settings')}
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all ${
              isActive('/settings')
                ? 'text-blue-500'
                : 'text-gray-500 hover:text-blue-400'
            }`}
            title="设置"
          >
            <Settings className="w-6 h-6" />
            <span className="text-xs mt-1">我的</span>
          </button>
        </div>
      </div>
    </div>
  );
}
