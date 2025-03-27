import { LoaderCircle } from "lucide-react";
import { LoaderProp } from "@/types/types";

export default function Loader({color = '#fff', strokeWidth='2px', size='1.5px'} : LoaderProp) {
    return (
        <div className="animate-spin">
            <LoaderCircle color={color} strokeWidth={strokeWidth} size={size}/>
        </div>
    )
}