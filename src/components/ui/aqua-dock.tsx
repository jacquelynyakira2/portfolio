"use client";

import { useState } from 'react';

interface DockIcon {
  name: string;
  icon: string;
  color: string;
}

export function AquaDock() {
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);

  const dockIcons: DockIcon[] = [
    { name: "Finder", icon: "🔍", color: "from-blue-400 to-blue-600" },
    { name: "Safari", icon: "🧭", color: "from-blue-500 to-blue-700" },
    { name: "Mail", icon: "📮", color: "from-blue-400 to-blue-600" },
    { name: "iChat", icon: "💬", color: "from-green-400 to-green-600" },
    { name: "iTunes", icon: "🎵", color: "from-purple-400 to-purple-600" },
    { name: "iPhoto", icon: "📷", color: "from-green-400 to-green-600" },
    { name: "iMovie", icon: "🎬", color: "from-purple-400 to-purple-600" },
    { name: "iCal", icon: "📅", color: "from-orange-400 to-orange-600" },
    { name: "QuickTime", icon: "▶️", color: "from-blue-400 to-blue-600" },
    { name: "System Preferences", icon: "⚙️", color: "from-gray-400 to-gray-600" },
    { name: "Address Book", icon: "📖", color: "from-blue-400 to-blue-600" },
    { name: "Trash", icon: "🗑️", color: "from-gray-400 to-gray-600" },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
      {/* Dock Background - Curved reflective surface */}
      <div className="bg-gradient-to-t from-gray-800/80 via-gray-700/60 to-gray-600/40 backdrop-blur-md rounded-2xl px-3 py-2 shadow-2xl border border-gray-300/30">
        <div className="flex items-end space-x-1">
          {dockIcons.map((icon) => (
            <div
              key={icon.name}
              className="relative group"
              onMouseEnter={() => setHoveredIcon(icon.name)}
              onMouseLeave={() => setHoveredIcon(null)}
            >
              {/* Icon Container with reflection effect */}
              <div 
                className={`w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl transition-all duration-300 cursor-pointer ${
                  hoveredIcon === icon.name 
                    ? 'scale-125 shadow-lg' 
                    : 'scale-100'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${icon.color.split(' ')[1]}, ${icon.color.split(' ')[3]})`,
                  boxShadow: hoveredIcon === icon.name 
                    ? '0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.3)' 
                    : '0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)'
                }}
              >
                {/* Reflection overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-lg"></div>
                <span className="relative z-10">{icon.icon}</span>
              </div>
              
              {/* Icon label */}
              {hoveredIcon === icon.name && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800/90 text-white text-xs rounded whitespace-nowrap">
                  {icon.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 