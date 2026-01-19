import { Plus, Heart, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';

interface LoverProfile {
  id: string;
  name: string;
  image?: string;
  gender: string;
  personality: string;
  interests: string[];
  voiceStyle: string;
}

interface LoversListProps {
  lovers: LoverProfile[];
  currentLoverId?: string;
  onSelectLover: (loverId: string) => void;
  onCreateNew: () => void;
  onDeleteLover: (loverId: string) => void;
}

export function LoversList({ lovers, currentLoverId, onSelectLover, onCreateNew, onDeleteLover }: LoversListProps) {
  const personalityLabels: Record<string, string> = {
    caring: '温柔体贴',
    cheerful: '活泼开朗',
    intellectual: '知性优雅',
    humorous: '幽默风趣',
    calm: '沉稳内敛',
    romantic: '浪漫多情'
  };

  const handleDelete = (e: React.MouseEvent, loverId: string) => {
    e.stopPropagation();
    if (confirm('确定要删除这个虚拟恋人吗？聊天记录也会一起删除。')) {
      onDeleteLover(loverId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            我的虚拟恋人
          </h1>
          <p className="text-gray-600">选择一个开始聊天，或创建新的虚拟恋人</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 创建新恋人卡片 */}
          <Card 
            className="border-2 border-dashed border-pink-300 hover:border-pink-500 cursor-pointer transition-all hover:shadow-lg bg-white/50"
            onClick={onCreateNew}
          >
            <CardContent className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="font-semibold text-lg mb-2">创建新恋人</h3>
              <p className="text-sm text-gray-500">定制你的专属AI伴侣</p>
            </CardContent>
          </Card>

          {/* 现有恋人列表 */}
          {lovers.map((lover) => (
            <Card
              key={lover.id}
              className={`cursor-pointer transition-all hover:shadow-lg group relative ${
                currentLoverId === lover.id 
                  ? 'ring-2 ring-pink-500 shadow-lg' 
                  : 'hover:ring-2 hover:ring-pink-300'
              }`}
              onClick={() => onSelectLover(lover.id)}
            >
              {currentLoverId === lover.id && (
                <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500">
                  当前
                </Badge>
              )}
              
              <CardHeader className="text-center pb-3">
                <div className="flex justify-center mb-3">
                  <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                    <AvatarImage src={lover.image} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-2xl">
                      {lover.name[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{lover.name}</CardTitle>
                <CardDescription>
                  <Badge variant="secondary" className="mt-2">
                    {personalityLabels[lover.personality] || lover.personality}
                  </Badge>
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>兴趣：{lover.interests.slice(0, 3).join('、')}</span>
                  {lover.interests.length > 3 && <span>...</span>}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectLover(lover.id);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    聊天
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleDelete(e, lover.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {lovers.length === 0 && (
          <div className="text-center mt-12 text-gray-500">
            <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>还没有创建虚拟恋人</p>
            <p className="text-sm">点击上方卡片开始创建吧！</p>
          </div>
        )}
      </div>
    </div>
  );
}
