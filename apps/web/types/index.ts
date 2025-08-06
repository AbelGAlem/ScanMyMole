export type Badge = {
  label: string;
  variant?: "default" | "destructive" | "secondary" | "outline";
};

export interface DiagnosisInfo {
  cancerous: boolean;
  riskLevel: "Low" | "Medium" | "High";
  color: string;
  details: string;
  riskDescription: string;
  info: string;
  nextSteps: string[];
  fact: string;
  badges: Badge[];
}