import React, { useState, useEffect } from "react";

// This component mimics the macOS Trash application and hides a playful detective Easter egg.

const SECRET_PASSWORD = "constellations";

type TrashItem = {
  id: string;
  path: string;
  label: string;
  type: "image" | "video";
  clue?: boolean;
};

type IdeaFile = {
  id: string;
  name: string;
  body: string;
};

const TRASH_ITEMS: TrashItem[] = [
  {
    id: "screenshot-dec",
    path: "trash/Screenshot%202024-12-09%20at%2012.31.30%E2%80%AFPM.png",
    label: "Screenshot 2024-12-09 12.31.30",
    type: "image"
  },
  {
    id: "unnamed",
    path: "trash/unnamed.png",
    label: "unnamed.png",
    type: "image",
    clue: true
  },
  {
    id: "charmander",
    path: "trash/jacquelynyakira_charmander_pokemon_sitting_on_a_brown_leather_3666175f-8b25-4431-acf9-95852127f57a_1.png",
    label: "charmander-seat.png",
    type: "image"
  },
  {
    id: "rome-mp4-3",
    path: "trash/social_jacquelynyakira_Rome_influenced_vibes_--ar_11_--motion_low_--_09a877d4-786b-4e50-94c2-88bc32ac5db5_3.mp4",
    label: "Rome vibes 3.mp4",
    type: "video"
  },
  {
    id: "rome-mp4-2",
    path: "trash/social_jacquelynyakira_Rome_influenced_vibes_--ar_11_--motion_low_--_f0e3c9a0-29ec-4fe8-a9e6-2ed90845a1a6_2.mp4",
    label: "Rome vibes 2.mp4",
    type: "video"
  }
];

const IDEA_FILES: IdeaFile[] = [
  {
    id: "idea-astral",
    name: "astral-sketch.txt",
    body: `rewrite the night sky UI so constellations snap to the cursor.\nmake every drag feel like chalk on pavement.`
  },
  {
    id: "idea-improv",
    name: "improv-saas.md",
    body: `weekly improv prompts delivered like stand-up notes.\nusers reply with voice clips, AI tags the vibe, friends roast kindly.`
  },
  {
    id: "idea-daydream",
    name: "daydream.todo",
    body: `1. build app that reminds me of things i used to sketch.\n2. export nostalgia to pdf.\n3. share when brave.`
  }
];

