"use client"

import { createContext, useContext, useState, useMemo, type Dispatch, type SetStateAction, type ReactNode } from 'react'

type State = {
    displayNavigation: boolean;
    theme: 'light' | 'dark';
    language: string;
}

type AppContextProps = {
    state: State;
    setState: Dispatch<SetStateAction<State>>;
    toggleNavigation: () => void;
    toggleTheme: () => void;
}

const AppContext = createContext<AppContextProps>(null!)

export function useAppContext(){
    return useContext(AppContext)
}
export default function AppContextProvider(
    {children}:{children: ReactNode}
){
    const [state, setState] = useState<State>({
        displayNavigation: true,
        theme: 'dark',
        language: 'en'
    })

    const toggleNavigation = () => {
        setState(prev => ({ ...prev, displayNavigation: !prev.displayNavigation }))
    }

    const toggleTheme = () => {
        setState(prev => ({ ...prev, theme: prev.theme === 'dark' ? 'light' : 'dark' }))
    }

    const contextValue = useMemo(() => ({
        state,
        setState,
        toggleNavigation,
        toggleTheme
    }), [state])

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>

}