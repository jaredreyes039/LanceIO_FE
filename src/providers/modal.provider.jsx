import { createContext, useContext, useState } from "react";

export const modalContext = createContext()


export default function ModalProvider(props) {

    const [currentModal, setCurrentModal] = useState('');
    const [modalData, setModalData] = useState({});
    const [orderModalFormView, setOrderModalFormView] = useState(null)

    return (
        <modalContext.Provider value={{
            currentModal,
            setCurrentModal,
            modalData,
            setModalData,
            orderModalFormView,
            setOrderModalFormView
        }}>
            {props.children}
        </modalContext.Provider>
    )
}
