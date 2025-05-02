import { Users } from "lucide-react";

 const userSkeletonArray = Array(8).fill(null);
const SideBarSkeleton = () => {
  return (
    <div className="h-full w-20 lg:w-72 border-r border-base-300  flex flex-col transition-all duration-200">

      <div className="border-b border-base-300 p-5 w-full">
        <div className="flex items-center gap-2">
          <Users className="size-6" /> 
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {userSkeletonArray.map((_, id) => (
          <div key={id} className="w-full p-3 flex items-center gap-3">

            <div className="relative mx-auto  lg:mx-0">
                <div className="skeleton size-12 rounded-full"></div>
            </div>

            <div className="hidden lg:block  text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2"/>
              <div className="skeleton h-3 w-16"/>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBarSkeleton