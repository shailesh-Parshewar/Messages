import { Socket } from "socket.io-client"

export type LogInFormDataType = {
    email: string,
    password: string
}
export type SignUpFormDataType = LogInFormDataType & {
    fullName: string,
}

export type authUserType = {
    _id: any,
    fullName: string,
    email: string,
    profilePicture: string,
    createdAt: string
}

export type authUserStoreVariable = {
    authUser: null | authUserType,
    onlineUsers: string[],
    socket: Socket | null,
    isSigningUp: boolean,
    isLoggingIn: boolean,
    isUpdatingProfile: boolean,
    isChecking: boolean,
}
export type authUserStoreMethod = {
    checkAuth: () => Promise<void>,
    signup: (data: SignUpFormDataType) => Promise<void>,
    logout: () => Promise<void>,
    login: (data: LogInFormDataType) => Promise<void>,
    updateProfile: (file: unknown) => Promise<void>,
    connectToSocket: () => void,
    disconnectFromSocket: () => void
}
type Message = {
    _id: string,
    text: string,
    image: string,
    senderID: string,
    recieverID: string,
    createdAt: string,
    updatedAt: string
}
export type chatStoreVariables = {
    messages: Message[] | never[],
    users: authUserType[],
    selectedUser: authUserType | null,
    isUsersLoading: boolean,
    isMessagesLoading: boolean
}
export type chatStoreMethods = {
    getUsers: () => Promise<void>,
    getMessages: (id: string) => Promise<void>,
    setSelectedUser: (id: authUserType | null) => void,
    sendMessage: (data: { text?: string, image?: string }) => Promise<void>,
    subscribeToMessages : () => void,
    unsubscribeToMessages : () => void,
}

