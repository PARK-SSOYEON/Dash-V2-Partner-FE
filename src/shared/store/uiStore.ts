import { create } from "zustand";

type UIState = {
    bottomMenuVisible: boolean;
    showBottomMenu: () => void;
    hideBottomMenu: () => void;
    setBottomMenuVisible: (visible: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
    bottomMenuVisible: true,
    showBottomMenu: () => set({ bottomMenuVisible: true }),
    hideBottomMenu: () => set({ bottomMenuVisible: false }),
    setBottomMenuVisible: (visible) => set({ bottomMenuVisible: visible }),
}));
