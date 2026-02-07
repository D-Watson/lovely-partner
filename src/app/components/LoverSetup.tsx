// LoverSetup.tsx
import { useState } from 'react';
import { Heart, Sparkles, ArrowLeft, Loader, ArrowRight, ChevronLeft, Image as ImageIcon, User, Smile, MessageSquare, Palette } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';
import { createLoverRequest, LoverProfile } from '../types/request';
import { createLover, getLoverProfile } from '../request/api';
import {getUserId} from '../request/util'

// 导入CSS文件
import './lover-setup.css';
import { set } from 'date-fns';

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
  const generateAvatarSync = async (loverId: string, prompt: string) => {
    const userId = getUserId();
    try {
      const response = await getLoverProfile(userId, loverId, prompt);
      setProfile(prev => ({ ...prev, image: response }));
      return response;
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
      const resBase = await createLover({
        user_id: userId,
        lover_id: loverId,
        avatar: defaultAvatar,
        name: profile.name,   
        gender: profile.gender,
        personality: profile.personality,
        hobbies: profile.interests.map(interest => interestOptions.indexOf(interest)),
        talking_style: profile.voiceStyle
      } as createLoverRequest);
      console.log(resBase)
      const resAvatar = await generateAvatarSync(loverId, avatarPrompt);
      console.log(resAvatar)
      if (resBase !==undefined && resAvatar !== undefined) {
        setIsSubmitting(false);
        onComplete();
      } else {
        throw new Error('Failed to create lover or generate avatar');
      }
      
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
          <div className="lover-setup-step-content">
            <div className="lover-setup-step-icon">
              <div className="lover-step-icon-circle lover-step-avatar-icon">
                <ImageIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="avatarPrompt" className="lover-step-label">
                描述你心中的完美形象
              </Label>
              <p className="lover-step-hint">
                越详细的描述，越能生成你理想中的形象。试试包含外貌特征、风格、情绪等细节。
              </p>
              <textarea
                id="avatarPrompt"
                placeholder="例如：温柔的女孩，棕色长发，戴着金边眼镜，穿着白色连衣裙，站在樱花树下，阳光明媚，动漫风格，带着温暖的微笑..."
                value={avatarPrompt}
                onChange={(e) => setAvatarPrompt(e.target.value)}
                rows={6}
                className="lover-textarea"
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
          <div className="lover-setup-step-content">
            <div className="lover-setup-step-icon">
              <div className="lover-step-icon-circle lover-step-name-icon">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="name" className="lover-step-label">
                为你的恋人起一个名字
              </Label>
              <p className="lover-step-hint">
                一个特别的名字，会让你们的相遇更加难忘。可以是你喜欢的名字，或者有特殊意义的称呼。
              </p>
              <Input
                id="name"
                placeholder="例如：小雅、明轩、苏菲、星辰..."
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="lover-input"
                autoFocus
              />
            </div>
          </div>
        );

      case 3: // 性别
        return (
          <div className="lover-setup-step-content">
            <div className="lover-setup-step-icon">
              <div className="lover-step-icon-circle lover-step-gender-icon">
                <User className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="lover-step-label">
                选择恋人的性别
              </Label>
              <p className="lover-step-hint">
                选择让你感觉最舒适和亲近的性别。
              </p>
              
              <div className="lover-gender-options">
                {[
                  { 
                    value: 0, 
                    label: "男性", 
                    description: "阳光、沉稳、可靠", 
                    type: "male"
                  },
                  { 
                    value: 1, 
                    label: "女性", 
                    description: "温柔、体贴、优雅", 
                    type: "female"
                  },
                  { 
                    value: 2, 
                    label: "其他", 
                    description: "独特、自由、神秘", 
                    type: "other"
                  }
                ].map((option) => {
                  const isSelected = profile.gender === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setProfile({ ...profile, gender: option.value })}
                      className={`lover-gender-option ${option.type} ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="lover-gender-icon">
                        <User className={`w-6 h-6 ${isSelected ? 'text-white' : ''}`} />
                      </div>
                      
                      <div className="lover-gender-name">{option.label}</div>
                      <div className="lover-gender-description">{option.description}</div>
                      
                      {isSelected && (
                        <div className="lover-gender-selected-indicator">
                          <div className="lover-gender-selected-dot"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 4: // 性格
        return (
          <div className="lover-setup-step-content">
            <div className="lover-setup-step-icon">
              <div className="lover-step-icon-circle lover-step-personality-icon">
                <Smile className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="lover-step-label">
                选择恋人的性格特点
              </Label>
              <p className="lover-step-hint">
                性格决定了你们相处的独特方式。选择最吸引你的特质。
              </p>
              <Select 
                onValueChange={(value) => setProfile({ ...profile, personality: Number(value) })}
                value={String(profile.personality)}
              >
                <SelectTrigger className="lover-select-trigger">
                  <SelectValue placeholder="请选择性格特点" />
                </SelectTrigger>
                <SelectContent className="lover-select-content">
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
                      className="lover-select-item"
                    >
                      <div>
                        <span className="lover-select-item-label">{option.label}</span>
                        <p className="lover-select-item-description">{option.description}</p>
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
          <div className="lover-setup-step-content">
            <div className="lover-setup-step-icon">
              <div className="lover-step-icon-circle lover-step-interests-icon">
                <Palette className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="lover-step-label">
                选择共同的兴趣爱好
              </Label>
              <p className="lover-step-hint">
                选择3-5个你们可能会一起分享的爱好，这会让对话更有趣。
              </p>
              
              <div className="lover-interests-grid">
                {interestOptions.map((interest, index) => {
                  const isSelected = profile.interests.includes(interest);
                  const colorVariants = [
                    'pink', 'blue', 'emerald', 'amber', 'purple', 'cyan'
                  ];
                  const color = colorVariants[index % colorVariants.length];
                  
                  return (
                    <div
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`lover-interest-item lover-interest-${color} ${isSelected ? 'selected' : ''}`}
                    >
                      <div className={`lover-interest-checkbox ${isSelected ? 'selected' : ''}`}></div>
                      <div className="lover-interest-label">{interest}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="lover-interests-status">
                <p className={profile.interests.length >= 3 && profile.interests.length <= 5 ? 'valid' : 'invalid'}>
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
          <div className="lover-setup-step-content">
            <div className="lover-setup-step-icon">
              <div className="lover-step-icon-circle lover-step-voice-icon">
                <MessageSquare className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="lover-step-label">
                选择喜欢的说话风格
              </Label>
              <p className="lover-step-hint">
                声音风格会塑造独特的对话体验。选择让你感觉最舒适的风格。
              </p>
              <Select 
                onValueChange={(value) => setProfile({ ...profile, voiceStyle: Number(value) })}
                value={String(profile.voiceStyle)}
              >
                <SelectTrigger className="lover-select-trigger">
                  <SelectValue placeholder="请选择说话风格" />
                </SelectTrigger>
                <SelectContent className="lover-select-content">
                  {[
                    { value: "0", label: "温暖亲切", description: "像阳光般温暖，让人感到安心" },
                    { value: "1", label: "可爱俏皮", description: "活泼可爱，带着些许调皮" },
                    { value: "2", label: "成熟稳重", description: "理性睿智，给人以依靠感" },
                    { value: "3", label: "文艺浪漫", description: "富有诗意，充满想象力" }
                  ].map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="lover-select-item"
                    >
                      <div>
                        <span className="lover-select-item-label">{option.label}</span>
                        <p className="lover-select-item-description">{option.description}</p>
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
    <div className="lover-setup-container">
      <div className="lover-setup-card">
        <div className="lover-setup-header">
          {/* 返回按钮 */}
          {onBack && (
            <button
              onClick={handlePrev}
              className="lover-setup-back-btn"
            >
              <ChevronLeft className="w-4 h-4" />
              {currentStep === 1 ? '返回' : '上一步'}
            </button>
          )}

          {/* 标题和图标 */}
          <div className="lover-setup-icon-container">
            <div className="lover-setup-main-icon">
              <Heart className="w-8 h-8 text-white" />
              <div className="lover-setup-step-badge">
                {currentStep}
              </div>
            </div>
          </div>

          {/* 进度条 */}
          <div className="lover-setup-progress-container">
            <div className="lover-setup-progress-text">
              <span>创建你的虚拟恋人</span>
              <span>步骤 {currentStep} / {steps.length}</span>
            </div>
            <div className="lover-setup-progress-bar">
              <div 
                className="lover-setup-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* 步骤标题 */}
          <div className="lover-setup-title">
            {steps[currentStep - 1].title}
          </div>
          <div className="lover-setup-description">
            {steps[currentStep - 1].description}
          </div>
        </div>

        <div className="lover-setup-content">
          {/* 步骤内容 */}
          {renderStepContent()}

          {/* 导航按钮 */}
          <div className="lover-nav-buttons">
            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="lover-next-btn"
              >
                下一步
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="lover-submit-btn"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    创建中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    开始我们的故事
                  </>
                )}
              </button>
            )}
          </div>

          {/* 步骤指示器 */}
          <div className="lover-step-indicators">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`lover-step-dot ${step.id === currentStep ? 'active' : step.id < currentStep ? 'completed' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}