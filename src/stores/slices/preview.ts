import type { StateCreator } from "zustand";

export interface PreviewItem {
  path: string;
  label: string;
  type: "image" | "video";
}

export interface PreviewSlice {
  previewItem: PreviewItem | null;
  setPreviewItem: (item: PreviewItem | null) => void;
  shouldOpenPreview: boolean;
  setShouldOpenPreview: (should: boolean) => void;
}

export const createPreviewSlice: StateCreator<PreviewSlice> = (set) => ({
  previewItem: null,
  setPreviewItem: (item) => set({ previewItem: item }),
  shouldOpenPreview: false,
  setShouldOpenPreview: (should) => set({ shouldOpenPreview: should })
});
