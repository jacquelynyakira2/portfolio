import type { StateCreator } from "zustand";
import type {
  AIMStatus,
  AIMBuddyGroup,
  AIMChat,
  AIMChatMessage,
  AIMPreferences
} from "~/types";
import { defaultBuddyGroups } from "~/configs/aim";

const AIM_STORAGE_KEY = "aim-state";

interface PersistedAIMState {
  screenName: string;
  buddyGroups: AIMBuddyGroup[];
  openChats: AIMChat[];
  preferences: AIMPreferences;
}

// Chat window position tracking for desktop windows
export interface AIMChatWindow {
  buddyId: string;
  buddyScreenName: string;
  x: number;
  y: number;
  z: number;
}

export interface AIMSlice {
  // State
  aimIsSignedIn: boolean;
  aimScreenName: string;
  aimStatus: AIMStatus;
  aimAwayMessage: string | null;
  aimBuddyGroups: AIMBuddyGroup[];
  aimOpenChats: AIMChat[];
  aimChatWindows: AIMChatWindow[]; // Windows shown on desktop
  aimMaxZ: number; // Track z-index for chat windows
  aimPreferences: AIMPreferences;

  // Actions
  aimSignIn: (screenName: string) => void;
  aimSignOut: () => void;
  aimSetStatus: (status: AIMStatus, awayMessage?: string | null) => void;
  aimToggleGroupCollapsed: (groupId: string) => void;
  aimOpenChat: (buddyId: string, buddyScreenName: string) => void;
  aimCloseChat: (buddyId: string) => void;
  aimFocusChat: (buddyId: string) => void;
  aimSendMessage: (buddyId: string, text: string) => void;
  aimReceiveMessage: (buddyId: string, text: string) => void;
  aimSetBuddyTyping: (buddyId: string, isTyping: boolean) => void;
  aimUpdateBuddyStatus: (
    buddyId: string,
    status: AIMStatus,
    awayMessage?: string
  ) => void;
  aimToggleSounds: () => void;
  aimHydrateFromStorage: () => void;
  aimBuddyLeave: (buddyId: string) => void;
}

// Helper to generate unique message IDs
const generateMessageId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Helper to deep clone buddy groups with randomized statuses
const initializeBuddyGroups = (): AIMBuddyGroup[] => {
  return defaultBuddyGroups.map((group) => ({
    ...group,
    collapsed: false,
    buddies: group.buddies.map((buddy) => ({
      ...buddy,
      // Randomize initial status for fun
      status: buddy.status
    }))
  }));
};

