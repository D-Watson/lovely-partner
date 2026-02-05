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

// 使用 IPv4 地址以避免本机 localhost 解析为 IPv6 (::1) 导致的连接拒绝
const wsUrl = 'ws://127.0.0.1:8080/lovers';

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
  const [ws, setWs] = useState<WebSocket | null>(null);
// 删除或注释掉： import { io,Socket } from 'socket.io-client';
// 并删除与 socket.io 相关的 wsRef 和 connectSocket 调用

useEffect(() => {
  const userId = localStorage.getItem('userId');
  if (!userId || !profile.loverId) {
    console.error('missing userId or loverId');
    return;
  }
  const socket = new WebSocket(`ws://127.0.0.1:8080/lovers/chat/${userId}/${profile.loverId}`);
  
  socket.onopen = () => {
    console.log('Connected to backend WebSocket server:', socket.url);
    setIsConnected(true);
  };

  socket.onmessage = (event) => {
    try {
      const parsed = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'lover',
        content: parsed.content || event.data,
        timestamp: new Date(),
        type: 'text'
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'lover',
        content: event.data,
        timestamp: new Date(),
        type: 'text'
      }]);
    }
  };

  socket.onerror = (err) => {
    console.error('WebSocket error:', err);
  };

  socket.onclose = (ev) => {
    console.log('WebSocket closed:', ev);
    setIsConnected(false);
  };

  // 保存 socket 引用以便发送/关闭
  wsRef.current = socket as any;
  setWs(socket);

  return () => {
    socket.close();
  };
}, [profile.loverId]);
   

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
      }
    }
  }, [profile.loverId]);
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
      wsRef.current.send(inputValue);
      console.log('Message sent via WebSocket:', inputValue);
    } else {
      console.warn('WebSocket is not connected');
      return;
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