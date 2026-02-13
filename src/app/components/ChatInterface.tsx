import { useState, useRef, useEffect, use } from 'react';
import { Send, Heart, Newspaper, Menu, Settings, ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/components/ui/avatar';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { NewsPanel } from './NewsPanel';
import { DailyCarePanel } from './DailyCarePanel';
import { LoverProfile, Message } from '@/app/types/request';
import './chat.css';
import { getLoverMessages } from '../request/api';


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
  setInterval(() => {
    if(socket.readyState === WebSocket.OPEN){
      console.log('WebSocket is open, sending ping');
      socket.send(JSON.stringify({ "action": "heartbeat" }));
    }
  }, 30*1000); // 每30秒发送一次ping保持连接
  
  socket.onmessage = (event) => {
    try {
      const parsed = event.data;
      console.log('Received WebSocket message:', parsed, typeof parsed);
      const msg = {
        id: Date.now().toString(),
        sender: 'ai',
        content: parsed,
        timestamp: new Date(),
        type: 'text'
      } as Message;
      setMessages(prev => [...prev, msg]);
      console.log(localStorage.getItem(`messages_${profile.loverId}`));
    } catch (e) {
      console.error('Failed to parse WebSocket message:', e);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'ai',
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
   

const loadMessages = async () => {
 // 从 服务端 加载该恋人的聊天记录

    const savedMessages = await getLoverMessages(profile.userId, profile.loverId);
    console.log('Loading messages for loverId:', profile.loverId, 'Saved messages:', savedMessages);
    if (savedMessages) {
      try {
        // 转换时间戳为 Date 对象
        const messagesWithDates = savedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (e) {
        console.error('Failed to load messages:', e);
      }
    }
}

  useEffect(() => {
    loadMessages();
  }, [profile.loverId]);
  const initializeChat = () => {
    // 初始问候消息
    const greetings = getGreeting();
    const initialMessages = [{
      id: '1',
      sender: 'ai' as const,
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
      sender: 'ai',
      content: randomCare,
      timestamp: new Date(),
      type: 'care'
    }]);
  };

const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'human',
      content: inputValue,
      timestamp: new Date(),
      type: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    // 通过 WebSocket 发送消息到后端
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        action: 'message',
        content: inputValue
      }));
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
    <div className="chat-page">
      {/* 侧边栏 - 新闻面板 */}
      {showNews && (
        <div className="news-panel-sidebar">
          <NewsPanel 
            interests={profile.interests} 
            onClose={() => setShowNews(false)}
          />
        </div>
      )}

      {/* 主聊天区域 */}
      <div className={`chat-main-container ${showNews ? 'with-sidebar' : ''}`}>
        {/* 顶部导航栏 */}
        <div className="chat-page-top">
          <div className="user-info-container">
            <button
              className="back-button"
              onClick={onBack}
            >
              <Users className="icon" />
            </button>
            <div className="avatar-container">
              {profile.image ? (
                <img src={profile.image} alt={profile.name} className="avatar-image" />
              ) : (
                <div className="avatar-fallback">
                  {profile.name[0]}
                </div>
              )}
            </div>
            <div className="user-details">
              <h2 className="user-name">{profile.name}</h2>
              <p className="user-status">
                {isConnected ? (
                  <span className="flex items-center gap-1">
                    <span className="status-indicator status-online"></span>
                    在线 • 随时陪伴你
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <span className="status-indicator status-connecting"></span>
                    连接中...
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="action-buttons">
            <button
              className="button button-outline"
              onClick={() => setShowNews(!showNews)}
            >
              <Newspaper className="icon" />
              今日资讯
            </button>
            <button
              className="button button-outline"
              onClick={sendCareMessage}
            >
              <Heart className="icon" />
              关心我
            </button>
          </div>
        </div>

        {/* 消息区域 */}
        <div className="chat-main-content">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-item ${message.sender === 'ai' ? 'message-ai' : 'message-human'}`}
            >
              {message.sender === 'ai' && (
                <div className="avatar-container">
                  {profile.image ? (
                    <img src={profile.image} alt={profile.name} className="avatar-image" />
                  ) : (
                    <div className="avatar-fallback avatar-fallback-sm">
                      {profile.name[0]}
                    </div>
                  )}
                </div>
              )}
              
              <div className="message-bubble-container">
                <div className={`message-bubble ${
                  message.sender === 'human' 
                    ? 'message-bubble-human' 
                    : message.type === 'care'
                    ? 'message-bubble-care'
                    : 'message-bubble-ai'
                }`}>
                  {message.type === 'care' && (
                    <div className="care-message-header">
                      <Heart className="icon" />
                      <span className="care-badge">每日关心</span>
                    </div>
                  )}
                  <p>{message.content}</p>
                </div>
                <span className="message-timestamp">
                  {message.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {message.sender === 'human' && (
                <div className="user-avatar-small">你</div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="chat-space">
            <textarea
              placeholder={`和 ${profile.name} 说点什么...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="message-input"
              rows={1}
            />
            <button 
              onClick={handleSendMessage}
              className="send-button"
            >
              <Send className="icon" />
            </button>
          </div>
      </div>
    </div>
  );
}