"use client";

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface DraggableIconProps {
  name: string;
  icon: React.ReactNode;
  color: string;
  onDoubleClick?: () => void;
  initialPosition?: { x: number; y: number };
}

export function DraggableIcon({ 
  name, 
  icon, 
  color, 
  onDoubleClick,
  initialPosition = { x: 0, y: 0 }
}: DraggableIconProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  // Motion values for smooth dragging
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);
  
  // Transform for hover effects
  const scale = useTransform(x, [0, 100], [1, 1.05]);
  const rotate = useTransform(x, [0, 100], [0, 2]);

  const handleDragStart = () => {
    setIsDragging(true);
    setIsSelected(false);
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    // Snap to grid or boundaries if needed
    const newX = Math.max(0, Math.min(window.innerWidth - 96, info.point.x));
    const newY = Math.max(32, Math.min(window.innerHeight - 200, info.point.y));
    
    x.set(newX);
    y.set(newY);
  };

  const handleClick = () => {
    setIsSelected(true);
    // Deselect after a short delay
    setTimeout(() => setIsSelected(false), 200);
  };

  const handleDoubleClick = () => {
    if (onDoubleClick) {
      onDoubleClick();
    }
  };

  return (
    <motion.div
      style={{ x, y, scale }}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      whileHover={{ 
        scale: 1.1,
        transition: { duration: 0.2 }
      }}
      whileTap={{ 
        scale: 0.95,
        transition: { duration: 0.1 }
      }}
      className="absolute cursor-pointer z-10"
    >
      <Card 
        className={`w-24 h-24 bg-white/90 backdrop-blur-sm border border-gray-300/50 shadow-lg transition-all duration-300 ${
          isSelected ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
        } ${isDragging ? 'shadow-2xl' : 'hover:shadow-xl'}`}
      >
        <CardContent className="p-2 flex flex-col items-center justify-center h-full">
          <motion.div
            animate={isDragging ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 0.3, repeat: isDragging ? Infinity : 0 }}
            className="mb-1"
          >
            {icon}
          </motion.div>
          <motion.p 
            className="text-xs text-center font-sans leading-tight text-gray-800"
            animate={isSelected ? { color: "#3B82F6" } : { color: "#374151" }}
            transition={{ duration: 0.2 }}
          >
            {name}
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
} 