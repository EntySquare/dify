"use client";

import { Theme } from "@/types/app";
import { type ReactNode, createContext, useRef, useContext, useEffect } from 'react'
import { createStore } from "zustand/vanilla";
import { useStore } from 'zustand'

type TGAIGlobalState = {
    theme: Theme
}

type TGAIGlobalActions = {
    setTheme: (theme: Theme) => void;
}

type TGAIGlobalStore = TGAIGlobalState & TGAIGlobalActions

const defaultInitState: TGAIGlobalState = {
    theme: Theme.dark,
}

const createTGAIGlobalStore = (initState: TGAIGlobalState = defaultInitState) => {
    return createStore<TGAIGlobalStore>()((set) => ({
        ...initState,
        setTheme: (theme: Theme) => {
            set((_state) => ({ theme }))
            if (globalThis) {
                globalThis.document.documentElement.setAttribute("data-theme", theme);
                theme === Theme.dark ? globalThis.document.body.setAttribute("arco-theme", theme) : globalThis.document.body.removeAttribute("arco-theme")
                theme === Theme.dark ? globalThis.document.documentElement.classList.add('dark') : globalThis.document.documentElement.classList.remove('dark')
            }
        }
    }))
}

export type TGAIGlobalStoreApi = ReturnType<typeof createTGAIGlobalStore>

export const TGAIGlobalStoreContext = createContext<TGAIGlobalStoreApi | undefined>(undefined)

export interface TGAIGlobalStoreProviderProps {
    children: ReactNode
}

export const TGAIGlobalStoreProvider = ({
    children,
}: TGAIGlobalStoreProviderProps) => {
    const storeRef = useRef<TGAIGlobalStoreApi>()
    if (!storeRef.current) {
        storeRef.current = createTGAIGlobalStore()
    }

    useEffect(() => {
        if (storeRef.current && globalThis) {
            const theme = storeRef.current.getState().theme
            globalThis.document.documentElement.setAttribute("data-theme", theme);
            theme === Theme.dark ? globalThis.document.body.setAttribute("arco-theme", theme) : globalThis.document.body.removeAttribute("arco-theme")
            theme === Theme.dark ? globalThis.document.documentElement.classList.add('dark') : globalThis.document.documentElement.classList.remove('dark')
        }
    }, [])


    return (
        <TGAIGlobalStoreContext.Provider value={storeRef.current}>
            {children}
        </TGAIGlobalStoreContext.Provider>
    )
}

export const useTGAIGlobalStore = <T,>(
    selector: (store: TGAIGlobalStore) => T,
): T => {
    const tgaiGlobalStoreContext = useContext(TGAIGlobalStoreContext)

    if (!tgaiGlobalStoreContext) {
        throw new Error(`useTGAIGlobalStore must be used within TGAIGlobalStoreProvider`)
    }

    return useStore(tgaiGlobalStoreContext, selector)
}


// import { ReactNode, useCallback, useEffect, useState } from "react";
// import {
//     createContext,
//     useContext,
//     useContextSelector,
// } from "use-context-selector";

// export type TGAIGlobalContextValue = {
//     theme: Theme;
//     setTheme: (theme: Theme) => void;
//     useSelector: typeof useSelector;
// }

// const TGAIGlobalContext = createContext<TGAIGlobalContextValue>({
//     theme: Theme.dark,
//     setTheme: () => { },
//     useSelector
// })

// export function useSelector<T>(selector: (value: TGAIGlobalContextValue) => T): T {
//     return useContextSelector(TGAIGlobalContext, selector);
// }

// export type TGAIGlobalContextProviderProps = {
//     children: ReactNode;
// };

// export const TGAIGlobalContextProvider = ({ children }: TGAIGlobalContextProviderProps) => {

//     const [theme, setTheme] = useState<Theme>(Theme.dark);
//     const handleSetTheme = useCallback((theme: Theme) => {
//         setTheme(theme);
//         globalThis.document.documentElement.setAttribute("data-theme", theme);
//         theme === Theme.dark ? globalThis.document.body.setAttribute("arco-theme", theme) : globalThis.document.body.removeAttribute("arco-theme")
//     }, []);

//     useEffect(() => {
//         globalThis.document.documentElement.setAttribute("data-theme", theme);
//         theme === Theme.dark ? globalThis.document.body.setAttribute("arco-theme", theme) : globalThis.document.body.removeAttribute("arco-theme")
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     return (

//         <TGAIGlobalContext.Provider
//             value={{
//                 theme,
//                 setTheme: handleSetTheme,
//                 useSelector
//             }}
//         >
//             {children}
//         </TGAIGlobalContext.Provider>
//     )
// }

// export const useTGAIGlobalContext = () => useContext(TGAIGlobalContext);

// export default TGAIGlobalContext;