"use client"
import { useEffect, useRef, useState } from "react"
import { useImageStore } from "@/store/imageStore"
import { AlertTriangle, Info, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { mockReport } from "@/constants"
import InfoTooltip from "@/components/infoTooltip"
import DiagnosisBadges from "@/components/diagnosisBadges"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic";
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

export default function ReportDetailPage() {
  const [imgURL, setImgURL] = useState<string | null>(null)
  
  const file = useImageStore((s) => s.file)
  const router = useRouter()

  const scrollTargetRef = useRef<HTMLDivElement | null>(null);

  //scroll down to report
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollTargetRef.current) {
        const offset = 30;
        const y = scrollTargetRef.current.getBoundingClientRect().top + window.scrollY - offset;
  
        window.scrollTo({
          top: y,
          behavior: 'smooth',
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [imgURL]);

  
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

  //TODO: change to a better loading ui
  if (!file || !imgURL) return <div className="mt-20">Loading...</div>

  return (
    <div className="md:max-w-lg md:mx-auto mx-6 p-4 md:p-6 bg-white shadow-2xl rounded-2xl mt-8 space-y-2" ref={scrollTargetRef}>
      {/* Header/Diagnosis */}
      <div className="flex items-start gap-3 mb-4" >
        <AlertTriangle className="text-red-500 mt-1" size={32} />
        <div className="flex flex-col">
          <div className="flex flex-row items-center">
            <div className="text-3xl font-bold mr-2">{mockReport.diagnosis}</div> 
            <InfoTooltip info={mockReport.diagnosisDescription} />
          </div>
          <DiagnosisBadges
            badges={[
              { label: "Cancerous", variant: "destructive" },
              { label: "Requires Biopsy", variant: "default" },
            ]}
          />
        </div>
      </div>
      {/* Image Preview */}
      <div className="w-full flex justify-center">
        <img
          src={imgURL}
          alt="Scanned area"
          className="w-42 h-42 my-2 object-cover rounded-lg shadow border-6 border-red-500"
        />
      </div>
      {/* Risk Level */}
      <span className="font-semibold">Risk Assesment:</span>
      <div className="flex items-center gap-3 shadow mt-1 p-4">
        <div className={`px-3 py-1 rounded-full text-sm font-semibold 
          ${mockReport.riskLevel === "High" ? "bg-red-100 text-red-700" :
            mockReport.riskLevel === "Medium" ? "bg-yellow-100 text-yellow-700" :
              "bg-green-100 text-green-700"}`}>
          {mockReport.riskLevel}
        </div>
        <span className="text-sm text-gray-600">{mockReport.riskDescription}</span>
      </div>
      {/* Confidence Score */}
      <div className="flex flex-col items-center ">
        <span className="font-semibold self-start ">AI Confidence Score:</span>
        <GaugeComponent
            value={80}
            type="semicircle"
            arc={{
              width: 0.2,
              padding: 0.01,
              colorArray: ['#EF4444', '#FACC15', '#22C55E'],
              //gradient: true,
              subArcs: [
                { limit: 40, color: '#EF4444', }, 
                { limit: 70, color: '#FACC15', },   
                { limit: 100, color: '#22C55E',}, 
              ],
            }}
            pointer={{type: "arrow"}}
            labels={{
              valueLabel: {
                formatTextValue: val => `${val}%`,
                style: {
                  fontSize: 36,
                  fontWeight: 700,
                  fill: "#111827", 
                  textShadow: "0 1px 6px #e5e7eb"
                },
              }
            }}
            />
      </div>
      <span className="font-bold">Treatment: <span className="font-normal text-sm text-gray-600" >{mockReport.advice}</span></span>
      {/* Tip */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6 rounded shadow max-w-xl mx-auto">
        <div className="flex items-center">
            <Info className="text-cyan-500 mt-0.5 mr-4" size={20} />
            <title>Tip</title>
          <span className="text-blue-900 font-medium">Tip:</span>
        </div>
        <p className="ml-9 text-sm text-blue-800">Don't check your skin lesion obsessively. Changes happen slowly track once a month instead.</p>
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
