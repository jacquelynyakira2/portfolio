import { create } from "zustand";
import { createAIMSlice, type AIMSlice } from "./slices/aim";
import { createDockSlice, type DockSlice } from "./slices/dock";
import { createSystemSlice, type SystemSlice } from "./slices/system";
import { createUserSlice, type UserSlice } from "./slices/user";
import { createPreviewSlice, type PreviewSlice } from "./slices/preview";

export const useStore = create<
  AIMSlice & DockSlice & SystemSlice & UserSlice & PreviewSlice
>((...a) => ({
  ...createAIMSlice(...a),
  ...createDockSlice(...a),
  ...createSystemSlice(...a),
  ...createUserSlice(...a),
  ...createPreviewSlice(...a)
}));
