import { useState, useEffect } from 'react';
import { Heart, Sparkles, ArrowLeft, Loader, ArrowRight, ChevronLeft, Image as ImageIcon, User, Smile, MessageSquare, Palette } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Progress } from '@/app/components/ui/progress';
import { cn } from '@/lib/utils';

import { createLoverRequest, LoverProfile } from '../types/request';
import { createLover, getLoverProfile } from '../request/api';

interface LoverSetupProps {
  onComplete: () => void;
  onBack?: () => void;
}

interface StepConfig {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  required: boolean;
}

const steps: StepConfig[] = [
  { 
    id: 1, 
    title: 'Ta 的形象', 
    description: '描述你心中的完美形象',
    icon: <ImageIcon className="w-5 h-5" />,
    required: true
  },
  { 
    id: 2, 
    title: 'Ta 的名字', 
    description: '为你的恋人起一个名字',
    icon: <User className="w-5 h-5" />,
    required: true
  },
  { 
    id: 3, 
    title: 'Ta 的性别', 
    description: '选择恋人的性别',
    icon: <User className="w-5 h-5" />,
    required: true
  },
  { 
    id: 4, 
    title: 'Ta 的性格', 
    description: '选择恋人的性格特点',
    icon: <Smile className="w-5 h-5" />,
    required: true
  },
  { 
    id: 5, 
    title: 'Ta 的爱好', 
    description: '选择共同的兴趣爱好',
    icon: <Palette className="w-5 h-5" />,
    required: true
  },
  { 
    id: 6, 
    title: 'Ta 的声音', 
    description: '选择喜欢的说话风格',
    icon: <MessageSquare className="w-5 h-5" />,
    required: true
  },
];

