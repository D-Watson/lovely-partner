import { useState } from 'react';
import { Upload, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Checkbox } from '@/app/components/ui/checkbox';

interface LoverProfile {
  id: string;
  name: string;
  image?: string;
  gender: string;
  personality: string;
  interests: string[];
  voiceStyle: string;
}

interface LoverSetupProps {
  onComplete: (profile: LoverProfile) => void;
  onBack?: () => void;
  editingProfile?: LoverProfile;
}

export function LoverSetup({ onComplete, onBack, editingProfile }: LoverSetupProps) {
  const [profile, setProfile] = useState<LoverProfile>(
    editingProfile || {
      id: '',
      name: '',
      image: undefined,
      gender: 'female',
      personality: 'caring',
      interests: [],
      voiceStyle: 'warm'
    }
  );

  const [imagePreview, setImagePreview] = useState<string>(editingProfile?.image || '');

  // 生成默认头像
  const generateDefaultAvatar = (name: string, gender: string) => {
    // 使用 DiceBear API 生成卡通头像
    const style = gender === 'female' ? 'avataaars' : 'avataaars';
    const seed = encodeURIComponent(name + Date.now());
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setProfile({ ...profile, image: result });
      };
      reader.readAsDataURL(file);
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

  const handleSubmit = () => {
    if (profile.name) {
      const finalProfile = {
        ...profile,
        id: profile.id || Date.now().toString(),
        // 如果没有上传图片，生成默认头像
        image: profile.image || generateDefaultAvatar(profile.name, profile.gender)
      };
      onComplete(finalProfile);
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
            {editingProfile ? '编辑虚拟恋人' : '创建你的虚拟恋人'}
          </CardTitle>
          <CardDescription>定制一个专属于你的AI伴侣</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 上传照片 */}
          <div className="space-y-2">
            <Label>上传照片（可选）</Label>
            <div className="flex items-center gap-4">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">未上传将<br/>自动生成</p>
                  </div>
                )}
              </div>
              <div>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="max-w-[250px]"
                />
                <p className="text-sm text-gray-500 mt-2">支持 JPG、PNG 格式</p>
                <p className="text-sm text-pink-500 mt-1">💡 不上传将自动生成专属头像</p>
              </div>
            </div>
          </div>

          {/* 名字 */}
          <div className="space-y-2">
            <Label htmlFor="name">Ta 的名字 *</Label>
            <Input
              id="name"
              placeholder="请输入名字"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>

          {/* 性别 */}
          <div className="space-y-2">
            <Label>性别</Label>
            <RadioGroup value={profile.gender} onValueChange={(value) => setProfile({ ...profile, gender: value })}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">女性</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">男性</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other">其他</Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* 性格 */}
          <div className="space-y-2">
            <Label htmlFor="personality">性格特点</Label>
            <Select value={profile.personality} onValueChange={(value) => setProfile({ ...profile, personality: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="caring">温柔体贴</SelectItem>
                <SelectItem value="cheerful">活泼开朗</SelectItem>
                <SelectItem value="intellectual">知性优雅</SelectItem>
                <SelectItem value="humorous">幽默风趣</SelectItem>
                <SelectItem value="calm">沉稳内敛</SelectItem>
                <SelectItem value="romantic">浪漫多情</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 兴趣爱好 */}
          <div className="space-y-2">
            <Label>兴趣爱好（选择3-5个）</Label>
            <div className="grid grid-cols-3 gap-3">
              {interestOptions.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={profile.interests.includes(interest)}
                    onCheckedChange={() => toggleInterest(interest)}
                  />
                  <Label htmlFor={interest} className="cursor-pointer">{interest}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* 说话风格 */}
          <div className="space-y-2">
            <Label htmlFor="voiceStyle">说话风格</Label>
            <Select value={profile.voiceStyle} onValueChange={(value) => setProfile({ ...profile, voiceStyle: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="warm">温暖亲切</SelectItem>
                <SelectItem value="cute">可爱俏皮</SelectItem>
                <SelectItem value="mature">成熟稳重</SelectItem>
                <SelectItem value="poetic">文艺浪漫</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            disabled={!profile.name}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            开始我们的故事
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}