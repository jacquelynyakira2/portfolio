"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MenuBar } from "@/components/ui/menu-bar";
import { AquaDock } from "@/components/ui/aqua-dock";
import { DraggableIcon } from "@/components/ui/draggable-icon";
import { motion } from "framer-motion";

export default function Home() {
  return (
    // Main desktop container - Mac OS X Aqua style
    <div className="min-h-screen relative overflow-hidden">
      {/* Authentic Aqua background with flowing wave patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500">
        {/* Multiple wave layers for depth and authenticity */}
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Primary wave shapes */}
          <div className="absolute top-10 left-5 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl aqua-wave"></div>
          <div className="absolute top-32 right-10 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-3xl aqua-wave" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 left-1/3 w-[350px] h-[350px] bg-blue-300/30 rounded-full blur-3xl aqua-wave" style={{animationDelay: '2s'}}></div>
          
          {/* Secondary wave shapes for more complexity */}
          <div className="absolute top-60 left-1/4 w-[300px] h-[300px] bg-blue-200/25 rounded-full blur-2xl"></div>
          <div className="absolute bottom-40 right-1/4 w-[250px] h-[250px] bg-blue-100/35 rounded-full blur-2xl"></div>
          
          {/* Subtle texture overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%),
                             radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)`
          }}></div>
        </div>
      </div>

      {/* Aqua Menu Bar */}
      <MenuBar />

      {/* Draggable Desktop Icons - Right-aligned like real Mac */}
      <div className="relative z-10 w-full h-full">
        <DraggableIcon
          name="Portfolio"
          color="blue"
          initialPosition={{ x: 1200, y: 100 }}
          onDoubleClick={() => console.log('Portfolio opened!')}
          icon={
            <div className="w-12 h-10 bg-gradient-to-br from-blue-400 to-blue-600 border border-gray-300/50 flex items-center justify-center rounded-sm">
              <div className="w-8 h-6 bg-gradient-to-br from-blue-300 to-blue-500 border border-gray-300/50 rounded-sm"></div>
            </div>
          }
        />
        
        <DraggableIcon
          name="About Me"
          color="gray"
          initialPosition={{ x: 1200, y: 200 }}
          onDoubleClick={() => console.log('About Me opened!')}
          icon={
            <div className="w-10 h-12 bg-white border border-gray-300/50 relative rounded-sm">
              <div className="absolute top-1 left-1 w-6 h-1 bg-gray-600 rounded-sm"></div>
              <div className="absolute top-3 left-1 w-4 h-1 bg-gray-600 rounded-sm"></div>
              <div className="absolute top-5 left-1 w-5 h-1 bg-gray-600 rounded-sm"></div>
            </div>
          }
        />
        
        <DraggableIcon
          name="Projects"
          color="yellow"
          initialPosition={{ x: 1200, y: 300 }}
          onDoubleClick={() => console.log('Projects opened!')}
          icon={
            <div className="w-12 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 border border-gray-300/50 flex items-center justify-center rounded-sm">
              <div className="w-8 h-6 bg-gradient-to-br from-yellow-300 to-yellow-500 border border-gray-300/50 rounded-sm"></div>
            </div>
          }
        />
        
        <DraggableIcon
          name="Contact"
          color="green"
          initialPosition={{ x: 1200, y: 400 }}
          onDoubleClick={() => console.log('Contact opened!')}
          icon={
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 border border-gray-300/50 flex items-center justify-center rounded-sm">
              <div className="w-6 h-6 bg-gradient-to-br from-green-300 to-green-500 border border-gray-300/50 rounded-sm"></div>
            </div>
          }
        />
        
        <DraggableIcon
          name="Resume"
          color="gray"
          initialPosition={{ x: 1200, y: 500 }}
          onDoubleClick={() => console.log('Resume opened!')}
          icon={
            <div className="w-10 h-12 bg-white border border-gray-300/50 relative rounded-sm">
              <div className="absolute top-1 left-1 w-6 h-1 bg-gray-600 rounded-sm"></div>
              <div className="absolute top-3 left-1 w-4 h-1 bg-gray-600 rounded-sm"></div>
              <div className="absolute top-5 left-1 w-5 h-1 bg-gray-600 rounded-sm"></div>
              <div className="absolute top-7 left-1 w-3 h-1 bg-gray-600 rounded-sm"></div>
            </div>
          }
        />
        
        <DraggableIcon
          name="Trash"
          color="gray"
          initialPosition={{ x: 1200, y: 600 }}
          onDoubleClick={() => console.log('Trash opened!')}
          icon={
            <div className="w-8 h-10 bg-gradient-to-br from-gray-400 to-gray-600 border border-gray-300/50 relative rounded-sm">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-gradient-to-br from-gray-500 to-gray-700 border border-gray-300/50 rounded-sm"></div>
              <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-500 border border-gray-300/50 rounded-sm"></div>
            </div>
          }
        />
      </div>

      {/* Welcome Message - Aqua style dialog */}
      <motion.div 
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <Card className="w-80 bg-white/95 backdrop-blur-md border border-gray-300/50 shadow-2xl rounded-lg">
          <div className="bg-gradient-to-b from-gray-100/90 to-gray-200/90 border-b border-gray-300/50 p-3 flex items-center justify-between rounded-t-lg">
            <span className="font-sans text-sm font-medium text-gray-800">Welcome!</span>
            <Button variant="ghost" size="sm" className="w-6 h-6 p-0 hover:bg-gray-300/50 rounded-sm">
              ✕
            </Button>
          </div>
          <CardContent className="p-4">
            <p className="font-sans text-sm mb-4 text-gray-700">
              Welcome to my Mac OS X Aqua-style portfolio! Click on any icon to explore.
            </p>
            <div className="flex justify-end">
              <Button className="bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border border-gray-300/50 font-sans text-sm rounded-md shadow-sm">
                OK
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Aqua Dock */}
      <AquaDock />

      {/* Bottom corner icons - like the real Mac OS X */}
      <div className="fixed bottom-4 left-4 z-30">
        <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
          N
        </div>
      </div>
      
      <div className="fixed bottom-4 right-4 z-30">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">
          &gt;&lt;
        </div>
      </div>

      {/* Aqua-style cursor */}
      <div className="fixed w-6 h-6 pointer-events-none z-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath fill='black' d='M0 0 L16 8 L8 16 L6 14 L12 8 L0 0 Z'/%3E%3C/svg%3E")`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat'
      }}></div>
    </div>
  );
}
