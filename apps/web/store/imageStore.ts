import { create } from "zustand"
import { PredictResponse } from "@/types"

interface ImageStore {
    file: File | null
    predictionData: PredictResponse | null
    error: string | null
    setImage: (file: File | null) => void
    setPredictionData: (data: PredictResponse) => void
    setError: (error: string | null) => void
    clearImage: () => void
    clearPredictionData: () => void
    clearError: () => void
  }

export const useImageStore = create<ImageStore>((set) => ({
    file: null,
    predictionData: null,
    error: null,
    setImage: (file) => set({ file }),
    setPredictionData: (data) => set({ predictionData: data, error: null }),
    setError: (error) => set({ error }),
    clearImage: () => set({ file: null }),
    clearPredictionData: () => set({ predictionData: null }),
    clearError: () => set({ error: null }),
}))