export function LoverSetup({ onComplete, onBack }: LoverSetupProps) {
  const [currentStep, setCurrentStep] = useState(1);
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 计算进度
  const progress = (currentStep / steps.length) * 100;

  // 生成默认头像
  const generateDefaultAvatar = (name: string, gender: number) => {
    const style = gender === 1 ? 'avataaars' : 'avataaars';
    const seed = encodeURIComponent(name + Date.now());
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  // 异步生成头像
  const generateAvatarAsync = async (loverId: string, prompt: string) => {
    try {
      const response = await getLoverProfile(profile.userId!, loverId, prompt);
      const event = new CustomEvent('lover-avatar-updated', { 
        detail: { loverId, image: response } 
      });
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

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else if (onBack) {
      onBack();
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: // 形象
        return avatarPrompt.trim().length >= 5;
      case 2: // 名字
        return profile.name.trim().length >= 2;
      case 3: // 性别
        return profile.gender !== undefined;
      case 4: // 性格
        return profile.personality !== undefined;
      case 5: // 爱好
        return profile.interests.length >= 3 && profile.interests.length <= 5;
      case 6: // 声音
        return profile.voiceStyle !== undefined;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;
    
    setIsSubmitting(true);
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = `user-${Date.now()}`;
      localStorage.setItem('userId', userId);
    }
    
    const loverId = profile.id || 'lover-' + Date.now();
    const defaultAvatar = generateDefaultAvatar(profile.name, profile.gender);
    
    try {
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
      
      if (avatarPrompt.trim()) {
        generateAvatarAsync(loverId, avatarPrompt);
      }
      
      setIsSubmitting(false);
      onComplete();
    } catch (error) {
      console.error('Error creating lover:', error);
      setIsSubmitting(false);
    }
  };

  const interestOptions = [
    '科技', '艺术', '音乐', '电影', '美食', '旅行', 
    '运动', '阅读', '游戏', '时尚', '摄影', '宠物'
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // 形象
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-purple-300 flex items-center justify-center shadow-lg">
                <ImageIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="avatarPrompt" className="text-xl font-semibold text-gray-800">
                描述你心中的完美形象
              </Label>
              <p className="text-gray-600 mb-4">
                越详细的描述，越能生成你理想中的形象。试试包含外貌特征、风格、情绪等细节。
              </p>
              <textarea
                id="avatarPrompt"
                placeholder="例如：温柔的女孩，棕色长发，戴着金边眼镜，穿着白色连衣裙，站在樱花树下，阳光明媚，动漫风格，带着温暖的微笑..."
                value={avatarPrompt}
                onChange={(e) => setAvatarPrompt(e.target.value)}
                rows={6}
                className="w-full rounded-xl px-4 py-3 bg-white border-2 border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 resize-none"
              />
              <div className="text-sm text-gray-500 space-y-2">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>描述外貌：长发/短发，眼睛颜色，身高体型等</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>描述风格：穿着风格，场景氛围，艺术风格等</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>描述情绪：微笑的，温柔的，活泼的，神秘的等</span>
                </p>
              </div>
            </div>
          </div>
        );

      case 2: // 名字
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-200 to-cyan-300 flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="name" className="text-xl font-semibold text-gray-800">
                为你的恋人起一个名字
              </Label>
              <p className="text-gray-600 mb-4">
                一个特别的名字，会让你们的相遇更加难忘。可以是你喜欢的名字，或者有特殊意义的称呼。
              </p>
              <Input
                id="name"
                placeholder="例如：小雅、明轩、苏菲、星辰..."
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="rounded-xl px-4 py-3 bg-white border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 text-center text-lg font-medium"
                autoFocus
              />
            </div>
          </div>
        );

      case 3: // 性别
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-rose-300 flex items-center justify-center shadow-lg">
          <User className="w-10 h-10 text-white" />
        </div>
      </div>
      <div className="space-y-4">
        <Label className="text-xl font-semibold text-gray-800">
          选择恋人的性别
        </Label>
        <p className="text-gray-600 mb-6">
          选择让你感觉最舒适和亲近的性别。
        </p>
        <RadioGroup
          onValueChange={(value) => setProfile({ ...profile, gender: Number(value) })}
          value={String(profile.gender)}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { 
              value: "0", 
              label: "男性", 
              description: "阳光、沉稳、可靠", 
              selectedColor: "from-blue-400 to-cyan-500",
              unselectedColor: "bg-blue-50 border-blue-200 text-blue-700"
            },
            { 
              value: "1", 
              label: "女性", 
              description: "温柔、体贴、优雅", 
              selectedColor: "from-pink-400 to-rose-500",
              unselectedColor: "bg-pink-50 border-pink-200 text-pink-700"
            },
            { 
              value: "2", 
              label: "其他", 
              description: "独特、自由、神秘", 
              selectedColor: "from-purple-400 to-violet-500",
              unselectedColor: "bg-purple-50 border-purple-200 text-purple-700"
            }
          ].map((option) => {
            const isSelected = profile.gender === Number(option.value);
            
            return (
              <div key={option.value} className="relative">
                <RadioGroupItem
                  value={option.value}
                  id={`gender-${option.value}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`gender-${option.value}`}
                  className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${isSelected
                      ? `scale-105 shadow-lg border-transparent bg-gradient-to-br ${option.selectedColor}`
                      : `${option.unselectedColor} hover:border-gray-300 hover:bg-gray-50`
                    }`}
                >
                  {/* 图标容器 - 根据选中状态改变背景 */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3
                    ${isSelected ? 'bg-white/20' : 'bg-white border'}`}
                  >
                    <User className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                  </div>
                  
                  {/* 文字 - 根据选中状态改变颜色 */}
                  <span className={`text-lg font-semibold ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                    {option.label}
                  </span>
                  <span className={`text-sm mt-1 ${isSelected ? 'text-white/80' : 'text-gray-600'}`}>
                    {option.description}
                  </span>
                  
                  {/* 选中指示器 */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-500"></div>
                    </div>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );

      case 4: // 性格
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center shadow-lg">
                <Smile className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-xl font-semibold text-gray-800">
                选择恋人的性格特点
              </Label>
              <p className="text-gray-600 mb-6">
                性格决定了你们相处的独特方式。选择最吸引你的特质。
              </p>
              <Select 
                onValueChange={(value) => setProfile({ ...profile, personality: Number(value) })}
                value={String(profile.personality)}
              >
                <SelectTrigger className="rounded-xl px-4 py-6 bg-white border-2 border-amber-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-gray-800 shadow-sm transition-all duration-200">
                  <SelectValue placeholder="请选择性格特点" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "0", label: "温柔体贴", description: "细心周到，懂得照顾人" },
                    { value: "1", label: "活泼开朗", description: "充满活力，乐观向上" },
                    { value: "2", label: "知性优雅", description: "睿智理性，气质出众" },
                    { value: "3", label: "幽默风趣", description: "善于调侃，气氛活跃" },
                    { value: "4", label: "沉稳内敛", description: "成熟稳重，心思细腻" },
                    { value: "5", label: "浪漫多情", description: "富有诗意，情感丰富" }
                  ].map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="px-4 py-3 hover:bg-amber-50 cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-medium text-gray-800">{option.label}</span>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5: // 爱好
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-200 to-teal-300 flex items-center justify-center shadow-lg">
                <Palette className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-xl font-semibold text-gray-800">
                选择共同的兴趣爱好
              </Label>
              <p className="text-gray-600 mb-6">
                选择3-5个你们可能会一起分享的爱好，这会让对话更有趣。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {interestOptions.map((interest, index) => {
                  const isSelected = profile.interests.includes(interest);
                  const colorClasses = [
                    { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-600', selectedBg: 'bg-pink-100', selectedBorder: 'border-pink-400' },
                    { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', selectedBg: 'bg-blue-100', selectedBorder: 'border-blue-400' },
                    { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-600', selectedBg: 'bg-emerald-100', selectedBorder: 'border-emerald-400' },
                    { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', selectedBg: 'bg-amber-100', selectedBorder: 'border-amber-400' },
                    { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', selectedBg: 'bg-purple-100', selectedBorder: 'border-purple-400' },
                    { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', selectedBg: 'bg-cyan-100', selectedBorder: 'border-cyan-400' },
                  ];
                  const color = colorClasses[index % colorClasses.length];
                  
                  return (
                    <div
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:scale-105",
                        isSelected 
                          ? `${color.selectedBg} ${color.selectedBorder} shadow-md` 
                          : `${color.bg} ${color.border} hover:shadow-sm`
                      )}
                    >
                      <Checkbox
                        id={`interest-${interest}`}
                        checked={isSelected}
                        onCheckedChange={() => {}}
                        className={cn(
                          "w-5 h-5 border-2 rounded mr-3",
                          isSelected ? 'border-current' : 'border-gray-300'
                        )}
                        style={{ color: isSelected ? color.text.replace('text-', '') : undefined }}
                      />
                      <Label 
                        htmlFor={`interest-${interest}`}
                        className={cn(
                          "font-medium cursor-pointer select-none",
                          isSelected ? color.text : "text-gray-700"
                        )}
                      >
                        {interest}
                      </Label>
                    </div>
                  );
                })}
              </div>
              <div className="pt-4 border-t">
                <p className={cn(
                  "text-sm font-medium transition-colors",
                  profile.interests.length >= 3 && profile.interests.length <= 5
                    ? "text-emerald-600"
                    : "text-amber-600"
                )}>
                  {profile.interests.length < 3 
                    ? `已选择 ${profile.interests.length} 个，还需选择 ${3 - profile.interests.length} 个`
                    : profile.interests.length > 5
                    ? "最多选择5个爱好"
                    : `已选择 ${profile.interests.length} 个爱好，选择完成`
                  }
                </p>
              </div>
            </div>
          </div>
        );

      case 6: // 声音
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-200 to-purple-300 flex items-center justify-center shadow-lg">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-xl font-semibold text-gray-800">
                选择喜欢的说话风格
              </Label>
              <p className="text-gray-600 mb-6">
                声音风格会塑造独特的对话体验。选择让你感觉最舒适的风格。
              </p>
              <Select 
                onValueChange={(value) => setProfile({ ...profile, voiceStyle: Number(value) })}
                value={String(profile.voiceStyle)}
              >
                <SelectTrigger className="rounded-xl px-4 py-6 bg-white border-2 border-violet-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 text-gray-800 shadow-sm transition-all duration-200">
                  <SelectValue placeholder="请选择说话风格" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    { value: "0", label: "温暖亲切", description: "像阳光般温暖，让人感到安心" },
                    { value: "1", label: "可爱俏皮", description: "活泼可爱，带着些许调皮" },
                    { value: "2", label: "成熟稳重", description: "理性睿智，给人以依靠感" },
                    { value: "3", label: "文艺浪漫", description: "富有诗意，充满想象力" }
                  ].map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="px-4 py-3 hover:bg-violet-50 cursor-pointer transition-colors"
                    >
                      <div>
                        <span className="font-medium text-gray-800">{option.label}</span>
                        <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center pb-6">
          {/* 返回按钮 */}
          <div className="absolute left-4 top-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrev}
              className="text-gray-600 hover:text-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {currentStep === 1 ? '返回' : '上一步'}
            </Button>
          </div>

          {/* 标题和图标 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xs font-bold text-white">{currentStep}</span>
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>创建你的虚拟恋人</span>
              <span>步骤 {currentStep} / {steps.length}</span>
            </div>
            <Progress value={progress} className="h-2 bg-gray-200">
              <div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </Progress>
          </div>

          {/* 步骤标题 */}
          <CardTitle className="text-2xl font-bold text-gray-800 mt-6">
            {steps[currentStep - 1].title}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {steps[currentStep - 1].description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* 步骤内容 */}
          {renderStepContent()}

          {/* 导航按钮 */}
          <div className="pt-6 border-t border-gray-100">
            {currentStep < steps.length ? (
              <Button
                onClick={handleNext}
                disabled={!isStepValid()}
                className={cn(
                  "w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300",
                  isStepValid()
                    ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                下一步
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className={cn(
                  "w-full py-6 text-lg font-semibold rounded-xl transition-all duration-300",
                  isStepValid() && !isSubmitting
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                )}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    开始我们的故事
                  </>
                )}
              </Button>
            )}
          </div>

          {/* 步骤指示器 */}
          <div className="flex justify-center space-x-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  step.id === currentStep
                    ? "w-8 bg-gradient-to-r from-pink-500 to-purple-500"
                    : step.id < currentStep
                    ? "bg-gradient-to-r from-pink-300 to-purple-300"
                    : "bg-gray-300"
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}