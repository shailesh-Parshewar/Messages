import { create, StoreApi, UseBoundStore } from "zustand";
import { chatStoreMethods, chatStoreVariables } from "../lib/types"
import { axiosClient } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

type useChatStoreType = chatStoreVariables & chatStoreMethods;
export const useChatStore: UseBoundStore<StoreApi<useChatStoreType>> = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const response = await axiosClient.get("/message/users");
            set({ users: response.data })
        } catch (error : any) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (id) => {
        set({ isMessagesLoading: true })
        try {

            const response = await axiosClient.get(`/message/${id}`);
            set({ messages: response.data })
        } catch (error : any) {
            toast.error(error.response.data.messages);
        } finally {
            set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (data) => {
        const { selectedUser, messages } = get();
        try {
            const response = await axiosClient.post(`/message/send/${selectedUser?._id}`, data)
            set({ messages: [...messages, response.data] })
        } catch (error : any) {
            toast.error(error.response.data.message);
        }
    },
    setSelectedUser: (user) => {
        set({ selectedUser: user })
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.on("newMessage", (message) => {
                // if the user is not our selectedUser just return;
                if (message.senderID !== selectedUser._id) return;
                set({ messages: [...get().messages, message] })
            })
        }
    },
    unsubscribeToMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage")
    }

}))