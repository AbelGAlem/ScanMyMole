import React from "react"
import Image from "next/image"

export default function MokcupSection() {
    return(
        <section className="bg-[url(/mockupBG.png)] bg-contain flex justify-center items-center mt-12 md:16 lg:mt-24">
            <div className="relative w-1/2 translate-x-12 md:translate-x-20 lg:translate-x-28">
                <Image
                    src="/mockup.png"
                    alt="Mockup"
                    width={0}
                    height={0}
                    sizes="50vw"
                    className="w-full h-auto object-contain"
                />
            </div>
        </section>
    )
}