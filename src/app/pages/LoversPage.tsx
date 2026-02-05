import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoversList } from '../components/LoversList';
import { getLoverProfileList,deleteLover } from '../request/api';
import { LoverProfile } from '../types/request';

export function LoversPage() {
  const navigate = useNavigate();
  const [lovers, setLovers] = useState<LoverProfile[]>([]);
  const [currentLoverId, setCurrentLoverId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let savedUserId = localStorage.getItem('userId');
    if (!savedUserId) {
      savedUserId = `user-${Date.now()}`;
      localStorage.setItem('userId', savedUserId);
    }
  }, []);
 
async function fetchLovers() {
    setIsLoading(true);
    setError(null);
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
      setError('无法加载虚拟恋人列表，请检查网络连接或后端服务是否运行');
    } finally {
      setIsLoading(false);
    }
}

useEffect(() => {
  // initial fetch
  fetchLovers();

  // listen for avatar updates
  const handler = (e: any) => {
    const { loverId, image } = e.detail || {};
    if (!loverId) return;
    setLovers(prev => prev.map(l => l.loverId === loverId ? { ...l, image } : l));
  };
  window.addEventListener('lover-avatar-updated', handler as EventListener);
  return () => window.removeEventListener('lover-avatar-updated', handler as EventListener);
}, []);


  const handleSelectLover = (loverId: string) => {
    setCurrentLoverId(loverId);
    localStorage.setItem('currentLoverId', loverId);
    navigate(`/chat`);
  };

  const handleCreateNew = () => {
    navigate('/setup');
  };

  const handleDeleteLover = (loverId: string) => {
    console.log(loverId);
    setLovers(lovers.filter(l => l.loverId !== loverId));
    localStorage.removeItem(`messages_${loverId}`);
    localStorage.removeItem(`lastCareDate_${loverId}`);
    if (currentLoverId === loverId) {
      setCurrentLoverId(undefined);
    }

    let userId = localStorage.getItem('userId');
    if (userId) {
      deleteLover(userId, loverId).catch(err => {
        console.error('Failed to delete lover from backend:', err);
      });
    }
  };

  const handleRetry = () => {
    setError(null);
    setLovers([]);
    fetchLovers();
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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-20">
        <div className="max-w-md mx-auto p-4 text-center">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <p className="text-red-500 font-semibold">{error}</p>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-all"
            >
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

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
