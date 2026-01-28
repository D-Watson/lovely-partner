import { useState, useEffect } from 'react';
import { MessageCircle, Users, Heart, Settings, Plus } from 'lucide-react';
import { LoverSetup } from './components/LoverSetup';
import { ChatInterface } from './components/ChatInterface';
import { LoversList } from './components/LoversList';
import { getLoverProfileList } from './request/api';
import { LoverProfile } from './types/request';
import { Button } from './components/ui/button';

type ViewMode = 'chat' | 'lovers' | 'daily' | 'news' | 'setup' | 'settings';

export default function App() {
  const [lovers, setLovers] = useState<LoverProfile[]>([]);
  const [currentLoverId, setCurrentLoverId] = useState<string | undefined>();
  const [userId, setUserId] = useState<string>('user_12345');
  const [viewMode, setViewMode] = useState<ViewMode>('lovers');
  const [isLoading, setIsLoading] = useState(true);

  const handleCreateNew = () => {
    setViewMode('setup');
  };

  useEffect(() => {
    let savedUserId = localStorage.getItem('userId');
    if (!savedUserId) {
      savedUserId = `user-${Date.now()}`;
      localStorage.setItem('userId', savedUserId);
    }
    setUserId(savedUserId);
  }, []);
  
  useEffect(() => {
    async function fetchLovers() {
      setIsLoading(false);
      try {
        let userId = localStorage.getItem('userId');
        if (!userId) {
          userId = `user-${Date.now()}`;
          localStorage.setItem('userId', userId);
        }
        const loverProfiles = await getLoverProfileList(userId);
        console.log('Fetched lover profiles:', loverProfiles);
        setLovers(loverProfiles);
      } catch (error) {
        console.error('Failed to fetch lovers:', error);
      }
    }
    
    fetchLovers();
  }, []);

  const handleSelectLover = (loverId: string) => {
    setCurrentLoverId(loverId);
    setViewMode('chat');
  };

  const handleProfileComplete = async () => {
    try {
      let userId = localStorage.getItem('userId');
      if (!userId) {
        userId = `user-${Date.now()}`;
        localStorage.setItem('userId', userId);
      }
      const loverProfiles = await getLoverProfileList(userId);
      console.log('Refreshed lover profiles:', loverProfiles);
      setLovers(loverProfiles);
    } catch (error) {
      console.error('Failed to refresh lovers:', error);
    }
    setViewMode('lovers');
  };

  const handleDeleteLover = (loverId: string) => {
    setLovers(lovers.filter(l => l.loverId !== loverId));
    localStorage.removeItem(`messages_${loverId}`);
    localStorage.removeItem(`lastCareDate_${loverId}`);
    
    if (currentLoverId === loverId) {
      setCurrentLoverId(undefined);
      setViewMode('lovers');
    }
  };

  const handleBackToList = () => {
    setViewMode('lovers');
  };

  const handleReset = () => {
    if (confirm('确定要删除所有虚拟恋人吗？所有聊天记录都会丢失。')) {
      lovers.forEach(lover => {
        localStorage.removeItem(`messages_${lover.loverId}`);
        localStorage.removeItem(`lastCareDate_${lover.loverId}`);
      });
      localStorage.removeItem('lovers');
      
      setLovers([]);
      setCurrentLoverId(undefined);
      setViewMode('lovers');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // 主内容区域
  const renderContent = () => {
    if (viewMode === 'setup') {
      return (
        <LoverSetup
          onComplete={handleProfileComplete}
          onBack={handleBackToList}
        />
      );
    }

    if (viewMode === 'chat' && currentLoverId) {
      const currentLover = lovers.find(l => l.loverId === currentLoverId);
      if (currentLover) {
        return (
          <ChatInterface
            profile={currentLover}
            onReset={handleReset}
            onBack={handleBackToList}
          />
        );
      }
    }

    if (viewMode === 'lovers') {
      return (
        <LoversList
          lovers={lovers}
          currentLoverId={currentLoverId}
          onSelectLover={handleSelectLover}
          onCreateNew={handleCreateNew}
          onDeleteLover={handleDeleteLover}
        />
      );
    }

    if (viewMode === 'daily') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-20">
          <div className="max-w-md mx-auto p-4">
            <h1 className="text-3xl font-bold text-pink-600 mb-6">日常关怀</h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
              <p className="text-center text-gray-600">这里是日常关怀面板</p>
            </div>
          </div>
        </div>
      );
    }

    if (viewMode === 'news') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-20">
          <div className="max-w-md mx-auto p-4">
            <h1 className="text-3xl font-bold text-purple-600 mb-6">新闻资讯</h1>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <MessageCircle className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <p className="text-center text-gray-600">这里是新闻资讯面板</p>
            </div>
          </div>
        </div>
      );
    }

    if (viewMode === 'settings') {
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

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* 内容区域 */}
      <div className="pb-20">
        {renderContent()}
      </div>

      {/* 底部导航栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-2 flex justify-around items-center">
          {/* 恋人列表 Tab */}
          <button
            onClick={() => setViewMode('lovers')}
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all ${
              viewMode === 'lovers'
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
            onClick={() => setViewMode('chat')}
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all ${
              viewMode === 'chat'
                ? 'text-pink-500'
                : 'text-gray-500 hover:text-pink-400'
            }`}
            title="消息"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1">消息</span>
          </button>

          {/* 新建 Tab (中间突出) */}
          <button
            onClick={() => setViewMode('setup')}
            className="flex flex-col items-center py-2 px-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg transition-shadow -mt-4"
            title="新建"
          >
            <Plus className="w-7 h-7" />
          </button>

          {/* 日常关怀 Tab */}
          <button
            onClick={() => setViewMode('daily')}
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all ${
              viewMode === 'daily'
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
            onClick={() => setViewMode('settings')}
            className={`flex flex-col items-center py-3 px-4 rounded-lg transition-all ${
              viewMode === 'settings'
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