// Load state from localStorage
const loadFromStorage = (): PersistedAIMState | null => {
  try {
    const stored = localStorage.getItem(AIM_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to load AIM state from localStorage:", e);
  }
  return null;
};

// Save state to localStorage
const saveToStorage = (state: PersistedAIMState) => {
  try {
    localStorage.setItem(AIM_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save AIM state to localStorage:", e);
  }
};

export const createAIMSlice: StateCreator<AIMSlice> = (set, get) => ({
  // Initial state
  aimIsSignedIn: false,
  aimScreenName: "",
  aimStatus: "online",
  aimAwayMessage: null,
  aimBuddyGroups: initializeBuddyGroups(),
  aimOpenChats: [],
  aimChatWindows: [],
  aimMaxZ: 100,
  aimPreferences: { soundEnabled: true },

  // Sign in
  aimSignIn: (screenName: string) => {
    set(() => ({
      aimIsSignedIn: true,
      aimScreenName: screenName,
      aimStatus: "online",
      aimAwayMessage: null
    }));

    // Save to storage
    const state = get();
    saveToStorage({
      screenName: state.aimScreenName,
      buddyGroups: state.aimBuddyGroups,
      openChats: state.aimOpenChats,
      preferences: state.aimPreferences
    });
  },

  // Sign out
  aimSignOut: () => {
    set(() => ({
      aimIsSignedIn: false,
      aimStatus: "offline",
      aimAwayMessage: null,
      aimChatWindows: [] // Close all chat windows on sign out
    }));
  },

  // Set status (online, away, offline)
  aimSetStatus: (status: AIMStatus, awayMessage?: string | null) => {
    set(() => ({
      aimStatus: status,
      aimAwayMessage:
        status === "away" ? awayMessage ?? "I am away from my computer right now." : null
    }));
  },

  // Toggle buddy group collapsed state
  aimToggleGroupCollapsed: (groupId: string) => {
    set((state) => ({
      aimBuddyGroups: state.aimBuddyGroups.map((group) =>
        group.id === groupId ? { ...group, collapsed: !group.collapsed } : group
      )
    }));

    // Save to storage
    const state = get();
    saveToStorage({
      screenName: state.aimScreenName,
      buddyGroups: state.aimBuddyGroups,
      openChats: state.aimOpenChats,
      preferences: state.aimPreferences
    });
  },

  // Open a chat with a buddy (creates window on desktop)
  aimOpenChat: (buddyId: string, buddyScreenName: string) => {
    set((state) => {
      // Check if chat already exists
      const existingChat = state.aimOpenChats.find((c) => c.buddyId === buddyId);
      const existingWindow = state.aimChatWindows.find((w) => w.buddyId === buddyId);

      if (existingChat && existingWindow) {
        // Just focus the existing window
        const newZ = state.aimMaxZ + 1;
        return {
          aimChatWindows: state.aimChatWindows.map((w) =>
            w.buddyId === buddyId ? { ...w, z: newZ } : w
          ),
          aimMaxZ: newZ
        };
      }

      const newChat: AIMChat = existingChat || {
        buddyId,
        messages: [],
        isTyping: false
      };

      // Calculate position with cascade offset
      const windowCount = state.aimChatWindows.length;
      const newZ = state.aimMaxZ + 1;
      const newWindow: AIMChatWindow = {
        buddyId,
        buddyScreenName,
        x: 100 + (windowCount % 5) * 30,
        y: 50 + (windowCount % 5) * 30,
        z: newZ
      };

      return {
        aimOpenChats: existingChat
          ? state.aimOpenChats
          : [...state.aimOpenChats, newChat],
        aimChatWindows: [...state.aimChatWindows, newWindow],
        aimMaxZ: newZ
      };
    });

    // Save to storage
    const state = get();
    saveToStorage({
      screenName: state.aimScreenName,
      buddyGroups: state.aimBuddyGroups,
      openChats: state.aimOpenChats,
      preferences: state.aimPreferences
    });
  },

  // Close a chat window
  aimCloseChat: (buddyId: string) => {
    set((state) => ({
      aimChatWindows: state.aimChatWindows.filter((w) => w.buddyId !== buddyId),
      aimOpenChats: state.aimOpenChats.filter((c) => c.buddyId !== buddyId)
    }));

    // Save to storage
    const state = get();
    saveToStorage({
      screenName: state.aimScreenName,
      buddyGroups: state.aimBuddyGroups,
      openChats: state.aimOpenChats,
      preferences: state.aimPreferences
    });
  },

  // Focus a chat window (bring to front)
  aimFocusChat: (buddyId: string) => {
    set((state) => {
      const newZ = state.aimMaxZ + 1;
      return {
        aimChatWindows: state.aimChatWindows.map((w) =>
          w.buddyId === buddyId ? { ...w, z: newZ } : w
        ),
        aimMaxZ: newZ
      };
    });
  },

  // Send a message
  aimSendMessage: (buddyId: string, text: string) => {
    const message: AIMChatMessage = {
      id: generateMessageId(),
      senderId: "me",
      text,
      timestamp: Date.now()
    };

    set((state) => ({
      aimOpenChats: state.aimOpenChats.map((chat) =>
        chat.buddyId === buddyId
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    }));

    // Save to storage
    const state = get();
    saveToStorage({
      screenName: state.aimScreenName,
      buddyGroups: state.aimBuddyGroups,
      openChats: state.aimOpenChats,
      preferences: state.aimPreferences
    });
  },

  // Receive a message from a buddy
  aimReceiveMessage: (buddyId: string, text: string) => {
    const message: AIMChatMessage = {
      id: generateMessageId(),
      senderId: buddyId,
      text,
      timestamp: Date.now()
    };

    set((state) => ({
      aimOpenChats: state.aimOpenChats.map((chat) =>
        chat.buddyId === buddyId
          ? { ...chat, messages: [...chat.messages, message], isTyping: false }
          : chat
      )
    }));

    // Save to storage
    const state = get();
    saveToStorage({
      screenName: state.aimScreenName,
      buddyGroups: state.aimBuddyGroups,
      openChats: state.aimOpenChats,
      preferences: state.aimPreferences
    });
  },

  // Set buddy typing indicator
  aimSetBuddyTyping: (buddyId: string, isTyping: boolean) => {
    set((state) => ({
      aimOpenChats: state.aimOpenChats.map((chat) =>
        chat.buddyId === buddyId ? { ...chat, isTyping } : chat
      )
    }));
  },

  // Update a buddy's status
  aimUpdateBuddyStatus: (buddyId: string, status: AIMStatus, awayMessage?: string) => {
    set((state) => ({
      aimBuddyGroups: state.aimBuddyGroups.map((group) => ({
        ...group,
        buddies: group.buddies.map((buddy) =>
          buddy.id === buddyId
            ? {
                ...buddy,
                status,
                awayMessage: status === "away" ? awayMessage : undefined
              }
            : buddy
        )
      }))
    }));
  },

  // Toggle sound effects on/off
  aimToggleSounds: () => {
    set((state) => ({
      aimPreferences: {
        ...state.aimPreferences,
        soundEnabled: !state.aimPreferences.soundEnabled
      }
    }));

    // Save to storage
    const state = get();
    saveToStorage({
      screenName: state.aimScreenName,
      buddyGroups: state.aimBuddyGroups,
      openChats: state.aimOpenChats,
      preferences: state.aimPreferences
    });
  },

  // Buddy leaves the chat (rate limit hit)
  aimBuddyLeave: (buddyId: string) => {
    const { aimBuddyGroups, aimReceiveMessage, aimUpdateBuddyStatus, aimCloseChat } =
      get();

    const buddy = aimBuddyGroups.flatMap((g) => g.buddies).find((b) => b.id === buddyId);
    const isSpecial = buddy && (buddy as any).isSpecial;

    const specialFarewells = [
      "hey i gotta run, ttyl!! <3",
      "omg i'm so sorry, something just came up – catch u later!",
      "brb for real this time, talk soon!! <3"
    ];
    const regularFarewells = [
      "omg my mom is calling me off the computer g2g",
      "brb parents are yelling lol gtg!!",
      "sry gotta go, mom needs the phone line!! ttyl"
    ];

    const farewells = isSpecial ? specialFarewells : regularFarewells;
    const farewell = farewells[Math.floor(Math.random() * farewells.length)];

    aimReceiveMessage(buddyId, farewell);

    setTimeout(() => {
      aimUpdateBuddyStatus(buddyId, "offline");
    }, 2000);

    setTimeout(() => {
      aimCloseChat(buddyId);
    }, 2500);
  },

  // Hydrate state from localStorage on app load
  aimHydrateFromStorage: () => {
    const stored = loadFromStorage();
    if (stored) {
      // Always use defaultBuddyGroups as source of truth so new buddies always appear.
      // Only restore collapsed state from storage.
      const collapsedMap: Record<string, boolean> = {};
      stored.buddyGroups.forEach((g) => {
        collapsedMap[g.id] = g.collapsed ?? false;
      });
      const mergedGroups = initializeBuddyGroups().map((g) => ({
        ...g,
        collapsed: collapsedMap[g.id] ?? false
      }));
      set(() => ({
        aimScreenName: stored.screenName,
        aimBuddyGroups: mergedGroups,
        aimOpenChats: stored.openChats,
        aimPreferences: stored.preferences
      }));
    }
  }
});
