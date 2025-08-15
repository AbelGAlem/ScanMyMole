import { AlertCircle, RefreshCw, Home } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"

interface ErrorComponentProps {
  title?: string
  message: string
}

export default function ErrorComponent({
  title = "Something went wrong",
  message,
}: ErrorComponentProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center space-y-6 mt-8 p-8">
        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
            <AlertCircle className="text-red-600" size={32} />
        </div>

        <div className="text-center space-y-3 max-w-md">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-gray-600 leading-relaxed">{message}</p>
        </div>

        <Button 
                onClick={() => router.push("/")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
                <Home size={16} />
                Go Home
        </Button>
    </div>
  )
}