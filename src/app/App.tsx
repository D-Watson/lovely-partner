import { useState, useEffect } from 'react';
import { LoverSetup } from './components/LoverSetup';
import { ChatInterface } from './components/ChatInterface';
import { LoversList } from './components/LoversList';
import { getLoverProfileList } from './request/api';
import { LoverProfile } from './types/request';

type ViewMode = 'list' | 'setup' | 'chat';

export default function App() {
  const [lovers, setLovers] = useState<LoverProfile[]>([]);
  const [currentLoverId, setCurrentLoverId] = useState<string | undefined>();
  const [userId, setUserId] = useState<string>('user_12345'); // 示例用户ID
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(true);

  const handleCreateNew = () => {
    setViewMode('setup');
  };
  useEffect(() => {
    // 生成或加载用户ID
    let savedUserId = localStorage.getItem('userId');
    if (!savedUserId) {
      savedUserId = `user-${Date.now()}`;
      localStorage.setItem('userId', savedUserId);
    }
    setUserId(savedUserId);
  }, []);
  
  useEffect(() => {
    // 加载恋人列表
    async function fetchLovers() {
      setIsLoading(true);
      try {
        let userId = localStorage.getItem('userId');
        if (!userId) {
          userId = `user-${Date.now()}`;
          localStorage.setItem('userId', userId);
        }
        const loverProfiles = await getLoverProfileList(userId);
        console.log('Fetched lover profiles:', loverProfiles);
        setLovers(loverProfiles);
        
        // 尝试加载上次选中的恋人
        const savedLoverId = localStorage.getItem('currentLoverId');
        if (savedLoverId && loverProfiles.some(l => l.id === savedLoverId)) {
          setCurrentLoverId(savedLoverId);
          setViewMode('chat');
        } else {
          setViewMode('list');
        }
      } catch (error) {
        console.error('Failed to fetch lovers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchLovers();
  }, []);

  useEffect(() => {
    // 保存当前选中的恋人ID
    if (currentLoverId) {
      localStorage.setItem('currentLoverId', currentLoverId);
    }
  }, [currentLoverId]); 


  const handleProfileComplete = (profile: LoverProfile) => {
    // 检查是否是编辑现有恋人
    const existingIndex = lovers.findIndex(l => l.id === profile.id);
    
    if (existingIndex >= 0) {
      // 更新现有恋人
      const updatedLovers = [...lovers];
      updatedLovers[existingIndex] = profile;
      setLovers(updatedLovers);
    } else {
      // 添加新恋人
      setLovers([...lovers, profile]);
    }
    
    setCurrentLoverId(profile.id);
    setViewMode('chat');
  };

  const handleSelectLover = (loverId: string) => {
    setCurrentLoverId(loverId);
    setViewMode('chat');
  };

  const handleDeleteLover = (loverId: string) => {
    // 删除恋人及其聊天记录
    setLovers(lovers.filter(l => l.id !== loverId));
    localStorage.removeItem(`messages_${loverId}`);
    localStorage.removeItem(`lastCareDate_${loverId}`);
    
    // 如果删除的是当前选中的恋人，返回列表
    if (currentLoverId === loverId) {
      setCurrentLoverId(undefined);
      setViewMode('list');
    }
    
    // 如果删除后没有恋人了，清除保存的当前ID
    if (lovers.length === 1) {
      localStorage.removeItem('currentLoverId');
    }
  };

  const handleBackToList = () => {
    setViewMode('list');
  };

  const handleReset = () => {
    if (confirm('确定要删除所有虚拟恋人吗？所有聊天记录都会丢失。')) {
      // 清除所有数据
      lovers.forEach(lover => {
        localStorage.removeItem(`messages_${lover.id}`);
        localStorage.removeItem(`lastCareDate_${lover.id}`);
      });
      localStorage.removeItem('lovers');
      localStorage.removeItem('currentLoverId');
      
      setLovers([]);
      setCurrentLoverId(undefined);
      setViewMode('list');
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

  // 列表视图
  if (viewMode === 'list') {
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

  // 创建/编辑视图
  if (viewMode === 'setup') {
    return (
      <LoverSetup
        onComplete={handleProfileComplete}
        onBack={handleBackToList}
      />
    );
  }

  // 聊天视图
  if (viewMode === 'chat' && currentLoverId) {
    const currentLover = lovers.find(l => l.id === currentLoverId);
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

  // 默认返回列表
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
