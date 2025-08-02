import React from 'react'
import UploadDialog from './uploadDialog'
import { Button } from './ui/button'

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center mx-10 md:mx-16">
      <div className="px-6 py-1 rounded-full bg-[#ffe0e08a]">
        <h3 className="text-sm font-medium">SKIN CANCER DETECTION</h3>
      </div>
      <h1 className="text-[2.56rem] md:text-[3.125rem] lg:text-[5rem] leading-none text-center mt-6 mb-4">
        Early Detection <span className='text-blue-700 font-serif italic'>Saves Lives</span>.
        Analyze Skin With AI
      </h1>
      <p className="md:w-[32rem] leading-5 text-center mb-6">
        Upload a skin image and receive a smart, easy-to-understand medical report. 
        Powered by AI, guided by care.
      </p>
      <UploadDialog/>
    </section>
  )
}

