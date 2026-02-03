import { useState, useEffect, useRef, useCallback } from "react";
import { useStore } from "~/stores";
import { useAIMSounds } from "~/hooks";
import type { AIMBuddy, AIMChat } from "~/types";

// Common emoji shortcuts for the picker
const EMOJI_SHORTCUTS = [
  { emoji: "😊", label: "smile" },
  { emoji: "😂", label: "laugh" },
  { emoji: "😍", label: "love" },
  { emoji: "😎", label: "cool" },
  { emoji: "😢", label: "sad" },
  { emoji: "😡", label: "angry" },
  { emoji: "🤔", label: "think" },
  { emoji: "👍", label: "thumbs up" },
  { emoji: "❤️", label: "heart" },
  { emoji: "🔥", label: "fire" },
  { emoji: "✨", label: "sparkles" },
  { emoji: "🎉", label: "party" },
  { emoji: "💀", label: "skull" },
  { emoji: "🙄", label: "eye roll" },
  { emoji: "😘", label: "kiss" },
  { emoji: "🤣", label: "rofl" }
];

interface AIMChatProps {
  buddyId: string;
  onClose: () => void;
}

const AIMChatWindow = ({ buddyId, onClose }: AIMChatProps) => {
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const prevMessageCount = useRef(0);

  const {
    aimScreenName,
    aimBuddyGroups,
    aimOpenChats,
    aimSendMessage,
    aimReceiveMessage,
    aimSetBuddyTyping
  } = useStore();

  const { playMessageSend, playMessageReceive, playDoorClose } = useAIMSounds();

  // Find the buddy and chat
  const buddy = aimBuddyGroups.flatMap((g) => g.buddies).find((b) => b.id === buddyId);

  const chat = aimOpenChats.find((c) => c.buddyId === buddyId);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  // Track selection for formatting
  const handleSelect = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  // Apply formatting to selected text or wrap cursor position
  const applyFormatting = (prefix: string, suffix: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = inputText;
    const selectedText = text.slice(start, end);

    const newText =
      text.slice(0, start) + prefix + selectedText + suffix + text.slice(end);
    setInputText(newText);

    // Restore focus and cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = start + prefix.length + selectedText.length + suffix.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  const insertEmoji = (emoji: string) => {
    if (!textareaRef.current) return;

    const start = textareaRef.current.selectionStart;
    const text = inputText;
    const newText = text.slice(0, start) + emoji + text.slice(start);
    setInputText(newText);
    setShowEmojiPicker(false);

    // Restore focus
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newPos = start + emoji.length;
        textareaRef.current.setSelectionRange(newPos, newPos);
      }
    }, 0);
  };

  // Play sound when receiving a new message
  useEffect(() => {
    if (chat && chat.messages.length > prevMessageCount.current) {
      const lastMessage = chat.messages[chat.messages.length - 1];
      // Only play receive sound if it's from the buddy (not from us)
      if (lastMessage && lastMessage.senderId !== "me") {
        playMessageReceive();
      }
      prevMessageCount.current = chat.messages.length;
    }
  }, [chat?.messages.length, playMessageReceive]);

  // Handle close with door sound
  const handleClose = () => {
    playDoorClose();
    onClose();
  };

  // Auto-response system
  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() || !buddy) return;

    const text = inputText.trim();
    setInputText("");
    playMessageSend();
    aimSendMessage(buddyId, text);

    // Trigger auto-response if buddy is online/away
    if (buddy.status !== "offline" && buddy.autoResponses.length > 0) {
      // Show typing indicator
      setTimeout(() => {
        aimSetBuddyTyping(buddyId, true);
      }, 500);

      // Send auto-response
      const delay = 1500 + Math.random() * 2500;
      setTimeout(() => {
        const response =
          buddy.autoResponses[Math.floor(Math.random() * buddy.autoResponses.length)];
        aimReceiveMessage(buddyId, response);
      }, delay);
    }
  }, [
    inputText,
    buddy,
    buddyId,
    aimSendMessage,
    aimReceiveMessage,
    aimSetBuddyTyping,
    playMessageSend
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  // Render message text with basic formatting
  const renderMessageText = (text: string) => {
    // Simple markdown-like rendering
    // **bold** -> bold
    // *italic* or _italic_ -> italic
    // __underline__ -> underline
    const rendered = text;

    // This is simplified - in a real app you'd use a proper parser
    return <span>{rendered}</span>;
  };

  if (!buddy || !chat) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <span className="text-gray-500">Chat not found</span>
      </div>
    );
  }

  return (
    <div
      className="aim-chat h-full flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #e8e8e8 0%, #d4d4d4 100%)" }}
    >
      {/* Classic AIM Menu Bar */}
      <div
        className="flex items-center gap-4 px-2 py-1 text-[11px] border-b border-gray-400/50"
        style={{ background: "linear-gradient(to bottom, #f0f0f0 0%, #d8d8d8 100%)" }}
      >
        <span className="text-gray-600 hover:text-gray-900 cursor-default">File</span>
        <span className="text-gray-600 hover:text-gray-900 cursor-default">Edit</span>
        <span className="text-gray-600 hover:text-gray-900 cursor-default">Insert</span>
        <span className="text-gray-600 hover:text-gray-900 cursor-default">People</span>
        <div className="flex-1" />
        <span className="text-[10px] text-gray-400">
          {buddy.screenName}'s Warning Level: 0%
        </span>
      </div>

      {/* Buddy Away Message (if away) */}
      {buddy.status === "away" && buddy.awayMessage && (
        <div
          className="mx-2 mt-2 px-2 py-1.5 text-xs border border-yellow-400 rounded"
          style={{ background: "linear-gradient(to bottom, #fffde7 0%, #fff9c4 100%)" }}
        >
          <span className="font-semibold text-yellow-700">
            {buddy.screenName} is away:
          </span>
          <span className="italic text-gray-700 ml-1">"{buddy.awayMessage}"</span>
        </div>
      )}

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto overflow-x-hidden p-2 bg-white border border-gray-400 mx-2 mt-2"
        style={{ minHeight: 0 }}
      >
        {chat.messages.length === 0 && (
          <div className="text-center text-gray-400 text-xs py-4">
            Start a conversation with {buddy.screenName}
          </div>
        )}

        {chat.messages.map((msg) => {
          const isMe = msg.senderId === "me";
          const senderName = isMe ? aimScreenName : buddy.screenName;

          return (
            <div key={msg.id} className="mb-1 text-sm">
              <span className="font-bold" style={{ color: isMe ? "#0000FF" : "#FF0000" }}>
                {senderName}
              </span>
              <span className="text-gray-400 text-[10px] ml-1">
                ({formatTime(msg.timestamp)})
              </span>
              <span className="text-gray-900">: {renderMessageText(msg.text)}</span>
            </div>
          );
        })}

        {chat.isTyping && (
          <div className="text-xs text-gray-500 italic">
            {buddy.screenName} is typing...
          </div>
        )}
      </div>

      {/* Formatting Toolbar */}
      <div
        className="flex items-center gap-0.5 px-2 py-1 mx-2 mt-1 border border-gray-400"
        style={{ background: "linear-gradient(to bottom, #f0f0f0 0%, #e0e0e0 100%)" }}
      >
        <ToolbarButton
          icon="i-mdi:format-bold"
          title="Bold (**text**)"
          onClick={() => applyFormatting("**", "**")}
        />
        <ToolbarButton
          icon="i-mdi:format-italic"
          title="Italic (*text*)"
          onClick={() => applyFormatting("*", "*")}
        />
        <ToolbarButton
          icon="i-mdi:format-underline"
          title="Underline (__text__)"
          onClick={() => applyFormatting("__", "__")}
        />
        <div className="w-px h-4 bg-gray-400 mx-1" />
        <ToolbarButton
          icon="i-mdi:link-variant"
          title="Insert Link"
          onClick={() => applyFormatting("[", "](url)")}
        />
        <div className="flex-1" />
        <div className="relative">
          <ToolbarButton
            icon="i-mdi:emoticon-happy-outline"
            title="Insert Emoji"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            active={showEmojiPicker}
          />
          {/* Emoji Picker Dropdown */}
          {showEmojiPicker && (
            <div
              className="absolute bottom-full right-0 mb-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-50"
              style={{ width: "180px" }}
            >
              <div className="grid grid-cols-4 gap-1">
                {EMOJI_SHORTCUTS.map((item) => (
                  <button
                    key={item.emoji}
                    onClick={() => insertEmoji(item.emoji)}
                    className="p-1.5 text-lg hover:bg-gray-100 rounded"
                    title={item.label}
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="px-2 py-1">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onSelect={handleSelect}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type your message..."
          className="w-full h-16 px-2 py-1 text-sm border border-gray-400 bg-white text-gray-900 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </form>

      {/* Action Buttons */}
      <div
        className="flex items-center justify-between px-2 py-2 border-t border-gray-400/50"
        style={{ background: "linear-gradient(to bottom, #e0e0e0 0%, #c8c8c8 100%)" }}
      >
        <div className="flex gap-1">
          <ActionButton icon="i-mdi:alert-outline" label="Warn" />
          <ActionButton icon="i-mdi:cancel" label="Block" />
        </div>
        <div className="flex gap-1">
          <ActionButton icon="i-mdi:account-outline" label="Info" />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className="px-4 py-1.5 rounded text-xs text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            style={{
              background: inputText.trim()
                ? "linear-gradient(to bottom, #4BA3F5 0%, #1A6ED8 100%)"
                : "#a0a0a0",
              boxShadow: inputText.trim()
                ? "0 1px 2px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
                : "none"
            }}
          >
            <span className="i-mdi:send text-sm" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

// Toolbar Button Component
const ToolbarButton = ({
  icon,
  title,
  onClick,
  active = false
}: {
  icon: string;
  title: string;
  onClick: () => void;
  active?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`p-1 rounded hover:bg-gray-300 ${active ? "bg-gray-300" : ""}`}
    title={title}
  >
    <span className={`${icon} text-base text-gray-700`} />
  </button>
);

// Action Button Component
const ActionButton = ({ icon, label }: { icon: string; label: string }) => (
  <button
    className="flex flex-col items-center px-2 py-1 hover:bg-gray-300/50 rounded"
    title={label}
  >
    <span className={`${icon} text-base text-gray-600`} />
    <span className="text-[9px] text-gray-600">{label}</span>
  </button>
);

export default AIMChatWindow;
