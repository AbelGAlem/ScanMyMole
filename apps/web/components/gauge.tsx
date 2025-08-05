import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Gauge = dynamic(() => import('react-gauge-component'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-64 h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent" />
    </div>
  ),
});

//fall back component if there a problem with gauge component
const GaugeFallback = ({ value }: { value: number }) => (
  <div className="flex flex-col items-center justify-center w-64 h-32 bg-gray-50 rounded-lg border-2 border-gray-200">
    <div className="text-3xl font-bold text-gray-700">{value}%</div>
    <div className="text-sm text-gray-500 mt-1">Confidence Score</div>
  </div>
);

export default function GaugeComponent({ percent }: { percent: number }){
    const [gaugeError, setGaugeError] = useState(false)

    //set fallback state if import fails, to render the fallback component
    useEffect(() => {
        const loadGauge = async () => {
        try {
            await import('react-gauge-component');
        } catch (error) {
            console.error('Failed to load gauge component:', error);
            setGaugeError(true);
        }
        };
        
        loadGauge();
    }, []);

    return(
        <>
        {gaugeError ? (
            <GaugeFallback value={percent} />
          ) : (
            <Gauge
              value={percent}
              type="semicircle"
              arc={{
                width: 0.2,
                padding: 0.01,
                colorArray: ['#EF4444', '#FACC15', '#22C55E'],
                //gradient: true,
                subArcs: [
                  { limit: 40, color: '#EF4444', }, 
                  { limit: 70, color: '#FACC15', },   
                  { limit: 100, color: '#22C55E',}, 
                ],
              }}
              pointer={{type: "arrow"}}
              labels={{
                valueLabel: {
                  formatTextValue: val => `${val}%`,
                  style: {
                    fontSize: 36,
                    fontWeight: 700,
                    fill: "#111827", 
                    textShadow: "0 1px 6px #e5e7eb"
                  },
                }
              }}
            />
          )}
        </>
    )
}