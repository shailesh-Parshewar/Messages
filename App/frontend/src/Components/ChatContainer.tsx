import { useEffect, useRef } from "react";
import { useChatStore } from "../Store/useChatStore"
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../Store/useAuthStore";
import { formatDateTime } from "../lib/utils";


const ChatContainer = () => {
  const { selectedUser, messages, isMessagesLoading,
    subscribeToMessages, unsubscribeToMessages, getMessages } = useChatStore();
  const { authUser } = useAuthStore();

  const lastMessageRef = useRef<HTMLDivElement>(null);
  useEffect(() => {

    // this is always true since the component doesn't mount if the selectedUser is null
    // this is just to satisfy typescript.
    if (selectedUser) getMessages(selectedUser._id);
    subscribeToMessages();
    return () => {
      unsubscribeToMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    // if we have a clear last message element
    if (messages && lastMessageRef.current) lastMessageRef.current.scrollIntoView({ behavior: "smooth" })
  }, [messages])


  return (
    <main className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      {
        isMessagesLoading
          ? <MessageSkeleton />
          : <section className="flex-1 overflow-y-auto space-y-4 p-4">
            {messages.map(message => (
              <div
                key={message._id}
                ref={lastMessageRef}
                className={`chat ${message.senderID === selectedUser?._id ? "chat-start" : "chat-end"}`}>
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border">
                    <img
                      src={message.senderID === selectedUser?._id
                        ? (selectedUser.profilePicture || "/avatar.png")
                        : (authUser?.profilePicture || "/avatar.png")}
                      alt="profile picture" />
                  </div>
                </div>

                <div className="chat-header mb-1">
                  <time className="text-xs opacity-50 ml-1">{formatDateTime(message.createdAt)}</time>
                </div>

                <div className="chat-bubble flex flex-col">
                  {message.image && (
                    <img src={message.image} alt="image" className="sm:max-w-[200px]  rounded-md mb-2" />
                  )}
                  {message.text && <p>{message.text}</p>}
                </div>
              </div>
            ))}
          </section>
      }

      <MessageInput />
    </main>
  )
}

export default ChatContainer