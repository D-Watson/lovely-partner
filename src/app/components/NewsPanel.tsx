import { X, ExternalLink, TrendingUp, Newspaper } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';

interface NewsPanelProps {
  interests: string[];
  onClose: () => void;
}

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: string;
  time: string;
  url: string;
}

export function NewsPanel({ interests, onClose }: NewsPanelProps) {
  // 模拟新闻数据，实际应该基于用户兴趣从API获取
  const mockNews: NewsItem[] = [
    {
      id: '1',
      title: 'AI技术新突破：多模态大模型性能再创新高',
      summary: '最新研究表明，新一代多模态AI模型在图像理解和文本生成方面取得重大进展...',
      category: '科技',
      time: '2小时前',
      url: '#'
    },
    {
      id: '2',
      title: '本周末艺术展览推荐：当代艺术与科技的碰撞',
      summary: '市中心美术馆将举办大型当代艺术展，展出50余位艺术家的创新作品...',
      category: '艺术',
      time: '3小时前',
      url: '#'
    },
    {
      id: '3',
      title: '今年最佳电影盘点：这些作品不容错过',
      summary: '影评人协会评选出年度十佳电影，其中包括多部口碑与票房双丰收的作品...',
      category: '电影',
      time: '5小时前',
      url: '#'
    },
    {
      id: '4',
      title: '健康生活：如何在忙碌工作中保持运动习惯',
      summary: '专家建议，即使工作繁忙，每天也应保证30分钟的中等强度运动...',
      category: '运动',
      time: '6小时前',
      url: '#'
    },
    {
      id: '5',
      title: '美食探店：城市新开的三家特色餐厅值得一试',
      summary: '本周为大家推荐三家风格各异的新餐厅，从日料到西餐应有尽有...',
      category: '美食',
      time: '8小时前',
      url: '#'
    },
    {
      id: '6',
      title: '旅行攻略：春季最适合游玩的十个目的地',
      summary: '春暖花开的季节即将到来，这些地方的春景美不胜收...',
      category: '旅行',
      time: '10小时前',
      url: '#'
    },
    {
      id: '7',
      title: '音乐节预告：本月即将举办的精彩演出',
      summary: '多场音乐会和音乐节将在本月陆续举办，涵盖古典、摇滚、电子等多种风格...',
      category: '音乐',
      time: '12小时前',
      url: '#'
    },
    {
      id: '8',
      title: '阅读推荐：本周新书榜单出炉',
      summary: '包括文学、科普、商业等多个类别的优秀新书上榜...',
      category: '阅读',
      time: '1天前',
      url: '#'
    }
  ];

  // 根据用户兴趣过滤新闻
  const filteredNews = mockNews.filter(news => 
    interests.length === 0 || interests.includes(news.category)
  );

  const displayNews = filteredNews.length > 0 ? filteredNews : mockNews;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-pink-500" />
          <h3 className="font-semibold">今日为你推荐</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="px-4 py-3 bg-gradient-to-r from-pink-50 to-purple-50">
        <p className="text-sm text-gray-600">
          <TrendingUp className="w-4 h-4 inline mr-1" />
          根据你的兴趣精选了 {displayNews.length} 条资讯
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {displayNews.map((news, index) => (
            <div key={news.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary" className="mb-2">
                      {news.category}
                    </Badge>
                    <span className="text-xs text-gray-400">{news.time}</span>
                  </div>
                  <CardTitle className="text-base leading-snug">{news.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm mb-3">
                    {news.summary}
                  </CardDescription>
                  <Button variant="link" className="p-0 h-auto text-xs text-pink-500 hover:text-pink-600">
                    阅读全文
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </CardContent>
              </Card>
              {index < displayNews.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50">
        <p className="text-xs text-center text-gray-500">
          每日自动更新 • 上次更新：{new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
