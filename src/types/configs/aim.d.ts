export type AIMStatus = "online" | "away" | "offline";

export interface AIMBuddy {
  id: string;
  screenName: string;
  status: AIMStatus;
  awayMessage?: string;
  /** Pool of auto-response messages this buddy can send */
  autoResponses: string[];
  /** Persona prompt sent to Claude */
  systemPrompt?: string;
  /** true only for jacquelynyakira — uses a better model */
  isSpecial?: boolean;
  /** Per-session message cap before buddy leaves (default 15, special 25) */
  messageLimit?: number;
}

export interface AIMBuddyGroup {
  id: string;
  name: string;
  buddies: AIMBuddy[];
  collapsed?: boolean;
}

export interface AIMChatMessage {
  id: string;
  senderId: string; // "me" or buddy id
  text: string;
  timestamp: number;
}

export interface AIMChat {
  buddyId: string;
  messages: AIMChatMessage[];
  isTyping?: boolean;
}

export interface AIMAwayMessage {
  id: string;
  text: string;
  isCustom?: boolean;
}

export interface AIMPreferences {
  soundEnabled: boolean;
}

export interface AIMState {
  isSignedIn: boolean;
  screenName: string;
  status: AIMStatus;
  awayMessage: string | null;
  buddyGroups: AIMBuddyGroup[];
  openChats: AIMChat[];
  activeChatBuddyId: string | null;
  preferences: AIMPreferences;
}

export interface AIMConfig {
  defaultBuddyGroups: AIMBuddyGroup[];
  presetAwayMessages: AIMAwayMessage[];
}
