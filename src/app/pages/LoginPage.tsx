import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { login, register } from '../request/api';
import './AuthPages.css'; // 创建这个CSS文件

// 登录页面组件
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('请输入用户名和密码');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // 模拟API调用
    setTimeout(() => {
      // try {
      //   const res = await login({ username, password });
      //   if (res.token) {
      //     localStorage.setItem('token', res.token);
      //     navigate('/');
      //   } else {
      //     setError('登陆失败，请检查用户名和密码');
      //   }
      // } catch (err) {
      //   setError('登陆失败，请重试');
      // } finally {
      //   setIsLoading(false);
      // }
      setIsLoading(false);
      // 演示用 - 模拟成功登录
      localStorage.setItem('token', 'demo-token');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="brand-header">
          <h1>虚拟恋人</h1>
          <p className="brand-tagline">寻找你的专属AI陪伴</p>
        </div>
        <div className="illustration">
          <div className="heart-pulse"></div>
          <div className="chat-bubbles">
            <div className="bubble bubble-1">💕</div>
            <div className="bubble bubble-2">💬</div>
            <div className="bubble bubble-3">🤖</div>
          </div>
        </div>
        <p className="welcome-text">欢迎回来，开始你的温暖对话</p>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h2>用户登录</h2>
          <p>请输入您的账号信息</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="username"
                type="text"
                placeholder="请输入用户名"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>记住我</span>
            </label>
            <button 
              type="button" 
              className="text-button"
              onClick={() => navigate('/forgot-password')}
            >
              忘记密码？
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                登录中...
              </>
            ) : '立即登录'}
          </button>
          
          <div className="divider">
            <span>或</span>
          </div>
          
          <div className="auth-footer">
            <p>还没有账号？</p>
            <button 
              type="button" 
              className="switch-button"
              onClick={() => navigate('/register')}
            >
              立即注册
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 注册页面组件
const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    
    if (password.length < 6) {
      setError('密码至少需要6位字符');
      return;
    }
    
    if (password !== confirm) {
      setError('两次输入的密码不一致');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    // 模拟API调用
    setTimeout(() => {
      // try {
      //   const res = await register({ username, password });
      //   if (res.success) {
      //     setSuccess('注册成功，正在跳转到登录页面...');
      //     setTimeout(() => navigate('/login'), 1500);
      //   } else {
      //     setError(res.message || '注册失败');
      //   }
      // } catch (err) {
      //   setError('注册失败，请重试');
      // } finally {
      //   setIsLoading(false);
      // }
      setSuccess('注册成功！正在跳转到登录页面...');
      setIsLoading(false);
      setTimeout(() => navigate('/login'), 1500);
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-left-panel">
        <div className="brand-header">
          <h1>虚拟恋人</h1>
          <p className="brand-tagline">开启你的AI陪伴之旅</p>
        </div>
        <div className="illustration">
          <div className="stars">
            <div className="star star-1">✨</div>
            <div className="star star-2">✨</div>
            <div className="star star-3">✨</div>
          </div>
          <div className="connection-dots">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="dot"></div>
            ))}
          </div>
        </div>
        <p className="welcome-text">加入我们，体验温暖的AI对话</p>
      </div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h2>创建账号</h2>
          <p>填写信息加入虚拟恋人</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-username">用户名</label>
            <div className="input-with-icon">
              <span className="input-icon">👤</span>
              <input
                id="reg-username"
                type="text"
                placeholder="请输入用户名（4-20位字符）"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="form-input"
              />
            </div>
            <p className="input-hint">用户名可用于登录和展示</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="reg-password">密码</label>
            <div className="input-with-icon">
              <span className="input-icon">🔒</span>
              <input
                id="reg-password"
                type="password"
                placeholder="至少6位字符"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirm-password">确认密码</label>
            <div className="input-with-icon">
              <span className="input-icon">✅</span>
              <input
                id="confirm-password"
                type="password"
                placeholder="请再次输入密码"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="form-input"
              />
            </div>
          </div>
          
          <div className="terms-agreement">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>我已阅读并同意<span className="link">《用户协议》</span>和<span className="link">《隐私政策》</span></span>
            </label>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <button 
            type="submit" 
            className="submit-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                注册中...
              </>
            ) : '创建账号'}
          </button>
          
          <div className="divider">
            <span>已有账号？</span>
          </div>
          
          <div className="auth-footer">
            <button 
              type="button" 
              className="switch-button"
              onClick={() => navigate('/login')}
            >
              返回登录
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { LoginPage, RegisterPage };