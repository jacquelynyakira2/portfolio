import React from "react";

// This component mimics the macOS Trash application
// It shows a "lost ideas" folder inside the trash

const Trash = () => {
  return (
    <div className="w-full h-full flex flex-col bg-c-50">
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-c-100/50 border-r border-c-300 overflow-y-auto py-2">
          <div className="px-3 py-1 text-xs font-semibold text-c-500">Locations</div>
          <div className="px-2 space-y-0.5">
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:delete text-red-500 mr-2" />
              Trash
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:delete-empty text-gray-400 mr-2" />
              Empty Trash
            </div>
          </div>

          <div className="px-3 py-1 mt-4 text-xs font-semibold text-c-500">
            Recently Deleted
          </div>
          <div className="px-2 space-y-0.5">
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:folder text-blue-500 mr-2" />
              Ideas
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:file-document text-gray-500 mr-2" />
              Projects
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:image text-green-500 mr-2" />
              Photos
            </div>
          </div>
        </div>

        {/* Content area - shows the lost ideas folder */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="flex flex-wrap gap-8">
            {/* The lost ideas folder */}
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => {
                // You could add functionality here to open the folder
                console.log("Opening lost ideas folder...");
              }}
            >
              <div className="w-24 h-24 group-hover:opacity-80 transition-opacity">
                <img
                  src="img/icons/folder.png"
                  alt="lost ideas folder"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-1 text-sm text-c-800 text-center">lost ideas</div>
            </div>

            {/* Optional: Add some other "deleted" items for realism */}
            <div className="flex flex-col items-center opacity-60">
              <div className="w-16 h-16">
                <span className="i-mdi:file-document text-4xl text-gray-400" />
              </div>
              <div className="mt-1 text-xs text-c-600 text-center">old_project.txt</div>
            </div>

            <div className="flex flex-col items-center opacity-60">
              <div className="w-16 h-16">
                <span className="i-mdi:image text-4xl text-green-400" />
              </div>
              <div className="mt-1 text-xs text-c-600 text-center">screenshot.png</div>
            </div>
          </div>

          {/* Empty trash message */}
          <div className="mt-12 text-center text-c-500">
            <p className="text-sm">
              Items in the Trash will be deleted permanently after 30 days.
            </p>
            <p className="text-xs mt-2">Double-click items to restore them.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trash;
