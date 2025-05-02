import { X } from "lucide-react";
import { useAuthStore } from "../Store/useAuthStore";
import { useChatStore } from "../Store/useChatStore"


const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <header className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="h-full flex items-center gap-3">

          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.profilePicture || "/avatar.png"} />
            </div>
          </div>

          <div>
            <h3 className="font-medium ">{selectedUser?.fullName}</h3>
            <p className='text-sm text-base-content/70'>
              {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>

    </header>
  )
}

export default ChatHeader