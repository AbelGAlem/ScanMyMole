import { DiagnosisInfo, Localization } from "@/types";

export const faqItems = [
  {
    title: "What does this app do?",
    content:
      "Our app uses advanced AI technology to analyze photos of your skin and provide risk assessments for various types of skin cancer, including melanoma. It's designed to help you monitor your skin health and spot potentially concerning changes early."
  },
  {
    title: "How accurate is the AI diagnosis?",
    content:
      "The AI is trained on thousands of clinical images and has demonstrated high accuracy in tests, but it is not a replacement for a dermatologist. We recommend using the app as a helpful screening tool and consulting a healthcare professional for a full diagnosis."
  },
  {
    title: "Is my data and privacy protected?",
    content:
      "Yes, your photos and personal information are not stored, in fact we dont have a database and all data is stored in memory so be carefull when refreshing your page."
  },
  {
    title: "Can the app diagnose all types of skin cancer?",
    content:
      "The app is most accurate for common types such as melanoma, basal cell carcinoma and 5 more types of lessions. It may not detect rare or unusual skin conditions, so always consult a doctor if you have concerns."
  },
  {
    title: "What should I do if the app flags a spot as high risk?",
    content:
      "If the app identifies a spot as potentially high risk, we recommend making an appointment with a dermatologist as soon as possible. The app provides guidance, but only a medical professional can make an official diagnosis and recommend treatment."
  }
];

export const steps = [
  "Validating image quality",
  "Detecting skin region",
  "Analyzing skin features",
  "Running cancer detection AI",
  "Classifying possible conditions",
  "Finalizing report",
]


export const mockReport = {
  riskLevel: "Low",
  riskDescription: "The analysis detected features that may be associated with a higher risk skin lesion.",
  confidence: 92,
  diagnosis: "Melanoma",
  diagnosisDescription: "Melanoma is a serious form of skin cancer that requires prompt medical attention.",
  advice: "Please consult a certified dermatologist as soon as possible. Early detection and treatment are crucial.",
  timestamp: "2025-08-03 12:34",
}

// Map shorthand labels to full diagnosis names
 export const diagnosisMapping: Record<string, string> = {
    "bcc": "Basal cell carcinoma",
    "mel": "Melanoma", 
    "scc": "Squamous cell carcinoma",
    "akiec": "Actinic keratosis",
    "bkl": "Benign keratosis",
    "df": "Dermatofibroma",
    "vasc": "Vascular lesion",
    "nv": "Melanocytic nevus"
  }

  export const LOCALIZATION_OPTIONS: { value: Localization; label: string }[] = [
    { value: 'abdomen', label: 'Abdomen' },
    { value: 'back', label: 'Back' },
    { value: 'chest', label: 'Chest' },
    { value: 'ear', label: 'Ear' },
    { value: 'face', label: 'Face' },
    { value: 'foot', label: 'Foot' },
    { value: 'genital', label: 'Genital' },
    { value: 'hand', label: 'Hand' },
    { value: 'lower extremity', label: 'Lower extremity' },
    { value: 'neck', label: 'Neck' },
    { value: 'scalp', label: 'Scalp' },
    { value: 'trunk', label: 'Trunk' },
    { value: 'upper extremity', label: 'Upper extremity' },
    { value: 'unknown', label: 'Unknown / missing' },
  ]

