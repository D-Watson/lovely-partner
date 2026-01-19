import { Heart, Coffee, Sun, Moon, Cloud } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';

interface DailyCarePanelProps {
  userName?: string;
}

export function DailyCarePanel({ userName = '亲爱的' }: DailyCarePanelProps) {
  const hour = new Date().getHours();
  
  // 根据时间推荐不同的关心内容
  const getCareContent = () => {
    if (hour >= 6 && hour < 9) {
      return {
        icon: <Sun className="w-8 h-8 text-yellow-500" />,
        title: '早安问候',
        message: '早上好！新的一天开始了，记得吃个营养丰富的早餐哦～今天也要元气满满！',
        tips: ['喝一杯温水', '做个简单的伸展运动', '计划今天的重要事项']
      };
    } else if (hour >= 9 && hour < 12) {
      return {
        icon: <Coffee className="w-8 h-8 text-amber-600" />,
        title: '上午加油',
        message: '上午工作辛苦了！适当休息一下，喝杯水或咖啡提提神～',
        tips: ['每小时站起来活动一下', '眺望远方缓解眼疲劳', '保持良好的坐姿']
      };
    } else if (hour >= 12 && hour < 14) {
      return {
        icon: <Heart className="w-8 h-8 text-red-500" />,
        title: '午餐时间',
        message: '该吃午饭啦！记得吃得健康又营养，吃完可以小憩一会儿～',
        tips: ['营养均衡很重要', '不要吃太饱', '饭后散散步助消化']
      };
    } else if (hour >= 14 && hour < 18) {
      return {
        icon: <Cloud className="w-8 h-8 text-blue-500" />,
        title: '下午时光',
        message: '下午好！感觉累了就休息一下，劳逸结合效率更高哦～',
        tips: ['补充水分', '吃点健康零食', '调整呼吸放松身心']
      };
    } else if (hour >= 18 && hour < 22) {
      return {
        icon: <Heart className="w-8 h-8 text-pink-500" />,
        title: '晚间温馨',
        message: '辛苦一天了！好好享受晚餐时光，今天有什么想分享的吗？',
        tips: ['享受晚餐时光', '适度运动', '和家人朋友聊聊天']
      };
    } else {
      return {
        icon: <Moon className="w-8 h-8 text-indigo-500" />,
        title: '晚安祝福',
        message: '夜深了，该休息了哦～放下手机，好好睡一觉，明天又是美好的一天！',
        tips: ['早点睡觉', '睡前不要看手机', '保持规律作息']
      };
    }
  };

  const careContent = getCareContent();

  return (
    <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          {careContent.icon}
          <CardTitle>{careContent.title}</CardTitle>
        </div>
        <CardDescription className="text-base text-gray-700">
          {careContent.message}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">💝 小贴士：</p>
          <ul className="space-y-1">
            {careContent.tips.map((tip, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
