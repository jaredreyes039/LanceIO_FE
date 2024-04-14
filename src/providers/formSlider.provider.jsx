import { createContext, useState } from "react";

export const formSliderContext = createContext();

export default function FormSliderProvider(props) {

    const [currentPosition, setCurrentPosition] = useState(0)

    return (
        <formSliderContext.Provider value={{
            currentPosition,
            setCurrentPosition,
        }}>
            {props.children}
        </formSliderContext.Provider>
    )
}
