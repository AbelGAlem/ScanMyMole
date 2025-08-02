import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { UploadCloud } from "lucide-react"
import Link from "next/link"

export default function UploadDialog(){
    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="px-6 py-5 rounded-full text-white text-lg font-semibold bg-[#690500] border-2 border-[#3D0000]">
                    Scan Now
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="items-start">
                    <DialogTitle>Upload Image Here.</DialogTitle>
                    <DialogDescription>
                        Add your image here, and you can upload up to 5 MB max
                    </DialogDescription>
                </DialogHeader>
                <div className="outline-dashed outline-blue-500 rounded-md">
                    <div className="grid place-items-center gap-y-1 py-6">
                        <UploadCloud size={36} color="blue" />
                        <p className="mt-2">Drag your file(s) or <span className="text-blue-700">browse</span></p>
                        <p className="text-xs text-gray-700">Max 10 MB files are allowed</p>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Link href="/results">
                        <Button type="submit">Upload</Button>
                    </Link>
                </DialogFooter>    
            </DialogContent>
        </Dialog>
    )
}