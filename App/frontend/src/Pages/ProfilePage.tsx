import {useAuthStore} from "../Store/useAuthStore.ts";
import {Camera, Mail, User} from "lucide-react";
import {useState} from "react";


const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImage, setSelectedImage] = useState< string | null>(null);

  const handleImageUpload = async (e : React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null; // retrieve the file from parameter
    if(!file) return;
    
    const reader = new FileReader();
    reader.readAsDataURL(file); // convert image into readable format for http requests.
    reader.onload = async () => {
      const base64Image = reader.result; // read the result of readAsDataURL() method
      if(typeof base64Image === "string") setSelectedImage(base64Image); // set the selectedImage to that image variable
    await updateProfile({ profilePicture: base64Image }); // call the updateProfile method in useAuthStore().
    }
  }
  return (
      <main className="pt-20">
        <section className="max-w-2xl mx-auto p-4 py-8">
          <div>
            <div className="bg-base-300 max-h-max rounded-xl p-6 space-y-8">
              <div className="text-center">
                <h1 className="text-2xl font-semibold">Profile</h1>
                <p className="mt-2">Your profile information</p>
              </div>
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <img
                  src={selectedImage || authUser?.profilePicture || "/avatar.png"}
                  alt="profile"
                  className="size-32 rounded-full object-cover border-4"/>
                  <label htmlFor="avatar-upload"
                  className={`absolute bottom-0 right-0 bg-base-content
                   hover:scale-105 p-2 rounded-full cursor-pointer
                    transition-all duration-200 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}>
                    <Camera className="size-5  text-base-200" />
                    <input
                    type="file"
                    accept="image/*"
                    id="avatar-upload"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}/>
                  </label>
                </div>
                <p className="text-sm text-zinc-400">
                  {isUpdatingProfile ? "Updating the profile..." : "Click the camera icon to update your profile picture."}
                </p>
                <div className="space-y-6 w-full">
                  <div className="space-y-1.5">
                     <div  className="text-sm text-zinc-400 flex items-center gap-2">
                       <User className="size-4" />
                       Full name
                     </div>
                    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.fullName}</p>
                  </div>
                  <div className="space-y-1.5">
                    <div  className="text-sm text-zinc-400 flex items-center gap-2">
                      <Mail className="size-4" />
                      Email
                    </div>
                    <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
                  </div>
                </div>
                 <div className="mt-6 bg-base-300 rounded-xl p-6 w-full" >
                    <h2 className="text-lg font-medium mb-4">Account Information</h2>
                   <div className="flex items-center justify-between py-2  border-b  border-zinc-700">
                     <span>Member Since</span>
                     <span>{authUser?.createdAt.split("T")[0]}</span>
                   </div>
                   <div className="flex items-center justify-between py-2">
                     <span>Account Status</span>
                     <span className="text-green-500">Active</span>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </section>
      </main>
  )
}

export default ProfilePage