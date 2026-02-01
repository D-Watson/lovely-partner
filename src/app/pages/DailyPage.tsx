import { Heart } from 'lucide-react';

export function DailyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">日常关怀</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4" />
          <p className="text-center text-gray-600">这里是日常关怀面板</p>
        </div>
      </div>
    </div>
  );
}
