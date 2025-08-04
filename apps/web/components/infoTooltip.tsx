import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideInfo } from "lucide-react";

export default function InfoTooltip({info}: {info: string}){
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <LucideInfo className="text-blue-500 hover:text-blue-800 focus:outline-none" size={20} />
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                    {info}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}