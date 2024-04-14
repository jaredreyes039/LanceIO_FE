import { createContext, useState } from "react";

export const userSettingsContext = createContext();

export default function UserSettingsProvider(props) {

    const [defaultCurrency, setDefaultCurrency] = useState('USD')

    return (
        <userSettingsContext.Provider value={{
            defaultCurrency,
            setDefaultCurrency
        }}>
            {props.children}
        </userSettingsContext.Provider>
    )
}
