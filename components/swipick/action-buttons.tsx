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
  const buttons = [
    { icon: RotateCcw, onClick: onUndo, size: 'w-12 h-12', bg: 'bg-gray-600', label: 'رجوع' },
    { icon: X, onClick: onDislike, size: 'w-14 h-14', bg: 'bg-red-500', label: 'رفض' },
    { icon: Share2, onClick: onShare, size: 'w-12 h-12', bg: 'bg-blue-500', label: 'مشاركة' },
    { icon: Heart, onClick: onLike, size: 'w-14 h-14', bg: 'bg-green-500', label: 'إعجاب' },
    { icon: Info, onClick: onDetails, size: 'w-12 h-12', bg: 'bg-gradient-to-r from-pink-500 to-purple-600', label: 'تفاصيل' },
  ];

  return (
    <div className="absolute bottom-[4%] left-0 right-0 flex justify-center gap-5 z-[100]">
      {buttons.map((btn, idx) => {
        const Icon = btn.icon;
        return (
          <button
            key={idx}
            onClick={btn.onClick}
            className={`${btn.size} ${btn.bg} rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95`}
          >
            <Icon className="w-6 h-6 text-white" />
          </button>
        );
      })}
    </div>
  );
}