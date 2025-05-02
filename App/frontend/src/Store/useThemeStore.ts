import {create, UseBoundStore, StoreApi} from "zustand";


type themeStoreType = {
    theme : string,
    setTheme : (theme: string) => void
}

export const useThemeStore: UseBoundStore<StoreApi<themeStoreType>> = create((set) => ({
    theme: localStorage.getItem("theme") || "dark",

    setTheme: (theme) => {
        localStorage.setItem("theme", theme);
        set({theme})
    }
}))