export interface DiagnosisBadgesProps {
    badges: Array<{
      label: string;
      variant?: "default" | "destructive" | "secondary" | "outline";
    }>;
  }
  