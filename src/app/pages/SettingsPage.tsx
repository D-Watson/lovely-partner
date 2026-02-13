import React from 'react';
import './settings.css';

const SettingsPage = () => {
  const user = {
    name: "元宝",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=元宝",
    email: "yuanbao@example.com"
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  type Action = '切换账号' | '修改密码' | '账号绑定' | '关于我们';

  const handleButtonClick = (action: Action) => { 
    alert(`您点击了: ${action}`);
  };

  return (
    <div className="settings-container">
      <div className="settings-wrapper">
        {/* 用户信息卡片 */}
        <div className="user-card">
          <div className="user-info">
            <div className="avatar-container">
              <img 
                src={user.avatar} 
                alt="用户头像" 
                className="user-avatar"
              />
              <div className="avatar-badge">
                <svg className="badge-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <div className="user-details">
              <h2 className="user-name">{user.name}</h2>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
        </div>

        {/* 页面标题 */}
        <div className="header-title">
          <svg className="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h1 className="page-title">账户设置</h1>
        </div>

        {/* 功能按钮列表 */}
        <div className="function-list">
          {/* 切换账号 */}
          <button 
            className="function-btn switch-account"
            onClick={() => handleButtonClick('切换账号')}
          >
            <div className="btn-content">
              <div className="icon-wrapper">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="text-wrapper">
                <h3 className="function-title">切换账号</h3>
                <p className="function-desc">切换到其他账户</p>
              </div>
            </div>
            <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 修改密码 */}
          <button 
            className="function-btn change-password"
            onClick={() => handleButtonClick('修改密码')}
          >
            <div className="btn-content">
              <div className="icon-wrapper">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="text-wrapper">
                <h3 className="function-title">修改密码</h3>
                <p className="function-desc">更新登录密码</p>
              </div>
            </div>
            <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 账号绑定 */}
          <button 
            className="function-btn account-bind"
            onClick={() => handleButtonClick('账号绑定')}
          >
            <div className="btn-content">
              <div className="icon-wrapper">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="text-wrapper">
                <h3 className="function-title">账号绑定</h3>
                <p className="function-desc">关联第三方账号</p>
              </div>
            </div>
            <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 关于我们 */}
          <button 
            className="function-btn about-us"
            onClick={() => handleButtonClick('关于我们')}
          >
            <div className="btn-content">
              <div className="icon-wrapper">
                <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-wrapper">
                <h3 className="function-title">关于我们</h3>
                <p className="function-desc">版本信息和帮助</p>
              </div>
            </div>
            <svg className="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>


          {/* 退出登录 */}
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            <svg className="logout-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            退出登录
          </button>
        </div>

        {/* 底部信息 */}
        <div className="footer-info">
          <p className="version">当前版本 2.1.0</p>
          <p className="copyright">© 2026 元宝助手</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;