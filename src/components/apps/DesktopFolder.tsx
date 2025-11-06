import React, { useEffect, useState } from "react";
import EasterEggNote from "~/components/apps/EasterEggNote";

// This component mimics the macOS Finder window
// It shows a folder icon that can be opened recursively (the Easter egg!)

interface DesktopFolderProps {
  depth?: number; // How many folders deep are we? Starts at 0
}

const DesktopFolder = ({ depth = 0 }: DesktopFolderProps) => {
  // Level starts at 2 because the first inner folder is "desktop 2"
  const [level, setLevel] = useState<number>(Math.max(2, depth + 2));
  const MAX_LEVEL = 10; // reveal Easter egg at 10

  // Keep the document title in sync (window bar still shows "desktop")
  useEffect(() => {
    document.title = `desktop ${level - 1}`;
  }, [level]);
  return (
    <div className="w-full h-full flex flex-col bg-c-50">
      {/* Finder Toolbar (hidden for now) */}
      <div className="hidden" />

      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-c-100/50 border-r border-c-300 overflow-y-auto py-2">
          <div className="px-3 py-1 text-xs font-semibold text-c-500">Favorites</div>
          <div className="px-2 space-y-0.5">
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:broadcast text-blue-500 mr-2" />
              AirDrop
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:clock text-blue-500 mr-2" />
              Recents
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:application text-blue-500 mr-2" />
              Applications
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:file-document text-blue-500 mr-2" />
              Documents
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:download text-blue-500 mr-2" />
              Downloads
            </div>
          </div>

          <div className="px-3 py-1 mt-4 text-xs font-semibold text-c-500">iCloud</div>
          <div className="px-2 space-y-0.5">
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:cloud text-blue-500 mr-2" />
              iCloud D...
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:folder-account text-blue-500 mr-2" />
              Shared
            </div>
          </div>

          <div className="px-3 py-1 mt-4 text-xs font-semibold text-c-500">Tags</div>
          <div className="px-2 space-y-0.5">
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:circle text-gray-400 mr-2 text-xs" />
              Home
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:circle text-blue-500 mr-2 text-xs" />
              Blue
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:circle text-purple-500 mr-2 text-xs" />
              Purple
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:circle text-gray-400 mr-2 text-xs" />
              Work
            </div>
          </div>
        </div>

        {/* Content area - shows the desktop folder or Easter Egg */}
        <div className="flex-1 overflow-y-auto p-8">
          {level < MAX_LEVEL ? (
            <div className="flex flex-wrap gap-8">
              {/* The nested desktop folder */}
              <div
                className="flex flex-col items-center cursor-pointer group"
                onDoubleClick={() => setLevel((n) => Math.min(MAX_LEVEL, n + 1))}
              >
                <div className="w-24 h-24 group-hover:opacity-80 transition-opacity">
                  <img
                    src="img/icons/Folder.png"
                    alt="desktop folder"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="mt-1 text-sm text-c-800 text-center">{`desktop ${level}`}</div>
              </div>
            </div>
          ) : (
            <EasterEggNote />
          )}
        </div>
      </div>
    </div>
  );
};

export default DesktopFolder;
