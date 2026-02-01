import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatInterface } from '../components/ChatInterface';
import { getLoverProfileList } from '../request/api';
import { LoverProfile } from '../types/request';

export function ChatPage() {
  const navigate = useNavigate();
  const [currentLover, setCurrentLover] = useState<LoverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // 如果已经加载过，就不再加载了
    if (hasLoaded) return;

    async function loadCurrentLover() {
      try {
        const currentLoverId = localStorage.getItem('currentLoverId');
        if (!currentLoverId) {
          setIsLoading(false);
          setHasLoaded(true);
          return;
        }

        let userId = localStorage.getItem('userId');
        if (!userId) {
          userId = `user-${Date.now()}`;
          localStorage.setItem('userId', userId);
        }

        const loverProfiles = await getLoverProfileList(userId);
        const lover = loverProfiles.find(l => l.loverId === currentLoverId);

        if (lover) {
          setCurrentLover(lover);
          setIsLoading(false);
        } else {
          localStorage.removeItem('currentLoverId');
          navigate('/lovers');
        }
      } catch (error) {
        console.error('Failed to load current lover:', error);
        setIsLoading(false);
      } finally {
        setHasLoaded(true);
      }
    }

    loadCurrentLover();
  }, [navigate, hasLoaded]);

  const handleReset = () => {
    if (confirm('确定要删除所有虚拟恋人吗？所有聊天记录都会丢失。')) {
      localStorage.removeItem('currentLoverId');
      navigate('/lovers');
    }
  };

  const handleBack = () => {
    navigate('/lovers');
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

  if (!currentLover) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <div className="text-center">
          <p className="text-gray-600">请先选择一个虚拟恋人</p>
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      profile={currentLover}
      onReset={handleReset}
      onBack={handleBack}
    />
  );
}
