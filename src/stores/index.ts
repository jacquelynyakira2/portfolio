import { create } from "zustand";
import { createDockSlice, type DockSlice } from "./slices/dock";
import { createSystemSlice, type SystemSlice } from "./slices/system";
import { createUserSlice, type UserSlice } from "./slices/user";
import { createPreviewSlice, type PreviewSlice } from "./slices/preview";

export const useStore = create<DockSlice & SystemSlice & UserSlice & PreviewSlice>(
  (...a) => ({
    ...createDockSlice(...a),
    ...createSystemSlice(...a),
    ...createUserSlice(...a),
    ...createPreviewSlice(...a)
  })
);
