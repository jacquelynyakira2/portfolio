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
