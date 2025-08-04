import { DiagnosisBadgesProps } from "@/types";
import { Badge } from "./ui/badge";

export default function DiagnosisBadges({badges} : DiagnosisBadgesProps){
    return(
        <div className="flex gap-2 flex-wrap my-1">
            {badges.map((badge, idx) => (
            <Badge key={idx} variant={badge.variant} className="text-xs py-0.5 px-2">
                {badge.label}
            </Badge>
            ))}
        </div>
    )
}
