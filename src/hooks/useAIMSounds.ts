import { useCallback, useRef, useEffect } from "react";
import { useStore } from "~/stores";

// Sound file paths - add your AIM sound files to public/audio/aim/
const SOUNDS = {
  doorOpen: "/audio/aim/dooropen.mp3", // Opening a chat window
  doorClose: "/audio/aim/doorclose.mp3", // Closing a chat window
  messageReceive: "/audio/aim/IM.mp3", // Incoming message
  messageSend: "/audio/aim/IM.mp3", // Outgoing message (same sound)
  signOn: "/audio/aim/signon.mp3", // You sign on
  signOff: "/audio/aim/signoff.mp3" // You sign off
};

type SoundType = keyof typeof SOUNDS;

export const useAIMSounds = () => {
  const audioRefs = useRef<{ [key in SoundType]?: HTMLAudioElement }>({});
  const { aimPreferences } = useStore();

  // Preload all sounds on mount
  useEffect(() => {
    Object.entries(SOUNDS).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.volume = 0.5;
      audioRefs.current[key as SoundType] = audio;
    });

    return () => {
      // Cleanup
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  const playSound = useCallback(
    (sound: SoundType) => {
      if (!aimPreferences.soundEnabled) return;

      const audio = audioRefs.current[sound];
      if (audio) {
        // Reset to start if already playing
        audio.currentTime = 0;
        audio.play().catch((err) => {
          // Ignore autoplay errors (browser policy)
          console.debug("AIM sound play blocked:", err);
        });
      }
    },
    [aimPreferences.soundEnabled]
  );

  return {
    playDoorOpen: () => playSound("doorOpen"),
    playDoorClose: () => playSound("doorClose"),
    playMessageReceive: () => playSound("messageReceive"),
    playMessageSend: () => playSound("messageSend"),
    playSignOn: () => playSound("signOn"),
    playSignOff: () => playSound("signOff"),
    playSound
  };
};

export default useAIMSounds;
