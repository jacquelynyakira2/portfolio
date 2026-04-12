import { useState, useEffect, useRef, useMemo } from "react";
import { createPortal } from "react-dom";
import { useStore } from "~/stores";
import { useAIMSounds } from "~/hooks";
import { presetAwayMessages } from "~/configs/aim";
import type { AIMBuddy, AIMBuddyGroup, AIMStatus } from "~/types";

/** Buddies omitted from the buddy list (still in config for data/AI if needed). */
const HIDDEN_BUDDY_IDS = new Set(["coolmom42", "daddio1965"]);

// ============================================================================
// LOGIN SCREEN
// ============================================================================

interface LoginScreenProps {
  onSignIn: (screenName: string) => void;
}

const LoginScreen = ({ onSignIn }: LoginScreenProps) => {
  const [screenName, setScreenName] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenName.trim()) {
      setError("Please enter a Screen Name");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate connection delay for nostalgia
    setTimeout(() => {
      setIsLoading(false);
      onSignIn(screenName.trim());
    }, 1500);
  };

  return (
    <div className="aim-login h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#f0f0f0] to-[#d9d9d9] p-6">
      {/* AIM Header Image */}
      <div className="mb-6 w-full max-w-64 px-2">
        <img
          src="/img/AIM/AIM_logo.svg"
          alt="AIM"
          className="mx-auto w-full h-auto select-none"
          draggable={false}
        />
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-64 space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Screen Name
          </label>
          <input
            type="text"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner"
            placeholder="YourScreenName"
            disabled={isLoading}
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner"
            placeholder="••••••••"
            disabled={isLoading}
          />
        </div>

        {error && <div className="text-xs text-red-500 text-center">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 rounded-md text-sm text-white font-medium shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: isLoading
              ? "#a0a0a0"
              : "linear-gradient(to bottom, #4BA3F5 0%, #1A6ED8 100%)",
            boxShadow: isLoading
              ? "none"
              : "0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
          }}
        >
          {isLoading ? (
            <>
              <span className="i-svg-spinners:ring-resize text-lg" />
              <span>Signing On...</span>
            </>
          ) : (
            "Sign On"
          )}
        </button>
      </form>

      {isLoading && (
        <div className="mt-4 text-xs text-blue-600 animate-pulse">
          Connecting to AOL...
        </div>
      )}

      <div className="mt-6 text-[10px] text-gray-500">
        Enter that old AOL username & any password to sign in
      </div>
    </div>
  );
};

// ============================================================================
// STATUS INDICATOR
// ============================================================================

const StatusDot = ({ status }: { status: AIMStatus }) => {
  const colors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-400"
  };

  return <span className={`inline-block w-2 h-2 rounded-full ${colors[status]}`} />;
};

// ============================================================================
// BUDDY LIST ITEM
// ============================================================================

interface BuddyItemProps {
  buddy: AIMBuddy;
  onDoubleClick: () => void;
}

