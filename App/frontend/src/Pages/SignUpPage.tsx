import { useState } from "react"
import { useAuthStore } from "../Store/useAuthStore"
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";
import AuthImagePattern from "../Components/AuthImagePattern";
import toast from "react-hot-toast";
import Label from "../Components/Label";


const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: ""
  })
  const { signup, isSigningUp } = useAuthStore();
  const validateForm = () => { 
    if(!formData.fullName.trim()) return toast.error("Full Name is required.");
    if(!formData.email.trim()) return toast.error("Email is required.");
    if(!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid Email format.");
    if(!formData.password.trim()) return toast.error("Password is required.");
    if(formData.password.length < 6) return toast.error("Password must be at least 6 characters.");

    return true;
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const success  = validateForm();
    if(success === true) signup(formData)
  };


  return (
    <form onSubmit={e => handleSubmit(e)} className="space-y-6 z-10">
    <div className="form-control">
      <Label title="Full Name" ref="fullname" />
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="size-5 text-base-content/40" />
        </div>
        <input
          id="fullname"
          type="text"
          className="border-gray-600 border-1 rounded-lg w-full pl-10 p-2 mt-2 outline-none focus:border-gray-400"
          placeholder="Jacob Niels"
          value={formData.fullName}
          onChange={e => setFormData(prev => { return { ...prev, fullName: e.target.value } })}
        />
      </div>

      <Label title="Email" ref="email" />
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="size-5 text-base-content/40" />
        </div>
        <input
          id="email"
          type="email"
          className="border-gray-600 border-1 rounded-lg w-full pl-10 p-2 mt-2 outline-none focus:border-gray-400"
          placeholder="you@email.com"
          value={formData.email}
          onChange={e => setFormData(prev => { return { ...prev, email: e.target.value } })}
        />
      </div>

     <Label title="Password" ref="password"/>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="size-5 text-base-content/40" />
        </div>
        <input
        id="password"
          type={showPassword ? "text" : "password"}
          className="border-gray-600 border-1 rounded-lg w-full pl-10 p-2 mt-2 outline-none focus:border-gray-400"
          placeholder="**********"
          value={formData.password}
          onChange={e => setFormData(prev => { return { ...prev, password: e.target.value } })} />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(prev => !prev)}>{
            showPassword ?
              <EyeOff className="size-5 text-base-content/40" />
              : <Eye className="size-5 text-base-content/40" />
          }</button>
      </div>
    </div>
    <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
      {isSigningUp ? (<>
        <Loader2 className="size-5 animate-spin" />
        Loading...
      </>) : "Create Account"
      }
    </button>
  </form>
  )

}

const SignUpPage = () => {
  

  return (
    <main className="min-h-screen grid lg:grid-cols-2">
      <section className="flex flex-col justify-center items-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl  bg-primary/10 flex items-center justify-center group-hover:bg-primary-20 transition-colors">
                <MessageSquare className="size-10 text-primary" />
              </div>

              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>
         
          <SignUpForm />

          <div className="text-center">
            <p className="text-base-content/60">
            already have an account?{" "}
            <Link to="/login" className="link link-primary">Sign in</Link>
            </p>
          </div>
        </div>
      </section>

      
        <AuthImagePattern 
        title="Join our community"
        subtitle="Connect with friends,share moments, stay in touch with your loved ones." />
      
    </main>
  )
}

export default SignUpPage