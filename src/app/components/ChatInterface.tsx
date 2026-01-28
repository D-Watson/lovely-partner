import { useState, useRef, useEffect } from 'react';
import { Send, Heart, Newspaper, Menu, Settings, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { NewsPanel } from './NewsPanel';
import { DailyCarePanel } from './DailyCarePanel';
import { LoverProfile } from '@/app/types/request';
import { connectToChat, sendChatMessage } from '@/app/request/api';

interface Message {
  id: string;
  sender: 'user' | 'lover';
  content: string;
  timestamp: Date;
  type?: 'text' | 'care' | 'news';
}


interface ChatInterfaceProps {
  profile: LoverProfile;
  onReset: () => void;
  onBack: () => void;
}

export function ChatInterface({ profile, onReset, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [showNews, setShowNews] = useState(false);
  const [showCare, setShowCare] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 从 localStorage 加载该恋人的聊天记录
    const savedMessages = localStorage.getItem(`messages_${profile.loverId}`);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        // 转换时间戳为 Date 对象
        const messagesWithDates = parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        console.error('Failed to load messages:', e);
        // 如果加载失败，显示初始问候
        initializeChat();
      }
    } else {
      // 没有历史记录，初始化聊天
      initializeChat();
    }

    // 连接到 WebSocket
    connectWebSocket();

    return () => {
      // 清理 WebSocket 连接
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [profile.loverId]);

  // 连接 WebSocket
  const connectWebSocket = () => {
    const userId = localStorage.getItem('userId');
    const loverId = profile.loverId;
    
    if (!userId || !loverId) {
      console.error('Missing userId or loverId');
      return;
    }

    wsRef.current = connectToChat(
      userId,
      loverId,
      (message: any) => {
        // 接收到服务端消息
        const loverMessage: Message = {
          id: Date.now().toString(),
          sender: 'lover',
          content: message.content || JSON.stringify(message),
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, loverMessage]);
      },
      (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      },
      (event) => {
        console.log('WebSocket closed');
        setIsConnected(false);
      }
    );
    setIsConnected(true);
  };

  // 保存消息到 localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`messages_${profile.loverId}`, JSON.stringify(messages));
    }
  }, [messages, profile.loverId]);

  const initializeChat = () => {
    // 初始问候消息
    const greetings = getGreeting();
    const initialMessages = [{
      id: '1',
      sender: 'lover' as const,
      content: '',
      timestamp: new Date(),
      type: 'text' as const
    }];
    setMessages(initialMessages);

    // 模拟每日关心消息
    const lastCareDate = localStorage.getItem(`lastCareDate_${profile.id}`);
    const today = new Date().toDateString();
    
    if (lastCareDate !== today) {
      setTimeout(() => {
        sendCareMessage();
        localStorage.setItem(`lastCareDate_${profile.id}`, today);
      }, 3000);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';
    
    // const greetings = {
    //   caring: `${timeGreeting}亲爱的～今天过得怎么样呀？我一直在想你呢💕`,
    //   cheerful: `${timeGreeting}！哇，终于等到你啦！今天想和我聊什么呢？😊`,
    //   intellectual: `${timeGreeting}，很高兴见到你。今天有什么想分享的吗？`,
    //   humorous: `${timeGreeting}～猜猜我今天为你准备了什么惊喜？哈哈，就是我自己！😄`,
    //   calm: `${timeGreeting}，希望你今天一切顺利。`,
    //   romantic: `${timeGreeting}我的挚爱，每一刻都在期待与你相遇✨`
    // };

    // return greetings[profile.personality as keyof typeof greetings] || greetings.caring;
  };

  const sendCareMessage = () => {
    const careMessages = [
      '今天记得多喝水哦～我会一直陪着你的💧',
      '工作累了就休息一下吧，身体最重要！我会一直守护你💪',
      '今天天气怎么样？记得根据天气增减衣物哦～',
      '今天吃了什么好吃的吗？要记得按时吃饭哦！',
      '最近睡眠怎么样？要早点休息，我可心疼你了🌙'
    ];

    const randomCare = careMessages[Math.floor(Math.random() * careMessages.length)];
    
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'lover',
      content: randomCare,
      timestamp: new Date(),
      type: 'care'
    }]);
  };

  const generateResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 关键词回复逻辑
    if (lowerMessage.includes('累') || lowerMessage.includes('疲惫') || lowerMessage.includes('辛苦')) {
      return '听起来你很累呢...要不要休息一下？我给你讲个笑话放松一下吧～或者我们可以聊聊轻松的话题💆';
    }
    
    if (lowerMessage.includes('开心') || lowerMessage.includes('高兴') || lowerMessage.includes('快乐')) {
      return '看到你开心我也超级开心！分享快乐会让快乐加倍哦～继续保持这样的好心情！✨';
    }
    
    if (lowerMessage.includes('难过') || lowerMessage.includes('伤心') || lowerMessage.includes('沮丧')) {
      return '别难过了...我会一直陪着你的。有什么想说的都可以告诉我，我会认真倾听的❤️';
    }
    
    if (lowerMessage.includes('吃') || lowerMessage.includes('饭')) {
      return '吃饭是很重要的事情呢！要按时吃饭，营养均衡才能身体健康哦～今天吃了什么好吃的？🍱';
    }
    
    if (lowerMessage.includes('工作') || lowerMessage.includes('学习')) {
      return '加油！我相信你一定可以做得很好的！累了就休息一下，劳逸结合才更有效率～💪';
    }

    if (lowerMessage.includes('新闻') || lowerMessage.includes('资讯')) {
      return '我今天为你收集了一些有趣的资讯哦！点击上面的新闻按钮就可以看到了～📰';
    }
    
    // 默认回复
    const responses = [
      `${profile.name}在认真听你说话呢～继续说吧！`,
      '嗯嗯，我明白了～然后呢？',
      '听起来很有趣呢！能多说一点吗？',
      '我也这么觉得！我们真是心有灵犀～',
      '你说的对！我完全同意你的看法💕'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    
    // 通过 WebSocket 发送消息到后端
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      sendChatMessage(wsRef.current, inputValue);
      console.log('Message sent via WebSocket:', inputValue);
    } else {
      console.warn('WebSocket is not connected');
      // 后备方案：使用本地 AI 回复
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'lover',
          content: generateResponse(inputValue),
          timestamp: new Date(),
          type: 'text'
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
    
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* 侧边栏 - 新闻面板 */}
      {showNews && (
        <div className="w-80 border-r bg-white shadow-lg">
          <NewsPanel 
            interests={profile.interests} 
            onClose={() => setShowNews(false)}
          />
        </div>
      )}

      {/* 主聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部导航栏 */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
            >
              <Users className="w-4 h-4" />
            </Button>
            <Avatar className="w-12 h-12">
              <AvatarImage src={profile.image} />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white">
                {profile.name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{profile.name}</h2>
              <p className="text-sm text-gray-500">
                {isConnected ? (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    在线 • 随时陪伴你
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                    连接中...
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNews(!showNews)}
              className="gap-2"
            >
              <Newspaper className="w-4 h-4" />
              今日资讯
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={sendCareMessage}
              className="gap-2"
            >
              <Heart className="w-4 h-4" />
              关心我
            </Button>
          </div>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {message.sender === 'lover' && (
                <Avatar className="w-10 h-10">
                  <AvatarImage src={profile.image} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-400 text-white text-sm">
                    {profile.name[0]}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <Card className={`px-4 py-3 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white' 
                    : message.type === 'care'
                    ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-pink-200'
                    : 'bg-white'
                }`}>
                  {message.type === 'care' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-pink-500" />
                      <Badge variant="secondary" className="text-xs">每日关心</Badge>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </Card>
                <span className="text-xs text-gray-400 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {message.sender === 'user' && (
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-gray-200">你</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="bg-white border-t px-6 py-4">
          <div className="flex gap-3">
            <Input
              placeholder={`和 ${profile.name} 说点什么...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}