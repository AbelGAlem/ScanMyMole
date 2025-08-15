"use client"
import { Key, useEffect, useRef, useState } from "react"
import { useImageStore } from "@/store/imageStore"
import { AlertTriangle, Info, Download, CheckCircle, ShieldAlert, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import InfoTooltip from "@/components/infoTooltip"
import DiagnosisBadges from "@/components/diagnosisBadges"
import { Button } from "@/components/ui/button"
import GaugeComponent from "@/components/gauge"
import { diagnosisInfo, diagnosisMapping } from "@/constants"

export default function ReportDetailPage() {
  const [imgURL, setImgURL] = useState<string | null>(null)
  const router = useRouter()
  const scrollTargetRef = useRef<HTMLDivElement | null>(null);

  const file = useImageStore((s) => s.file)
  const predictionData = useImageStore((s) => s.predictionData)
  
  // Extract prediction information
  // TODO: probably better to get final result from server, change server response
  const prediction = predictionData?.top?.[0] 
  const diagnosis = prediction?.label || "Unknown"
  const confidence = prediction?.probability || 0
  const confidencePercentage = Math.round(confidence * 100)

  const fullDiagnosis = diagnosisMapping[diagnosis.toLowerCase()] || diagnosis
  const allPredictions = predictionData?.top || []

  // Get diagnosis detail information from constants
  const dInfo = diagnosisInfo[fullDiagnosis]

  //scroll a litte down
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollTargetRef.current) {
        const offset = 30;
        const y = scrollTargetRef.current.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({top: y,behavior: 'smooth',});
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [imgURL]);

  //load selected image or redirect
  useEffect(() => {
    if (!file || !predictionData?.top?.[0]) {
      router.push("/")
      return
    }
    const url = URL.createObjectURL(file!)
    setImgURL(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file, router])

  //TODO: change to a better loading ui and error falback state for dinfo
  if (!file || !imgURL || !dInfo) return <div className="mt-20">Loading...</div>

  const Icon = dInfo.color === "red" ? AlertTriangle : dInfo.color === "green" ? CheckCircle : ShieldAlert

  return (
    <div className="md:max-w-lg md:mx-auto mx-6 p-4 md:p-6 bg-white shadow-2xl rounded-2xl mt-8 space-y-2" ref={scrollTargetRef}>
      {/* Header/Diagnosis */}
      <div className="flex items-start gap-3 mb-4">
        <Icon className={`text-${dInfo.color}-700  mt-1`} size={32} />
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <div className="text-3xl font-bold mr-2">{fullDiagnosis}</div>
            <InfoTooltip info={dInfo.details} />
          </div>
          <span className="text-sm text-gray-600 mb-2">{dInfo.info}</span>
          <DiagnosisBadges badges={dInfo.badges} />
        </div>
      </div>
      {/* Image Preview */}
      <div className="w-full flex justify-center">
        <img
          src={imgURL}
          alt="Scanned area"
          className={`w-42 h-42 my-2 object-cover rounded-lg shadow border-6 border-${dInfo.color}-500`}
        />
      </div>
      {/* Risk Level */}
      <span className="font-semibold">Risk Assessment:</span>
      <div className={`flex items-center gap-3 shadow mt-1 p-4 bg-${dInfo.color}-50`}>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold bg-${dInfo.color}-100 text-${dInfo.color}-700`}>
          {dInfo.riskLevel}
        </div>
        <span className="text-sm text-gray-600">{dInfo.riskDescription}</span>
      </div>
      {/* Confidence Score */}
      <div className="flex flex-col items-center ">
        <span className="font-semibold self-start">AI Confidence Score:</span>
        <GaugeComponent percent={confidencePercentage} />
        <span className="text-xs text-gray-600 mt-1">
          The AI is {confidencePercentage}% confident in this diagnosis.
        </span>
      </div>
       {/* Optional All Predictions */}
       {/* {allPredictions.length > 1 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium mb-4">All Possible Diagnoses</h3>
            <div className="space-y-3">
              {allPredictions.slice(0, 5).map((pred: { label: string; probability: any }, index: Key | null | undefined) => {
                const predDiagnosis = diagnosisMapping[pred.label.toLowerCase()] || pred.label
                const predConfidence = Math.round((pred.probability || 0) * 100)
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div>
                      <p className="font-medium text-gray-900">{predDiagnosis}</p>
                      <p className="text-sm text-gray-600">Confidence: {predConfidence}%</p>
                    </div>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${predConfidence}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )} */}
      {/* Next Steps */}
      <span className="font-bold">Next Steps:</span>
      <ul className="list-disc ml-6 text-sm mb-2">
        {dInfo.nextSteps.map((step, i) => <li key={i}>{step}</li>)}
      </ul>
      {/* Helpful Fact */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-4 rounded shadow max-w-xl mx-auto">
        <div className="flex items-center">
          <Info className="text-cyan-500 mt-0.5 mr-2" size={20} />
          <span className="text-blue-900 font-medium">Did you know?</span>
        </div>
        <p className="ml-7 text-sm text-blue-800">{dInfo.fact}</p>
      </div>
      {/* Download Button */}
      <div className="flex justify-center">
        <Button
          className="flex items-center justify-center gap-2 px-4 py-2 mb-4 mt-2 bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 "
        >
          <Download size={18} />
          Download Full Report
        </Button>
      </div>
      {/* Extra reassurance */}
      <div className="mt-3 text-xs text-gray-400 text-center">
        This AI report does <span className="font-semibold text-red-400">not replace professional medical advice</span>.
        Please consult a healthcare provider for any concerns.
      </div>
    </div>
  )
}