const BuddyItem = ({ buddy, onDoubleClick }: BuddyItemProps) => {
  const [showAwayTooltip, setShowAwayTooltip] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tooltipCoords, setTooltipCoords] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (!showAwayTooltip || !itemRef.current || !buddy.awayMessage) {
      setTooltipCoords(null);
      return;
    }
    const rect = itemRef.current.getBoundingClientRect();
    const padding = 8;
    const tooltipWidth = 200;
    let left = rect.right + padding;
    if (left + tooltipWidth > window.innerWidth - 16) {
      left = rect.left - tooltipWidth - padding;
    }
    if (left < 16) left = 16;
    setTooltipCoords({ top: rect.top, left });
  }, [showAwayTooltip, buddy.awayMessage]);

  const handleItemLeave = () => {
    hideTimeoutRef.current = setTimeout(() => setShowAwayTooltip(false), 150);
  };

  const handleTooltipEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  };

  const handleTooltipLeave = () => {
    setShowAwayTooltip(false);
  };

  return (
    <>
      <div
        ref={itemRef}
        className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-blue-100 rounded select-none"
        onDoubleClick={onDoubleClick}
        onMouseEnter={() =>
          buddy.status === "away" && buddy.awayMessage && setShowAwayTooltip(true)
        }
        onMouseLeave={handleItemLeave}
      >
        <StatusDot status={buddy.status} />
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="text-sm text-gray-900 truncate">{buddy.screenName}</div>
          {buddy.status === "away" && buddy.awayMessage && (
            <div className="text-[10px] text-yellow-700 italic truncate">
              ~{buddy.awayMessage.slice(0, 25)}
              {buddy.awayMessage.length > 25 ? "..." : ""}~
            </div>
          )}
        </div>
      </div>

      {/* Away message tooltip - portal to body, fixed position, outside UI flow */}
      {showAwayTooltip &&
        buddy.awayMessage &&
        tooltipCoords &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[9999] p-2 bg-yellow-50 border border-yellow-300 rounded shadow-lg max-w-52"
            style={{
              top: tooltipCoords.top,
              left: tooltipCoords.left,
              minWidth: "160px"
            }}
            onMouseEnter={handleTooltipEnter}
            onMouseLeave={handleTooltipLeave}
          >
            <div className="text-[9px] font-semibold text-yellow-700 uppercase mb-1">
              Away Message
            </div>
            <div className="text-xs text-gray-700 italic break-words">
              "{buddy.awayMessage}"
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

// ============================================================================
// BUDDY GROUP
// ============================================================================

interface BuddyGroupProps {
  group: AIMBuddyGroup;
  onToggleCollapse: () => void;
  onOpenChat: (buddyId: string, buddyScreenName: string) => void;
}

const BuddyGroup = ({ group, onToggleCollapse, onOpenChat }: BuddyGroupProps) => {
  const onlineCount = group.buddies.filter((b) => b.status !== "offline").length;

  return (
    <div className="mb-1">
      <button
        onClick={onToggleCollapse}
        className="w-full flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 rounded select-none"
      >
        <span
          className={`i-mdi:chevron-right text-sm text-gray-500 transition-transform ${
            !group.collapsed ? "rotate-90" : ""
          }`}
        />
        <span>{group.name}</span>
        <span className="text-gray-400">
          ({onlineCount}/{group.buddies.length})
        </span>
      </button>

      {!group.collapsed && (
        <div className="ml-2">
          {group.buddies.map((buddy) => (
            <BuddyItem
              key={buddy.id}
              buddy={buddy}
              onDoubleClick={() => onOpenChat(buddy.id, buddy.screenName)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// AWAY MESSAGE PICKER
// ============================================================================

interface AwayPickerProps {
  currentMessage: string | null;
  onSelect: (message: string) => void;
  onClose: () => void;
}

const AwayPicker = ({ currentMessage, onSelect, onClose }: AwayPickerProps) => {
  const [customMessage, setCustomMessage] = useState("");

  return (
    <div
      className="absolute inset-0 z-20 flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #f6f6f6 0%, #e8e8e8 100%)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-gray-300"
        style={{ background: "linear-gradient(to bottom, #e8e8e8 0%, #d8d8d8 100%)" }}
      >
        <span className="text-sm font-semibold text-gray-700">Away Message</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-300 rounded text-gray-500 hover:text-gray-700"
        >
          <span className="i-mdi:close text-sm" />
        </button>
      </div>

      {/* Preset Messages */}
      <div className="flex-1 overflow-y-auto p-2">
        {presetAwayMessages.map((msg) => (
          <button
            key={msg.id}
            onClick={() => onSelect(msg.text)}
            className={`w-full text-left px-3 py-2 text-sm rounded mb-1 transition-colors ${
              currentMessage === msg.text
                ? "bg-blue-100 text-blue-800"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            {msg.text}
          </button>
        ))}
      </div>

      {/* Custom Message Input */}
      <div
        className="p-2 border-t border-gray-300"
        style={{ background: "linear-gradient(to bottom, #e8e8e8 0%, #d8d8d8 100%)" }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Custom message..."
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded bg-white"
          />
          <button
            onClick={() => customMessage && onSelect(customMessage)}
            disabled={!customMessage}
            className="px-3 py-1 text-sm text-white rounded disabled:opacity-50"
            style={{
              background: customMessage
                ? "linear-gradient(to bottom, #4BA3F5 0%, #1A6ED8 100%)"
                : "#a0a0a0"
            }}
          >
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// AWAY MESSAGE DISPLAY (with classic AIM styling)
// ============================================================================

const AwayMessageDisplay = ({ message }: { message: string }) => {
  // Parse classic AIM-style formatting
  // ~*~text~*~ or -*-text-*- = sparkle emphasis
  // *text* = bold
  // _text_ = italic
  // <3 = heart
  // :) :( ;) = emoticons

  const renderFormattedMessage = (text: string) => {
    // Replace special patterns
    const formatted = text
      // Hearts
      .replace(/<3/g, "❤️")
      .replace(/<\/3/g, "💔")
      // Stars and sparkles
      .replace(/\*\.\*/g, "✨")
      .replace(/~\*~/g, "✨")
      .replace(/-\*-/g, "⭐");

    // Split by formatting patterns and render
    const parts: React.ReactNode[] = [];
    const remaining = formatted;
    let key = 0;

    // Handle ~*~text~*~ sparkle emphasis
    const sparkleRegex = /~\*~(.+?)~\*~/g;
    let match;
    let lastIndex = 0;

    while ((match = sparkleRegex.exec(formatted)) !== null) {
      if (match.index > lastIndex) {
        parts.push(formatted.slice(lastIndex, match.index));
      }
      parts.push(
        <span key={key++} className="text-pink-500 font-medium">
          ✨ {match[1]} ✨
        </span>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < formatted.length) {
      parts.push(formatted.slice(lastIndex));
    }

    if (parts.length === 0) {
      return <span>{formatted}</span>;
    }

    return <>{parts}</>;
  };

  return <div className="font-medium italic">"{renderFormattedMessage(message)}"</div>;
};

// ============================================================================
// BUDDY LIST (MAIN VIEW)
// ============================================================================

interface BuddyListProps {
  screenName: string;
  status: AIMStatus;
  awayMessage: string | null;
  buddyGroups: AIMBuddyGroup[];
  soundEnabled: boolean;
  onSignOut: () => void;
  onSetStatus: (status: AIMStatus, awayMessage?: string | null) => void;
  onToggleGroupCollapsed: (groupId: string) => void;
  onOpenChat: (buddyId: string, buddyScreenName: string) => void;
  onToggleSounds: () => void;
}

const BuddyList = ({
  screenName,
  status,
  awayMessage,
  buddyGroups,
  soundEnabled,
  onSignOut,
  onSetStatus,
  onToggleGroupCollapsed,
  onOpenChat,
  onToggleSounds
}: BuddyListProps) => {
  const [showAwayPicker, setShowAwayPicker] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  return (
    <div
      className="aim-buddy-list h-full flex flex-col overflow-hidden relative"
      style={{ background: "linear-gradient(to bottom, #f0f0f0 0%, #d8d8d8 100%)" }}
    >
      {/* Header with Screen Name */}
      <div
        className="px-3 py-2 border-b border-gray-400/50"
        style={{ background: "linear-gradient(to bottom, #4a90d9 0%, #357abd 100%)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/img/AIM/AIM_logo.svg" alt="AIM" className="w-5 h-5" />
            <span className="font-semibold text-sm text-white truncate">
              {screenName}
            </span>
          </div>
          <button
            onClick={onSignOut}
            className="text-white/80 hover:text-white text-xs"
            title="Sign Out"
          >
            Sign Off
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="relative px-2 py-1 border-b border-gray-300 bg-white">
        <button
          onClick={() => setShowStatusMenu(!showStatusMenu)}
          className="w-full flex items-center justify-between px-2 py-1 text-xs hover:bg-gray-100 rounded"
        >
          <div className="flex items-center gap-2">
            <StatusDot status={status} />
            <span className="text-gray-700">
              {status === "online" && "Available"}
              {status === "away" && "Away"}
              {status === "offline" && "Invisible"}
            </span>
          </div>
          <span className="i-mdi:chevron-down text-gray-400 text-sm" />
        </button>

        {/* Status Dropdown */}
        {showStatusMenu && (
          <div className="absolute left-2 right-2 top-full mt-1 bg-white rounded shadow-lg border border-gray-300 z-30 overflow-hidden">
            <button
              onClick={() => {
                onSetStatus("online");
                setShowStatusMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-100 text-gray-700"
            >
              <span className="w-2 h-2 rounded-full bg-green-500" />
              Available
            </button>
            <button
              onClick={() => {
                setShowStatusMenu(false);
                setShowAwayPicker(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-100 text-gray-700"
            >
              <span className="w-2 h-2 rounded-full bg-yellow-500" />
              Away...
            </button>
            <button
              onClick={() => {
                onSetStatus("offline");
                setShowStatusMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-blue-100 text-gray-700"
            >
              <span className="w-2 h-2 rounded-full bg-gray-400" />
              Invisible
            </button>
          </div>
        )}
      </div>

      {/* Away Message Display - Prominent when active */}
      {status === "away" && awayMessage && (
        <div
          className="mx-2 mt-2 p-3 border border-yellow-400 rounded"
          style={{
            background: "linear-gradient(to bottom, #fffde7 0%, #fff9c4 100%)"
          }}
        >
          <div className="text-[10px] font-semibold text-yellow-700 uppercase tracking-wide mb-1">
            Your Away Message
          </div>
          <div className="aim-away-message text-sm text-gray-800 break-words">
            <AwayMessageDisplay message={awayMessage} />
          </div>
          <button
            onClick={() => setShowAwayPicker(true)}
            className="mt-2 text-[10px] text-blue-600 hover:text-blue-800 hover:underline"
          >
            Change away message...
          </button>
        </div>
      )}

      {/* Buddy Groups */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 bg-white">
        {buddyGroups.map((group) => (
          <BuddyGroup
            key={group.id}
            group={group}
            onToggleCollapse={() => onToggleGroupCollapsed(group.id)}
            onOpenChat={onOpenChat}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        className="px-2 py-2 border-t border-gray-400/50 flex items-center justify-between"
        style={{ background: "linear-gradient(to bottom, #e8e8e8 0%, #d0d0d0 100%)" }}
      >
        <span className="text-[10px] text-gray-500">Double-click a buddy to IM</span>
        <button
          onClick={onToggleSounds}
          className="flex items-center gap-1 px-2 py-1 text-[10px] text-gray-600 hover:bg-gray-300/50 rounded"
          title={soundEnabled ? "Mute sounds" : "Enable sounds"}
        >
          <span className={soundEnabled ? "i-mdi:volume-high" : "i-mdi:volume-off"} />
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
      </div>

      {/* Away Picker Modal */}
      {showAwayPicker && (
        <AwayPicker
          currentMessage={awayMessage}
          onSelect={(msg) => {
            onSetStatus("away", msg);
            setShowAwayPicker(false);
          }}
          onClose={() => setShowAwayPicker(false)}
        />
      )}
    </div>
  );
};

// ============================================================================
// MAIN AIM COMPONENT
// ============================================================================

const AIM = () => {
  const {
    aimIsSignedIn,
    aimScreenName,
    aimStatus,
    aimAwayMessage,
    aimBuddyGroups,
    aimPreferences,
    aimSignIn,
    aimSignOut,
    aimSetStatus,
    aimToggleGroupCollapsed,
    aimOpenChat,
    aimToggleSounds,
    aimHydrateFromStorage,
    aimUpdateBuddyStatus
  } = useStore();

  const { playSignOn, playSignOff, playDoorOpen } = useAIMSounds();

  // Hydrate from localStorage on mount
  useEffect(() => {
    aimHydrateFromStorage();
  }, []);

  // Rotate buddy away messages and occasionally flip statuses for realism
  useEffect(() => {
    if (!aimIsSignedIn) return;

    const interval = setInterval(() => {
      const allBuddies = aimBuddyGroups
        .flatMap((g) => g.buddies)
        .filter((b) => !HIDDEN_BUDDY_IDS.has(b.id));
      const roll = Math.random();

      if (roll < 0.65) {
        // Rotate a random away buddy's message
        const awayBuddies = allBuddies.filter(
          (b) => b.status === "away" && b.awayMessages && b.awayMessages.length > 1
        );
        if (awayBuddies.length > 0) {
          const buddy = awayBuddies[Math.floor(Math.random() * awayBuddies.length)];
          const pool = buddy.awayMessages!;
          const next = pool[Math.floor(Math.random() * pool.length)];
          aimUpdateBuddyStatus(buddy.id, "away", next);
        }
      } else if (roll < 0.82) {
        // Flip a random online buddy to away (skip jacquelynyakira)
        const onlineBuddies = allBuddies.filter(
          (b) =>
            b.status === "online" && b.id !== "jacquelynyakira" && b.awayMessages?.length
        );
        if (onlineBuddies.length > 0) {
          const buddy = onlineBuddies[Math.floor(Math.random() * onlineBuddies.length)];
          const pool = buddy.awayMessages!;
          const msg = pool[Math.floor(Math.random() * pool.length)];
          aimUpdateBuddyStatus(buddy.id, "away", msg);
        }
      } else {
        // Bring a random away buddy back online (skip jacquelynyakira)
        const awayBuddies = allBuddies.filter(
          (b) => b.status === "away" && b.id !== "jacquelynyakira"
        );
        if (awayBuddies.length > 0) {
          const buddy = awayBuddies[Math.floor(Math.random() * awayBuddies.length)];
          aimUpdateBuddyStatus(buddy.id, "online");
        }
      }
    }, 55_000); // every ~55s

    return () => clearInterval(interval);
  }, [aimIsSignedIn, aimBuddyGroups, aimUpdateBuddyStatus]);

  // Handle sign in with sound
  const handleSignIn = (screenName: string) => {
    aimSignIn(screenName);
    playSignOn();
  };

  // Handle sign out with sound
  const handleSignOut = () => {
    playSignOff();
    aimSignOut();
  };

  const visibleBuddyGroups = useMemo(
    () =>
      aimBuddyGroups.map((group) => ({
        ...group,
        buddies: group.buddies.filter((b) => !HIDDEN_BUDDY_IDS.has(b.id))
      })),
    [aimBuddyGroups]
  );

  // Handle opening chat with door sound
  const handleOpenChat = (buddyId: string, buddyScreenName: string) => {
    playDoorOpen();
    aimOpenChat(buddyId, buddyScreenName);
  };

  if (!aimIsSignedIn) {
    return <LoginScreen onSignIn={handleSignIn} />;
  }

  return (
    <BuddyList
      screenName={aimScreenName}
      status={aimStatus}
      awayMessage={aimAwayMessage}
      buddyGroups={visibleBuddyGroups}
      soundEnabled={aimPreferences.soundEnabled}
      onSignOut={handleSignOut}
      onSetStatus={aimSetStatus}
      onToggleGroupCollapsed={aimToggleGroupCollapsed}
      onOpenChat={handleOpenChat}
      onToggleSounds={aimToggleSounds}
    />
  );
};

export default AIM;
