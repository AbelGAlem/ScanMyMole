import { create } from "zustand"

interface ImageStore {
    file: File | null
    setImage: (file: File | null) => void
    clearImage: () => void
  }

export const useImageStore = create<ImageStore>((set) => ({
    file: null,
    setImage: (file) => set({ file }),
    clearImage: () => set({ file: null }),
}))