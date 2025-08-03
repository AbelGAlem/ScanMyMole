import { faqItems } from "@/constants"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"

export default function Faq(){
    return(
        <section className="flex flex-col items-center justify-center mt-10 md:mt-16 px-10">
            <h1 className="text-4xl md:text-5xl leading-none text-center mt-6 mb-4">
                Frequently asked<br/>questions
            </h1>
            <p className="md:w-[30rem] leading-5 text-center text-gray-600 mb-12">
                Everything you need to know about the app and process. Find answers to the most common questions below.
            </p>
            <div className="w-full max-w-xl">
                <Accordion type="single" collapsible>
                    {faqItems.map((item, idx) => (
                        <AccordionItem value={item.title} key={idx}>
                        <AccordionTrigger className="text-xl font-normal" >{item.title}</AccordionTrigger>
                        <AccordionContent>{item.content}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}