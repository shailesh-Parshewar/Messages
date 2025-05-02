import { useRef, useState } from "react";
import { useChatStore } from "../Store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<null | string>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.files) return;
    const file = e.target.files[0];
    if(!file.type.startsWith("image/")) {
      toast.error("please select an image file");
      return;
    } 
   const reader = new FileReader();
   reader.onloadend = () => {

    // checking if the reader.result is a valid string.
    if(typeof reader.result === "string") setImagePreview(reader.result)
   };
   reader.readAsDataURL(file)
  };

  const removeImage = () => {
    setImagePreview(null);
    if(fileRef.current) fileRef.current.value = ""
  };
  const handleSendMessage = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 try {
   await sendMessage({text : text.trim(), image : (imagePreview ? imagePreview : undefined)});

   //set everything to default after sending the message.
  setText("");
  setImagePreview(null)

  if(fileRef.current)  fileRef.current.value = "";
  
 } catch (error) {
    console.error("failed to send message : ", error);
    toast.error("failed to send message")
 }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview &&  (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
             src={imagePreview}
            alt="preview"
            className="size-20 object-cover rounded-lg border border-zinc-700" />
            <button
            onClick={removeImage}
            className="absolute -top-1.5 -right-1.5 size-5 rounded-full bg-base-300 flex items-center justify-center " 
            type="button">
              <X className="size-3" /></button>
          </div>
        </div>
      )}
        <form onSubmit={handleSendMessage}
        className="flex items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input 
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="say something..."
            value={text}
            onChange={e => setText(e.target.value)}  />
            <input
            type="file"
            accept="image/*"
            className="hidden"
              ref={fileRef}
              onChange={handleImageChange} />
              <button 
              type="button"
              className={`hidden sm:flex  btn btn-circle ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
         onClick={() => {  if(fileRef.current) fileRef.current.click(); }}>
          <Image size={20}/>
         </button>
          </div>
          <button 
          type="submit"
          className="btn btn-md btn-circle"
          disabled={!text.trim() && !imagePreview}>
            <Send size={20}/>
          </button>
        </form>
    </div>
  )
}

export default MessageInput;