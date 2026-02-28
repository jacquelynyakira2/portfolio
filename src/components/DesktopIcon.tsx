import React, { useState, useRef } from "react";

// This component creates a draggable desktop icon (like the classic macOS folder on desktop)
// Users can drag it around and double-click to open it

interface DesktopIconProps {
  id: string; // unique identifier for the icon
  title: string; // name displayed under the icon
  img: string; // path to the icon image
  onOpen: (id: string) => void; // function to call when icon is double-clicked
  initialX?: number; // starting X position (default: 50)
  initialY?: number; // starting Y position (default: 50)
}

const DesktopIcon = ({
  id,
  title,
  img,
  onOpen,
  initialX = 50,
  initialY = 50
}: DesktopIconProps) => {
  // State to track the icon's position
  const [position, setPosition] = useState({ x: initialX, y: initialY });

  // Track if we're currently dragging
  const [isDragging, setIsDragging] = useState(false);

  // Track if the user actually dragged (vs just clicked)
  const [hasDragged, setHasDragged] = useState(false);

  // Store the offset between mouse position and icon position when drag starts
  const dragOffset = useRef({ x: 0, y: 0 });

  // Handle mouse down - start dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Calculate offset between mouse position and icon's top-left corner
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
    setIsDragging(true);
    setHasDragged(false);
    e.preventDefault(); // Prevent text selection
  };

  // Handle mouse move - update position while dragging
  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    setHasDragged(true);
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y
    });
  }, []);

  // Handle mouse up - stop dragging
  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  // Set up and clean up mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle double-click to open the folder
  const handleDoubleClick = () => {
    // Only open if we didn't just drag
    if (!hasDragged) {
      onOpen(id);
    }
  };

  return (
    <div
      className="absolute flex flex-col items-center cursor-pointer select-none"
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      style={{
        width: "80px",
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab"
      }}
    >
      {/* The folder icon image */}
      <div className="w-16 h-16 mb-1 hover:opacity-80 transition-opacity">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </div>

      {/* The folder name with macOS-style selection */}
      <div className="text-xs text-white text-center font-medium px-2 py-0.5 rounded bg-transparent hover:bg-blue-500/30 transition-colors">
        {title}
      </div>
    </div>
  );
};

export default DesktopIcon;
