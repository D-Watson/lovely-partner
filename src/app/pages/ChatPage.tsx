import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatInterface } from '../components/ChatInterface';
import { getLoverProfileList } from '../request/api';
import { LoverProfile } from '../types/request';

// 定义内联样式对象
const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #eff6ff 100%)',
    boxSizing: 'border-box' as const,
  },
  loadingContainer: {
    textAlign: 'center' as const,
  },
  spinner: {
    display: 'block',
    width: '48px',
    height: '48px',
    margin: '0 auto 16px auto',
    border: '3px solid transparent',
    borderTopColor: '#ec4899',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  text: {
    color: '#4b5563',
    fontSize: '16px',
    margin: 0,
  },
  chatWrapper: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
  },
};

// 定义旋转动画关键帧
const spinKeyframes = `
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

export function ChatPage() {
  const navigate = useNavigate();
  const [currentLover, setCurrentLover] = useState<LoverProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
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
      <>
        <style>{spinKeyframes}</style>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.text}>加载中...</p>
          </div>
        </div>
      </>
    );
  }

  if (!currentLover) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <p style={styles.text}>请先选择一个虚拟恋人</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{spinKeyframes}</style>
      <div style={styles.container}>
        <div style={styles.chatWrapper}>
          <ChatInterface
            profile={currentLover}
            onReset={handleReset}
            onBack={handleBack}
          />
        </div>
      </div>
    </>
  );
}