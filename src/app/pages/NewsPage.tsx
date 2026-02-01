import { MessageCircle } from 'lucide-react';

export function NewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">新闻资讯</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <MessageCircle className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <p className="text-center text-gray-600">这里是新闻资讯面板</p>
        </div>
      </div>
    </div>
  );
}
