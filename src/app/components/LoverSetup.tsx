import { useState } from 'react';
import { Heart, Sparkles, ArrowLeft, Loader } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';

import { createLoverRequest, LoverProfile } from '../types/request';
import { createLover, getLoverProfile } from '../request/api';

interface LoverSetupProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function LoverSetup({ onComplete, onBack }: LoverSetupProps) {
  const [profile, setProfile] = useState<LoverProfile>({
    id: '',
    loverId: '',
    userId: '',
    name: '',
    image: undefined,
    gender: 0,
    personality: 0,
    interests: [],
    voiceStyle: 0
  });

  const [avatarPrompt, setAvatarPrompt] = useState<string>('');

  // 生成默认头像
  const generateDefaultAvatar = (name: string, gender: number) => {
    // 使用 DiceBear API 生成卡通头像
    const style = gender === 1 ? 'avataaars' : 'avataaars';
    const seed = encodeURIComponent(name + Date.now());
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  // 异步生成头像 - 发送给后端生成
  const generateAvatarAsync = async (loverId: string, prompt: string) => {
    try {
      // 这里调用后端接口生成头像，后端会异步处理并最终更新数据库
      // 假设后端有一个 /generate-avatar 接口
      const response = await getLoverProfile(profile.userId!, loverId, prompt);
      // 头像生成后，前端可以选择刷新数据或通过其他方式获取最新头像
      const event = new CustomEvent('lover-avatar-updated', { detail: { loverId, image: response } });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Error generating avatar:', error);
    }
  };

  const toggleInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    if (!profile.name) return;
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user-${Date.now()}`;
      localStorage.setItem('userId', userId);
    }
    
    const loverId = profile.id || 'lover-' + Date.now();
    const defaultAvatar = generateDefaultAvatar(profile.name, profile.gender);
    
    try {
      // 先创建 lover，使用默认头像
      const res = await createLover({
        user_id: userId,
        lover_id: loverId,
        avatar: defaultAvatar,
        name: profile.name,   
        gender: profile.gender,
        personality: profile.personality,
        hobbies: profile.interests.map(interest => interestOptions.indexOf(interest)),
        talking_style: profile.voiceStyle
      } as createLoverRequest);
      
      // 异步生成头像（不阻塞主流程）
      if (avatarPrompt.trim()) {
        generateAvatarAsync(loverId, avatarPrompt);
      }
      onComplete();
    } catch (error) {
      console.error('Error creating lover:', error);
    }
  };

  const interestOptions = [
    '科技', '艺术', '音乐', '电影', '美食', '旅行', 
    '运动', '阅读', '游戏', '时尚', '摄影', '宠物'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          {onBack && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-4 top-4"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          )}
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-pink-500" />
          </div>
          <CardTitle className="text-3xl">
            创建你的虚拟恋人
          </CardTitle>
          <CardDescription>定制一个专属于你的AI伴侣</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 头像描述 Prompt */}
          <div className="space-y-2">
            <Label htmlFor="avatarPrompt" className="text-pink-500 font-bold text-lg tracking-wide">
              头像描述 <span className="text-pink-400">*</span>
            </Label>
            <div className="space-y-2">
              <textarea
                id="avatarPrompt"
                placeholder="例如: 温柔的女孩, 戴着眼镜, 漫画风格, 长棕色头发..."
                value={avatarPrompt}
                onChange={(e) => setAvatarPrompt(e.target.value)}
                rows={4}
                className="w-full rounded-lg px-5 py-3 bg-purple-50 border-2 border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 text-purple-700 placeholder-purple-300 shadow-sm transition-all duration-200 resize-none"
              />
              <p className="text-sm text-gray-500">✨ 详细描述你想要的虚拟恋人头像风格，我们会为你自动生成独特的头像。描述越详细，生成效果越好！</p>
            </div>
          </div>

          {/* 名字 */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-pink-500 font-bold text-lg tracking-wide"
            >
              Ta 的名字 <span className="text-pink-400">*</span>
            </Label>
            <Input
              id="name"
              placeholder="请输入名字"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="rounded-full px-5 py-3 bg-pink-50 border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-pink-700 placeholder-pink-300 shadow-sm transition-all duration-200"
            />
          </div>

          {/* 性别 */}
          <div className="space-y-2">
            <Label className="text-pink-500 font-bold text-lg">性别</Label>
            <RadioGroup
              onValueChange={(value) => setProfile({ ...profile, gender: Number(value) })}
              value={String(profile.gender)}
            >
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="0"
                    id="male"
                    className="w-6 h-6 border-2 border-pink-300 rounded-full bg-pink-50 transition-all duration-200 shadow-sm hover:scale-110 focus:ring-2 focus:ring-pink-200"
                  />
                  <Label
                    htmlFor="male"
                    className="cursor-pointer px-3 py-1 rounded-full bg-pink-100 text-pink-600 font-medium transition-all duration-200 hover:bg-pink-200"
                  >
                    男性
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="1"
                    id="female"
                    className="w-6 h-6 border-2 border-purple-300 rounded-full bg-purple-50 transition-all duration-200 shadow-sm hover:scale-110 focus:ring-2 focus:ring-purple-200"
                  />
                  <Label
                    htmlFor="female"
                    className="cursor-pointer px-3 py-1 rounded-full bg-purple-100 text-purple-600 font-medium transition-all duration-200 hover:bg-purple-200"
                  >
                    女性
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="2"
                    id="other"
                    className="w-6 h-6 border-2 border-blue-300 rounded-full bg-blue-50 transition-all duration-200 shadow-sm hover:scale-110 focus:ring-2 focus:ring-blue-200"
                  />
                  <Label
                    htmlFor="other"
                    className="cursor-pointer px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium transition-all duration-200 hover:bg-blue-200"
                  >
                    其他
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* 性格 */}
          <div className="space-y-2">
            <Label htmlFor="personality" className="text-pink-500 font-bold text-lg">性格特点</Label>
            <Select onValueChange={(value) => setProfile({ ...profile, personality: Number(value) })} value={String(profile.personality)}>
              <SelectTrigger className="rounded-full px-3 py-4 bg-pink-50 border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-pink-700 shadow-sm transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">温柔体贴</SelectItem>
                <SelectItem value="1">活泼开朗</SelectItem>
                <SelectItem value="2">知性优雅</SelectItem>
                <SelectItem value="3">幽默风趣</SelectItem>
                <SelectItem value="4">沉稳内敛</SelectItem>
                <SelectItem value="5">浪漫多情</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 兴趣爱好 */}
          <div className="space-y-2">
            <Label className="text-pink-500 font-bold text-lg">兴趣爱好（选择3-5个）</Label>
            <div className="grid grid-cols-3 gap-4">
              {interestOptions.map((interest, index) => {
                const colors = ['bg-pink-50 border-pink-200 hover:bg-pink-100 hover:border-pink-300', 'bg-orange-50 border-orange-200 hover:bg-orange-100 hover:border-orange-300', 'bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300', 'bg-purple-50 border-purple-200 hover:bg-purple-100 hover:border-purple-300'];
                const colorClass = colors[index % 4];
                return (
                  <div key={interest} className={`flex items-center space-x-2 p-3 ${colorClass} rounded-lg border-2 hover:scale-105 transition-all duration-200 cursor-pointer shadow-sm`}>
                    <Checkbox
                      id={interest}
                      checked={profile.interests.indexOf(interest) !== -1}
                      onCheckedChange={() => toggleInterest(interest)}
                      className="w-5 h-5 border-2 border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-gray-200"
                    />
                    <Label htmlFor={interest} className="text-gray-700 font-medium cursor-pointer">{interest}</Label>
                  </div>
                );
              })}
            </div>
          </div>
          {/* 说话风格 */}
          <div className="space-y-2">
            <Label htmlFor="voiceStyle" className="text-pink-500 font-bold text-lg">说话风格</Label>
            <Select onValueChange={(value) => setProfile({ ...profile, voiceStyle: Number(value) })} value={String(profile.voiceStyle)}>
              <SelectTrigger className="rounded-full px-3 py-4 bg-pink-50 border-2 border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 text-pink-700 shadow-sm transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">温暖亲切</SelectItem>
                <SelectItem value="1">可爱俏皮</SelectItem>
                <SelectItem value="2">成熟稳重</SelectItem>
                <SelectItem value="3">文艺浪漫</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleSubmit} 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            disabled={!profile.name || !avatarPrompt.trim() || profile.interests.length < 3 || profile.interests.length > 5}
          >
            
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                开始我们的故事
              </>
            
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}