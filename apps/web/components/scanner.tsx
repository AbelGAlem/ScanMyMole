"use client"
import { useImageStore } from "@/store/imageStore"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Lottie from "lottie-react"
import scanAnimation from "@/public/lottie/scanAnimation.json"
import { Loader2, CheckCircle2 } from "lucide-react"
import { steps } from "@/constants"
import ErrorComponent from "./simpleError"

export default function Scanner() {
  const [imgURL, setImgURL] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [showCheck, setShowCheck] = useState(false)
  const [finished, setFinished] = useState(false)

  const file = useImageStore((s) => s.file)
  const predictionData = useImageStore((s) => s.predictionData)
  const error = useImageStore((s) => s.error)
  const router = useRouter()

  // Check if we have prediction data and show results
  useEffect(() => {
    if (predictionData && finished) {
      router.push("/results/report")
    }
  }, [predictionData, finished, router])

  //simulate step progress only if no prediction data and no error
  useEffect(() => {
    if (!error && step < steps.length && !finished) {
      const timer = setTimeout(() => {
        setShowCheck(true)
        setTimeout(() => {
          setShowCheck(false)
          if (step < steps.length - 1) {
            setStep(s => s + 1)
          } else {
            setFinished(true)
          }
        }, 350)
      }, 1200) 
      return () => clearTimeout(timer)
    }
  }, [step, finished, error])

  //load selected image or redirect
  useEffect(() => {
    if (!file) {
      router.push("/")
      return
    }
    const url = URL.createObjectURL(file!)
    setImgURL(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file, router])

  //TODO: better loading state
  if (!file || !imgURL) return <div className="mt-20">Loading...</div>

  // Show error state
  if (error) {
    return <ErrorComponent
      title="Something went wrong."
      message={error}
    />
  }

  return (
    <div className="flex flex-col items-center space-y-8 mt-6">
      {/* Image scan animation */}
      <div className="relative w-52 h-52 overflow-hidden shadow-2xl rounded-lg">
        <img src={imgURL} alt="Uploaded" className="w-full h-full object-cover" />
        <div className="flex justify-start items-start">
          <Lottie animationData={scanAnimation} loop autoplay className="absolute inset-0 w-[158%] h-fit" />
        </div>
      </div>

      {/* Steps progress */}
      <div className="flex flex-col items-center w-full mt-4">
        <div className="flex items-center gap-3 text-lg font-medium min-h-[32px]">
          {!finished ? (
            <>
              {showCheck ? (
                <CheckCircle2 className="text-green-500 animate-pop" size={28} />
              ) : (
                <Loader2 className="animate-spin text-blue-500" size={28} />
              )}
              <span>{steps[step]}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="text-green-500" size={28} />
              <span>Analysis complete!</span>
            </>
          )}
        </div>
        {/* Progress bar */}
        <div className="mt-4 w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-600"
            style={{ width: `${((step + (finished ? 1 : 0)) / steps.length) * 100}%` }}
          ></div>
        </div>
        {/* Message */}
        <div className="mx-12 mt-4 text-xs text-gray-500 text-center">
          {finished
            ? predictionData 
              ? "Your skin analysis is ready. Redirecting to results..."
              : "Analysis complete but no data received."
            : "Please hold on while we analyze your scan. This usually takes less than a minute."}
        </div>
      </div>
    </div>
  )
}