// TODO: Consider mapping on server side
export const diagnosisInfo: Record<string, DiagnosisInfo> = {
  "Basal cell carcinoma": {
    cancerous: true,
    riskLevel: "High",
    color: "red",
    riskDescription: "A common form of skin cancer that grows slowly but requires medical treatment.",
    info: "Basal cell carcinoma (BCC) is the most frequent skin cancer. It's usually not life-threatening but can cause local damage if untreated.",
    details: "Basal cell carcinoma (BCC) is the most common type of skin cancer. It usually appears as a small, shiny bump or a pink growth on sun-exposed areas like the face or neck. BCC grows slowly and rarely spreads to other parts of the body, but if left untreated, it can invade deeper tissues and cause significant local damage. Treatment options are highly effective and may include surgical removal, topical medications, or other therapies as recommended by your doctor.",
    nextSteps: [
      "Schedule an appointment with a dermatologist as soon as possible.",
      "Discuss biopsy and treatment options with your doctor.",
      "Protect your skin from sun exposure in the future."
    ],
    fact: "BCC rarely spreads to other parts of the body but can reoccur after treatment.",
    badges: [
      { label: "Cancerous", variant: "destructive" },
      { label: "Needs Biopsy", variant: "default" },
      { label: "Early Detection Important", variant: "secondary" }
    ]
  },
  "Melanocytic nevus": {
    cancerous: false,
    riskLevel: "Low",
    color: "green",
    riskDescription: "A benign (non-cancerous) mole, usually harmless.",
    info: "Melanocytic nevi are common moles. Most are not dangerous but should be watched for changes.",
    details: "A melanocytic nevus, commonly known as a mole, is a cluster of pigment-producing cells in the skin. Most moles appear during childhood or adolescence and remain unchanged throughout life. They can be flat or raised and come in a variety of colors. Moles are generally harmless, but it’s important to watch for signs of change—such as asymmetry, irregular borders, color changes, or rapid growth—as these may indicate a risk for skin cancer. Regular self-checks can help catch any concerning changes early.",
    nextSteps: [
      "Self-monitor this mole once a month for any changes.",
      "See a dermatologist if you notice rapid growth, color changes, or irregular edges.",
      "Take photos periodically for easy comparison."
    ],
    fact: "Most adults have between 10 and 40 moles.",
    badges: [
      { label: "Benign", variant: "secondary" },
      { label: "Self-Monitor", variant: "default" },
      { label: "Common Lesion", variant: "outline" }
    ]
  },
  "Actinic keratosis": {
    cancerous: false,
    riskLevel: "Medium",
    color: "yellow",
    riskDescription: "A precancerous lesion that can become skin cancer if untreated.",
    info: "Actinic keratosis is caused by sun damage and may progress to squamous cell carcinoma over time.",
    details: "Actinic keratosis (AK) is a rough, scaly patch that develops on skin exposed to the sun, such as the face, ears, hands, or scalp. It is considered a precancerous lesion because, over time, it can turn into squamous cell carcinoma if not treated. Most AKs grow slowly and may be tender or itchy. Treatment often involves freezing, topical medications, or other dermatological procedures to remove or destroy the abnormal cells. Preventing future sun damage by using sunscreen and protective clothing is also important.",
    nextSteps: [
      "Consult a dermatologist for evaluation and possible removal.",
      "Use sunscreen daily to prevent new lesions.",
      "Monitor for any new or changing spots."
    ],
    fact: "Actinic keratoses are among the most common skin conditions treated by dermatologists.",
    badges: [
      { label: "Precancerous", variant: "outline" },
      { label: "Sun-Induced", variant: "secondary" },
      { label: "Needs Monitoring", variant: "default" }
    ]
  },
  "Benign keratosis": {
    cancerous: false,
    riskLevel: "Low",
    color: "green",
    riskDescription: "A harmless, non-cancerous growth, typically not a health concern.",
    info: "Benign keratosis includes seborrheic keratosis and similar non-cancerous growths.",
    details: "Benign keratosis lesions, such as seborrheic keratoses, are common, non-cancerous skin growths that often appear as people age. They can look warty or waxy, and vary in color from light tan to dark brown or black. These growths are not harmful and do not require treatment unless they become irritated, itchy, or are a cosmetic concern. If a growth changes rapidly or looks unusual, it’s best to have it checked by a dermatologist to rule out other conditions.",
    nextSteps: [
      "No treatment needed unless it becomes irritated or cosmetically concerning.",
      "Monitor for changes and consult a dermatologist if any appear.",
      "Avoid scratching or picking at the lesion."
    ],
    fact: "These growths are common with age and are not contagious.",
    badges: [
      { label: "Benign", variant: "secondary" },
      { label: "No Treatment Needed", variant: "default" },
      { label: "Age-Related", variant: "outline" }
    ]
  },
  "Dermatofibroma": {
    cancerous: false,
    riskLevel: "Low",
    color: "green",
    riskDescription: "A benign skin nodule, usually harmless.",
    info: "Dermatofibromas are small, firm nodules often caused by minor skin injuries.",
    details: "Dermatofibromas are small, firm nodules that commonly appear on the legs or arms. They are benign and are thought to be a reaction to minor skin injuries such as insect bites or cuts. Dermatofibromas are usually painless but may be sensitive to touch. They do not require treatment unless they become bothersome, in which case removal is possible but may leave a scar. Monitoring for any changes in size, color, or sensation is always a good idea.",
    nextSteps: [
      "No treatment needed unless it causes discomfort.",
      "Monitor for any significant changes.",
      "Consult a dermatologist if it grows or changes color."
    ],
    fact: "Dermatofibromas are more common in adults and may feel firm to the touch.",
    badges: [
      { label: "Benign", variant: "secondary" },
      { label: "No Treatment Needed", variant: "default" },
      { label: "Self-Monitor", variant: "outline" }
    ]
  },
  "Vascular lesion": {
    cancerous: false,
    riskLevel: "Low",
    color: "green",
    riskDescription: "A non-cancerous lesion related to blood vessels, usually not dangerous.",
    info: "Vascular lesions include angiomas and similar benign blood vessel growths.",
    details: "Vascular lesions include a variety of harmless growths formed from blood vessels, such as cherry angiomas or hemangiomas. These can appear as red or purple spots on the skin and may increase in number with age. Most vascular lesions are not a cause for concern and do not require treatment. However, if a lesion bleeds, grows rapidly, or causes discomfort, consult a healthcare professional for evaluation and advice.",
    nextSteps: [
      "Typically requires no treatment unless bothersome.",
      "Monitor for rapid growth, pain, or bleeding.",
      "Consult a dermatologist if unsure about the lesion."
    ],
    fact: "Vascular lesions are common and generally harmless.",
    badges: [
      { label: "Benign", variant: "secondary" },
      { label: "Blood Vessel Related", variant: "outline" },
      { label: "Monitor for Changes", variant: "default" }
    ]
  },
  "Melanoma": {
    cancerous: true,
    riskLevel: "High",
    color: "red",
    riskDescription: "A dangerous form of skin cancer that requires urgent medical attention.",
    info: "Melanoma is a serious skin cancer. Early detection and treatment greatly improve outcomes.",
    details: "Melanoma is a serious form of skin cancer that can develop in an existing mole or as a new dark spot on the skin. It may appear as an irregularly shaped, multicolored lesion with uneven borders. Melanoma can spread quickly to other parts of the body, making early detection and treatment critical. If caught early, treatment is often highly effective. Regular self-exams and prompt attention to any new or changing skin spots are key to prevention and early detection.",
    nextSteps: [
      "Contact a dermatologist or healthcare provider immediately.",
      "Do not delay in scheduling a biopsy or further testing.",
      "Avoid excessive sun exposure and monitor for any new spots."
    ],
    fact: "Melanoma can spread rapidly but is often curable if caught early.",
    badges: [
      { label: "Cancerous", variant: "destructive" },
      { label: "Urgent Attention Needed", variant: "default" },
      { label: "High Risk", variant: "secondary" }
    ]
  },
  "Squamous cell carcinoma": {
    cancerous: true,
    riskLevel: "High",
    color: "red",
    riskDescription: "A common skin cancer that can spread if not treated.",
    info: "Squamous cell carcinoma often appears as a red, scaly patch and can grow or spread if untreated.",
    details: "Squamous cell carcinoma (SCC) is a common skin cancer that often develops on areas exposed to the sun, such as the face, ears, neck, and hands. It can appear as a scaly patch, red bump, or sore that doesn’t heal. SCC can grow and spread if not treated, but most cases are curable when detected early. Treatments may include surgical removal, topical therapies, or other procedures depending on the lesion’s size and location. Protecting your skin from further sun damage is important to prevent future SCCs.",
    nextSteps: [
      "Consult a dermatologist promptly for evaluation and treatment.",
      "Follow up regularly after treatment to monitor for recurrence.",
      "Protect your skin from further sun damage."
    ],
    fact: "Squamous cell carcinoma is the second most common skin cancer.",
    badges: [
      { label: "Cancerous", variant: "destructive" },
      { label: "Needs Biopsy", variant: "default" },
      { label: "Treat Early", variant: "secondary" }
    ]
  }
}

