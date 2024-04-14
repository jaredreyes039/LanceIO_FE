import { useContext, useEffect, useRef, useState } from "react"
import { modalContext } from "../../providers/modal.provider";
import ServiceBasicForm from './../forms/serviceBasic.forms';
import { formSliderContext } from "../../providers/formSlider.provider";
import currencyStringToSymbol from "../../utils/currencySymbolConversion.util";


export default function EditServiceModal(props) {

    const editServiceModal = useRef(null);
    const { refresh, tableRefresh } = props
    let {
        serviceData
    } = props;

    // VIEW STATES
    const { currentModal, setCurrentModal } = useContext(modalContext);
    const [isOpen, setIsOpen] = useState(false)

    // VIEW HANDLING
    useEffect(() => {
        if (props.isOpen) {
            setIsOpen(true)
        }
    }, [props.isOpen])
    useEffect(() => {
        if (isOpen) {
            editServiceModal.current.classList.remove('modal-hidden')
            editServiceModal.current.classList.add('modal-visible')
        }
        else if (serviceData !== null) {
            editServiceModal.current.classList.remove('modal-visible')
            editServiceModal.current.classList.add('modal-hidden')
        }
        else {
            return;
        }
    }, [isOpen, serviceData])

    async function handleCloseModal() {
        await setIsOpen(false);
        console.log('closing service planning modal...');
        setCurrentModal("");
    }

    if (serviceData === null) {
        return;
    }
    else if (currentModal === "editServiceModal") {
        return (
            <div>
                <div ref={editServiceModal} className="modal-container modal-hidden">
                    <div className="close-modal-btn">
                        <button onClick={() => { handleCloseModal() }}
                            style={{
                                color: "#ffffff",
                                fontSize: "12pt",
                                fontWeight: "bold",
                                backgroundColor: "transparent",
                                position: 'absolute',
                                top: '12px',
                                right: '24px',
                                border: '2px solid #ffffff',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 100
                            }}
                        >
                            X
                        </button>
                    </div>
                    <div className="modal-header">
                        <h1>Edit Service</h1>
                        <h2 className="modal-text-header">{serviceData.title}</h2>
                        <p className="modal-text">{serviceData.description}</p>
                        <div className="mt-4">
                            <b><span>Cost:</span></b><p className="modal-text">{currencyStringToSymbol(serviceData.currency)}{serviceData.price}{serviceData.payStruct === "fixed" ? " Fixed" : "/hr"}</p>
                            <b><span>Est. Delivery Time: </span></b><p className="modal-text">{serviceData.estDeliveryTime || "N/A"}</p>
                        </div>
                    </div>
                    <div className="gig-modal-body flex flex-col">
                        <ServiceBasicForm edit={true} serviceEdit={serviceData} tableRefresh={tableRefresh} refresh={refresh} />
                    </div>
                </div>
            </div>
        )
    }
    else {
        return;
    }
}
