import React from "react";

// Preview app - mimics macOS Quick Look / Preview.app
// Used to display images and videos from the Trash app

const Preview: React.FC = () => {
  const item = useStore((state) => state.previewItem);

  if (!item) {
    return (
      <div className="w-full h-full bg-c-50 flex items-center justify-center">
        <div className="text-center text-c-500">
          <div className="text-4xl mb-2">👁️</div>
          <p>No preview available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-c-50 flex flex-col">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-c-100/50 border-b border-c-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1.5 rounded hover:bg-c-200 text-c-600"
            title="Show in Finder"
          >
            <span className="i-mdi:compass text-lg" />
          </button>
          <button
            type="button"
            className="p-1.5 rounded hover:bg-c-200 text-c-600"
            title="Rotate"
          >
            <span className="i-mdi:rotate-right text-lg" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="px-3 py-1 text-xs rounded bg-c-200 hover:bg-c-300 text-c-700 font-medium"
          >
            Open with Preview
          </button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
        {item.type === "image" ? (
          <img
            src={item.path}
            alt={item.label}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <video src={item.path} controls autoPlay className="max-h-full max-w-full" />
        )}
      </div>
    </div>
  );
};

export default Preview;
