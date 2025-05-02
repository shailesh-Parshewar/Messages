import { create, StoreApi, UseBoundStore } from "zustand";
import { axiosClient } from "../lib/axios";
import { authUserStoreMethod, authUserStoreVariable} from "../lib/types";
import toast from "react-hot-toast";
import { io } from "socket.io-client";


const BACKEND_BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5100" : "/";

type authUserStoreType = authUserStoreVariable & authUserStoreMethod;

export const useAuthStore: UseBoundStore<StoreApi<authUserStoreType>> = create((set, get) => ({
    authUser: null,
    onlineUsers: [],
    socket: null,

    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isChecking: false,

    checkAuth: async () => {
        try {
            // check user
            const res = await axiosClient.get("/auth/check")
            // set authUser to res.data
            set({ authUser: res.data })
            get().connectToSocket()
        } catch (error : any) {
            console.log("Error in checkAuth : " + error)
            // set authUser to null
            set({ authUser: null })
        } finally {
            // set isCheckingAuth to false
            set({ isChecking: false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const response = await axiosClient.post("/auth/signup", data);
            toast.success("We have signed you in.");

            set({ authUser: response.data })
            get().connectToSocket(); 
        } catch (error : any) {
            console.log("Error whlie signing up" + error);
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false })
        }
    },
    logout: async () => {
        try {
            await axiosClient.post("/auth/logout");
            toast.success("Logged out successfully.");

            set({ authUser: null })
            get().disconnectFromSocket();
        } catch (error : any) {
            toast.error(error.response.data.message);
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const response = await axiosClient.post("/auth/login", data);
            toast.success("Logged in successfully.");

            set({ authUser: response.data });
            get().connectToSocket();
        } catch (error : any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false })
        }
    },
    updateProfile: async (file) => {
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosClient.put("/auth/update-profile", file);
            toast.success("Profile updated successfully.");
            set({ authUser: response.data });
        } catch (error : any) {
            console.log("Error in updateProfile controller : " + error);
            toast.error(error.response.data.message);
        } finally {
            set({ isUpdatingProfile: false })
        }
    },
    connectToSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const socketConnection = io(BACKEND_BASE_URL, {
            query : {
                userId: authUser._id
            }
        });
        const connection = socketConnection.connect();
        set({ socket: connection })
        connection.on("getOnlineUsers", (userIds) => {
            set({onlineUsers : userIds})
        })
    },
    disconnectFromSocket: () => {
        const { socket} = get();
        if(socket?.connected) socket.disconnect();
    },
}))