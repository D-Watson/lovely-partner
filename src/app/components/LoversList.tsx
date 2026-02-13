import { Plus, Heart, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { LoverProfile } from '@/app/types/request';
import './LoversList.css';
import { useState } from 'react';

interface LoversListProps {
  lovers: LoverProfile[];
  currentLoverId?: string;
  onSelectLover: (loverId: string) => void;
  onCreateNew: () => void;
  onDeleteLover: (loverId: string) => void;
}

// 定义内联样式对象
const styles = {
  page: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(135deg, #fdf2f8 0%, #faf5ff 50%, #eff6ff 100%)',
    padding: '40px 20px',
    position: 'relative' as const,
    boxSizing: 'border-box' as const,
    margin: 0,
    overflow: 'hidden',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    position: 'relative' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: '48px',
  },
  title: {
    fontSize: '36px',
    fontWeight: 700,
    margin: '0 0 8px 0',
    background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '16px',
    color: '#6b7280',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '24px',
    width: '100%',
  },
  createCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '0',
    border: '2px dashed #d1d5db',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '256px',
    textAlign: 'center' as const,
  },
  createCardHover: {
    borderColor: '#ec4899',
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.3)',
  },
  createIcon: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  plusIcon: {
    width: '32px',
    height: '32px',
    color: '#ec4899',
  },
  loverCard: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '0',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
    overflow: 'hidden',
  },
  loverCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  loverCardSelected: {
    border: '2px solid #ec4899',
    boxShadow: '0 10px 25px -5px rgba(236, 72, 153, 0.3)',
  },
  currentBadge: {
    position: 'absolute' as const,
    top: '-8px',
    right: '-8px',
    background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)',
    color: '#ffffff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    zIndex: 10,
  },
  cardHeader: {
    textAlign: 'center' as const,
    padding: '24px 24px 12px 24px',
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '12px',
  },
  avatar: {
    width: '96px',
    height: '96px',
    border: '4px solid #ffffff',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  avatarFallback: {
    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    color: '#ffffff',
    fontSize: '24px',
    fontWeight: 600,
  },
  loverName: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#111827',
    margin: '0 0 8px 0',
  },
  personalityBadge: {
    marginTop: '8px',
    backgroundColor: '#f3f4f6',
    color: '#6b7280',
    borderRadius: '12px',
    padding: '4px 12px',
    fontSize: '12px',
    display: 'inline-block',
  },
  cardContent: {
    padding: '12px 24px 24px 24px',
  },
  interestsRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '16px',
  },
  heartIcon: {
    width: '16px',
    height: '16px',
    color: '#ec4899',
  },
  buttonsRow: {
    display: 'flex',
    gap: '8px',
    paddingTop: '16px',
    borderTop: '1px solid #f3f4f6',
  },
  chatButton: {
    flex: 1,
    padding: '8px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  deleteButton: {
    padding: '8px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: 'transparent',
    color: '#ef4444',
    cursor: 'pointer',
    opacity: 0,
    transition: 'all 0.2s',
  },
  deleteButtonVisible: {
    opacity: 1,
  },
  deleteButtonHover: {
    backgroundColor: '#fef2f2',
  },
  emptyState: {
    textAlign: 'center' as const,
    marginTop: '48px',
    color: '#6b7280',
  },
  emptyIcon: {
    width: '64px',
    height: '64px',
    margin: '0 auto 16px auto',
    opacity: 0.2,
  },
};

// 媒体查询定义
const mediaQueries = `
@media (min-width: 768px) {
  .lovers-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .lovers-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
`;

export function LoversList({ lovers, currentLoverId, onSelectLover, onCreateNew, onDeleteLover }: LoversListProps) {
  const personalityLabels: Record<number, string> = {
    0: '温柔体贴',
    1: '活泼开朗',
    2: '知性优雅',
    3: '幽默风趣',
    4: '沉稳内敛',
    5: '浪漫多情'
  };

  const handleDelete = (e: React.MouseEvent, loverId: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个虚拟恋人吗？聊天记录也会一起删除。')) {
      onDeleteLover(loverId);
    }
  };

  // 创建卡片悬停状态管理
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <>
      <style>{mediaQueries}</style>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>我的虚拟恋人</h1>
            <p style={styles.subtitle}>选择一个开始聊天，或创建新的虚拟恋人</p>
          </div>
          <div className='lover-page'>
            <div style={{...styles.grid, ...{gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'}}}>
            {/* 创建新恋人卡片 */}
            <div
              style={{
                ...styles.createCard,
                ...(hoveredCard === 'create' ? styles.createCardHover : {})
              }}
              onClick={onCreateNew}
              onMouseEnter={() => setHoveredCard('create')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={styles.createIcon}>
                <Plus style={styles.plusIcon} />
              </div>
              <h3 style={{fontSize: '18px', fontWeight: 600, margin: '0 0 8px 0', color: '#111827'}}>创建新恋人</h3>
              <p style={{fontSize: '14px', color: '#6b7280', margin: 0}}>定制你的专属AI伴侣</p>
            </div>
            
              {lovers.length === 0 && (
                <div style={styles.emptyState}>
                  <Heart style={styles.emptyIcon} />
                  <p>还没有创建虚拟恋人</p>
                  <p style={{fontSize: '14px', marginTop: '8px'}}>点击卡片开始创建吧！</p>
                </div>
              )}
            {/* 现有恋人列表 */}
            {lovers.map((lover) => (
              <div
                key={lover.loverId}
                style={{
                  ...styles.loverCard,
                  ...(hoveredCard === lover.loverId ? styles.loverCardHover : {}),
                  ...(currentLoverId === lover.loverId ? styles.loverCardSelected : {})
                }}
                onClick={() => onSelectLover(lover.loverId)}
                onMouseEnter={() => setHoveredCard(lover.loverId)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {currentLoverId === lover.loverId && (
                  <div style={styles.currentBadge}>当前</div>
                )}
                
                <div style={styles.cardHeader}>
                  <div style={styles.avatarContainer}>
                    <div style={styles.avatar}>
                      <img 
                        src={lover.image} 
                        alt={lover.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          borderRadius: '50%',
                          objectFit: 'cover'
                        }}
                      />
                    </div>
                  </div>
                  <h2 style={styles.loverName}>{lover.name}</h2>
                  <div>
                    <span style={styles.personalityBadge}>
                      {personalityLabels[lover.personality] || lover.personality}
                    </span>
                  </div>
                </div>

                <div style={styles.cardContent}>
                  <div style={styles.interestsRow}>
                    <Heart style={styles.heartIcon} />
                    <span>兴趣：{lover.interests.slice(0, 3).join('、')}</span>
                    {lover.interests.length > 3 && <span>...</span>}
                  </div>

                  <div style={styles.buttonsRow}>
                    <button
                      style={styles.chatButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectLover(lover.loverId);
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                    >
                      <MessageCircle style={{width: '16px', height: '16px'}} />
                      聊天
                    </button>
                    <button
                      style={{
                        ...styles.deleteButton,
                        ...(hoveredCard === lover.loverId ? styles.deleteButtonVisible : {})
                      }}
                      onClick={(e) => handleDelete(e, lover.loverId)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Trash2 style={{width: '16px', height: '16px'}} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

            </div>
          </div>
         
      </div>
    </>
  );
}

function useLocalState<T>(arg0: null): [any, any] {
  throw new Error('Function not implemented.');
}
