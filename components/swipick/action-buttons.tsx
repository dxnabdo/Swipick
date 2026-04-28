'use client';

import { RotateCcw, X, Share2, Heart, Info } from 'lucide-react';

interface ActionButtonsProps {
  onUndo: () => void;
  onDislike: () => void;
  onShare: () => void;
  onLike: () => void;
  onDetails: () => void;
}

export default function ActionButtons({
  onUndo,
  onDislike,
  onShare,
  onLike,
  onDetails,
}: ActionButtonsProps) {
  return (
    <div 
      className="fixed bottom-[80px] left-0 right-0 flex justify-center gap-5 z-[100]"
      style={{ pointerEvents: 'auto' }}
    >
      {/* رجوع */}
      <button
        onClick={onUndo}
        className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <RotateCcw className="w-6 h-6 text-white" />
      </button>

      {/* رفض */}
      <button
        onClick={onDislike}
        className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <X className="w-7 h-7 text-white" />
      </button>

      {/* مشاركة */}
      <button
        onClick={onShare}
        className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <Share2 className="w-6 h-6 text-white" />
      </button>

      {/* إعجاب */}
      <button
        onClick={onLike}
        className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <Heart className="w-7 h-7 text-white" />
      </button>

      {/* تفاصيل */}
      <button
        onClick={onDetails}
        className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <Info className="w-6 h-6 text-white" />
      </button>
    </div>
  );
}