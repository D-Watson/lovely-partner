import { useState, useEffect } from 'react';
import { LoverSetup } from './components/LoverSetup';
import { ChatInterface } from './components/ChatInterface';
import { LoversList } from './components/LoversList';
import { getLoverProfileList } from './request/api';

interface LoverProfile {
  id: string;
  name: string;
  image?: string;
  gender: string;
  personality: string;
  interests: string[];
  voiceStyle: string;
}

type ViewMode = 'list' | 'setup' | 'chat';

export default function App() {
  const [lovers, setLovers] = useState<LoverProfile[]>([]);
  const [currentLoverId, setCurrentLoverId] = useState<string | undefined>();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 从 localStorage 加载所有虚拟恋人
    const savedLovers = localStorage.getItem('lovers');
    const savedCurrentId = localStorage.getItem('currentLoverId');
    
    if (savedLovers) {
      try {
        const parsed = JSON.parse(savedLovers);
        setLovers(parsed);
        
        // 如果有保存的当前ID且该恋人存在，则直接进入聊天
        if (savedCurrentId && parsed.some((l: LoverProfile) => l.id === savedCurrentId)) {
          setCurrentLoverId(savedCurrentId);
          setViewMode('chat');
        }
      } catch (e) {
        console.error('Failed to load lovers:', e);
      }
    }
    
    setIsLoading(false);
  }, []);

  // 保存恋人列表到 localStorage
  useEffect(() => {
    if (lovers.length > 0) {
      localStorage.setItem('lovers', JSON.stringify(lovers));
    }
  }, [lovers]);

  // 保存当前选中的恋人ID
  useEffect(() => {
    if (currentLoverId) {
      localStorage.setItem('currentLoverId', currentLoverId);
    }
  }, [currentLoverId]);

  const handleCreateNew = () => {
    setViewMode('setup');
  };

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
