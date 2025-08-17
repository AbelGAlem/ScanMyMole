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

export type PredictTopItem = {
  label: string;
  probability: number;
};
export type PredictResponse = {
  top: PredictTopItem[];
};


export type Sex = 'male' | 'female' | 'unknown'
export type Localization =
  | 'abdomen'
  | 'back'
  | 'chest'
  | 'ear'
  | 'face'
  | 'foot'
  | 'genital'
  | 'hand'
  | 'lower extremity'
  | 'neck'
  | 'scalp'
  | 'trunk'
  | 'upper extremity'
  | 'unknown'
