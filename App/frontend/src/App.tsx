import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./Store/useAuthStore";
import {useEffect, lazy} from "react";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";


import Navbar from "./Components/Navbar";
import LogInPage from "./Pages/LogInPage";
import LoadWhileRender from "./Components/LoadWhileRender.tsx";
import SettingsPage from "./Pages/SettingsPage";
import {useThemeStore} from "./Store/useThemeStore.ts";

const HomePage = lazy(() => import("./Pages/HomePage"));
const SignUpPage = lazy(() => import("./Pages/SignUpPage"));
const ProfilePage =  lazy(() => import("./Pages/ProfilePage"));


const App = () => {
  const { authUser, checkAuth, isChecking, onlineUsers } = useAuthStore();
 const {theme} = useThemeStore();

  useEffect(() => { checkAuth() }, []);
 console.log(onlineUsers)
  if (isChecking && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }


  // we are going to navigate user back to login page if he is not authorized by using
  // <Navigate /> component from react-router-dom which navigates user automatically
  return (
      <main data-theme={theme  ? theme : "dark"} className="min-h-screen">
        <Router>
          <Routes>
            <Route path="/" element={<Navbar />} >

              <Route index element={authUser ? 
              <LoadWhileRender children={<HomePage />} /> : <Navigate to="/login" />} />
              <Route path="/profile" element={authUser ? 
              <LoadWhileRender children={<ProfilePage />} /> : <Navigate to="/login" />} />

              <Route path="/signup" element={!authUser ? 
              <LoadWhileRender children={<SignUpPage />} /> : <Navigate to="/" />} />
              <Route path="/login" element={!authUser ? 
              <LoadWhileRender children={<LogInPage />} /> : <Navigate to="/" />} />

              <Route path="/settings" element={<SettingsPage />} />

            </Route>
          </Routes>
          <Toaster />
        </Router>
      </main>
  )
}

export default App
