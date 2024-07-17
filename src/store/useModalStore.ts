import { create } from "zustand";

type ModalStoreType = {
  open: boolean;
  view: "login" | "signup" | "resetPassword";
  setOpen: (status: boolean) => void;
};

const useModalStore = create<ModalStoreType>((set) => ({
  open: false,
  view: "login",
  setOpen: (status) => set(() => ({ open: status })),
}));

export { useModalStore };