const Trash: React.FC = () => {
  const setPreviewItem = useStore((state) => state.setPreviewItem);
  const setShouldOpenPreview = useStore((state) => state.setShouldOpenPreview);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isIdeaShelfOpen, setIsIdeaShelfOpen] = useState(false);
  const [activeIdea, setActiveIdea] = useState<IdeaFile | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleFolderClick = () => {
    if (isUnlocked) {
      setIsIdeaShelfOpen((prev) => !prev);
      return;
    }

    setIsPromptOpen(true);
    setErrorMessage("");
  };

  const handlePromptClose = () => {
    setIsPromptOpen(false);
    setPasswordAttempt("");
    setErrorMessage("");
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (passwordAttempt.trim().toLowerCase() === SECRET_PASSWORD.toLowerCase()) {
      setIsUnlocked(true);
      setIsIdeaShelfOpen(true);
      setIsPromptOpen(false);
      setPasswordAttempt("");
      setErrorMessage("");
      return;
    }

    setErrorMessage("Nope, keep sleuthing.");
  };

  const handleIdeaOpen = (idea: IdeaFile) => {
    setActiveIdea(idea);
  };

  const handleIdeaClose = () => {
    setActiveIdea(null);
  };

  const folderIcon = isUnlocked ? "img/icons/folder.png" : "img/icons/folder-locked.png";

  const folderHint = (() => {
    if (!isUnlocked) {
      return "Click to investigate";
    }

    return isIdeaShelfOpen ? "Close the stash" : "Open the stash";
  })();

  const selectedTrashItem = TRASH_ITEMS.find((item) => item.id === selectedItemId);

  const handlePreviewOpen = (item: TrashItem) => {
    // Set the item in the store
    setPreviewItem({
      path: item.path,
      label: item.label,
      type: item.type
    });

    // Trigger the Desktop component to open the Preview app
    setShouldOpenPreview(true);
  };

  // Handle spacebar for Quick Look
  useEffect(() => {
    if (!selectedTrashItem || isPromptOpen || activeIdea) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        handlePreviewOpen(selectedTrashItem);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTrashItem, isPromptOpen, activeIdea]);

  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setSelectedItemId(null);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-c-50">
      {/* Main content area with sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-c-100/50 border-r border-c-300 overflow-y-auto py-2">
          <div className="px-3 py-1 text-xs font-semibold text-c-500">Locations</div>
          <div className="px-2 space-y-0.5">
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:delete text-red-500 mr-2" />
              Trash
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:delete-empty text-gray-400 mr-2" />
              Empty Trash
            </div>
          </div>

          <div className="px-3 py-1 mt-4 text-xs font-semibold text-c-500">
            Recently Deleted
          </div>
          <div className="px-2 space-y-0.5">
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:folder text-blue-500 mr-2" />
              Ideas
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:file-document text-gray-500 mr-2" />
              Projects
            </div>
            <div className="px-2 py-1 text-sm text-c-700 hover:bg-c-300 rounded cursor-pointer flex items-center">
              <span className="i-mdi:image text-green-500 mr-2" />
              Photos
            </div>
          </div>
        </div>

        {/* Content area - shows the lost ideas folder */}
        <div className="flex-1 overflow-y-auto p-8" onClick={handleBackgroundClick}>
          <div className="flex flex-wrap gap-10">
            {/* The lost ideas folder */}
            <div
              className="flex flex-col items-center cursor-pointer group"
              onClick={handleFolderClick}
            >
              <div className="w-16 h-16 group-hover:opacity-80 transition-opacity">
                <img
                  src={folderIcon}
                  alt="lost ideas folder"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-1 text-xs text-c-800 text-center">lost ideas</div>
              <div className="mt-0.5 text-[11px] text-c-500 opacity-0 group-hover:opacity-100 transition-opacity">
                {folderHint}
              </div>
            </div>

            {/* Real trash contents */}
            {TRASH_ITEMS.map((item) => (
              <div
                key={item.id}
                className="flex w-24 flex-col items-center text-center group"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedItemId(item.id);
                }}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  handlePreviewOpen(item);
                }}
              >
                <div
                  className={`w-20 h-20 flex items-center justify-center overflow-hidden rounded-xl border bg-white shadow-sm transition-all group-hover:shadow-md group-hover:border-c-300 ${
                    selectedItemId === item.id
                      ? "border-blue-400 shadow-blue-200/80 ring-2 ring-blue-200"
                      : "border-c-200"
                  }`}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.path}
                      alt={item.label}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  ) : (
                    <span className="i-mdi:filmstrip text-4xl text-c-500" />
                  )}
                </div>
                <div
                  className={`mt-1 text-xs leading-tight px-1 py-0.5 rounded transition-colors ${
                    selectedItemId === item.id ? "bg-blue-500 text-white" : "text-c-700"
                  }`}
                  title={item.label}
                >
                  {item.label}
                </div>
                {item.type === "video" && (
                  <div className="mt-0.5 text-[11px] uppercase tracking-wide text-c-400">
                    mp4
                  </div>
                )}
                {item.clue && !isUnlocked && (
                  <div className="mt-1 text-[11px] text-c-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    constellations
                  </div>
                )}
              </div>
            ))}
          </div>

          {isUnlocked && isIdeaShelfOpen && (
            <div className="mt-10 border-t border-c-200 pt-6">
              <div className="text-xs uppercase tracking-wide text-c-500">
                recovered fragments
              </div>
              <div className="mt-4 flex flex-wrap gap-8">
                {IDEA_FILES.map((idea) => (
                  <button
                    key={idea.id}
                    type="button"
                    className="flex w-24 flex-col items-center text-center group focus:outline-none"
                    onClick={() => handleIdeaOpen(idea)}
                  >
                    <div className="w-14 h-16 rounded-lg border border-c-200 bg-white shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:border-c-300 transition-all">
                      <span className="i-mdi:file-document-edit-outline text-3xl text-c-500" />
                    </div>
                    <div className="mt-1 text-xs text-c-700 leading-tight">
                      {idea.name}
                    </div>
                    <div className="mt-0.5 text-[11px] text-c-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      Open idea
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {isPromptOpen && (
        <div className="absolute inset-0 bg-c-900/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-xs p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-c-800">Lost Ideas Locker</h2>
              <p className="mt-1 text-sm text-c-600">
                Clue: One random file still whispers the password.
              </p>
            </div>

            <form className="space-y-3" onSubmit={handlePasswordSubmit}>
              <label className="flex flex-col text-sm text-c-700">
                Password
                <input
                  type="password"
                  className="mt-1 rounded-md border border-c-300 bg-white px-3 py-2 text-sm text-c-800 focus:border-c-500 focus:outline-none focus:ring-2 focus:ring-c-200"
                  autoFocus
                  value={passwordAttempt}
                  onChange={(event) => setPasswordAttempt(event.target.value)}
                  placeholder="Enter the secret"
                />
              </label>

              {errorMessage && <div className="text-xs text-red-500">{errorMessage}</div>}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="rounded-md px-3 py-1.5 text-sm text-c-600 hover:bg-c-200"
                  onClick={handlePromptClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-c-800 px-3 py-1.5 text-sm text-white hover:bg-c-700"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeIdea && (
        <div
          className="absolute inset-0 bg-c-900/40 backdrop-blur flex items-center justify-center p-6"
          onClick={handleIdeaClose}
        >
          <div
            className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-lg p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-c-800">{activeIdea.name}</h3>
                <p className="text-sm text-c-600">Recovered thought fragment</p>
              </div>
              <button
                type="button"
                className="text-sm text-c-600 hover:text-c-800"
                onClick={handleIdeaClose}
              >
                Close
              </button>
            </div>
            <div className="mt-4 whitespace-pre-wrap rounded-lg border border-c-200 bg-c-100/70 px-4 py-3 text-sm font-mono leading-relaxed text-c-700">
              {activeIdea.body}
            </div>
          </div>
        </div>
      )}

      {isUnlocked && !isPromptOpen && !activeIdea && (
        <div className="absolute bottom-6 right-6 rounded-xl bg-white/90 px-4 py-3 text-sm text-c-700 shadow-lg">
          Secret dossier unlocked. Click the folder to peek inside.
        </div>
      )}
    </div>
  );
};

export default Trash;
