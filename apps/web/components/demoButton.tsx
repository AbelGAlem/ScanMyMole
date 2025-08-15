'use client'

import { useImageStore } from "@/store/imageStore";
import { useRouter } from "next/navigation"
import { useState } from "react";
import { Button } from "./ui/button";

export default function DemoButton() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const setImage = useImageStore((s) => s.setImage)
  const setPredictionData = useImageStore((s) => s.setPredictionData)
  const setError = useImageStore((s) => s.setError)

  //TODO: instead of actually making api request, just simulate analysis
  async function handleDemoUpload() {
    setError(null);
    setIsUploading(true);
    const f = await fileFromUrl("/mock/mock.webp",  "demo.webp", "image/webp");

    // Store the image for preview in scanner page
    setImage(f);
    router.push("/results");

    try {
      const formData = new FormData();
      formData.append("file", f);

      const res = await fetch("/api/predict", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");

      setPredictionData(data);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
      <Button 
        onClick={handleDemoUpload} 
        disabled={isUploading} 
        variant="outline"
        className="px-6 py-5 rounded-full text-black text-lg font-semibold border-2 border-[#3D0000]">
            {isUploading ? "Uploading..." : "Try Demo"}
      </Button>
  );
}

async function fileFromUrl(url: string, filename: string, fallbackMime = "image/webp") {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch mock image: ${res.status}`);
    const buf = await res.arrayBuffer();
    const mime = res.headers.get("content-type") || fallbackMime; 
    return new File([buf], filename, { type: mime });
  }