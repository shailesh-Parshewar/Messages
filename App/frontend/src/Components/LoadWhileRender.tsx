import {ReactNode, Suspense} from "react"
import {Loader} from "lucide-react";



const LoadWhileRender = ({children}: {children: ReactNode}) => {
 return (
     <Suspense fallback={<Loader className="size-10 animate-spin" />}>{children}</Suspense>
 )
}
export default LoadWhileRender;