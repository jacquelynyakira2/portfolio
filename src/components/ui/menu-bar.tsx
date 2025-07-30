"use client";

import { useState } from 'react';

interface MenuBarProps {
  className?: string;
}

export function MenuBar({ className = "" }: MenuBarProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menuItems = [
    { name: "Finder", hasDropdown: true },
    { name: "File", hasDropdown: true },
    { name: "Edit", hasDropdown: true },
    { name: "View", hasDropdown: true },
    { name: "Go", hasDropdown: true },
    { name: "Window", hasDropdown: true },
    { name: "Help", hasDropdown: true },
  ];

  const systemIcons = [
    { icon: "📶", label: "Wi-Fi" },
    { icon: "🔊", label: "Volume" },
    { icon: "🕐", label: "Time" },
  ];

  return (
    <div className={`relative z-50 ${className}`}>
      {/* Main Menu Bar - Aqua glass effect */}
      <div className="h-8 bg-gradient-to-b from-gray-100/90 to-gray-200/90 backdrop-blur-sm border-b border-gray-300/50 flex items-center justify-between px-2 font-sans text-sm text-gray-800 shadow-sm">
        
        {/* Left side - Apple logo and menu items */}
        <div className="flex items-center space-x-1">
          {/* Apple Logo */}
          <div className="w-6 h-6 flex items-center justify-center text-blue-600 font-bold text-lg leading-none">
            
          </div>
          
          {/* Menu Items */}
          {menuItems.map((item) => (
            <div key={item.name} className="relative">
              <button
                className={`px-2 py-1 rounded-sm transition-all duration-150 hover:bg-blue-500/20 hover:text-blue-800 ${
                  activeMenu === item.name ? 'bg-blue-500/30 text-blue-800' : ''
                }`}
                onMouseEnter={() => setActiveMenu(item.name)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {item.name}
              </button>
              
              {/* Dropdown Menu - Aqua style */}
              {activeMenu === item.name && item.hasDropdown && (
                <div className="absolute top-full left-0 mt-1 min-w-48 bg-white/95 backdrop-blur-md border border-gray-300/50 rounded-lg shadow-xl z-50">
                  <div className="py-1">
                    <div className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-500/20 hover:text-blue-800 cursor-pointer">
                      New {item.name === "Finder" ? "Finder Window" : "Document"}
                    </div>
                    <div className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-500/20 hover:text-blue-800 cursor-pointer">
                      Open...
                    </div>
                    {item.name === "File" && (
                      <>
                        <div className="border-t border-gray-200/50 my-1"></div>
                        <div className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-500/20 hover:text-blue-800 cursor-pointer">
                          Save
                        </div>
                        <div className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-500/20 hover:text-blue-800 cursor-pointer">
                          Print...
                        </div>
                      </>
                    )}
                    {item.name === "Edit" && (
                      <>
                        <div className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-500/20 hover:text-blue-800 cursor-pointer">
                          Undo
                        </div>
                        <div className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-500/20 hover:text-blue-800 cursor-pointer">
                          Cut
                        </div>
                        <div className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-500/20 hover:text-blue-800 cursor-pointer">
                          Copy
                        </div>
                        <div className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-500/20 hover:text-blue-800 cursor-pointer">
                          Paste
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right side - System icons */}
        <div className="flex items-center space-x-3">
          {systemIcons.map((icon) => (
            <div
              key={icon.label}
              className="w-6 h-6 flex items-center justify-center text-gray-700 hover:text-gray-900 cursor-pointer transition-colors"
              title={icon.label}
            >
              {icon.icon}
            </div>
          ))}
          
          {/* Time Display */}
          <div className="text-xs text-gray-700 font-medium">
            {new Date().toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit',
              hour12: true 
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 